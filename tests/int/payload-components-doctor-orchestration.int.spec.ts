import { afterEach, describe, expect, it, vi } from 'vitest'

import type {
  ComponentManifest,
  DetectedProject,
  InstallState,
  InstallStateEntry,
  ResolvedInstallPlan,
} from '../../tools/payload-components/types'

import { makeTestManifest } from './manifest-factory'

const detectedProject: DetectedProject = {
  cwd: '/tmp/fixture',
  hostFiles: {
    pagesLayout: 'src/collections/Pages/index.ts',
    renderBlocks: 'src/blocks/RenderBlocks.tsx',
  },
  lockfilePath: 'pnpm-lock.yaml',
  nextMajor: 16,
  packageManager: 'pnpm',
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

const stateEntryFor = (manifest: ComponentManifest): InstallStateEntry => ({
  fileHashes: {},
  installedAt: '2026-07-13T00:00:00.000Z',
  lastAttemptAt: '2026-07-13T00:00:00.000Z',
  lastError: null,
  manifestVersion: manifest.version,
  patchedFiles: manifest.recovery.patchedFiles,
  registryItemName: manifest.registryItemName,
  status: 'installed',
  targetId: detectedProject.target.id,
})

const planFor = (manifest: ComponentManifest): ResolvedInstallPlan => ({
  dependencies: manifest.dependencies,
  files: manifest.files,
  name: manifest.name,
  payloadFragments: manifest.payloadFragments,
  peerDependencies: manifest.peerDependencies,
  postInstall: manifest.postInstall,
  recovery: manifest.recovery,
  registryDependencies: [],
  registryItemName: manifest.registryItemName,
  version: manifest.version,
})

describe('payload-components doctor orchestration', () => {
  afterEach(() => {
    vi.resetModules()
    vi.restoreAllMocks()
  })

  it('reports an install-plan failure per component and continues diagnostics', async () => {
    const heroManifest = makeTestManifest()
    const featureManifest = makeTestManifest({
      name: 'feature-grid-basic',
      registryItemName: 'feature-grid-basic',
      title: 'Feature Grid Basic',
    })
    const state: InstallState = {
      components: {
        [heroManifest.name]: stateEntryFor(heroManifest),
        [featureManifest.name]: stateEntryFor(featureManifest),
      },
      version: 4,
    }
    const resolveInstallPlan = vi
      .fn()
      .mockRejectedValueOnce(new Error('registry plan unavailable'))
      .mockResolvedValueOnce(planFor(featureManifest))
    const output: string[] = []

    vi.doMock('node:fs/promises', () => ({
      readFile: vi.fn().mockResolvedValue(
        JSON.stringify({
          scripts: {
            'generate:importmap': 'payload generate:importmap',
            'generate:types': 'payload generate:types',
          },
        }),
      ),
      readdir: vi.fn().mockResolvedValue(['hero-basic.json', 'feature-grid-basic.json']),
    }))
    vi.doMock('../../tools/payload-components/dependencies', () => ({
      checkDependencyRequirements: vi.fn().mockResolvedValue({ installed: {}, missing: [] }),
    }))
    vi.doMock('../../tools/payload-components/install-plan', () => ({ resolveInstallPlan }))
    vi.doMock('../../tools/payload-components/manifest', () => ({
      loadManifest: vi.fn(async (name: string) =>
        name === heroManifest.name ? heroManifest : featureManifest,
      ),
    }))
    vi.doMock('../../tools/payload-components/project', () => ({
      assertManifestSupport: vi.fn(),
      detectProject: vi.fn().mockResolvedValue(detectedProject),
      verifyInstalledManifestFiles: vi.fn().mockResolvedValue({
        isValid: true,
        missingFiles: [],
        missingRegistryDependencies: [],
      }),
      verifyInstalledPayloadFragments: vi.fn().mockResolvedValue({
        isValid: true,
        missingFragments: [],
      }),
    }))
    vi.doMock('../../tools/payload-components/safe-path', () => ({
      readSafeProjectFile: vi.fn().mockResolvedValue(
        JSON.stringify({
          scripts: {
            'generate:importmap': 'payload generate:importmap',
            'generate:types': 'payload generate:types',
          },
        }),
      ),
      safeProjectFileExists: vi.fn().mockResolvedValue(true),
    }))
    vi.doMock('../../tools/payload-components/state', () => ({
      loadState: vi.fn().mockResolvedValue(state),
    }))
    vi.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
      output.push(String(chunk))
      return true
    })

    const { doctorCommand } = await import('../../tools/payload-components/commands/doctor')

    /* Component-scoped failures exit 1 — the project itself is usable. */
    await expect(doctorCommand({ cwd: detectedProject.cwd })).resolves.toBe(1)
    expect(resolveInstallPlan).toHaveBeenCalledTimes(2)
    expect(output.join('')).toContain('[error] hero-basic: registry plan unavailable')
    expect(output.join('')).toContain('[ok] feature-grid-basic: Payload fragments')
    expect(output.join('')).not.toContain('[error] project: registry plan unavailable')
  })
})
