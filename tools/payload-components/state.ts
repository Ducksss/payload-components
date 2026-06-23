import { access } from 'node:fs/promises'
import path from 'node:path'

import type {
  InstallError,
  InstallState,
  InstallStateEntry,
  InstallStateV1,
  InstallStage,
  ComponentManifest,
} from './types'

import { CURRENT_ALPHA_TARGET_ID, SHARED_PATCHED_FILES } from './constants'
import { readJsonFile, repoRoot, writeJsonFile } from './utils'

// Return a fresh object every time: callers (recordInstall*) mutate the loaded
// state in place, so handing out a shared singleton would leak entries across
// loads within a single process.
const createDefaultState = (): InstallState => ({
  components: {},
  version: 2,
})

const normalizeFileList = (files: string[]) => [...new Set(files)].sort()

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
    version: 2,
  }
}

const normalizeState = (state: InstallState): InstallState => ({
  version: 2,
  components: Object.fromEntries(
    Object.entries(state.components).map(([componentName, entry]) => [
      componentName,
      {
        ...entry,
        lastError: entry.lastError ?? null,
        patchedFiles: normalizeFileList(entry.patchedFiles),
      },
    ]),
  ),
})

const upsertEntry = ({
  installedAt,
  lastAttemptAt,
  lastError,
  manifest,
  patchedFiles,
  status,
  targetId,
}: {
  installedAt: string | null
  lastAttemptAt: string
  lastError: InstallError | null
  manifest: Pick<ComponentManifest, 'name' | 'registryItemName' | 'version'>
  patchedFiles: string[]
  status: InstallStateEntry['status']
  targetId: string
}): InstallStateEntry => ({
  ...getEntryBase({
    manifest,
    targetId,
  }),
  installedAt,
  lastAttemptAt,
  lastError,
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

  let rawState: InstallState | InstallStateV1

  try {
    rawState = await readJsonFile<InstallState | InstallStateV1>(statePath)
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
    return normalizeState(rawState)
  }

  throw new Error(`Unsupported payload-components state version "${String((rawState as { version?: unknown }).version)}".`)
}

export const saveState = async (cwd: string, state: InstallState) => {
  await writeJsonFile(getStatePath(cwd), normalizeState(state))
}

export const recordInstallAttempt = async ({
  cwd,
  manifest,
  patchedFiles,
  targetId,
}: {
  cwd: string
  manifest: Pick<ComponentManifest, 'name' | 'registryItemName' | 'version'>
  patchedFiles: string[]
  targetId: string
}) => {
  const state = await loadState(cwd)
  const now = new Date().toISOString()
  const currentEntry = state.components[manifest.name]

  state.components[manifest.name] = upsertEntry({
    installedAt: currentEntry?.installedAt ?? null,
    lastAttemptAt: now,
    lastError: null,
    manifest,
    patchedFiles,
    status: 'partial',
    targetId,
  })

  await saveState(cwd, state)
}

export const recordInstallFailure = async ({
  cwd,
  manifest,
  patchedFiles,
  stage,
  targetId,
  message,
}: {
  cwd: string
  manifest: Pick<ComponentManifest, 'name' | 'registryItemName' | 'version'>
  patchedFiles: string[]
  stage: InstallStage
  targetId: string
  message: string
}) => {
  const state = await loadState(cwd)
  const now = new Date().toISOString()
  const currentEntry = state.components[manifest.name]

  state.components[manifest.name] = upsertEntry({
    installedAt: currentEntry?.installedAt ?? null,
    lastAttemptAt: now,
    lastError: {
      message,
      stage,
    },
    manifest,
    patchedFiles,
    status: 'partial',
    targetId,
  })

  await saveState(cwd, state)
}

export const recordInstalledState = async ({
  cwd,
  installedAt,
  manifest,
  patchedFiles,
  targetId,
}: {
  cwd: string
  installedAt?: string
  manifest: Pick<ComponentManifest, 'name' | 'registryItemName' | 'version'>
  patchedFiles: string[]
  targetId: string
}) => {
  const state = await loadState(cwd)
  const now = new Date().toISOString()

  state.components[manifest.name] = upsertEntry({
    installedAt: installedAt ?? now,
    lastAttemptAt: now,
    lastError: null,
    manifest,
    patchedFiles,
    status: 'installed',
    targetId,
  })

  await saveState(cwd, state)
}
