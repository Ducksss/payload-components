import { describe, expect, it } from 'vitest'

import { classifyKitInstall, formatDoctorReports } from '../../tools/payload-kit/commands/doctor'

import type { DoctorReport } from '../../tools/payload-kit/commands/doctor'
import type { InstallStateEntry, KitManifest } from '../../tools/payload-kit/types'

const manifest: KitManifest = {
  $schema: '../schema/poc-manifest.schema.json',
  dependencies: {},
  description: 'Test manifest',
  files: ['src/blocks/HeroBasic/config.ts', 'src/blocks/HeroBasic/Component.tsx'],
  installMode: 'payload-kit-required',
  name: 'hero-basic',
  payloadFragments: [
    {
      blockSlug: 'heroBasic',
      importName: 'HeroBasicBlock',
      importPath: '@/blocks/HeroBasic/Component',
      kind: 'renderBlocks',
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
    patchedFiles: ['src/blocks/RenderBlocks.tsx'],
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

const installedEntry: InstallStateEntry = {
  installedAt: '2026-05-18T00:00:00.000Z',
  installedFiles: manifest.files,
  lastAttemptAt: '2026-05-18T00:00:00.000Z',
  lastError: null,
  manifestVersion: manifest.version,
  patchedFiles: manifest.recovery.patchedFiles,
  registryItemName: manifest.registryItemName,
  status: 'installed',
  targetId: 'payload-website-starter',
}

const baseInput = {
  dependencyProblems: [],
  fileCheck: {
    isValid: true,
    missingFiles: [],
  },
  fragmentCheck: {
    isValid: true,
    missingFragments: [],
  },
  manifest,
  stateEntry: installedEntry,
}

describe('payload-kit doctor classification', () => {
  it('reports a complete wrapper install when files, dependencies, fragments, and state are valid', () => {
    expect(classifyKitInstall(baseInput)).toMatchObject({
      kitName: 'hero-basic',
      status: 'fully-installed',
    })
  })

  it('reports a direct shadcn copy when files exist but wrapper-required Payload fragments are missing', () => {
    expect(
      classifyKitInstall({
        ...baseInput,
        fragmentCheck: {
          isValid: false,
          missingFragments: ['renderBlocks.block:heroBasic'],
        },
        stateEntry: undefined,
      }),
    ).toMatchObject({
      status: 'shadcn-only',
      summary: expect.stringContaining('shadcn-only copied'),
    })
  })

  it('reports missing Payload registration when a previously installed kit drifts', () => {
    expect(
      classifyKitInstall({
        ...baseInput,
        fragmentCheck: {
          isValid: false,
          missingFragments: ['renderBlocks.block:heroBasic'],
        },
      }),
    ).toMatchObject({
      status: 'missing-payload-registration',
      summary: expect.stringContaining('Payload registration is missing'),
    })
  })

  it('reports partial installs from state failures before other status labels', () => {
    expect(
      classifyKitInstall({
        ...baseInput,
        stateEntry: {
          ...installedEntry,
          lastError: {
            message: 'generate:types failed',
            stage: 'post-install',
          },
          status: 'partial',
        },
      }),
    ).toMatchObject({
      status: 'partial',
      summary: expect.stringContaining('post-install'),
    })
  })

  it('treats shadcn-native kits as complete without Payload fragments', () => {
    expect(
      classifyKitInstall({
        ...baseInput,
        fragmentCheck: {
          isValid: false,
          missingFragments: ['pagesLayout.block:HeroBasic'],
        },
        manifest: {
          ...manifest,
          installMode: 'shadcn-native',
          payloadFragments: [],
          postInstall: [],
          recovery: {
            patchedFiles: [],
          },
        },
        stateEntry: undefined,
      }),
    ).toMatchObject({
      status: 'fully-installed',
      summary: expect.stringContaining('shadcn-native'),
    })
  })

  it('formats reports with actionable install commands', () => {
    const reports: DoctorReport[] = [
      classifyKitInstall({
        ...baseInput,
        fragmentCheck: {
          isValid: false,
          missingFragments: ['pagesLayout.block:HeroBasic'],
        },
        stateEntry: undefined,
      }),
    ]

    expect(formatDoctorReports(reports)).toContain('pnpm dlx payload-kit add hero-basic')
  })
})
