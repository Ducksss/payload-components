import { access, realpath } from 'node:fs/promises'
import path from 'node:path'

import type {
  InstallError,
  InstallState,
  InstallStateEntry,
  InstallStateV1,
  InstallStateV2,
  InstallStage,
  ComponentManifest,
} from './types'

import { CURRENT_ALPHA_TARGET_ID, SHARED_PATCHED_FILES } from './constants'
import { resolveRecordedFileHashes, snapshotInstalledFiles } from './component-files'
import { readJsonFile, repoRoot, writeJsonFile } from './utils'

// Return a fresh object every time: callers (recordInstall*) mutate the loaded
// state in place, so handing out a shared singleton would leak entries across
// loads within a single process.
const createDefaultState = (): InstallState => ({
  components: {},
  version: 3,
})

const normalizeFileList = (files: string[]) => [...new Set(files)].sort()
const normalizeFileHashes = (fileHashes: Record<string, string>) =>
  Object.fromEntries(Object.entries(fileHashes).sort(([left], [right]) => left.localeCompare(right)))

const getManifestPath = (componentName: string) =>
  path.join(repoRoot, 'payload-components', 'manifests', `${componentName}.json`)

const getEntryBase = ({
  manifest,
  targetId,
}: {
  manifest: Pick<ComponentManifest, 'name' | 'registryItemName' | 'version'>
  targetId: string
}) => ({
  manifestVersion: manifest.version,
  registryItemName: manifest.registryItemName,
  targetId,
})

const migrateLegacyEntry = async ({
  componentName,
  legacyEntry,
}: {
  componentName: string
  legacyEntry: InstallStateV1['components'][string]
}): Promise<InstallStateEntry> => {
  let registryItemName = componentName

  try {
    const manifest = await readJsonFile<ComponentManifest>(getManifestPath(componentName))
    registryItemName = manifest.registryItemName
  } catch {
    // Fall back to the legacy component name when the manifest is unavailable.
  }

  const patchedFiles = normalizeFileList(
    legacyEntry.touchedFiles.filter((filePath) => SHARED_PATCHED_FILES.includes(filePath as never)),
  )

  return {
    fileHashes: {},
    installedAt: legacyEntry.status === 'installed' ? legacyEntry.installedAt : null,
    lastAttemptAt: legacyEntry.installedAt,
    lastError: null,
    manifestVersion: legacyEntry.manifestVersion,
    patchedFiles,
    registryItemName,
    status: legacyEntry.status,
    targetId: CURRENT_ALPHA_TARGET_ID,
  }
}

const migrateLegacyState = async (state: InstallStateV1): Promise<InstallState> => {
  const migratedEntries = await Promise.all(
    Object.entries(state.components).map(async ([componentName, legacyEntry]) => {
      const migratedEntry = await migrateLegacyEntry({
        componentName,
        legacyEntry,
      })

      return [componentName, migratedEntry] as const
    }),
  )

  return {
    components: Object.fromEntries(migratedEntries),
    version: 3,
  }
}

const migrateV2State = (state: InstallStateV2): InstallState => ({
  components: Object.fromEntries(
    Object.entries(state.components).map(([componentName, entry]) => [
      componentName,
      { ...entry, fileHashes: {} },
    ]),
  ),
  version: 3,
})

const normalizeState = (state: InstallState): InstallState => ({
  version: 3,
  components: Object.fromEntries(
    Object.entries(state.components).map(([componentName, entry]) => [
      componentName,
      {
        ...entry,
        fileHashes: normalizeFileHashes(entry.fileHashes),
        lastError: entry.lastError ?? null,
        patchedFiles: normalizeFileList(entry.patchedFiles),
      },
    ]),
  ),
})

const upsertEntry = ({
  fileHashes,
  installedAt,
  lastAttemptAt,
  lastError,
  localized,
  manifest,
  patchedFiles,
  status,
  targetId,
}: {
  fileHashes: Record<string, string>
  installedAt: string | null
  lastAttemptAt: string
  lastError: InstallError | null
  localized?: boolean
  manifest: Pick<ComponentManifest, 'name' | 'registryItemName' | 'version'>
  patchedFiles: string[]
  status: InstallStateEntry['status']
  targetId: string
}): InstallStateEntry => ({
  ...getEntryBase({
    manifest,
    targetId,
  }),
  fileHashes: normalizeFileHashes(fileHashes),
  installedAt,
  lastAttemptAt,
  lastError,
  ...(localized ? { localized: true } : {}),
  patchedFiles: normalizeFileList(patchedFiles),
  status,
})

export const getStatePath = (cwd: string) => path.join(cwd, '.payload-components', 'state.json')

export const loadState = async (cwd: string): Promise<InstallState> => {
  const statePath = getStatePath(cwd)

  try {
    await access(statePath)
  } catch {
    return createDefaultState()
  }

  let rawState: InstallState | InstallStateV1 | InstallStateV2

  try {
    rawState = await readJsonFile<InstallState | InstallStateV1 | InstallStateV2>(statePath)
  } catch (error) {
    // A corrupt / half-written state file shouldn't wedge the CLI. Fall back to a
    // clean slate — the per-stage dedup and verify logic keep a re-run idempotent.
    process.stderr.write(
      `payload-components: ignoring unreadable install state at ${statePath} (${
        error instanceof Error ? error.message : String(error)
      }); starting from a clean state.\n`,
    )

    return createDefaultState()
  }

  if (rawState.version === 1) {
    return await migrateLegacyState(rawState)
  }

  if (rawState.version === 2) {
    return normalizeState(migrateV2State(rawState))
  }

  if (rawState.version === 3) {
    return normalizeState(rawState)
  }

  throw new Error(`Unsupported payload-components state version "${String((rawState as { version?: unknown }).version)}".`)
}

const saveStateUnlocked = async (cwd: string, state: InstallState) => {
  await writeJsonFile(getStatePath(cwd), normalizeState(state))
}

/* State writes are read-modify-write operations. Atomic rename protects a
 * single JSON write from truncation, but it does not stop two concurrent
 * callers from both reading the same state and then dropping each other's
 * entry. Queue mutations per project inside this process; the CLI-level project
 * lock handles separate processes and protects host-file patches as well. */
const stateMutationQueues = new Map<string, Promise<void>>()

const mutateState = async <T>(cwd: string, mutation: (state: InstallState) => Promise<T> | T) => {
  const key = await realpath(cwd).catch(() => path.resolve(cwd))
  const previous = stateMutationQueues.get(key) ?? Promise.resolve()
  let release = () => {}
  const turn = new Promise<void>((resolve) => {
    release = resolve
  })
  const tail = previous.then(() => turn)

  stateMutationQueues.set(key, tail)
  await previous

  try {
    const state = await loadState(cwd)
    const result = await mutation(state)

    await saveStateUnlocked(cwd, state)
    return result
  } finally {
    release()

    if (stateMutationQueues.get(key) === tail) {
      stateMutationQueues.delete(key)
    }
  }
}

export const saveState = async (cwd: string, state: InstallState) => {
  await mutateState(cwd, (latest) => {
    latest.components = state.components
  })
}

export const recordInstallAttempt = async ({
  cwd,
  localized,
  manifest,
  patchedFiles,
  targetId,
}: {
  cwd: string
  localized?: boolean
  manifest: Pick<ComponentManifest, 'name' | 'registryItemName' | 'version'>
  patchedFiles: string[]
  targetId: string
}) => {
  await mutateState(cwd, (state) => {
    const now = new Date().toISOString()
    const currentEntry = state.components[manifest.name]

    state.components[manifest.name] = upsertEntry({
      fileHashes: currentEntry?.fileHashes ?? {},
      installedAt: currentEntry?.installedAt ?? null,
      lastAttemptAt: now,
      lastError: null,
      localized: localized ?? currentEntry?.localized,
      manifest,
      patchedFiles,
      status: 'partial',
      targetId,
    })
  })
}

export const recordInstallFailure = async ({
  cwd,
  localized,
  manifest,
  patchedFiles,
  stage,
  targetId,
  message,
}: {
  cwd: string
  localized?: boolean
  manifest: Pick<ComponentManifest, 'name' | 'registryItemName' | 'version'>
  patchedFiles: string[]
  stage: InstallStage
  targetId: string
  message: string
}) => {
  await mutateState(cwd, (state) => {
    const now = new Date().toISOString()
    const currentEntry = state.components[manifest.name]

    state.components[manifest.name] = upsertEntry({
      fileHashes: currentEntry?.fileHashes ?? {},
      installedAt: currentEntry?.installedAt ?? null,
      lastAttemptAt: now,
      lastError: {
        message,
        stage,
      },
      localized: localized ?? currentEntry?.localized,
      manifest,
      patchedFiles,
      status: 'partial',
      targetId,
    })
  })
}

/* Drop a component's record after its files and wiring are gone. Returns
   whether anything was recorded so callers can stay quiet on a no-op. */
export const removeRecordedState = async ({
  componentName,
  cwd,
}: {
  componentName: string
  cwd: string
}) => {
  return await mutateState(cwd, (state) => {
    if (!state.components[componentName]) {
      return false
    }

    delete state.components[componentName]
    return true
  })
}

export const recordInstalledState = async ({
  cwd,
  installedAt,
  localized,
  manifest,
  patchedFiles,
  rewrittenFiles = [],
  targetId,
}: {
  cwd: string
  installedAt?: string
  localized?: boolean
  manifest: Pick<ComponentManifest, 'files' | 'name' | 'registryItemName' | 'version'>
  patchedFiles: string[]
  /* Only files this invocation actually created or transformed may establish a
   * new clean baseline. Existing shared files can carry consumer edits; a later
   * component must inherit the earlier owner's baseline instead of blessing the
   * current bytes as pristine. */
  rewrittenFiles?: string[]
  targetId: string
}) => {
  const installedFileHashes = await snapshotInstalledFiles({ cwd, files: manifest.files })
  const rewritten = new Set(rewrittenFiles)

  await mutateState(cwd, async (state) => {
    const now = new Date().toISOString()
    const currentEntry = state.components[manifest.name]
    const resolvedOwnerHashes = new Map<string, Record<string, string>>()

    for (const [componentName, entry] of Object.entries(state.components)) {
      if (componentName === manifest.name) {
        continue
      }

      const ownerManifest = await readJsonFile<ComponentManifest>(
        getManifestPath(componentName),
      ).catch(() => undefined)
      const fileHashes = await resolveRecordedFileHashes({
        componentName,
        installed: entry,
        manifest: ownerManifest,
      })

      if (fileHashes) {
        resolvedOwnerHashes.set(componentName, fileHashes)
        /* Materialize a reconstructable legacy baseline before synchronizing a
         * shared rewrite. Keeping only one path would make the remaining owned
         * files disappear from v3 ownership state. */
        if (Object.keys(entry.fileHashes).length === 0) {
          entry.fileHashes = normalizeFileHashes(fileHashes)
        }
      }
    }

    const fileHashes = Object.fromEntries(
      Object.entries(installedFileHashes).map(([projectPath, installedHash]) => {
        if (rewritten.has(projectPath)) {
          /* A shared source rewrite upgrades every recorded owner at once. Keep
           * their merge bases aligned so the new registry bytes do not look like
           * a consumer edit to a sibling component later. */
          for (const [componentName, entry] of Object.entries(state.components)) {
            if (
              componentName !== manifest.name &&
              resolvedOwnerHashes.get(componentName)?.[projectPath]
            ) {
              entry.fileHashes[projectPath] = installedHash
            }
          }

          return [projectPath, installedHash]
        }

        const currentBaseline = currentEntry?.fileHashes[projectPath]

        if (currentBaseline) {
          return [projectPath, currentBaseline]
        }

        const inheritedBaseline = [...resolvedOwnerHashes.entries()]
          .sort(([left], [right]) => left.localeCompare(right))
          .map(([, hashes]) => hashes[projectPath])
          .find((hash): hash is string => Boolean(hash))

        return [projectPath, inheritedBaseline ?? installedHash]
      }),
    )

    state.components[manifest.name] = upsertEntry({
      fileHashes,
      installedAt: installedAt ?? currentEntry?.installedAt ?? now,
      lastAttemptAt: now,
      lastError: null,
      localized,
      manifest,
      patchedFiles,
      status: 'installed',
      targetId,
    })
  })
}

/* Flip a recorded install to localized after the files were wrapped.
 *
 * `localize` runs against an already-installed component, so the block config on
 * disk no longer matches the baseline recorded at install time. Re-snapshot only
 * the files this run actually rewrote: `diff` then reads clean, and `update`
 * re-applies the wrapper instead of quietly reinstalling a config without it.
 * A file the component never recorded a baseline for is left alone — blessing
 * bytes that were never a known-clean install is how a consumer edit becomes
 * invisible. Returns false when nothing is recorded under that name. */
export const recordLocalizedInstall = async ({
  componentName,
  cwd,
  rewrittenFiles,
}: {
  componentName: string
  cwd: string
  rewrittenFiles: string[]
}) => {
  const hashes =
    rewrittenFiles.length > 0 ? await snapshotInstalledFiles({ cwd, files: rewrittenFiles }) : {}

  return await mutateState(cwd, (state) => {
    const entry = state.components[componentName]

    if (!entry) {
      return false
    }

    entry.localized = true
    entry.lastAttemptAt = new Date().toISOString()

    for (const [projectPath, hash] of Object.entries(hashes)) {
      if (entry.fileHashes[projectPath] !== undefined) {
        entry.fileHashes[projectPath] = hash
      }
    }

    return true
  })
}
