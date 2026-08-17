import { access, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { afterEach, describe, expect, it, vi } from 'vitest'

import type { ComponentManifest } from '../../tools/payload-components/types'

import { compareInstalledFiles } from '../../tools/payload-components/component-files'
import { diffCommand } from '../../tools/payload-components/commands/diff'
import { listCommand } from '../../tools/payload-components/commands/list'
import { removeCommand } from '../../tools/payload-components/commands/remove'
import { applyPayloadFragments } from '../../tools/payload-components/project'
import { loadState, recordInstalledState, saveState } from '../../tools/payload-components/state'

import { createInstallFixtureForComponents } from './payload-components-fixture'

/* These cover the lifecycle commands against the real project fixture with real
 * source files, so file-content drift, shared-file ownership, and state
 * bookkeeping are exercised end to end. Post-install scripts are stubbed in the
 * fixture's package.json (they only write placeholder files), so `remove` runs
 * its full pipeline without a Payload runtime. */

const fixtureDirs: string[] = []

afterEach(async () => {
  await Promise.all(fixtureDirs.splice(0).map((dir) => rm(dir, { force: true, recursive: true })))
  vi.restoreAllMocks()
})

const captureStdout = () => {
  const chunks: string[] = []

  vi.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
    chunks.push(String(chunk))
    return true
  })

  return () => chunks.join('')
}

/* Build a fixture where the given components are fully installed: source files
 * copied, wiring applied, install state recorded. */
const installFixture = async (componentNames: string[]) => {
  const { fixtureDir, manifests } = await createInstallFixtureForComponents(componentNames, {
    preseedSource: true,
  })

  fixtureDirs.push(fixtureDir)

  for (const manifest of manifests) {
    await applyPayloadFragments(fixtureDir, manifest.payloadFragments)
    await recordInstalledState({
      cwd: fixtureDir,
      manifest,
      patchedFiles: manifest.recovery.patchedFiles,
      targetId: 'payload-website-starter',
    })
  }

  return { fixtureDir, manifests }
}

const manifestByName = (manifests: ComponentManifest[], name: string) => {
  const manifest = manifests.find((candidate) => candidate.name === name)

  if (!manifest) {
    throw new Error(`Fixture is missing the "${name}" manifest.`)
  }

  return manifest
}

const exists = (filePath: string) =>
  access(filePath).then(
    () => true,
    () => false,
  )

describe('list', () => {
  it('separates recorded installs from the rest of the catalog', async () => {
    const { fixtureDir } = await installFixture(['hero-basic'])
    const read = captureStdout()

    await listCommand({ cwd: fixtureDir })

    const output = read()

    expect(output).toContain('Installed:')
    expect(output).toMatch(/hero-basic\s+0\.1\.0 up to date/)
    expect(output).toContain('Available (')
    expect(output).toContain('  faq-card')
  })

  it('emits machine-readable inventory under --json', async () => {
    const { fixtureDir } = await installFixture(['hero-basic'])
    const read = captureStdout()

    await listCommand({ cwd: fixtureDir, json: true })

    const inventory = JSON.parse(read()) as {
      entries: Array<{
        installed: null | { status: string }
        name: string
        updateAvailable: boolean
      }>
      orphaned: string[]
    }
    const heroBasic = inventory.entries.find(({ name }) => name === 'hero-basic')

    expect(inventory.orphaned).toEqual([])
    expect(heroBasic?.installed?.status).toBe('installed')
    expect(heroBasic?.updateAvailable).toBe(false)
    expect(inventory.entries.filter(({ installed }) => installed !== null)).toHaveLength(1)
  })
})

describe('diff', () => {
  it('reports a clean tree for an untouched install', async () => {
    const { fixtureDir } = await installFixture(['hero-basic'])
    const read = captureStdout()

    await expect(diffCommand({ cwd: fixtureDir })).resolves.toBe(true)
    expect(read()).toContain('hero-basic: clean (0.1.0)')
  })

  it('flags a locally edited file and a deleted file', async () => {
    const { fixtureDir, manifests } = await installFixture(['hero-basic'])
    const manifest = manifestByName(manifests, 'hero-basic')
    const configPath = path.join(fixtureDir, 'src/blocks/HeroBasic/config.ts')

    await writeFile(configPath, `${await readFile(configPath, 'utf8')}\n// local tweak\n`, 'utf8')
    await rm(path.join(fixtureDir, 'src/blocks/HeroBasic/Component.tsx'))

    const read = captureStdout()

    await expect(diffCommand({ cwd: fixtureDir })).resolves.toBe(false)

    const output = read()

    expect(output).toContain('modified  src/blocks/HeroBasic/config.ts')
    expect(output).toContain('missing   src/blocks/HeroBasic/Component.tsx')
    expect(manifest.files).toContain('src/blocks/HeroBasic/config.ts')
  })

  it('ignores line-ending and trailing-whitespace differences', async () => {
    const { fixtureDir } = await installFixture(['hero-basic'])
    const configPath = path.join(fixtureDir, 'src/blocks/HeroBasic/config.ts')
    const source = await readFile(configPath, 'utf8')

    await writeFile(configPath, `${source.replaceAll('\n', '\r\n')}\n\n`, 'utf8')

    const report = await compareInstalledFiles({
      cwd: fixtureDir,
      manifest: { files: ['src/blocks/HeroBasic/config.ts'], registryItemName: 'hero-basic' },
    })

    expect(report.modified).toEqual([])
  })

  it('rejects a component that was never recorded', async () => {
    const { fixtureDir } = await installFixture(['hero-basic'])

    await expect(diffCommand({ componentNames: ['faq-card'], cwd: fixtureDir })).rejects.toThrow(
      'not recorded as installed',
    )
  })
})

describe('remove', () => {
  it('previews without touching the project under --dry-run', async () => {
    const { fixtureDir } = await installFixture(['hero-basic'])
    const configPath = path.join(fixtureDir, 'src/blocks/HeroBasic/config.ts')
    const read = captureStdout()

    await removeCommand({ componentName: 'hero-basic', cwd: fixtureDir, dryRun: true })

    const output = read()

    expect(output).toContain('dry run for removing "hero-basic"')
    expect(output).toContain('src/blocks/HeroBasic/config.ts (would delete)')
    expect(output).toContain('No files were changed and no commands ran.')
    expect(await exists(configPath)).toBe(true)
    expect((await loadState(fixtureDir)).components['hero-basic']).toBeDefined()
  })

  it('deletes owned files, unwires the block, and drops the state record', async () => {
    const { fixtureDir } = await installFixture(['hero-basic'])
    const read = captureStdout()

    await removeCommand({ componentName: 'hero-basic', cwd: fixtureDir })

    expect(read()).toContain('removed "hero-basic"')
    expect(await exists(path.join(fixtureDir, 'src/blocks/HeroBasic/config.ts'))).toBe(false)
    expect(await exists(path.join(fixtureDir, 'src/blocks/HeroBasic'))).toBe(false)
    expect(await exists(path.join(fixtureDir, 'src/blocks/shared/heroFields.ts'))).toBe(false)

    const renderBlocks = await readFile(
      path.join(fixtureDir, 'src/blocks/RenderBlocks.tsx'),
      'utf8',
    )
    const pagesLayout = await readFile(
      path.join(fixtureDir, 'src/collections/Pages/index.ts'),
      'utf8',
    )

    expect(renderBlocks).not.toContain('HeroBasicBlock')
    expect(pagesLayout).not.toContain('HeroBasic')
    expect((await loadState(fixtureDir)).components['hero-basic']).toBeUndefined()
  })

  it('keeps a shared family file that another installed variant still needs', async () => {
    const { fixtureDir } = await installFixture(['hero-basic', 'hero-video'])
    const read = captureStdout()

    await removeCommand({ componentName: 'hero-basic', cwd: fixtureDir })

    expect(read()).toContain('src/blocks/shared/heroFields.ts (keep — still used by hero-video)')
    expect(await exists(path.join(fixtureDir, 'src/blocks/shared/heroFields.ts'))).toBe(true)
    expect(await exists(path.join(fixtureDir, 'src/blocks/HeroVideo/config.ts'))).toBe(true)
    expect(await exists(path.join(fixtureDir, 'src/blocks/HeroBasic/config.ts'))).toBe(false)

    const pagesLayout = await readFile(
      path.join(fixtureDir, 'src/collections/Pages/index.ts'),
      'utf8',
    )

    expect(pagesLayout).toContain('HeroVideo')
    expect(pagesLayout).not.toContain('HeroBasic,')
    expect((await loadState(fixtureDir)).components['hero-video']).toBeDefined()
  })

  it('refuses to delete a locally edited owned file unless --force is explicit', async () => {
    const { fixtureDir } = await installFixture(['hero-basic'])
    const configPath = path.join(fixtureDir, 'src/blocks/HeroBasic/config.ts')

    await writeFile(configPath, `${await readFile(configPath, 'utf8')}\n// local tweak\n`, 'utf8')

    await expect(removeCommand({ componentName: 'hero-basic', cwd: fixtureDir })).rejects.toThrow(
      'changed after installation',
    )
    expect(await exists(configPath)).toBe(true)
    expect((await loadState(fixtureDir)).components['hero-basic']).toBeDefined()

    const read = captureStdout()
    await removeCommand({ componentName: 'hero-basic', cwd: fixtureDir, force: true })

    expect(read()).toContain('local edits discarded by --force')
    expect(await exists(configPath)).toBe(false)
  })

  it('refuses unrecorded leftovers, while --force removes them deliberately', async () => {
    const { fixtureDir } = await createInstallFixtureForComponents(['hero-basic'], {
      preseedSource: true,
    })
    const configPath = path.join(fixtureDir, 'src/blocks/HeroBasic/config.ts')

    fixtureDirs.push(fixtureDir)

    await expect(removeCommand({ componentName: 'hero-basic', cwd: fixtureDir })).rejects.toThrow(
      'source with unknown ownership',
    )
    expect(await exists(configPath)).toBe(true)

    await removeCommand({ componentName: 'hero-basic', cwd: fixtureDir, force: true })

    expect(await exists(configPath)).toBe(false)
  })

  it('keeps a shared file owned by an orphaned recorded component', async () => {
    const { fixtureDir } = await installFixture(['hero-basic'])
    const state = await loadState(fixtureDir)
    const heroEntry = state.components['hero-basic']
    const sharedPath = 'src/blocks/shared/heroFields.ts'

    state.components['retired-hero'] = {
      ...heroEntry,
      fileHashes: { [sharedPath]: heroEntry.fileHashes[sharedPath] },
      registryItemName: 'retired-hero',
    }
    await saveState(fixtureDir, state)

    const read = captureStdout()
    await removeCommand({ componentName: 'hero-basic', cwd: fixtureDir })

    expect(read()).toContain(`${sharedPath} (keep — still used by retired-hero)`)
    expect(await exists(path.join(fixtureDir, sharedPath))).toBe(true)
  })

  it('fails closed when a retained orphan has no manifest or source baseline', async () => {
    const { fixtureDir } = await installFixture(['hero-basic'])
    const state = await loadState(fixtureDir)

    state.components['retired-unknown'] = {
      ...state.components['hero-basic'],
      fileHashes: {},
      manifestVersion: '9.9.9',
      registryItemName: 'retired-unknown',
    }
    await saveState(fixtureDir, state)

    await expect(removeCommand({ componentName: 'hero-basic', cwd: fixtureDir })).rejects.toThrow(
      'Cannot verify shared-file ownership',
    )
    expect(await exists(path.join(fixtureDir, 'src/blocks/HeroBasic/config.ts'))).toBe(true)
  })

  it('is idempotent — a second remove is a no-op that still succeeds', async () => {
    const { fixtureDir } = await installFixture(['hero-basic'])

    captureStdout()
    await removeCommand({ componentName: 'hero-basic', cwd: fixtureDir })
    await expect(
      removeCommand({ componentName: 'hero-basic', cwd: fixtureDir }),
    ).resolves.toBeUndefined()
    expect((await loadState(fixtureDir)).components['hero-basic']).toBeUndefined()
  })

  it('skips the generators when a repeat removal changes nothing', async () => {
    const { fixtureDir } = await installFixture(['hero-basic'])

    captureStdout()
    await removeCommand({ componentName: 'hero-basic', cwd: fixtureDir })

    const read = captureStdout()

    await removeCommand({ componentName: 'hero-basic', cwd: fixtureDir })

    const output = read()

    expect(output).toContain('nothing to remove for "hero-basic"')
    expect(output).not.toContain('running generate:types')
  })
})
