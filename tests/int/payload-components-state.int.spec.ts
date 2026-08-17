import { mkdtemp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { hashSource } from '../../tools/payload-components/component-files'
import {
  loadState,
  recordInstalledState,
  recordInstallAttempt,
  recordInstallFailure,
} from '../../tools/payload-components/state'

import type { InstallStateV1, InstallStateV2 } from '../../tools/payload-components/types'

const legacyState: InstallStateV1 = {
  components: {
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
  files: [],
  name: 'hero-basic',
  registryItemName: 'hero-basic',
  version: '0.1.0',
}

const legacyV2State: InstallStateV2 = {
  components: {
    'hero-basic': {
      installedAt: '2026-04-16T00:00:00.000Z',
      lastAttemptAt: '2026-04-16T00:00:00.000Z',
      lastError: null,
      manifestVersion: '0.1.0',
      patchedFiles: ['src/blocks/RenderBlocks.tsx', 'src/collections/Pages/index.ts'],
      registryItemName: 'hero-basic',
      status: 'installed',
      targetId: 'payload-website-starter',
    },
  },
  version: 2,
}

describe('payload-components state', () => {
  const tempDirs: string[] = []

  afterEach(async () => {
    await Promise.all(tempDirs.map((tempDir) => rm(tempDir, { force: true, recursive: true })))
  })

  it('migrates v1 state into the v3 shape', async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-state-'))
    tempDirs.push(tempDir)

    await mkdir(path.join(tempDir, '.payload-components'), { recursive: true })
    await writeFile(
      path.join(tempDir, '.payload-components', 'state.json'),
      `${JSON.stringify(legacyState, null, 2)}\n`,
      'utf8',
    )

    const migratedState = await loadState(tempDir)

    expect(migratedState.version).toBe(3)
    expect(migratedState.components['hero-basic']).toMatchObject({
      fileHashes: {},
      patchedFiles: ['src/blocks/RenderBlocks.tsx', 'src/collections/Pages/index.ts'],
      registryItemName: 'hero-basic',
      status: 'installed',
      targetId: 'payload-website-starter',
    })
  })

  it('migrates v2 state with an explicitly unknown source baseline', async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-state-'))
    tempDirs.push(tempDir)

    await mkdir(path.join(tempDir, '.payload-components'), { recursive: true })
    await writeFile(
      path.join(tempDir, '.payload-components', 'state.json'),
      `${JSON.stringify(legacyV2State, null, 2)}\n`,
      'utf8',
    )

    const migratedState = await loadState(tempDir)

    expect(migratedState).toMatchObject({
      components: {
        'hero-basic': {
          fileHashes: {},
          manifestVersion: '0.1.0',
          status: 'installed',
        },
      },
      version: 3,
    })
  })

  it('records partial install attempts and stage-specific failures', async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-state-'))
    tempDirs.push(tempDir)

    await recordInstallAttempt({
      cwd: tempDir,
      manifest: manifestRef,
      patchedFiles: ['src/blocks/RenderBlocks.tsx', 'src/collections/Pages/index.ts'],
      targetId: 'payload-website-starter',
    })

    await recordInstallFailure({
      cwd: tempDir,
      manifest: manifestRef,
      message: 'generate:types failed',
      patchedFiles: ['src/blocks/RenderBlocks.tsx', 'src/collections/Pages/index.ts'],
      stage: 'post-install',
      targetId: 'payload-website-starter',
    })

    const state = await loadState(tempDir)

    expect(state.components['hero-basic']).toMatchObject({
      lastError: {
        message: 'generate:types failed',
        stage: 'post-install',
      },
      status: 'partial',
    })
  })

  it('clears errors and marks installs as installed on success', async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-state-'))
    tempDirs.push(tempDir)

    await recordInstallAttempt({
      cwd: tempDir,
      manifest: manifestRef,
      patchedFiles: ['src/blocks/RenderBlocks.tsx', 'src/collections/Pages/index.ts'],
      targetId: 'payload-website-starter',
    })

    await recordInstallFailure({
      cwd: tempDir,
      manifest: manifestRef,
      message: 'fragment apply failed',
      patchedFiles: ['src/blocks/RenderBlocks.tsx', 'src/collections/Pages/index.ts'],
      stage: 'fragment-apply',
      targetId: 'payload-website-starter',
    })

    await recordInstalledState({
      cwd: tempDir,
      manifest: manifestRef,
      patchedFiles: ['src/blocks/RenderBlocks.tsx', 'src/collections/Pages/index.ts'],
      targetId: 'payload-website-starter',
    })

    const rawState = await readFile(path.join(tempDir, '.payload-components', 'state.json'), 'utf8')
    const state = JSON.parse(rawState) as {
      components: Record<
        string,
        {
          installedAt: string | null
          lastError: null | { message: string; stage: string }
          status: string
        }
      >
    }

    expect(state.components['hero-basic'].status).toBe('installed')
    expect(state.components['hero-basic'].lastError).toBeNull()
    expect(state.components['hero-basic'].installedAt).toBeTruthy()
  })

  it('falls back to a clean state when state.json is corrupt', async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-state-'))
    tempDirs.push(tempDir)

    await mkdir(path.join(tempDir, '.payload-components'), { recursive: true })
    await writeFile(
      path.join(tempDir, '.payload-components', 'state.json'),
      '{ "components": { half-written',
      'utf8',
    )

    const state = await loadState(tempDir)

    expect(state).toEqual({ components: {}, version: 3 })
  })

  it('records normalized hashes for the files that actually landed on disk', async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-state-'))
    tempDirs.push(tempDir)
    const projectPath = 'src/blocks/HeroBasic/config.ts'
    const source = "export const value = 'installed'\r\n\r\n"

    await mkdir(path.dirname(path.join(tempDir, projectPath)), { recursive: true })
    await writeFile(path.join(tempDir, projectPath), source, 'utf8')

    await recordInstalledState({
      cwd: tempDir,
      manifest: { ...manifestRef, files: [projectPath] },
      patchedFiles: ['src/blocks/RenderBlocks.tsx'],
      targetId: 'payload-website-starter',
    })

    expect((await loadState(tempDir)).components['hero-basic'].fileHashes).toEqual({
      [projectPath]: hashSource(source),
    })
  })

  it("does not adopt an existing owner's local edit as a clean shared-file baseline", async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-state-'))
    tempDirs.push(tempDir)
    const projectPath = 'src/blocks/shared/heroFields.ts'
    const installedSource = "export const heroFields = ['heading']\n"
    const editedSource = `${installedSource}// consumer edit\n`
    const sharedManifest = (name: string) => ({
      files: [projectPath],
      name,
      registryItemName: name,
      version: '0.1.0',
    })

    await mkdir(path.dirname(path.join(tempDir, projectPath)), { recursive: true })
    await writeFile(path.join(tempDir, projectPath), installedSource, 'utf8')
    await recordInstalledState({
      cwd: tempDir,
      manifest: sharedManifest('hero-basic'),
      patchedFiles: [],
      rewrittenFiles: [projectPath],
      targetId: 'payload-website-starter',
    })
    await writeFile(path.join(tempDir, projectPath), editedSource, 'utf8')
    await recordInstalledState({
      cwd: tempDir,
      manifest: sharedManifest('hero-video'),
      patchedFiles: [],
      rewrittenFiles: [],
      targetId: 'payload-website-starter',
    })

    const state = await loadState(tempDir)

    expect(state.components['hero-video'].fileHashes[projectPath]).toBe(hashSource(installedSource))
    expect(state.components['hero-video'].fileHashes[projectPath]).not.toBe(
      hashSource(editedSource),
    )
  })

  it('updates every recorded owner baseline after rewriting a shared file', async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-state-'))
    tempDirs.push(tempDir)
    const projectPath = 'src/blocks/shared/heroFields.ts'
    const oldSource = "export const heroFields = ['heading']\n"
    const newSource = "export const heroFields = ['heading', 'eyebrow']\n"
    const sharedManifest = (name: string) => ({
      files: [projectPath],
      name,
      registryItemName: name,
      version: '0.2.0',
    })

    await mkdir(path.dirname(path.join(tempDir, projectPath)), { recursive: true })
    await writeFile(path.join(tempDir, projectPath), oldSource, 'utf8')
    await recordInstalledState({
      cwd: tempDir,
      manifest: sharedManifest('hero-basic'),
      patchedFiles: [],
      rewrittenFiles: [projectPath],
      targetId: 'payload-website-starter',
    })
    await recordInstalledState({
      cwd: tempDir,
      manifest: sharedManifest('hero-video'),
      patchedFiles: [],
      rewrittenFiles: [],
      targetId: 'payload-website-starter',
    })
    await writeFile(path.join(tempDir, projectPath), newSource, 'utf8')
    await recordInstalledState({
      cwd: tempDir,
      manifest: sharedManifest('hero-video'),
      patchedFiles: [],
      rewrittenFiles: [projectPath],
      targetId: 'payload-website-starter',
    })

    const state = await loadState(tempDir)

    expect(state.components['hero-basic'].fileHashes[projectPath]).toBe(hashSource(newSource))
    expect(state.components['hero-video'].fileHashes[projectPath]).toBe(hashSource(newSource))
  })

  it('serializes concurrent state mutations without dropping component entries', async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-state-'))
    tempDirs.push(tempDir)
    const componentNames = Array.from({ length: 24 }, (_, index) => `component-${index}`)

    await Promise.all(
      componentNames.map((name) =>
        recordInstalledState({
          cwd: tempDir,
          manifest: { files: [], name, registryItemName: name, version: '0.1.0' },
          patchedFiles: [],
          targetId: 'payload-website-starter',
        }),
      ),
    )

    expect(Object.keys((await loadState(tempDir)).components).sort()).toEqual(componentNames.sort())
  })

  it('writes state atomically, leaving no temp files behind', async () => {
    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-state-'))
    tempDirs.push(tempDir)

    await recordInstalledState({
      cwd: tempDir,
      manifest: manifestRef,
      patchedFiles: ['src/blocks/RenderBlocks.tsx'],
      targetId: 'payload-website-starter',
    })

    const entries = await readdir(path.join(tempDir, '.payload-components'))

    expect(entries).toEqual(['state.json'])
  })
})
