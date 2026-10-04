import { mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { diffCommand } from '../../tools/payload-components/commands/diff'
import { checkDependencyRequirements } from '../../tools/payload-components/dependencies'
import { listComponentNames, loadManifest } from '../../tools/payload-components/manifest'
import {
  applyPayloadFragments,
  detectProject,
  removePayloadFragments,
  resolveRecoveryPatchedFiles,
  verifyInstalledPayloadFragments,
} from '../../tools/payload-components/project'
import { recordInstalledState } from '../../tools/payload-components/state'
import { captureRejection } from './payload-components-assertions'

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

const makeProject = async (
  files: Record<string, string>,
  dependencies: Record<string, string> = { next: '^16.0.0', payload: '^3.0.0' },
) => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-target-'))
  tempDirs.push(dir)

  await writeFile(
    path.join(dir, 'package.json'),
    `${JSON.stringify(
      {
        dependencies,
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

/* create-payload-app --version latest writes "latest" for every Payload package,
 * which names no major or range, so the installed version has to stand in. pnpm
 * links node_modules/<name> into its store, hence the symlink. */
const installPackage = async (dir: string, name: string, version: string) => {
  const storePath = path.join('.pnpm', `${name}@${version}`, 'node_modules', name)

  await mkdir(path.join(dir, 'node_modules', storePath), { recursive: true })
  await writeFile(
    path.join(dir, 'node_modules', storePath, 'package.json'),
    `${JSON.stringify({ name, version })}\n`,
    'utf8',
  )
  await symlink(storePath, path.join(dir, 'node_modules', name))
}

describe('dependencies declared by dist-tag', () => {
  it('detects the project from the installed Payload version', async () => {
    const dir = await makeProject(starterFiles, { next: '16.0.0', payload: 'latest' })
    await installPackage(dir, 'payload', '3.90.2')

    const project = await detectProject(dir)

    expect(project.payloadMajor).toBe(3)
    expect(project.target.id).toBe('payload-website-starter')
  })

  it('keeps a declared range over the installed version', async () => {
    const dir = await makeProject(starterFiles)
    await installPackage(dir, 'payload', '4.0.0')

    expect((await detectProject(dir)).payloadMajor).toBe(3)
  })

  it('still rejects a dist-tag when nothing is installed', async () => {
    const dir = await makeProject(starterFiles, { next: '16.0.0', payload: 'latest' })

    await expect(detectProject(dir)).rejects.toThrow(
      'Unable to determine the installed major version for "payload"',
    )
  })

  it('checks peer ranges against the installed version', async () => {
    const dir = await makeProject(starterFiles, { next: '16.0.0', payload: 'latest' })
    await installPackage(dir, 'payload', '3.90.2')
    const check = (payload: string) =>
      checkDependencyRequirements({
        allowMissing: false,
        cwd: dir,
        dependencies: { payload },
        label: 'peerDependencies',
      })

    await expect(check('^3.0.0')).resolves.toMatchObject({ missing: [] })
    await expect(check('^4.0.0')).rejects.toThrow(
      'declares peerDependencies package "payload" as "latest" (installed 3.90.2)',
    )
  })

  it('treats a bare wildcard like a dist-tag', async () => {
    const dir = await makeProject(starterFiles, { next: '16.0.0', payload: '*' })
    const check = () =>
      checkDependencyRequirements({
        allowMissing: false,
        cwd: dir,
        dependencies: { payload: '^3.0.0' },
        label: 'peerDependencies',
      })

    await expect(check()).rejects.toThrow('has no installed version to check instead')

    await installPackage(dir, 'payload', '3.90.2')

    await expect(check()).resolves.toMatchObject({ installed: { payload: '3.90.2' } })
  })
})

/* create-payload-app pins every Payload package to the exact version it
 * scaffolds, so a Payload 4 canary project declares "4.0.0-canary.N". Detection
 * and every manifest's peer range have to accept that alongside v3, and a major
 * no target supports has to be named as such, not reported as a file shape. */
describe('Payload major support', () => {
  const canaryDependencies = { next: '16.3.8', payload: '4.0.0-canary.37', react: '19.3.0' }
  const checkPeers = (cwd: string, dependencies: Record<string, string>) =>
    checkDependencyRequirements({
      allowMissing: false,
      cwd,
      dependencies,
      label: 'peerDependencies',
    })

  it('detects a project pinned to a Payload 4 prerelease', async () => {
    const dir = await makeProject(starterFiles, canaryDependencies)
    const project = await detectProject(dir)

    expect(project.payloadMajor).toBe(4)
    expect(project.target.id).toBe('payload-website-starter')
  })

  it('accepts Payload 3 and a Payload 4 prerelease against every manifest peer range', async () => {
    const v3 = await makeProject(starterFiles, {
      next: '16.0.0',
      payload: '3.88.0',
      react: '19.0.0',
    })
    const v4 = await makeProject(starterFiles, canaryDependencies)

    /* Declared majors are held to support-matrix.json by
       payload-components-support-matrix.int.spec.ts; this proves the runtime
       peer check accepts real installs of both majors. */
    for (const name of await listComponentNames()) {
      const manifest = await loadManifest(name)

      await expect(checkPeers(v3, manifest.peerDependencies), name).resolves.toMatchObject({
        missing: [],
      })
      await expect(checkPeers(v4, manifest.peerDependencies), name).resolves.toMatchObject({
        installed: { payload: '4.0.0-canary.37' },
        missing: [],
      })
    }
  })

  it('keeps a prerelease inside its own major', async () => {
    const dir = await makeProject(starterFiles, canaryDependencies)

    await expect(checkPeers(dir, { payload: '^3.0.0' })).rejects.toThrow(
      'does not satisfy the required range "^3.0.0"',
    )
    await expect(checkPeers(dir, { payload: '^5.0.0-0' })).rejects.toThrow(
      'does not satisfy the required range "^5.0.0-0"',
    )
  })

  it('names an unsupported Payload major instead of blaming the file shape', async () => {
    const dir = await makeProject(starterFiles, { next: '^16.0.0', payload: '^2.0.0' })
    const error = await captureRejection(detectProject(dir))

    expect(error.message).toContain('Unsupported Payload major version 2')
    expect(error.message).toContain('supports Payload v3, v4')
    expect(error.message).not.toContain('Unsupported project shape')
  })

  it('names an unsupported Next.js major', async () => {
    const dir = await makeProject(starterFiles, { next: '^14.0.0', payload: '^3.0.0' })

    await expect(detectProject(dir)).rejects.toThrow('Unsupported Next.js major version 14')
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

  /* The repair instructions are only useful if they point at the file this
     project actually keeps, so the failure must name the resolved host path
     rather than the canonical starter one it was authored against. */
  it('names the resolved host path when a variant layout has drifted', async () => {
    const dir = await makeProject({
      'src/blocks/RenderBlocks.tsx': RENDER_BLOCKS_SOURCE,
      'src/collections/Pages.ts': PAGES_SOURCE,
      'src/payload.config.ts': 'export default {}\n',
      'src/utilities/ui.ts': 'export const cn = () => ""\n',
    })
    const project = await detectProject(dir)

    await writeFile(
      path.join(dir, 'src/collections/Pages.ts'),
      "import type { CollectionConfig } from 'payload'\n\nexport const Pages: CollectionConfig = {\n  slug: 'pages',\n  fields: [],\n}\n",
      'utf8',
    )

    const error = await captureRejection(
      applyPayloadFragments(dir, heroFragments, project.hostFiles),
    )

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toContain('src/collections/Pages.ts')
    expect(error.message).not.toContain('src/collections/Pages/index.ts')
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
