import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { assertManifestSupport } from '../../tools/payload-components/project'
import type { ComponentManifest, RegistryDefinition } from '../../tools/payload-components/types'

const repoRoot = process.cwd()
const manifestSchemaPath = path.join(repoRoot, 'payload-components', 'schema', 'poc-manifest.schema.json')

const baseManifest: ComponentManifest = {
  $schema: '../schema/poc-manifest.schema.json',
  dependencies: {},
  description: 'Test manifest',
  files: ['src/blocks/HeroBasic/config.ts', 'src/blocks/HeroBasic/Component.tsx'],
  name: 'hero-basic',
  payloadFragments: [
    {
      blockSlug: 'heroBasic',
      importName: 'HeroBasicBlock',
      importPath: '@/blocks/HeroBasic/Component',
      kind: 'renderBlocks',
    },
    {
      blockName: 'HeroBasic',
      importName: 'HeroBasic',
      importPath: '../../blocks/HeroBasic/config',
      kind: 'pagesLayout',
    },
  ],
  peerDependencies: {
    next: '^15.0.0 || ^16.0.0',
    payload: '^3.0.0',
  },
  postInstall: ['generate:types', 'generate:importmap'],
  preview: {
    summary: 'Preview summary',
  },
  recovery: {
    patchedFiles: ['src/blocks/RenderBlocks.tsx', 'src/collections/Pages/index.ts'],
  },
  registryItemName: 'hero-basic',
  sampleContent: {
    blockType: 'heroBasic',
  },
  supportedTargets: ['payload-website-starter'],
  supports: {
    nextMajors: [15, 16],
    payloadMajors: [3],
  },
  title: 'Hero Basic',
  version: '0.1.0',
}

const baseRegistry: RegistryDefinition = {
  homepage: 'https://example.com',
  items: [
    {
      name: 'hero-basic',
    },
  ],
  name: 'payload-components',
}

const loadManifestWithMocks = async (
  manifest: unknown,
  registry: RegistryDefinition = baseRegistry,
) => {
  const schema = JSON.parse(await readFile(manifestSchemaPath, 'utf8')) as object
  const readJsonFile = vi.fn(async (filePath: string) => {
    if (filePath.endsWith(path.join('payload-components', 'manifests', 'hero-basic.json'))) {
      return manifest
    }

    if (filePath.endsWith(path.join('payload-components', 'schema', 'poc-manifest.schema.json'))) {
      return schema
    }

    if (filePath.endsWith(path.join('payload-components', 'registry.json'))) {
      return registry
    }

    throw new Error(`Unexpected readJsonFile path: ${filePath}`)
  })

  vi.doMock('../../tools/payload-components/utils', () => ({
    getLockfileName: vi.fn(() => 'pnpm-lock.yaml'),
    isPathInside: (parentPath: string, childPath: string) => {
      const relative = path.relative(path.resolve(parentPath), path.resolve(childPath))

      return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))
    },
    readJsonFile,
    repoRoot: '/virtual/repo',
    runCommand: vi.fn(),
  }))

  const manifestModule = await import('../../tools/payload-components/manifest')

  return {
    loadManifest: manifestModule.loadManifest,
    readJsonFile,
  }
}

describe('payload-components manifest validation', () => {
  afterEach(() => {
    vi.resetModules()
    vi.restoreAllMocks()
  })

  it('fails when nested supports fields are missing', async () => {
    const manifest = {
      ...baseManifest,
      supports: {
        nextMajors: [15, 16],
      },
    }
    const { loadManifest } = await loadManifestWithMocks(manifest)

    await expect(loadManifest('hero-basic')).rejects.toThrow('supports.payloadMajors')
  })

  it('fails when a payload fragment is malformed', async () => {
    const manifest = {
      ...baseManifest,
      payloadFragments: [
        {
          kind: 'renderBlocks',
          importName: 'HeroBasicBlock',
          importPath: '@/blocks/HeroBasic/Component',
        },
      ],
    }
    const { loadManifest } = await loadManifestWithMocks(manifest)

    await expect(loadManifest('hero-basic')).rejects.toThrow('payloadFragments.0.blockSlug')
  })

  it('fails when dependency ranges are invalid', async () => {
    const manifest = {
      ...baseManifest,
      dependencies: {
        'bad-package': 'not-a-range',
      },
    }
    const { loadManifest } = await loadManifestWithMocks(manifest)

    await expect(loadManifest('hero-basic')).rejects.toThrow('dependencies.bad-package')
  })

  it('fails when post-install scripts are not supported', async () => {
    const manifest = {
      ...baseManifest,
      postInstall: ['generate:types', 'evil:script'],
    }
    const { loadManifest } = await loadManifestWithMocks(manifest)

    await expect(loadManifest('hero-basic')).rejects.toThrow('postInstall.1')
  })

  it('fails when the manifest references an unknown registry item', async () => {
    const manifest = {
      ...baseManifest,
      registryItemName: 'missing-item',
    }
    const { loadManifest } = await loadManifestWithMocks(manifest)

    await expect(loadManifest('hero-basic')).rejects.toThrow('no matching item exists')
  })

  it('fails support checks for unsupported targets and version majors', () => {
    const baseProject = {
      cwd: '/tmp/fixture',
      nextMajor: 16,
      packageManager: 'pnpm' as const,
      payloadMajor: 3,
      target: {
        allowedNextMajors: [15, 16],
        allowedPayloadMajors: [3],
        description: 'Target',
        id: 'payload-website-starter',
        requiredAnchors: [],
        requiredFiles: [],
      },
    }

    expect(() =>
      assertManifestSupport(
        {
          ...baseProject,
          target: {
            ...baseProject.target,
            id: 'different-target',
          },
        },
        baseManifest,
      ),
    ).toThrow('does not support the detected project target')

    expect(() =>
      assertManifestSupport(
        {
          ...baseProject,
          payloadMajor: 4,
        },
        baseManifest,
      ),
    ).toThrow('does not support Payload major version 4')

    expect(() =>
      assertManifestSupport(
        {
          ...baseProject,
          nextMajor: 14,
        },
        baseManifest,
      ),
    ).toThrow('does not support Next.js major version 14')
  })
})

describe('payload-components package metadata', () => {
  const readPackageJson = async () =>
    JSON.parse(await readFile(path.join(repoRoot, 'package.json'), 'utf8')) as {
      bin?: Record<string, string>
      dependencies?: Record<string, string>
      files?: string[]
    }

  // Guards against re-bloating the published CLI: the bin must point at the
  // compiled bundle and runtime deps must stay exactly ajv + semver, so a future
  // change can't silently drag the Next.js site deps into `npx payload-components`.
  it('publishes the compiled bin and only ajv + semver as runtime deps', async () => {
    const packageJson = await readPackageJson()

    expect(packageJson.bin).toEqual({
      'payload-components': './dist/cli.js',
    })
    expect(Object.keys(packageJson.dependencies ?? {}).sort()).toEqual(['ajv', 'semver'])
    expect(packageJson.files).toContain('dist/')
  })
})
