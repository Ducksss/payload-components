import { access, chmod, mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { hashSource } from '../../tools/payload-components/component-files'
import { applyPayloadFragments } from '../../tools/payload-components/project'
import { loadState, recordInstalledState, saveState } from '../../tools/payload-components/state'

import type { InstallStateV2 } from '../../tools/payload-components/types'

import { createInstallFixtureForComponents } from './payload-components-fixture'

/* `update` deletes files so the registry install rewrites them, then delegates
 * to `add`. The delegation is stubbed here: what matters is which components it
 * decides to re-install, and that a locally edited file blocks the component
 * until --force. A real re-install is covered by the add-command specs. */

const fixtureDirs: string[] = []

afterEach(async () => {
  await Promise.all(fixtureDirs.splice(0).map((dir) => rm(dir, { force: true, recursive: true })))
  vi.doUnmock('../../tools/payload-components/inventory')
  vi.doUnmock('../../tools/payload-components/manifest')
  vi.resetModules()
  vi.restoreAllMocks()
  process.exitCode = undefined
})

const setup = async () => {
  const addCommand = vi.fn().mockResolvedValue(undefined)
  const output: string[] = []

  vi.doMock('../../tools/payload-components/commands/add', () => ({ addCommand }))
  vi.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
    output.push(String(chunk))
    return true
  })

  const { updateCommand } = await import('../../tools/payload-components/commands/update')

  return { addCommand, output, updateCommand }
}

/* Install the components, then rewrite their recorded manifestVersion so the
 * catalog looks newer than what the project has — the exact state `update`
 * exists to resolve. */
const installFixture = async ({
  componentNames,
  recordedVersion,
}: {
  componentNames: string[]
  recordedVersion?: string
}) => {
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

  if (recordedVersion) {
    const state = await loadState(fixtureDir)

    for (const componentName of Object.keys(state.components)) {
      state.components[componentName].manifestVersion = recordedVersion
    }

    await saveState(fixtureDir, state)
  }

  return { fixtureDir, manifests }
}

/* Reproduce the actual state left by CLI v1.3: stats-proof 0.2.0 source on
   disk and v2 install state with no hashes. This is the transition that used
   to compare old installed source with 0.3.0 and falsely call it a local edit. */
const installLegacyStatsProofV2 = async () => {
  const { fixtureDir, manifests } = await createInstallFixtureForComponents(['stats-proof'], {
    preseedSource: true,
  })
  const [manifest] = manifests

  if (!manifest) {
    throw new Error('stats-proof fixture did not return a manifest.')
  }

  fixtureDirs.push(fixtureDir)
  await applyPayloadFragments(fixtureDir, manifest.payloadFragments)

  const legacySourceDir = path.join(process.cwd(), 'tests/int/fixtures/stats-proof-0.2.0')

  await Promise.all([
    writeFile(
      path.join(fixtureDir, 'src/blocks/StatsProof/config.ts'),
      await readFile(path.join(legacySourceDir, 'config.ts.txt'), 'utf8'),
      'utf8',
    ),
    writeFile(
      path.join(fixtureDir, 'src/blocks/StatsProof/Component.tsx'),
      await readFile(path.join(legacySourceDir, 'Component.tsx.txt'), 'utf8'),
      'utf8',
    ),
    rm(path.join(fixtureDir, 'src/blocks/shared/statsFields.ts'), { force: true }),
  ])

  const state: InstallStateV2 = {
    components: {
      'stats-proof': {
        installedAt: '2026-07-01T00:00:00.000Z',
        lastAttemptAt: '2026-07-01T00:00:00.000Z',
        lastError: null,
        manifestVersion: '0.2.0',
        patchedFiles: manifest.recovery.patchedFiles,
        registryItemName: manifest.registryItemName,
        status: 'installed',
        targetId: 'payload-website-starter',
      },
    },
    version: 2,
  }

  await mkdir(path.join(fixtureDir, '.payload-components'), { recursive: true })
  await writeFile(
    path.join(fixtureDir, '.payload-components/state.json'),
    `${JSON.stringify(state, null, 2)}\n`,
    'utf8',
  )

  return fixtureDir
}

/* A breaking bump does not exist in the shipped catalog yet, so this drives the
   refusal path off a stubbed inventory rather than rewriting a real manifest on
   disk — a crashed test must never leave the repo's manifests edited. */
const setupBreaking = async () => {
  const { fixtureDir, manifests } = await installFixture({
    componentNames: ['hero-basic'],
    recordedVersion: '0.1.0',
  })
  const addCommand = vi.fn().mockResolvedValue(undefined)
  const output: string[] = []
  const breakingEntry = {
    breaking: true,
    dataMigration: 'Rename the stored `heading` field to `title`.',
    summary: 'Renamed the headline field.',
    version: '0.2.0',
  }

  vi.doMock('../../tools/payload-components/commands/add', () => ({ addCommand }))
  vi.doMock('../../tools/payload-components/inventory', () => ({
    buildInventory: vi.fn().mockResolvedValue({
      entries: [
        {
          breakingUpdate: true,
          installed: {
            installedAt: null,
            lastError: null,
            localized: false,
            manifestVersion: '0.1.0',
            status: 'installed',
            targetId: 'payload-website-starter',
          },
          name: 'hero-basic',
          pendingChangelog: [breakingEntry],
          summary: 'Hero',
          title: 'Hero Basic',
          updateAvailable: true,
          version: '0.2.0',
        },
      ],
      orphaned: [],
    }),
    selectInstalled: (inventory: { entries: unknown[] }) => inventory.entries,
  }))
  vi.doMock('../../tools/payload-components/manifest', () => ({
    loadManifest: vi.fn().mockResolvedValue({ ...manifests[0], version: '0.2.0' }),
  }))
  vi.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
    output.push(String(chunk))
    return true
  })

  const { updateCommand } = await import('../../tools/payload-components/commands/update')

  return { addCommand, output, updateCommand, fixtureDir }
}

const exists = (filePath: string) =>
  access(filePath).then(
    () => true,
    () => false,
  )

describe('update', () => {
  it('does nothing when every recorded component is already current', async () => {
    const { addCommand, output, updateCommand } = await setup()
    const { fixtureDir } = await installFixture({ componentNames: ['hero-basic'] })

    await updateCommand({ cwd: fixtureDir })

    expect(addCommand).not.toHaveBeenCalled()
    expect(output.join('')).toContain('already at the version this CLI ships')
  })

  it('re-installs only the components whose recorded version is behind', async () => {
    const { addCommand, output, updateCommand } = await setup()
    const { fixtureDir } = await installFixture({ componentNames: ['hero-basic', 'faq-card'] })
    const state = await loadState(fixtureDir)

    state.components['hero-basic'].manifestVersion = '0.0.9'
    await saveState(fixtureDir, state)

    await updateCommand({ cwd: fixtureDir })

    expect(addCommand).toHaveBeenCalledOnce()
    expect(addCommand).toHaveBeenCalledWith({
      allowVersionChange: true,
      componentName: 'hero-basic',
      cwd: fixtureDir,
      localized: false,
    })
    expect(output.join('')).toContain('hero-basic: 0.0.9 → 0.1.0')
    expect(await exists(path.join(fixtureDir, 'src/blocks/FaqCard/config.ts'))).toBe(true)
  })

  it('deletes the component files so the registry install rewrites them', async () => {
    const { addCommand, updateCommand } = await setup()
    const { fixtureDir } = await installFixture({
      componentNames: ['hero-basic'],
      recordedVersion: '0.0.9',
    })

    await updateCommand({ cwd: fixtureDir })

    expect(addCommand).toHaveBeenCalledOnce()
    expect(await exists(path.join(fixtureDir, 'src/blocks/HeroBasic/config.ts'))).toBe(false)
    expect(await exists(path.join(fixtureDir, 'src/blocks/shared/heroFields.ts'))).toBe(false)
  })

  it('updates a pristine stats-proof 0.2.0 install using its historical baseline', async () => {
    const { addCommand, output, updateCommand } = await setup()
    const fixtureDir = await installLegacyStatsProofV2()

    await updateCommand({ cwd: fixtureDir })

    expect(addCommand).toHaveBeenCalledOnce()
    expect(addCommand).toHaveBeenCalledWith({
      allowVersionChange: true,
      componentName: 'stats-proof',
      cwd: fixtureDir,
      localized: false,
    })
    expect(output.join('')).toContain('stats-proof: 0.2.0 → 0.3.0')
    expect(output.join('')).not.toContain('skipped')
    expect(await exists(path.join(fixtureDir, 'src/blocks/StatsProof/config.ts'))).toBe(false)
    expect(await exists(path.join(fixtureDir, 'src/blocks/StatsProof/Component.tsx'))).toBe(false)
  })

  it('still protects a real local edit on top of stats-proof 0.2.0', async () => {
    const { addCommand, output, updateCommand } = await setup()
    const fixtureDir = await installLegacyStatsProofV2()
    const configPath = path.join(fixtureDir, 'src/blocks/StatsProof/config.ts')

    await writeFile(configPath, `${await readFile(configPath, 'utf8')}\n// local tweak\n`, 'utf8')
    await updateCommand({ cwd: fixtureDir })

    expect(addCommand).not.toHaveBeenCalled()
    expect(output.join('')).toContain('skipped — 1 locally modified file')
    expect(await exists(configPath)).toBe(true)
    expect(process.exitCode).toBe(1)
  })

  it('protects an edit to a shared file even when the target recorded the edited bytes', async () => {
    const { addCommand, output, updateCommand } = await setup()
    const { fixtureDir } = await installFixture({
      componentNames: ['hero-basic', 'hero-video'],
    })
    const sharedPath = 'src/blocks/shared/heroFields.ts'
    const absoluteSharedPath = path.join(fixtureDir, sharedPath)
    const editedSource = `${await readFile(absoluteSharedPath, 'utf8')}\n// consumer edit\n`
    const state = await loadState(fixtureDir)

    await writeFile(absoluteSharedPath, editedSource, 'utf8')
    state.components['hero-video'].fileHashes[sharedPath] = hashSource(editedSource)
    state.components['hero-video'].manifestVersion = '0.0.9'
    await saveState(fixtureDir, state)

    await updateCommand({ componentNames: ['hero-video'], cwd: fixtureDir })

    expect(addCommand).not.toHaveBeenCalled()
    expect(await readFile(absoluteSharedPath, 'utf8')).toBe(editedSource)
    expect(output.join('')).toContain(`${sharedPath} (modified)`)
    expect(process.exitCode).toBe(1)
  })

  it('keeps a retired file when another recorded component still owns it', async () => {
    const { addCommand, output, updateCommand } = await setup()
    const { fixtureDir } = await installFixture({
      componentNames: ['hero-basic', 'hero-video'],
    })
    const retainedPath = 'src/blocks/HeroBasic/config.ts'
    const absoluteRetainedPath = path.join(fixtureDir, retainedPath)
    const state = await loadState(fixtureDir)

    state.components['hero-video'].fileHashes[retainedPath] =
      state.components['hero-basic'].fileHashes[retainedPath]
    state.components['hero-video'].manifestVersion = '0.0.9'
    await saveState(fixtureDir, state)

    await updateCommand({ componentNames: ['hero-video'], cwd: fixtureDir })

    expect(addCommand).toHaveBeenCalledOnce()
    expect(await exists(absoluteRetainedPath)).toBe(true)
    expect(output.join('')).toContain(`${retainedPath} (keep — still used by hero-basic)`)
  })

  it('skips a component with local edits, keeps the file, and exits non-zero', async () => {
    const { addCommand, output, updateCommand } = await setup()
    const { fixtureDir } = await installFixture({
      componentNames: ['hero-basic'],
      recordedVersion: '0.0.9',
    })
    const configPath = path.join(fixtureDir, 'src/blocks/HeroBasic/config.ts')

    await writeFile(configPath, `${await readFile(configPath, 'utf8')}\n// local tweak\n`, 'utf8')

    await updateCommand({ cwd: fixtureDir })

    expect(addCommand).not.toHaveBeenCalled()
    expect(await exists(configPath)).toBe(true)
    expect(output.join('')).toContain('skipped — 1 locally modified file')
    expect(output.join('')).toContain('Re-run with --force')
    expect(process.exitCode).toBe(1)
  })

  it('overwrites local edits under --force', async () => {
    const { addCommand, output, updateCommand } = await setup()
    const { fixtureDir } = await installFixture({
      componentNames: ['hero-basic'],
      recordedVersion: '0.0.9',
    })
    const configPath = path.join(fixtureDir, 'src/blocks/HeroBasic/config.ts')

    await writeFile(configPath, `${await readFile(configPath, 'utf8')}\n// local tweak\n`, 'utf8')

    await updateCommand({ cwd: fixtureDir, force: true })

    expect(addCommand).toHaveBeenCalledOnce()
    expect(await exists(configPath)).toBe(false)
    expect(output.join('')).toContain('local edits discarded by --force')
    expect(process.exitCode).toBeUndefined()
  })

  it('changes nothing under --dry-run', async () => {
    const { addCommand, output, updateCommand } = await setup()
    const { fixtureDir } = await installFixture({
      componentNames: ['hero-basic'],
      recordedVersion: '0.0.9',
    })
    const configPath = path.join(fixtureDir, 'src/blocks/HeroBasic/config.ts')

    await updateCommand({ cwd: fixtureDir, dryRun: true })

    expect(addCommand).not.toHaveBeenCalled()
    expect(await exists(configPath)).toBe(true)
    expect(output.join('')).toContain('(would overwrite)')
    expect(output.join('')).toContain('No files were changed and no commands ran.')
  })

  it('holds back a breaking upgrade until it is explicitly accepted', async () => {
    const { addCommand, output, updateCommand, fixtureDir } = await setupBreaking()

    await updateCommand({ cwd: fixtureDir })

    expect(addCommand).not.toHaveBeenCalled()
    expect(output.join('')).toContain('held back')
    expect(output.join('')).toContain('changes stored content')
    expect(output.join('')).toContain(
      'migrate first: Rename the stored `heading` field to `title`.',
    )
    expect(output.join('')).toContain('re-run with --accept-breaking')
    expect(process.exitCode).toBe(1)
  })

  it('applies a breaking upgrade under --accept-breaking', async () => {
    const { addCommand, updateCommand, fixtureDir } = await setupBreaking()

    await updateCommand({ acceptBreaking: true, cwd: fixtureDir })

    expect(addCommand).toHaveBeenCalledOnce()
    expect(process.exitCode).toBeUndefined()
  })

  it('rejects a component that is not recorded', async () => {
    const { updateCommand } = await setup()
    const { fixtureDir } = await installFixture({ componentNames: ['hero-basic'] })

    await expect(updateCommand({ componentNames: ['faq-card'], cwd: fixtureDir })).rejects.toThrow(
      'not recorded as installed',
    )
  })
})

describe('update recovery', () => {
  it('validates project support before removing any installed source or state', async () => {
    const { fixtureDir, manifests } = await installFixture({
      componentNames: ['hero-basic'],
      recordedVersion: '0.0.1',
    })
    const { updateCommand, addCommand } = await setup()
    const packagePath = path.join(fixtureDir, 'package.json')
    const pkg = JSON.parse(await readFile(packagePath, 'utf8'))
    pkg.dependencies.payload = '^2.0.0'
    await writeFile(packagePath, JSON.stringify(pkg))
    const files = [...manifests[0].files, '.payload-components/state.json']
    const before = await Promise.all(
      files.map((file) => readFile(path.join(fixtureDir, file), 'utf8')),
    )
    await expect(updateCommand({ cwd: fixtureDir })).rejects.toThrow()
    expect(addCommand).not.toHaveBeenCalled()
    expect(
      await Promise.all(files.map((file) => readFile(path.join(fixtureDir, file), 'utf8'))),
    ).toEqual(before)
  })

  it('restores source, host files and ownership when installation fails after writes', async () => {
    const { fixtureDir, manifests } = await installFixture({
      componentNames: ['hero-basic'],
      recordedVersion: '0.0.1',
    })
    const { updateCommand, addCommand } = await setup()
    const files = [
      ...manifests[0].files,
      ...manifests[0].recovery.patchedFiles,
      '.payload-components/state.json',
      'package.json',
    ]
    const before = await Promise.all(
      files.map((file) => readFile(path.join(fixtureDir, file), 'utf8')),
    )
    addCommand.mockImplementation(async () => {
      for (const file of files)
        await writeFile(path.join(fixtureDir, file), 'interrupted replacement')
      throw new Error('generator failed')
    })
    await expect(updateCommand({ cwd: fixtureDir })).rejects.toThrow('were restored')
    expect(
      await Promise.all(files.map((file) => readFile(path.join(fixtureDir, file), 'utf8'))),
    ).toEqual(before)
    expect(await exists(path.join(fixtureDir, '.payload-components/update-backup.json'))).toBe(
      false,
    )
  })

  it('keeps a durable backup across interruption and restores binary bytes on explicit recovery', async () => {
    const { fixtureDir } = await installFixture({ componentNames: ['hero-basic'] })
    const { createUpdateBackup, assertNoPendingUpdate, restoreUpdateBackup } =
      await import('../../tools/payload-components/update-backup')
    const filePath = path.join(fixtureDir, 'bun.lockb')
    const original = Buffer.from([0, 255, 128, 12])
    await writeFile(filePath, original, { mode: 0o600 })
    await createUpdateBackup(fixtureDir, ['bun.lockb', 'new-file.ts'])
    await writeFile(filePath, 'replacement')
    await chmod(filePath, 0o644)
    await writeFile(path.join(fixtureDir, 'new-file.ts'), 'new')
    await expect(assertNoPendingUpdate(fixtureDir)).rejects.toThrow('update --recover')
    await restoreUpdateBackup(fixtureDir)
    expect(await readFile(filePath)).toEqual(original)
    expect((await stat(filePath)).mode & 0o777).toBe(0o600)
    expect(await exists(path.join(fixtureDir, 'new-file.ts'))).toBe(false)
  })
})
