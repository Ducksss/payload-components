import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import {
  loadState,
  recordInstalledState,
  recordInstallAttempt,
  recordInstallFailure,
} from '../../tools/payload-kit/state'

import type { InstallStateV1 } from '../../tools/payload-kit/types'

const legacyState: InstallStateV1 = {
  kits: {
    'hero-basic': {
      installedAt: '2026-04-16T00:00:00.000Z',
      manifestVersion: '0.1.0',
      status: 'installed',
      touchedFiles: [
        'src/blocks/HeroBasic/config.ts',
        'src/blocks/HeroBasic/Component.tsx',
        'src/blocks/RenderBlocks.tsx',
        'src/collections/Pages/index.ts',
      ],
    },
  },
  version: 1,
}

const manifestRef = {
  name: 'hero-basic',
  registryItemName: 'hero-basic',
  version: '0.1.0',
}

describe('payload-kit state', () => {
  const tempDirs: string[] = []

  afterEach(async () => {
    await Promise.all(tempDirs.map((tempDir) => rm(tempDir, { force: true, recursive: true })))
  })

  it('migrates v1 state into the alpha v2 shape', async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'payload-kit-state-'))
    tempDirs.push(tempDir)

    await mkdir(path.join(tempDir, '.payload-kit'), { recursive: true })
    await writeFile(path.join(tempDir, '.payload-kit', 'state.json'), `${JSON.stringify(legacyState, null, 2)}\n`, 'utf8')

    const migratedState = await loadState(tempDir)

    expect(migratedState.version).toBe(2)
    expect(migratedState.kits['hero-basic']).toMatchObject({
      installedFiles: ['src/blocks/HeroBasic/Component.tsx', 'src/blocks/HeroBasic/config.ts'],
      patchedFiles: ['src/blocks/RenderBlocks.tsx', 'src/collections/Pages/index.ts'],
      registryItemName: 'hero-basic',
      status: 'installed',
      targetId: 'payload-website-starter',
    })
  })

  it('records partial install attempts and stage-specific failures', async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'payload-kit-state-'))
    tempDirs.push(tempDir)

    await recordInstallAttempt({
      cwd: tempDir,
      installedFiles: ['src/blocks/HeroBasic/Component.tsx', 'src/blocks/HeroBasic/config.ts'],
      manifest: manifestRef,
      patchedFiles: ['src/blocks/RenderBlocks.tsx', 'src/collections/Pages/index.ts'],
      targetId: 'payload-website-starter',
    })

    await recordInstallFailure({
      cwd: tempDir,
      installedFiles: ['src/blocks/HeroBasic/Component.tsx', 'src/blocks/HeroBasic/config.ts'],
      manifest: manifestRef,
      message: 'generate:types failed',
      patchedFiles: ['src/blocks/RenderBlocks.tsx', 'src/collections/Pages/index.ts'],
      stage: 'post-install',
      targetId: 'payload-website-starter',
    })

    const state = await loadState(tempDir)

    expect(state.kits['hero-basic']).toMatchObject({
      lastError: {
        message: 'generate:types failed',
        stage: 'post-install',
      },
      status: 'partial',
    })
  })

  it('clears errors and marks installs as installed on success', async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'payload-kit-state-'))
    tempDirs.push(tempDir)

    await recordInstallAttempt({
      cwd: tempDir,
      installedFiles: ['src/blocks/HeroBasic/Component.tsx', 'src/blocks/HeroBasic/config.ts'],
      manifest: manifestRef,
      patchedFiles: ['src/blocks/RenderBlocks.tsx', 'src/collections/Pages/index.ts'],
      targetId: 'payload-website-starter',
    })

    await recordInstallFailure({
      cwd: tempDir,
      installedFiles: ['src/blocks/HeroBasic/Component.tsx', 'src/blocks/HeroBasic/config.ts'],
      manifest: manifestRef,
      message: 'fragment apply failed',
      patchedFiles: ['src/blocks/RenderBlocks.tsx', 'src/collections/Pages/index.ts'],
      stage: 'fragment-apply',
      targetId: 'payload-website-starter',
    })

    await recordInstalledState({
      cwd: tempDir,
      installedFiles: ['src/blocks/HeroBasic/Component.tsx', 'src/blocks/HeroBasic/config.ts'],
      manifest: manifestRef,
      patchedFiles: ['src/blocks/RenderBlocks.tsx', 'src/collections/Pages/index.ts'],
      targetId: 'payload-website-starter',
    })

    const rawState = await readFile(path.join(tempDir, '.payload-kit', 'state.json'), 'utf8')
    const state = JSON.parse(rawState) as {
      kits: Record<
        string,
        {
          installedAt: string | null
          lastError: null | { message: string; stage: string }
          status: string
        }
      >
    }

    expect(state.kits['hero-basic'].status).toBe('installed')
    expect(state.kits['hero-basic'].lastError).toBeNull()
    expect(state.kits['hero-basic'].installedAt).toBeTruthy()
  })
})
