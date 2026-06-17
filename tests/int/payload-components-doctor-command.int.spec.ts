import { execFile } from 'node:child_process'
import { access, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'

import { afterEach, describe, expect, it } from 'vitest'

import { createInstallFixture } from './payload-components-fixture'

import type { ComponentManifest, InstallState } from '../../tools/payload-components/types'

const execFileAsync = promisify(execFile)
const repoRoot = process.cwd()
const payloadComponentBin = path.join(repoRoot, 'bin', 'payload-components.mjs')

const runDoctorCommand = async (fixtureDir: string) => {
  try {
    const result = await execFileAsync(
      process.execPath,
      [payloadComponentBin, 'doctor', '--cwd', fixtureDir],
      {
        cwd: repoRoot,
        env: process.env,
        maxBuffer: 10_000_000,
      },
    )

    return {
      code: 0,
      stderr: result.stderr,
      stdout: result.stdout,
    }
  } catch (error) {
    const result = error as Error & {
      code?: number
      stderr?: string
      stdout?: string
    }

    return {
      code: result.code ?? 1,
      stderr: result.stderr ?? '',
      stdout: result.stdout ?? '',
    }
  }
}

const getStateEntry = (
  manifest: ComponentManifest,
  overrides: Partial<InstallState['components'][string]> = {},
): InstallState['components'][string] => ({
  installedAt: '2026-04-16T00:00:00.000Z',
  installedFiles: manifest.files,
  lastAttemptAt: '2026-04-16T00:00:00.000Z',
  lastError: null,
  manifestVersion: manifest.version,
  patchedFiles: manifest.recovery.patchedFiles,
  registryItemName: manifest.registryItemName,
  status: 'installed',
  targetId: 'payload-website-starter',
  ...overrides,
})

const writeInstallState = async ({
  fixtureDir,
  manifest,
  overrides,
}: {
  fixtureDir: string
  manifest: ComponentManifest
  overrides?: Partial<InstallState['components'][string]>
}) => {
  await mkdir(path.join(fixtureDir, '.payload-components'), { recursive: true })

  const state: InstallState = {
    components: {
      [manifest.name]: getStateEntry(manifest, overrides),
    },
    version: 2,
  }

  await writeFile(
    path.join(fixtureDir, '.payload-components', 'state.json'),
    `${JSON.stringify(state, null, 2)}\n`,
    'utf8',
  )
}

describe('payload-components doctor', () => {
  const tempDirs: string[] = []

  afterEach(async () => {
    await Promise.all(tempDirs.map((tempDir) => rm(tempDir, { force: true, recursive: true })))
  })

  it('passes a supported project with no recorded installs without writing state', async () => {
    const { fixtureDir } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)

    const result = await runDoctorCommand(fixtureDir)

    expect(result.code).toBe(0)
    expect(result.stderr).toBe('')
    expect(result.stdout).toContain('[ok] project: payload-website-starter')
    expect(result.stdout).toContain('[ok] state: no recorded components')
    await expect(access(path.join(fixtureDir, '.payload-components', 'state.json'))).rejects.toThrow()
  }, 180000)

  it('fails when a recorded component is missing files and Payload fragments', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)
    await writeInstallState({ fixtureDir, manifest })

    const result = await runDoctorCommand(fixtureDir)

    expect(result.code).toBe(1)
    expect(result.stdout).toContain('[error] hero-basic: missing files')
    expect(result.stdout).toContain('src/blocks/HeroBasic/config.ts')
    expect(result.stdout).toContain('[error] hero-basic: missing Payload fragments')
    expect(result.stdout).toContain('renderBlocks.block:heroBasic')
    expect(result.stdout).toContain('Run "payload-components add hero-basic" to retry the install.')
  }, 180000)

  it('reports partial install state with the failed stage and message', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)
    await writeInstallState({
      fixtureDir,
      manifest,
      overrides: {
        installedAt: null,
        lastError: {
          message: 'generate:types failed',
          stage: 'post-install',
        },
        status: 'partial',
      },
    })

    const result = await runDoctorCommand(fixtureDir)

    expect(result.code).toBe(1)
    expect(result.stdout).toContain('[error] hero-basic: install is partial')
    expect(result.stdout).toContain('post-install: generate:types failed')
  }, 180000)

  it('fails unsupported project shapes', async () => {
    const fixtureDir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-doctor-'))
    tempDirs.push(fixtureDir)
    await writeFile(
      path.join(fixtureDir, 'package.json'),
      `${JSON.stringify({ dependencies: { next: '^16.0.0', payload: '^3.0.0' } }, null, 2)}\n`,
      'utf8',
    )

    const result = await runDoctorCommand(fixtureDir)

    expect(result.code).toBe(1)
    expect(result.stdout).toContain('[error] project:')
    expect(result.stdout).toContain('Unsupported project shape')
  })

  it('fails unsupported install state versions', async () => {
    const { fixtureDir } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)
    await mkdir(path.join(fixtureDir, '.payload-components'), { recursive: true })
    await writeFile(
      path.join(fixtureDir, '.payload-components', 'state.json'),
      `${JSON.stringify({ components: {}, version: 999 }, null, 2)}\n`,
      'utf8',
    )

    const result = await runDoctorCommand(fixtureDir)

    expect(result.code).toBe(1)
    expect(result.stdout).toContain('[error] state:')
    expect(result.stdout).toContain('Unsupported payload-components state version')
  }, 180000)

  it('fails when required post-install scripts are missing', async () => {
    const { fixtureDir } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)
    const packageJsonPath = path.join(fixtureDir, 'package.json')
    const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8')) as {
      scripts?: Record<string, string>
    }

    delete packageJson.scripts?.['generate:types']
    await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, 'utf8')

    const result = await runDoctorCommand(fixtureDir)

    expect(result.code).toBe(1)
    expect(result.stdout).toContain('[error] scripts: missing generate:types')
    expect(result.stdout).toContain('[ok] scripts: generate:importmap')
  }, 180000)
})
