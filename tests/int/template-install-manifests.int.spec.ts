import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import {
  buildTemplateInstallManifests,
  serializeTemplateInstallManifest,
  templateManifestsDir,
} from '../../tools/templates/build-install-manifests'
import { listComponentNames } from '../../tools/payload-components/manifest'
import {
  listTemplateSlugs,
  loadAllTemplateManifests,
  loadTemplateManifest,
} from '../../tools/payload-components/templates'
import { templateShowcases } from '../../src/lib/templates/registry'

/* payload-components/templates/*.json is generated from src/lib/templates by
 * `pnpm templates:build`, the same source-of-truth-plus-committed-output shape
 * the public registry uses. These specs are the drift gate: edit a template and
 * forget to rebuild, and the committed install contract stops matching. */

describe('generated template install manifests', () => {
  it('matches a fresh build byte for byte', async () => {
    const manifests = buildTemplateInstallManifests()

    for (const manifest of manifests) {
      const committed = await readFile(
        path.join(templateManifestsDir, `${manifest.slug}.json`),
        'utf8',
      )

      expect(committed, `${manifest.slug}.json is stale — run "pnpm templates:build"`).toBe(
        serializeTemplateInstallManifest(manifest),
      )
    }
  })

  it('has exactly one file per showcase and no strays', async () => {
    const files = (await readdir(templateManifestsDir))
      .filter((file) => file.endsWith('.json'))
      .sort()

    expect(files).toEqual(templateShowcases.map(({ slug }) => `${slug}.json`).sort())
    expect(await listTemplateSlugs()).toEqual(templateShowcases.map(({ slug }) => slug).sort())
  })

  it('only references blocks that exist in the registry', async () => {
    const [componentNames, manifests] = await Promise.all([
      listComponentNames(),
      loadAllTemplateManifests(),
    ])

    for (const manifest of manifests) {
      for (const componentName of manifest.components) {
        expect(componentNames, `${manifest.slug} references ${componentName}`).toContain(
          componentName,
        )
      }
    }
  })

  it('keeps each template component list as the deduplicated union of its pages', async () => {
    for (const manifest of await loadAllTemplateManifests()) {
      const pageUnion = [...new Set(manifest.pages.flatMap((page) => page.components))].sort()

      expect(manifest.components).toEqual(pageUnion)
      expect(manifest.components).toEqual([...new Set(manifest.components)])
      expect(manifest.pages.length).toBeGreaterThan(0)

      for (const page of manifest.pages) {
        expect(page.components.length).toBeGreaterThan(0)
        expect(page.components).toEqual([...new Set(page.components)])
      }
    }
  })

  it('rejects unknown and traversing template slugs', async () => {
    await expect(loadTemplateManifest('does-not-exist')).rejects.toThrow('Unknown template')
    await expect(loadTemplateManifest('../registry')).rejects.toThrow('Unknown template')
    await expect(loadTemplateManifest('Saas-Launch')).rejects.toThrow('Unknown template')
  })
})
