import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { diffCommand } from '../../tools/payload-components/commands/diff'
import { loadManifest } from '../../tools/payload-components/manifest'
import {
  applyPayloadFragments,
  detectProject,
  removePayloadFragments,
  resolveRecoveryPatchedFiles,
  verifyInstalledPayloadFragments,
} from '../../tools/payload-components/project'
import { recordInstalledState } from '../../tools/payload-components/state'

import type { PayloadFragment } from '../../tools/payload-components/types'

/* Targets declare candidate paths per host file rather than one fixed path, so
 * the same page-blocks shape installs into repos that do not follow the starter
 * layout. These tests pin which shapes resolve, which are rejected, and that the
 * resolved paths — not the canonical ones — are what actually gets patched. */

const tempDirs: string[] = []

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { force: true, recursive: true })))
})

const RENDER_BLOCKS_SOURCE = [
  "import React from 'react'",
  '',
  'const blockComponents = {',
  '}',
  '',
  'export const RenderBlocks = () => null',
  '',
].join('\n')

const PAGES_SOURCE = [
  "import type { CollectionConfig } from 'payload'",
  '',
  'export const Pages: CollectionConfig = {',
  "  slug: 'pages',",
  '  fields: [',
  '    {',
  "      name: 'layout',",
  "      type: 'blocks',",
  '      blocks: [],',
  '    },',
  '  ],',
  '}',
  '',
].join('\n')

const writeProjectFile = async (dir: string, relPath: string, content: string) => {
  await mkdir(path.join(dir, path.dirname(relPath)), { recursive: true })
  await writeFile(path.join(dir, relPath), content, 'utf8')
}

const makeProject = async (files: Record<string, string>) => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-target-'))
  tempDirs.push(dir)

  await writeFile(
    path.join(dir, 'package.json'),
    `${JSON.stringify(
      {
        dependencies: { next: '^16.0.0', payload: '^3.0.0' },
        name: 'target-fixture',
        private: true,
      },
      null,
      2,
    )}\n`,
    'utf8',
  )
  await writeFile(path.join(dir, 'pnpm-lock.yaml'), 'lockfileVersion: 9.0\n', 'utf8')
  await writeFile(path.join(dir, 'components.json'), '{}\n', 'utf8')

  for (const [relPath, content] of Object.entries(files)) {
    await writeProjectFile(dir, relPath, content)
  }

  return dir
}

const starterFiles = {
  'src/blocks/RenderBlocks.tsx': RENDER_BLOCKS_SOURCE,
  'src/collections/Pages/index.ts': PAGES_SOURCE,
  'src/payload.config.ts': 'export default {}\n',
}

const heroFragments: PayloadFragment[] = [
  {
    blockSlug: 'heroBasic',
    importName: 'HeroBasicBlock',
    importPath: '@/blocks/HeroBasic/Component',
    kind: 'renderBlocks',
  },
  {
    blockName: 'HeroBasic',
    importName: 'HeroBasic',
    importPath: '@/blocks/HeroBasic/config',
    kind: 'pagesLayout',
  },
]

describe('detectProject target resolution', () => {
  it('matches the starter target first and resolves its canonical paths', async () => {
    const dir = await makeProject(starterFiles)
    const project = await detectProject(dir)

    expect(project.target.id).toBe('payload-website-starter')
    expect(project.hostFiles).toEqual({
      pagesLayout: 'src/collections/Pages/index.ts',
      renderBlocks: 'src/blocks/RenderBlocks.tsx',
    })
  })

  it('falls through to the variant target for a flat Pages collection file', async () => {
    const dir = await makeProject({
      'src/blocks/RenderBlocks.tsx': RENDER_BLOCKS_SOURCE,
      'src/collections/Pages.ts': PAGES_SOURCE,
      'src/payload.config.ts': 'export default {}\n',
      'src/utilities/ui.ts': 'export const cn = (...args: unknown[]) => args.join(" ")\n',
    })
    const project = await detectProject(dir)

    expect(project.target.id).toBe('payload-blocks-app')
    expect(project.hostFiles).toEqual({
      pagesLayout: 'src/collections/Pages.ts',
      renderBlocks: 'src/blocks/RenderBlocks.tsx',
    })
  })

  it('supports a project without a src directory', async () => {
    const dir = await makeProject({
      'blocks/RenderBlocks.tsx': RENDER_BLOCKS_SOURCE,
      'collections/Pages/index.ts': PAGES_SOURCE,
      'payload.config.ts': 'export default {}\n',
      'utilities/ui.ts': 'export const cn = (...args: unknown[]) => args.join(" ")\n',
    })
    const project = await detectProject(dir)

    expect(project.target.id).toBe('payload-blocks-app')
    expect(project.hostFiles).toEqual({
      pagesLayout: 'collections/Pages/index.ts',
      renderBlocks: 'blocks/RenderBlocks.tsx',
    })
  })

  it('rejects a variant layout that is missing the cn utility the blocks import', async () => {
    const dir = await makeProject({
      'src/blocks/RenderBlocks.tsx': RENDER_BLOCKS_SOURCE,
      'src/collections/Pages.ts': PAGES_SOURCE,
      'src/payload.config.ts': 'export default {}\n',
    })

    await expect(detectProject(dir)).rejects.toThrow('Unsupported project shape')
  })

  it('rejects a file that sits at a candidate path but lacks the anchors', async () => {
    const dir = await makeProject({
      ...starterFiles,
      'src/blocks/RenderBlocks.tsx': 'export const RenderBlocks = () => null\n',
      'src/utilities/ui.ts': 'export const cn = () => ""\n',
    })

    await expect(detectProject(dir)).rejects.toThrow('Unsupported project shape')
  })

  it('lists every supported shape when nothing matches', async () => {
    const dir = await makeProject({ 'src/payload.config.ts': 'export default {}\n' })

    await expect(detectProject(dir)).rejects.toThrow(
      /payload-website-starter[\s\S]*payload-blocks-app/,
    )
  })
})

describe('wiring a non-starter layout', () => {
  it('patches, verifies, and unwires the resolved paths', async () => {
    const dir = await makeProject({
      'src/blocks/RenderBlocks.tsx': RENDER_BLOCKS_SOURCE,
      'src/collections/Pages.ts': PAGES_SOURCE,
      'src/payload.config.ts': 'export default {}\n',
      'src/utilities/ui.ts': 'export const cn = () => ""\n',
    })
    const project = await detectProject(dir)

    const touched = await applyPayloadFragments(dir, heroFragments, project.hostFiles)

    expect(touched).toContain('src/collections/Pages.ts')

    await expect(
      verifyInstalledPayloadFragments({
        cwd: dir,
        hostFiles: project.hostFiles,
        manifest: { payloadFragments: heroFragments },
      }),
    ).resolves.toMatchObject({ isValid: true })

    /* The canonical starter path does not exist here, so verifying against it
     * must fail rather than silently report a healthy install. */
    await expect(
      verifyInstalledPayloadFragments({
        cwd: dir,
        manifest: { payloadFragments: heroFragments },
      }),
    ).rejects.toThrow()

    await removePayloadFragments(dir, heroFragments, project.hostFiles)

    await expect(
      verifyInstalledPayloadFragments({
        cwd: dir,
        hostFiles: project.hostFiles,
        manifest: { payloadFragments: heroFragments },
      }),
    ).resolves.toMatchObject({ isValid: false })
  })

  it('maps manifest recovery paths onto the resolved host files', () => {
    expect(
      resolveRecoveryPatchedFiles({
        hostFiles: {
          pagesLayout: 'collections/Pages.ts',
          renderBlocks: 'blocks/RenderBlocks.tsx',
        },
        recoveryPatchedFiles: ['src/blocks/RenderBlocks.tsx', 'src/collections/Pages/index.ts'],
      }),
    ).toEqual(['blocks/RenderBlocks.tsx', 'collections/Pages.ts'])
  })
})

describe('reporting against a non-starter layout', () => {
  /* Regression: diff used to check the canonical starter paths regardless of the
   * detected target, so every install on a variant layout reported as unwired. */
  it('checks the wiring where this project actually keeps it', async () => {
    const dir = await makeProject({
      'src/blocks/RenderBlocks.tsx': RENDER_BLOCKS_SOURCE,
      'src/collections/Pages.ts': PAGES_SOURCE,
      'src/payload.config.ts': 'export default {}\n',
      'src/utilities/ui.ts': 'export const cn = () => ""\n',
    })
    const project = await detectProject(dir)
    const manifest = await loadManifest('hero-basic')

    for (const projectPath of manifest.files) {
      await writeProjectFile(
        dir,
        projectPath,
        await readFile(
          path.join(
            process.cwd(),
            'payload-components',
            'source',
            projectPath.replace(/^src\//, ''),
          ),
          'utf8',
        ),
      )
    }

    await applyPayloadFragments(dir, manifest.payloadFragments, project.hostFiles)
    await recordInstalledState({
      cwd: dir,
      manifest,
      patchedFiles: manifest.recovery.patchedFiles,
      targetId: project.target.id,
    })

    const output: string[] = []
    vi.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
      output.push(String(chunk))
      return true
    })

    await expect(diffCommand({ cwd: dir })).resolves.toBe(true)
    expect(output.join('')).toContain('hero-basic: clean')

    vi.restoreAllMocks()
  })
})
