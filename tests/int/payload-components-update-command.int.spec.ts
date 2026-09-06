import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { hashSource } from '../../tools/payload-components/component-files'
import { applyPayloadFragments } from '../../tools/payload-components/project'
import { loadState, recordInstalledState, saveState } from '../../tools/payload-components/state'

import type { InstallStateV2 } from '../../tools/payload-components/types'

import { createInstallFixtureForComponents } from './payload-components-fixture'

/* `update` stages canonical source replacements, then delegates the remaining
 * dependency/wiring/state reconciliation to `add`. The delegation is stubbed
 * here: what matters is which components it re-installs, that live source never
 * disappears between stages, and that local edits still require --force. */

const fixtureDirs: string[] = []

afterEach(async () => {
  await Promise.all(fixtureDirs.splice(0).map((dir) => rm(dir, { force: true, recursive: true })))
  vi.resetModules()
  vi.restoreAllMocks()
  vi.doUnmock('../../tools/payload-components/component-files')
  vi.doUnmock('../../tools/payload-components/inventory')
  vi.doUnmock('../../tools/payload-components/manifest')
  vi.doUnmock('../../tools/payload-components/state')
  process.exitCode = undefined
})

const setup = async ({
  canonicalHashOverrides = {},
}: {
  canonicalHashOverrides?: Record<string, Record<string, string>>
} = {}) => {
  const addCommand = vi.fn().mockResolvedValue(undefined)
  const output: string[] = []

  vi.doMock('../../tools/payload-components/commands/add', () => ({ addCommand }))

  if (Object.keys(canonicalHashOverrides).length > 0) {
    vi.doMock('../../tools/payload-components/component-files', async () => {
      const actual = await vi.importActual<
        typeof import('../../tools/payload-components/component-files')
      >('../../tools/payload-components/component-files')

      return {
        ...actual,
        resolveCanonicalFileHashes: async (
          options: Parameters<typeof actual.resolveCanonicalFileHashes>[0],
        ) => ({
          ...(await actual.resolveCanonicalFileHashes(options)),
          ...canonicalHashOverrides[options.manifest.registryItemName],
        }),
      }
    })
  }

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
    resolveCanonicalFileHashes: vi.fn().mockResolvedValue({}),
    resolveRecordedFileHashes: vi.fn().mockResolvedValue({}),
    replaceCanonicalComponentFiles: vi.fn().mockResolvedValue(undefined),
  }))
  vi.doMock('../../tools/payload-components/state', () => ({
    loadState: vi.fn().mockResolvedValue({
      components: {
        'hero-basic': {
          fileHashes: {},
          installedAt: null,
          lastAttemptAt: '2026-04-16T00:00:00.000Z',
          lastError: null,
          localized: false,
          manifestVersion: '0.1.0',
          patchedFiles: [],
          registryItemName: 'hero-basic',
          status: 'installed',
          targetId: 'payload-website-starter',
        },
      },
      version: 4,
    }),
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

  it('does not rewrite a current non-localized install whose legacy state has no policy', async () => {
    const { addCommand, output, updateCommand } = await setup()
    const { fixtureDir } = await installFixture({ componentNames: ['hero-basic'] })
    const state = await loadState(fixtureDir)

    state.components['hero-basic'].localized = false
    delete state.components['hero-basic'].localizationPolicy
    await saveState(fixtureDir, state)

    await updateCommand({ cwd: fixtureDir })

    expect(addCommand).not.toHaveBeenCalled()
    expect(output.join('')).toContain('already at the version this CLI ships')
    expect(await exists(path.join(fixtureDir, 'src/blocks/HeroBasic/config.ts'))).toBe(true)
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
      prewrittenFiles: [
        'src/blocks/shared/heroFields.ts',
        'src/blocks/HeroBasic/config.ts',
        'src/blocks/HeroBasic/Component.tsx',
      ],
    })
    expect(output.join('')).toContain('hero-basic: 0.0.9 → 0.1.0')
    expect(await exists(path.join(fixtureDir, 'src/blocks/FaqCard/config.ts'))).toBe(true)
  })

  it('keeps canonical component files present while the remaining install stages run', async () => {
    const { addCommand, updateCommand } = await setup()
    const { fixtureDir } = await installFixture({
      componentNames: ['hero-basic'],
      recordedVersion: '0.0.9',
    })

    await updateCommand({ cwd: fixtureDir })

    expect(addCommand).toHaveBeenCalledOnce()
    expect(await exists(path.join(fixtureDir, 'src/blocks/HeroBasic/config.ts'))).toBe(true)
    expect(await exists(path.join(fixtureDir, 'src/blocks/shared/heroFields.ts'))).toBe(true)
  })

  it('updates a pristine stats-proof 0.2.0 install using its historical baseline', async () => {
    const { addCommand, output, updateCommand } = await setup()
    const fixtureDir = await installLegacyStatsProofV2()

    await updateCommand({ cwd: fixtureDir })

    expect(addCommand).toHaveBeenCalledOnce()
    expect(addCommand).toHaveBeenCalledWith({
      componentName: 'stats-proof',
      cwd: fixtureDir,
      localized: false,
      prewrittenFiles: [
        'src/blocks/shared/statsFields.ts',
        'src/blocks/StatsProof/config.ts',
        'src/blocks/StatsProof/Component.tsx',
      ],
    })
    expect(output.join('')).toContain('stats-proof: 0.2.0 → 0.3.0')
    expect(output.join('')).not.toContain('skipped')
    expect(await exists(path.join(fixtureDir, 'src/blocks/StatsProof/config.ts'))).toBe(true)
    expect(await exists(path.join(fixtureDir, 'src/blocks/StatsProof/Component.tsx'))).toBe(true)
  })

  it('still protects a real local edit on top of stats-proof 0.2.0', async () => {
    const { addCommand, output, updateCommand } = await setup()
    const fixtureDir = await installLegacyStatsProofV2()
    const configPath = path.join(fixtureDir, 'src/blocks/StatsProof/config.ts')

    await writeFile(configPath, `${await readFile(configPath, 'utf8')}\n// local tweak\n`, 'utf8')
    const isComplete = await updateCommand({ cwd: fixtureDir })

    expect(addCommand).not.toHaveBeenCalled()
    expect(output.join('')).toContain('skipped — 1 locally modified file')
    expect(await exists(configPath)).toBe(true)
    expect(isComplete).toBe(false)
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

    const isComplete = await updateCommand({ componentNames: ['hero-video'], cwd: fixtureDir })

    expect(addCommand).not.toHaveBeenCalled()
    expect(await readFile(absoluteSharedPath, 'utf8')).toBe(editedSource)
    expect(output.join('')).toContain('skipped — shared-file ownership conflict')
    expect(output.join('')).toContain(sharedPath)
    expect(isComplete).toBe(false)
  })

  it('rejects prospective shared bytes that a retained owner does not accept, even under --force', async () => {
    const sharedPath = 'src/blocks/shared/heroFields.ts'
    const { addCommand, output, updateCommand } = await setup({
      canonicalHashOverrides: {
        'hero-video': { [sharedPath]: hashSource('// next hero-video-only shared source\n') },
      },
    })
    const { fixtureDir } = await installFixture({
      componentNames: ['hero-basic', 'hero-video'],
    })
    const absoluteSharedPath = path.join(fixtureDir, sharedPath)
    const before = await readFile(absoluteSharedPath, 'utf8')
    const state = await loadState(fixtureDir)

    state.components['hero-video'].manifestVersion = '0.0.9'
    await saveState(fixtureDir, state)

    const isComplete = await updateCommand({
      componentNames: ['hero-video'],
      cwd: fixtureDir,
      force: true,
    })

    expect(addCommand).not.toHaveBeenCalled()
    expect(await readFile(absoluteSharedPath, 'utf8')).toBe(before)
    expect(output.join('')).toContain('skipped — shared-file ownership conflict')
    expect(output.join('')).toContain(
      `${sharedPath} (retained owners do not accept these bytes: hero-basic)`,
    )
    expect(isComplete).toBe(false)
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

    const isComplete = await updateCommand({ cwd: fixtureDir })

    expect(addCommand).not.toHaveBeenCalled()
    expect(await exists(configPath)).toBe(true)
    expect(output.join('')).toContain('skipped — 1 locally modified file')
    expect(output.join('')).toContain('Re-run with --force')
    expect(isComplete).toBe(false)
  })

  it('overwrites local edits under --force', async () => {
    const { addCommand, output, updateCommand } = await setup()
    const { fixtureDir } = await installFixture({
      componentNames: ['hero-basic'],
      recordedVersion: '0.0.9',
    })
    const configPath = path.join(fixtureDir, 'src/blocks/HeroBasic/config.ts')

    await writeFile(configPath, `${await readFile(configPath, 'utf8')}\n// local tweak\n`, 'utf8')

    const isComplete = await updateCommand({ cwd: fixtureDir, force: true })

    expect(addCommand).toHaveBeenCalledOnce()
    expect(await exists(configPath)).toBe(true)
    expect(output.join('')).toContain('local edits discarded by --force')
    expect(isComplete).toBe(true)
  })

  it('requires explicit consent before replacing legacy type-inferred localization', async () => {
    const { addCommand, output, updateCommand } = await setup()
    const { fixtureDir } = await installFixture({
      componentNames: ['hero-basic'],
    })
    const state = await loadState(fixtureDir)

    state.components['hero-basic'].localized = true
    delete state.components['hero-basic'].localizationPolicy
    await saveState(fixtureDir, state)

    await expect(updateCommand({ cwd: fixtureDir })).rejects.toThrow(
      '--accept-localization-policy-change',
    )
    expect(addCommand).not.toHaveBeenCalled()

    await updateCommand({
      acceptLocalizationPolicyChange: true,
      cwd: fixtureDir,
      force: true,
    })

    expect(addCommand).toHaveBeenCalledWith({
      acceptLocalizationPolicyChange: true,
      componentName: 'hero-basic',
      cwd: fixtureDir,
      localized: true,
      prewrittenFiles: [
        'src/blocks/shared/heroFields.ts',
        'src/blocks/HeroBasic/config.ts',
        'src/blocks/HeroBasic/Component.tsx',
      ],
    })
    expect(output.join('')).toContain('legacy type inference → semantic-v1')
    expect(output.join('')).toContain('no database migration will run')
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

    const isComplete = await updateCommand({ cwd: '/tmp/project' })

    expect(addCommand).not.toHaveBeenCalled()
    expect(output.join('')).toContain('held back')
    expect(output.join('')).toContain('changes stored content')
    expect(output.join('')).toContain(
      'migrate first: Rename the stored `heading` field to `title`.',
    )
    expect(output.join('')).toContain('re-run with --accept-breaking')
    expect(isComplete).toBe(false)
  })

  it('applies a breaking upgrade under --accept-breaking', async () => {
    const { addCommand, updateCommand } = await setupBreaking()

    const isComplete = await updateCommand({ acceptBreaking: true, cwd: '/tmp/project' })

    expect(addCommand).toHaveBeenCalledOnce()
    expect(isComplete).toBe(true)
  })

  it('rejects a component that is not recorded', async () => {
    const { updateCommand } = await setup()
    const { fixtureDir } = await installFixture({ componentNames: ['hero-basic'] })

    await expect(updateCommand({ componentNames: ['faq-card'], cwd: fixtureDir })).rejects.toThrow(
      'not recorded as installed',
    )
  })
})
