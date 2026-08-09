import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { assertManifestSupport } from '../../tools/payload-components/project'
import type { RegistryDefinition } from '../../tools/payload-components/types'

import { makeTestManifest } from './manifest-factory'

const repoRoot = process.cwd()
const manifestSchemaPath = path.join(
  repoRoot,
  'payload-components',
  'schema',
  'poc-manifest.schema.json',
)

const baseManifest = makeTestManifest()

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

  it('fails a changelog entry that is breaking without saying how to migrate', async () => {
    const { loadManifest } = await loadManifestWithMocks(
      makeTestManifest({
        changelog: [{ breaking: true, summary: 'Renamed a field.', version: '0.1.0' }],
      }),
    )

    await expect(loadManifest('hero-basic')).rejects.toThrow(
      /marks 0\.1\.0 breaking but gives no dataMigration/,
    )
  })

  it('fails a changelog that is not ordered newest first', async () => {
    const { loadManifest } = await loadManifestWithMocks(
      makeTestManifest({
        changelog: [
          { summary: 'Initial release.', version: '0.1.0' },
          { summary: 'Added a field.', version: '0.2.0' },
        ],
        version: '0.2.0',
      }),
    )

    await expect(loadManifest('hero-basic')).rejects.toThrow(/ordered newest first/)
  })

  it('fails a manifest whose own version has no changelog entry', async () => {
    const { loadManifest } = await loadManifestWithMocks(
      makeTestManifest({
        changelog: [{ summary: 'Initial release.', version: '0.1.0' }],
        version: '0.2.0',
      }),
    )

    await expect(loadManifest('hero-basic')).rejects.toThrow(
      /declares version 0\.2\.0 with no matching changelog entry/,
    )
  })

  it('fails a changelog entry with a non-semver version', async () => {
    const { loadManifest } = await loadManifestWithMocks(
      makeTestManifest({ changelog: [{ summary: 'Initial release.', version: 'v1' }] }),
    )

    await expect(loadManifest('hero-basic')).rejects.toThrow(/invalid version "v1"/)
  })

  it('accepts a well-formed changelog and a manifest without one', async () => {
    const withChangelog = await loadManifestWithMocks(
      makeTestManifest({
        changelog: [
          {
            breaking: true,
            dataMigration: 'Rename `heading` to `title`.',
            summary: 'Renamed.',
            version: '0.2.0',
          },
          { summary: 'Initial release.', version: '0.1.0' },
        ],
        version: '0.2.0',
      }),
    )

    await expect(withChangelog.loadManifest('hero-basic')).resolves.toMatchObject({
      version: '0.2.0',
    })

    vi.resetModules()

    /* The field is optional: an older manifest still loads. */
    const withoutChangelog = await loadManifestWithMocks(makeTestManifest())

    await expect(withoutChangelog.loadManifest('hero-basic')).resolves.not.toHaveProperty(
      'changelog',
    )
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
      hostFiles: {
        pagesLayout: 'src/collections/Pages/index.ts',
        renderBlocks: 'src/blocks/RenderBlocks.tsx',
      },
      lockfilePath: 'pnpm-lock.yaml',
      nextMajor: 16,
      packageManager: 'pnpm' as const,
      payloadMajor: 3,
      target: {
        allowedNextMajors: [15, 16],
        allowedPayloadMajors: [3],
        description: 'Target',
        hostFiles: {
          pagesLayout: { anchors: [], candidates: ['src/collections/Pages/index.ts'] },
          renderBlocks: { anchors: [], candidates: ['src/blocks/RenderBlocks.tsx'] },
        },
        id: 'payload-website-starter',
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
