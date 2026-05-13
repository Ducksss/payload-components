import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { assertManifestSupport } from '../../tools/payload-kit/project'
import type { KitManifest, RegistryDefinition } from '../../tools/payload-kit/types'

const repoRoot = process.cwd()
const manifestSchemaPath = path.join(repoRoot, 'payload-kits', 'schema', 'poc-manifest.schema.json')

const baseManifest: KitManifest = {
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
  name: 'payload-kits',
}

const loadManifestWithMocks = async (manifest: unknown, registry: RegistryDefinition = baseRegistry) => {
  const schema = JSON.parse(await readFile(manifestSchemaPath, 'utf8')) as object
  const readJsonFile = vi.fn(async (filePath: string) => {
    if (filePath.endsWith(path.join('payload-kits', 'manifests', 'hero-basic.json'))) {
      return manifest
    }

    if (filePath.endsWith(path.join('payload-kits', 'schema', 'poc-manifest.schema.json'))) {
      return schema
    }

    if (filePath.endsWith(path.join('payload-kits', 'registry.json'))) {
      return registry
    }

    throw new Error(`Unexpected readJsonFile path: ${filePath}`)
  })

  vi.doMock('../../tools/payload-kit/utils', () => ({
    getLockfileName: vi.fn(() => 'pnpm-lock.yaml'),
    readJsonFile,
    repoRoot: '/virtual/repo',
    runCommand: vi.fn(),
  }))

  const manifestModule = await import('../../tools/payload-kit/manifest')

  return {
    loadManifest: manifestModule.loadManifest,
    readJsonFile,
  }
}

describe('payload-kit manifest validation', () => {
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
