import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, rm } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'

import { afterEach, describe, expect, it } from 'vitest'

import {
  classifyKitInstall,
  getDoctorExitCode,
  type DoctorReport,
} from '../../tools/payload-kit/commands/doctor'

import { createInstallFixture } from './payload-kit-fixture'

import type { DetectedProject, InstallStateEntry, KitManifest } from '../../tools/payload-kit/types'

const execFileAsync = promisify(execFile)
const repoRoot = process.cwd()
const payloadKitBin = path.join(repoRoot, 'bin', 'payload-kit.mjs')

const manifest: KitManifest = {
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

const project: DetectedProject = {
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

const installedEntry: InstallStateEntry = {
  installedAt: '2026-06-12T00:00:00.000Z',
  installedFiles: manifest.files,
  lastAttemptAt: '2026-06-12T00:00:00.000Z',
  lastError: null,
  manifestVersion: manifest.version,
  patchedFiles: manifest.recovery.patchedFiles,
  registryItemName: manifest.registryItemName,
  status: 'installed',
  targetId: project.target.id,
}

const baseInput = {
  dependencies: {
    missing: [],
  },
  fileCheck: {
    isValid: true,
    missingFiles: [],
  },
  fragmentCheck: {
    isValid: true,
    missingFragments: [],
  },
  manifest,
  project,
  stateEntry: installedEntry,
}

const runDoctor = (fixtureDir: string, json = false) =>
  execFileAsync(
    process.execPath,
    [payloadKitBin, 'doctor', '--cwd', fixtureDir, ...(json ? ['--json'] : [])],
    {
      cwd: repoRoot,
      env: process.env,
      maxBuffer: 10_000_000,
    },
  )

describe('payload-kit doctor', () => {
  const tempDirs: string[] = []

  afterEach(async () => {
    await Promise.all(tempDirs.map((tempDir) => rm(tempDir, { force: true, recursive: true })))
  })

  it('classifies a valid wrapper install as healthy', () => {
    expect(classifyKitInstall(baseInput)).toMatchObject({
      severity: 'healthy',
      status: 'healthy',
    })
    expect(getDoctorExitCode([classifyKitInstall(baseInput)])).toBe(0)
  })

  it('does not fail CI when a kit has never been installed', () => {
    const finding = classifyKitInstall({
      ...baseInput,
      fileCheck: {
        isValid: false,
        missingFiles: manifest.files,
      },
      stateEntry: undefined,
    })

    expect(finding).toMatchObject({
      severity: 'info',
      status: 'not-installed',
    })
    expect(getDoctorExitCode([finding])).toBe(0)
  })

  it('reports partial installs with the failed stage and retry command', () => {
    expect(
      classifyKitInstall({
        ...baseInput,
        stateEntry: {
          ...installedEntry,
          installedAt: null,
          lastError: {
            message: 'generate:types failed',
            stage: 'post-install',
          },
          status: 'partial',
        },
      }),
    ).toMatchObject({
      actions: ['pnpm dlx payload-kit add hero-basic'],
      severity: 'recoverable',
      status: 'partial',
      summary: expect.stringContaining('post-install'),
    })
  })

  it('reports direct shadcn copies when files exist without Payload registration', () => {
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
      severity: 'recoverable',
      status: 'shadcn-only',
    })
  })

  it('reports stale recovery state when manifest metadata changes', () => {
    expect(
      classifyKitInstall({
        ...baseInput,
        stateEntry: {
          ...installedEntry,
          manifestVersion: '0.0.1',
        },
      }),
    ).toMatchObject({
      severity: 'recoverable',
      status: 'stale-state',
    })
  })

  it('returns JSON with exit code 0 for a supported target with no installed kits', async () => {
    const { fixtureDir } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)

    const result = await runDoctor(fixtureDir, true)
    const report = JSON.parse(result.stdout) as DoctorReport

    expect(report.exitCode).toBe(0)
    expect(report.project.supported).toBe(true)
    expect(report.findings.find((finding) => finding.kitName === 'hero-basic')).toMatchObject({
      severity: 'info',
      status: 'not-installed',
    })
  })

  it('exits 2 for unsupported project shapes', async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'payload-kit-doctor-unsupported-'))
    tempDirs.push(tempDir)
    await mkdir(tempDir, { recursive: true })

    await expect(runDoctor(tempDir, true)).rejects.toMatchObject({
      code: 2,
      stdout: expect.stringContaining('"supported": false'),
    })
  })
})
