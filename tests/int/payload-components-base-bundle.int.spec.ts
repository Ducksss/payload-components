import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import {
  BASE_BUNDLE_FILES,
  copyBaseBundle,
  registerBaseCollections,
} from '../../tools/payload-components/base-bundle'
import { detectProject } from '../../tools/payload-components/project'

/* A bare `create-payload-app` project fails detection before any of the starter
 * primitives matter: it has no blocks renderer and no Pages collection carrying
 * the anchors the installer patches. This is the proof that the base bundle
 * closes exactly that gap — the same project goes from "unsupported shape" to a
 * detected target. */

const tempDirs: string[] = []

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { force: true, recursive: true })))
})

/* What `create-payload-app` leaves you with, minus everything the base adds. */
const makeBareProject = async ({ config }: { config?: string } = {}) => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-bare-'))
  tempDirs.push(dir)

  await mkdir(path.join(dir, 'src'), { recursive: true })
  await Promise.all([
    writeFile(
      path.join(dir, 'package.json'),
      `${JSON.stringify(
        {
          dependencies: { next: '^16.0.0', payload: '^3.0.0' },
          name: 'bare-payload-app',
          private: true,
        },
        null,
        2,
      )}\n`,
      'utf8',
    ),
    writeFile(path.join(dir, 'pnpm-lock.yaml'), 'lockfileVersion: 9.0\n', 'utf8'),
    writeFile(path.join(dir, 'components.json'), '{}\n', 'utf8'),
    writeFile(
      path.join(dir, 'src', 'payload.config.ts'),
      config ??
        [
          "import { buildConfig } from 'payload'",
          '',
          'export default buildConfig({',
          '  collections: [],',
          "  secret: process.env.PAYLOAD_SECRET || '',",
          '})',
          '',
        ].join('\n'),
      'utf8',
    ),
  ])

  return dir
}

describe('the starter base bundle', () => {
  it('is what turns an unsupported bare project into a detected one', async () => {
    const cwd = await makeBareProject()

    /* Before: no renderer, no Pages collection, no primitives. */
    await expect(detectProject(cwd)).rejects.toThrow('Unsupported project shape')

    await copyBaseBundle({ cwd })

    const project = await detectProject(cwd)

    /* The base bundle deliberately reproduces the official starter layout, so a
       scaffolded project detects as that target rather than needing one of its
       own — there is nothing different about it to describe. */
    expect(project.target.id).toBe('payload-website-starter')
    expect(project.hostFiles).toEqual({
      pagesLayout: 'src/collections/Pages/index.ts',
      renderBlocks: 'src/blocks/RenderBlocks.tsx',
    })
  })

  it('lays down every primitive the installed blocks import', async () => {
    const cwd = await makeBareProject()
    const { created, skipped } = await copyBaseBundle({ cwd })

    expect(created).toEqual([...BASE_BUNDLE_FILES])
    expect(skipped).toEqual([])

    /* The four consumer imports that appear across the shipped source, plus the
       two files the installer patches and the collection uploads live in. */
    for (const [projectPath, expected] of [
      ['src/utilities/ui.ts', 'export const cn'],
      ['src/fields/link.ts', "name: 'link'"],
      ['src/fields/linkGroup.ts', 'export const linkGroup'],
      ['src/components/Link/index.tsx', 'export const CMSLink'],
      ['src/components/Media/index.tsx', 'export const Media'],
      ['src/collections/Media.ts', "slug: 'media'"],
      ['src/collections/Pages/index.ts', "name: 'layout'"],
      ['src/blocks/RenderBlocks.tsx', 'const blockComponents = {'],
    ] as const) {
      await expect(readFile(path.join(cwd, projectPath), 'utf8')).resolves.toContain(expected)
    }
  })

  it('never overwrites a primitive the project already has', async () => {
    const cwd = await makeBareProject()

    await mkdir(path.join(cwd, 'src', 'utilities'), { recursive: true })
    await writeFile(
      path.join(cwd, 'src', 'utilities', 'ui.ts'),
      'export const cn = () => "mine"\n',
      'utf8',
    )

    const { created, skipped } = await copyBaseBundle({ cwd })

    expect(skipped).toEqual(['src/utilities/ui.ts'])
    expect(created).not.toContain('src/utilities/ui.ts')
    await expect(readFile(path.join(cwd, 'src', 'utilities', 'ui.ts'), 'utf8')).resolves.toBe(
      'export const cn = () => "mine"\n',
    )
  })

  it('is idempotent — a second scaffold creates nothing', async () => {
    const cwd = await makeBareProject()

    await copyBaseBundle({ cwd })
    const second = await copyBaseBundle({ cwd })

    expect(second.created).toEqual([])
    expect(second.skipped).toEqual([...BASE_BUNDLE_FILES])
  })
})

describe('registering the base collections', () => {
  it('adds both collections and their imports to the config', async () => {
    const cwd = await makeBareProject()

    const result = await registerBaseCollections({
      configFileRelPath: 'src/payload.config.ts',
      cwd,
    })

    expect(result).toMatchObject({ patched: true, registered: ['Pages', 'Media'] })

    const config = await readFile(path.join(cwd, 'src', 'payload.config.ts'), 'utf8')

    expect(config).toContain("import { Pages } from './collections/Pages'")
    expect(config).toContain("import { Media } from './collections/Media'")
    expect(config).toContain('collections: [Pages, Media, ]')
  })

  it('leaves a config that already registers them alone', async () => {
    const cwd = await makeBareProject({
      config: [
        "import { buildConfig } from 'payload'",
        "import { Pages } from './collections/Pages'",
        "import { Media } from './collections/Media'",
        '',
        'export default buildConfig({',
        '  collections: [Pages, Media],',
        '})',
        '',
      ].join('\n'),
    })
    const before = await readFile(path.join(cwd, 'src', 'payload.config.ts'), 'utf8')

    const result = await registerBaseCollections({
      configFileRelPath: 'src/payload.config.ts',
      cwd,
    })

    expect(result).toMatchObject({ patched: false, reason: 'already-registered' })
    await expect(readFile(path.join(cwd, 'src', 'payload.config.ts'), 'utf8')).resolves.toBe(before)
  })

  it('reports rather than rewrites a config it cannot read', async () => {
    const cwd = await makeBareProject({ config: "export default { secret: 'x' }\n" })

    const result = await registerBaseCollections({
      configFileRelPath: 'src/payload.config.ts',
      cwd,
    })

    /* Guessing at the shape of someone's buildConfig call would produce an edit
       nobody could review. */
    expect(result).toEqual({ patched: false, reason: 'no-collections-array' })
    await expect(readFile(path.join(cwd, 'src', 'payload.config.ts'), 'utf8')).resolves.toBe(
      "export default { secret: 'x' }\n",
    )
  })
})
