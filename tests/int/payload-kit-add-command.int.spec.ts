import { afterEach, describe, expect, it, vi } from 'vitest'

import type { DetectedProject, InstallState, KitManifest } from '../../tools/payload-kit/types'

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
    payload: '^3.0.0',
  },
  postInstall: ['generate:types'],
  preview: {
    summary: 'Preview',
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

const detectedProject: DetectedProject = {
  cwd: '/tmp/fixture',
  nextMajor: 16,
  packageManager: 'pnpm',
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

const defaultState: InstallState = {
  kits: {},
  version: 2,
}

describe('payload-kit add command orchestration', () => {
  afterEach(() => {
    vi.resetModules()
    vi.restoreAllMocks()
  })

  const setup = async ({
    loadStateValue = defaultState,
    manifest = baseManifest,
  }: {
    loadStateValue?: InstallState
    manifest?: KitManifest
  } = {}) => {
    const loadManifest = vi.fn().mockResolvedValue(manifest)
    const detectProject = vi.fn().mockResolvedValue(detectedProject)
    const assertManifestSupport = vi.fn()
    const verifyInstalledManifestFiles = vi.fn().mockResolvedValue({
      isValid: true,
      missingFiles: [],
    })
    const verifyInstalledPayloadFragments = vi.fn().mockResolvedValue({
      isValid: true,
      missingFragments: [],
    })
    const applyPayloadFragments = vi
      .fn()
      .mockResolvedValue(['src/blocks/RenderBlocks.tsx', 'src/collections/Pages/index.ts'])
    const checkDependencyRequirements = vi.fn()
    const installManifestDependencies = vi.fn().mockResolvedValue(undefined)
    const getRuntimePatchedFiles = vi
      .fn()
      .mockReturnValue(['src/blocks/RenderBlocks.tsx', 'src/collections/Pages/index.ts'])
    const buildRegistry = vi.fn().mockResolvedValue('/tmp/payload-kit-registry')
    const installRegistryItem = vi.fn().mockResolvedValue(undefined)
    const loadState = vi.fn().mockResolvedValue(loadStateValue)
    const recordInstallAttempt = vi.fn().mockResolvedValue(undefined)
    const recordInstallFailure = vi.fn().mockResolvedValue(undefined)
    const recordInstalledState = vi.fn().mockResolvedValue(undefined)
    const getRunScriptCommand = vi.fn().mockReturnValue({
      args: ['generate:types'],
      command: 'pnpm',
    })
    const printHeader = vi.fn()
    const runCommand = vi.fn().mockResolvedValue(undefined)

    vi.doMock('../../tools/payload-kit/manifest', () => ({
      loadManifest,
    }))
    vi.doMock('../../tools/payload-kit/project', () => ({
      applyPayloadFragments,
      assertManifestSupport,
      detectProject,
      verifyInstalledManifestFiles,
      verifyInstalledPayloadFragments,
    }))
    vi.doMock('../../tools/payload-kit/dependencies', () => ({
      checkDependencyRequirements,
      getRuntimePatchedFiles,
      installManifestDependencies,
    }))
    vi.doMock('../../tools/payload-kit/registry', () => ({
      buildRegistry,
      installRegistryItem,
    }))
    vi.doMock('../../tools/payload-kit/state', () => ({
      loadState,
      recordInstalledState,
      recordInstallAttempt,
      recordInstallFailure,
    }))
    vi.doMock('../../tools/payload-kit/utils', async () => {
      const actual = await vi.importActual<typeof import('../../tools/payload-kit/utils')>(
        '../../tools/payload-kit/utils',
      )

      return {
        ...actual,
        getRunScriptCommand,
        printHeader,
        runCommand,
      }
    })

    const addCommandModule = await import('../../tools/payload-kit/commands/add')

    return {
      addCommand: addCommandModule.addCommand,
      mocks: {
        applyPayloadFragments,
        buildRegistry,
        checkDependencyRequirements,
        getRunScriptCommand,
        installManifestDependencies,
        installRegistryItem,
        loadState,
        printHeader,
        recordInstallAttempt,
        recordInstallFailure,
        recordInstalledState,
        runCommand,
        verifyInstalledManifestFiles,
        verifyInstalledPayloadFragments,
      },
    }
  }

  it('fails peer dependency validation before mutation', async () => {
    const { addCommand, mocks } = await setup()

    mocks.checkDependencyRequirements.mockRejectedValueOnce(
      new Error('Missing required peerDependencies package "payload".'),
    )

    await expect(addCommand({ cwd: '/tmp/fixture', kitName: 'hero-basic' })).rejects.toThrow(
      'Missing required peerDependencies package',
    )

    expect(mocks.recordInstallAttempt).not.toHaveBeenCalled()
    expect(mocks.recordInstallFailure).not.toHaveBeenCalled()
  })

  it('records dependency-install failures after partial state creation', async () => {
    const manifest = {
      ...baseManifest,
      dependencies: {
        clsx: '^2.1.1',
      },
    }
    const { addCommand, mocks } = await setup({
      manifest,
    })

    mocks.checkDependencyRequirements
      .mockResolvedValueOnce({ installed: { payload: '3.82.1' }, missing: [] })
      .mockResolvedValueOnce({ installed: {}, missing: ['clsx'] })
    mocks.verifyInstalledManifestFiles.mockResolvedValueOnce({
      isValid: false,
      missingFiles: ['src/blocks/HeroBasic/config.ts'],
    })
    mocks.verifyInstalledPayloadFragments.mockResolvedValueOnce({
      isValid: false,
      missingFragments: ['renderBlocks.block:heroBasic'],
    })
    mocks.installManifestDependencies.mockRejectedValueOnce(new Error('pnpm add failed'))

    await expect(addCommand({ cwd: '/tmp/fixture', kitName: 'hero-basic' })).rejects.toThrow('pnpm add failed')

    expect(mocks.recordInstallAttempt).toHaveBeenCalledOnce()
    expect(mocks.recordInstallFailure).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'pnpm add failed',
        stage: 'dependency-install',
      }),
    )
  })

  it('records fragment-apply failures after files are already present', async () => {
    const { addCommand, mocks } = await setup()

    mocks.checkDependencyRequirements
      .mockResolvedValueOnce({ installed: { payload: '3.82.1' }, missing: [] })
      .mockResolvedValueOnce({ installed: {}, missing: [] })
    mocks.verifyInstalledManifestFiles.mockResolvedValueOnce({
      isValid: true,
      missingFiles: [],
    })
    mocks.verifyInstalledPayloadFragments.mockResolvedValueOnce({
      isValid: false,
      missingFragments: ['pagesLayout.block:HeroBasic'],
    })
    mocks.applyPayloadFragments.mockRejectedValueOnce(new Error('Pages collection patch failed'))

    await expect(addCommand({ cwd: '/tmp/fixture', kitName: 'hero-basic' })).rejects.toThrow(
      'Pages collection patch failed',
    )

    expect(mocks.recordInstallFailure).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Pages collection patch failed',
        stage: 'fragment-apply',
      }),
    )
  })

  it('records post-install failures and leaves the install partial', async () => {
    const { addCommand, mocks } = await setup()

    mocks.checkDependencyRequirements
      .mockResolvedValueOnce({ installed: { payload: '3.82.1' }, missing: [] })
      .mockResolvedValueOnce({ installed: {}, missing: [] })
    mocks.verifyInstalledManifestFiles.mockResolvedValueOnce({
      isValid: false,
      missingFiles: ['src/blocks/HeroBasic/config.ts'],
    })
    mocks.verifyInstalledPayloadFragments.mockResolvedValueOnce({
      isValid: false,
      missingFragments: ['renderBlocks.block:heroBasic'],
    })
    mocks.runCommand.mockRejectedValueOnce(new Error('generate:types failed'))

    await expect(addCommand({ cwd: '/tmp/fixture', kitName: 'hero-basic' })).rejects.toThrow(
      'generate:types failed',
    )

    expect(mocks.recordInstallFailure).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'generate:types failed',
        stage: 'post-install',
      }),
    )
    expect(mocks.recordInstalledState).not.toHaveBeenCalled()
  })

  it('retries cleanly from a partial state when files and fragments are already present', async () => {
    const { addCommand, mocks } = await setup({
      loadStateValue: {
        kits: {
          'hero-basic': {
            installedAt: null,
            installedFiles: ['src/blocks/HeroBasic/Component.tsx', 'src/blocks/HeroBasic/config.ts'],
            lastAttemptAt: '2026-04-16T00:00:00.000Z',
            lastError: {
              message: 'generate:types failed',
              stage: 'post-install',
            },
            manifestVersion: '0.1.0',
            patchedFiles: ['src/blocks/RenderBlocks.tsx', 'src/collections/Pages/index.ts'],
            registryItemName: 'hero-basic',
            status: 'partial',
            targetId: 'payload-website-starter',
          },
        },
        version: 2,
      },
    })

    mocks.checkDependencyRequirements
      .mockResolvedValueOnce({ installed: { payload: '3.82.1' }, missing: [] })
      .mockResolvedValueOnce({ installed: {}, missing: [] })
    mocks.verifyInstalledManifestFiles.mockResolvedValueOnce({
      isValid: true,
      missingFiles: [],
    })
    mocks.verifyInstalledPayloadFragments.mockResolvedValueOnce({
      isValid: true,
      missingFragments: [],
    })

    await addCommand({ cwd: '/tmp/fixture', kitName: 'hero-basic' })

    expect(mocks.buildRegistry).not.toHaveBeenCalled()
    expect(mocks.installRegistryItem).not.toHaveBeenCalled()
    expect(mocks.installManifestDependencies).not.toHaveBeenCalled()
    expect(mocks.applyPayloadFragments).not.toHaveBeenCalled()
    expect(mocks.runCommand).toHaveBeenCalledOnce()
    expect(mocks.recordInstalledState).toHaveBeenCalledOnce()
  })
})
