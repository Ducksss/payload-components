import { readFile, readdir, rm } from 'node:fs/promises'
import path from 'node:path'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { applyPayloadFragments, detectProject } from '../../tools/payload-components/project'
import {
  buildTemplateSeedTarget,
  templatePageKey,
  writeTemplateSeedScripts,
} from '../../tools/payload-components/seed/template-seed'
import { recordInstalledState } from '../../tools/payload-components/state'
import { loadTemplateManifest } from '../../tools/payload-components/templates'
import { loadManifest } from '../../tools/payload-components/manifest'

import { createInstallFixtureForComponents } from './payload-components-fixture'

/* A template seeds one draft Page per page of the concept. The contract that
 * matters is isolation: every page must own its own private record, because the
 * shipped templates start several of their pages with the same block and a
 * naive fan-out would have them all claim the same one. */

const fixtureDirs: string[] = []
/* portfolio-solo is the smallest template (17 blocks, 5 pages) and its pages
 * share hero and content blocks, so it exercises the collision case. */
const TEMPLATE_SLUG = 'portfolio-solo'

afterEach(async () => {
  await Promise.all(fixtureDirs.splice(0).map((dir) => rm(dir, { force: true, recursive: true })))
  vi.restoreAllMocks()
})

const installTemplateFixture = async () => {
  const template = await loadTemplateManifest(TEMPLATE_SLUG)
  const { fixtureDir, manifests } = await createInstallFixtureForComponents(template.components, {
    preseedSource: true,
  })

  fixtureDirs.push(fixtureDir)

  for (const manifest of manifests) {
    await applyPayloadFragments(fixtureDir, manifest.payloadFragments)
    await recordInstalledState({
      cwd: fixtureDir,
      manifest,
      patchedFiles: manifest.recovery.patchedFiles,
      targetId: 'payload-website-starter',
    })
  }

  return { fixtureDir, project: await detectProject(fixtureDir), template }
}

describe('template seed targets', () => {
  it('gives the home page a usable slug', async () => {
    const template = await loadTemplateManifest(TEMPLATE_SLUG)
    const [homePage] = template.pages

    /* Every shipped template's home page has path '', which would produce an
       empty demo slug and a find-clause that matches nothing. */
    expect(homePage.path).toBe('')
    expect(templatePageKey(homePage)).toBe('home')

    const target = buildTemplateSeedTarget({
      configFileRelPath: 'src/payload.config.ts',
      page: homePage,
      template,
    })

    expect(target.slug).toBe(`payload-components-demo-${TEMPLATE_SLUG}-home`)
    expect(target.ownership).toEqual({
      id: `template:${TEMPLATE_SLUG}:home`,
      version: `${template.revision}.0.0`,
    })
  })

  it('derives a distinct identity, script, and state path for every page', async () => {
    const template = await loadTemplateManifest(TEMPLATE_SLUG)
    const targets = template.pages.map((page) =>
      buildTemplateSeedTarget({ configFileRelPath: 'src/payload.config.ts', page, template }),
    )

    for (const key of ['marker', 'ownershipStateRelPath', 'scriptRelPath', 'slug'] as const) {
      expect(new Set(targets.map((target) => target[key])).size).toBe(template.pages.length)
    }

    expect(new Set(targets.map((target) => target.ownership?.id)).size).toBe(template.pages.length)
  })
})

describe('writeTemplateSeedScripts', () => {
  it('writes one script per page, each owning its own private record', async () => {
    const { fixtureDir, project, template } = await installTemplateFixture()

    const plans = await writeTemplateSeedScripts({ cwd: fixtureDir, project, template })

    expect(plans).toHaveLength(template.pages.length)

    const stateFiles = await readdir(path.join(fixtureDir, '.payload-components', 'demo-state'))
    const records = await Promise.all(
      stateFiles.map(async (file) =>
        JSON.parse(
          await readFile(path.join(fixtureDir, '.payload-components', 'demo-state', file), 'utf8'),
        ),
      ),
    )

    expect(stateFiles).toHaveLength(template.pages.length)

    /* The blocker this feature had to solve: several pages of every shipped
       template start with the same block, so keying the record on that block
       would make them collide. Identities and secrets must both be distinct. */
    expect(new Set(records.map(({ component }) => component)).size).toBe(template.pages.length)
    expect(new Set(records.map(({ token }) => token)).size).toBe(template.pages.length)
    expect(records.every(({ mediaId, pageId }) => pageId === null && mediaId === null)).toBe(true)
  })

  it('seeds each page with its own blocks in the order the page composes them', async () => {
    const { fixtureDir, project, template } = await installTemplateFixture()

    await writeTemplateSeedScripts({ cwd: fixtureDir, project, template })

    for (const page of template.pages) {
      const key = templatePageKey(page)
      const script = await readFile(
        path.join(fixtureDir, 'payload-components', `seed-template-${template.slug}-${key}.ts`),
        'utf8',
      )
      const blockTypes = await Promise.all(
        page.components.map(async (componentName) => {
          const manifest = await loadManifest(componentName)

          return manifest.sampleContent.blockType as string
        }),
      )

      expect(script).toContain(`const demoSlug = 'payload-components-demo-${template.slug}-${key}'`)
      expect(script).toContain(`const expectedComponent = 'template:${template.slug}:${key}'`)
      expect(script).toContain("_status: 'draft'")
      /* Never publishes, never deletes — the same guarantees a single-component
         seed makes. */
      expect(script).not.toContain('payload.delete')
      expect(
        JSON.parse(/const rawLayoutBlockTypes = (\[[^\]]*\])/.exec(script)?.[1] ?? '[]'),
      ).toEqual(blockTypes)
    }
  })

  it('is idempotent — regenerating reuses each page record rather than reclaiming it', async () => {
    const { fixtureDir, project, template } = await installTemplateFixture()

    await writeTemplateSeedScripts({ cwd: fixtureDir, project, template })

    const stateDir = path.join(fixtureDir, '.payload-components', 'demo-state')
    const before = await Promise.all(
      (await readdir(stateDir)).map((file) => readFile(path.join(stateDir, file), 'utf8')),
    )

    await writeTemplateSeedScripts({ cwd: fixtureDir, project, template })

    const after = await Promise.all(
      (await readdir(stateDir)).map((file) => readFile(path.join(stateDir, file), 'utf8')),
    )

    expect(after).toEqual(before)
  })

  it('refuses when a block the template needs is not fully installed', async () => {
    const { fixtureDir, project, template } = await installTemplateFixture()

    await rm(path.join(fixtureDir, 'src', 'blocks', 'HeroKinetic', 'config.ts'))

    await expect(writeTemplateSeedScripts({ cwd: fixtureDir, project, template })).rejects.toThrow(
      /hero-kinetic[\s\S]*not fully installed/,
    )
  })
})
