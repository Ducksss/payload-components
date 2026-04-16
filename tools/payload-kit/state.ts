import { access } from 'node:fs/promises'
import path from 'node:path'

import type {
  InstallError,
  InstallState,
  InstallStateEntry,
  InstallStateV1,
  InstallStage,
  KitManifest,
} from './types'

import { CURRENT_ALPHA_TARGET_ID, SHARED_PATCHED_FILES } from './constants'
import { readJsonFile, repoRoot, writeJsonFile } from './utils'

const defaultState: InstallState = {
  kits: {},
  version: 2,
}

const normalizeFileList = (files: string[]) => [...new Set(files)].sort()

const getManifestPath = (kitName: string) =>
  path.join(repoRoot, 'payload-kits', 'manifests', `${kitName}.json`)

const getEntryBase = ({
  manifest,
  targetId,
}: {
  manifest: Pick<KitManifest, 'name' | 'registryItemName' | 'version'>
  targetId: string
}) => ({
  manifestVersion: manifest.version,
  registryItemName: manifest.registryItemName,
  targetId,
})

const migrateLegacyEntry = async ({
  kitName,
  legacyEntry,
}: {
  kitName: string
  legacyEntry: InstallStateV1['kits'][string]
}): Promise<InstallStateEntry> => {
  let registryItemName = kitName

  try {
    const manifest = await readJsonFile<KitManifest>(getManifestPath(kitName))
    registryItemName = manifest.registryItemName
  } catch {
    // Fall back to the legacy kit name when the manifest is unavailable.
  }

  const patchedFiles = normalizeFileList(
    legacyEntry.touchedFiles.filter((filePath) => SHARED_PATCHED_FILES.includes(filePath as never)),
  )
  const installedFiles = normalizeFileList(
    legacyEntry.touchedFiles.filter((filePath) => !SHARED_PATCHED_FILES.includes(filePath as never)),
  )

  return {
    installedAt: legacyEntry.status === 'installed' ? legacyEntry.installedAt : null,
    installedFiles,
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
    Object.entries(state.kits).map(async ([kitName, legacyEntry]) => {
      const migratedEntry = await migrateLegacyEntry({
        kitName,
        legacyEntry,
      })

      return [kitName, migratedEntry] as const
    }),
  )

  return {
    kits: Object.fromEntries(migratedEntries),
    version: 2,
  }
}

const normalizeState = (state: InstallState): InstallState => ({
  version: 2,
  kits: Object.fromEntries(
    Object.entries(state.kits).map(([kitName, entry]) => [
      kitName,
      {
        ...entry,
        installedFiles: normalizeFileList(entry.installedFiles),
        lastError: entry.lastError ?? null,
        patchedFiles: normalizeFileList(entry.patchedFiles),
      },
    ]),
  ),
})

const upsertEntry = ({
  currentEntry,
  installedAt,
  installedFiles,
  lastAttemptAt,
  lastError,
  manifest,
  patchedFiles,
  status,
  targetId,
}: {
  currentEntry?: InstallStateEntry
  installedAt: string | null
  installedFiles: string[]
  lastAttemptAt: string
  lastError: InstallError | null
  manifest: Pick<KitManifest, 'name' | 'registryItemName' | 'version'>
  patchedFiles: string[]
  status: InstallStateEntry['status']
  targetId: string
}): InstallStateEntry => ({
  ...getEntryBase({
    manifest,
    targetId,
  }),
  installedAt,
  installedFiles: normalizeFileList(installedFiles),
  lastAttemptAt,
  lastError,
  patchedFiles: normalizeFileList(patchedFiles),
  status,
})

export const getStatePath = (cwd: string) => path.join(cwd, '.payload-kit', 'state.json')

export const loadState = async (cwd: string): Promise<InstallState> => {
  const statePath = getStatePath(cwd)

  try {
    await access(statePath)
  } catch {
    return defaultState
  }

  const rawState: InstallState | InstallStateV1 = await readJsonFile<InstallState | InstallStateV1>(statePath)

  if (rawState.version === 1) {
    return await migrateLegacyState(rawState)
  }

  if (rawState.version === 2) {
    return normalizeState(rawState)
  }

  throw new Error(`Unsupported payload-kit state version "${String((rawState as { version?: unknown }).version)}".`)
}

export const saveState = async (cwd: string, state: InstallState) => {
  await writeJsonFile(getStatePath(cwd), normalizeState(state))
}

export const recordInstallAttempt = async ({
  cwd,
  installedFiles,
  manifest,
  patchedFiles,
  targetId,
}: {
  cwd: string
  installedFiles: string[]
  manifest: Pick<KitManifest, 'name' | 'registryItemName' | 'version'>
  patchedFiles: string[]
  targetId: string
}) => {
  const state = await loadState(cwd)
  const now = new Date().toISOString()
  const currentEntry = state.kits[manifest.name]

  state.kits[manifest.name] = upsertEntry({
    currentEntry,
    installedAt: currentEntry?.installedAt ?? null,
    installedFiles,
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
  installedFiles,
  manifest,
  patchedFiles,
  stage,
  targetId,
  message,
}: {
  cwd: string
  installedFiles: string[]
  manifest: Pick<KitManifest, 'name' | 'registryItemName' | 'version'>
  patchedFiles: string[]
  stage: InstallStage
  targetId: string
  message: string
}) => {
  const state = await loadState(cwd)
  const now = new Date().toISOString()
  const currentEntry = state.kits[manifest.name]

  state.kits[manifest.name] = upsertEntry({
    currentEntry,
    installedAt: currentEntry?.installedAt ?? null,
    installedFiles,
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
  installedFiles,
  manifest,
  patchedFiles,
  targetId,
}: {
  cwd: string
  installedAt?: string
  installedFiles: string[]
  manifest: Pick<KitManifest, 'name' | 'registryItemName' | 'version'>
  patchedFiles: string[]
  targetId: string
}) => {
  const state = await loadState(cwd)
  const now = new Date().toISOString()

  state.kits[manifest.name] = upsertEntry({
    currentEntry: state.kits[manifest.name],
    installedAt: installedAt ?? now,
    installedFiles,
    lastAttemptAt: now,
    lastError: null,
    manifest,
    patchedFiles,
    status: 'installed',
    targetId,
  })

  await saveState(cwd, state)
}
