import { access, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { applyPayloadFragments } from '../../tools/payload-components/project'
import { loadState, recordInstalledState, saveState } from '../../tools/payload-components/state'

import { createInstallFixtureForComponents } from './payload-components-fixture'

/* `update` deletes files so the registry install rewrites them, then delegates
 * to `add`. The delegation is stubbed here: what matters is which components it
 * decides to re-install, and that a locally edited file blocks the component
 * until --force. A real re-install is covered by the add-command specs. */

const fixtureDirs: string[] = []

afterEach(async () => {
  await Promise.all(fixtureDirs.splice(0).map((dir) => rm(dir, { force: true, recursive: true })))
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

/* A breaking bump does not exist in the shipped catalog yet, so this drives the
   refusal path off a stubbed inventory rather than rewriting a real manifest on
   disk — a crashed test must never leave the repo's manifests edited. */
const setupBreaking = async () => {
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
    loadManifest: vi.fn().mockResolvedValue({ files: [], version: '0.2.0' }),
  }))
  vi.doMock('../../tools/payload-components/component-files', () => ({
    compareInstalledFiles: vi
      .fn()
      .mockResolvedValue({ comparisons: [], missing: [], modified: [] }),
  }))
  vi.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
    output.push(String(chunk))
    return true
  })

  const { updateCommand } = await import('../../tools/payload-components/commands/update')

  return { addCommand, output, updateCommand }
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
    const { addCommand, output, updateCommand } = await setupBreaking()

    await updateCommand({ cwd: '/tmp/project' })

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
    const { addCommand, updateCommand } = await setupBreaking()

    await updateCommand({ acceptBreaking: true, cwd: '/tmp/project' })

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
