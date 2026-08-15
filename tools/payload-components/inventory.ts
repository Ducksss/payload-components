import semver from 'semver'

import type { ChangelogEntry, ComponentManifest, InstallError, InstallStatus } from './types'

import { loadAllManifests, selectPendingChangelog } from './manifest'
import { loadState } from './state'

export type InstalledSummary = {
  /* Absent on installs recorded before hashes were tracked, which is what tells
   * `diff`/`update` they cannot separate an old file from an edited one. */
  fileHashes?: Record<string, string>
  installedAt: string | null
  lastError: InstallError | null
  localized: boolean
  manifestVersion: string
  status: InstallStatus
  targetId: string
}

export type InventoryEntry = {
  /* Changelog entries newer than what this project recorded — what an upgrade
   * would apply. Empty when nothing is installed or nothing is pending. */
  breakingUpdate: boolean
  installed: InstalledSummary | null
  name: string
  pendingChangelog: ChangelogEntry[]
  summary: string
  title: string
  updateAvailable: boolean
  version: string
}

export type Inventory = {
  entries: InventoryEntry[]
  /* Recorded components with no matching manifest — a component removed from
   * the registry, or a state file from a newer CLI. Surfaced rather than
   * silently dropped so `list`/`doctor` agree about what is unaccounted for. */
  orphaned: string[]
}

const toInstalledSummary = (
  entry: Awaited<ReturnType<typeof loadState>>['components'][string],
): InstalledSummary => ({
  ...(entry.fileHashes ? { fileHashes: entry.fileHashes } : {}),
  installedAt: entry.installedAt,
  lastError: entry.lastError,
  localized: entry.localized === true,
  manifestVersion: entry.manifestVersion,
  status: entry.status,
  targetId: entry.targetId,
})

/* Join the shipped catalog with what this project recorded. Deliberately does
 * not call detectProject: `list` has to work in any directory, including one
 * that was never initialized, so the catalog is always inspectable. */
export const buildInventory = async ({
  cwd,
  manifests,
}: {
  cwd: string
  manifests?: ComponentManifest[]
}): Promise<Inventory> => {
  const resolvedManifests = manifests ?? (await loadAllManifests())
  const state = await loadState(cwd)
  const entries = resolvedManifests.map((manifest) => {
    const stateEntry = state.components[manifest.name]
    const pendingChangelog = stateEntry
      ? selectPendingChangelog({
          changelog: manifest.changelog,
          recordedVersion: stateEntry.manifestVersion,
        })
      : []

    return {
      breakingUpdate: pendingChangelog.some((entry) => entry.breaking === true),
      installed: stateEntry ? toInstalledSummary(stateEntry) : null,
      name: manifest.name,
      pendingChangelog,
      summary: manifest.preview.summary,
      title: manifest.title,
      updateAvailable: stateEntry
        ? semver.gt(manifest.version, stateEntry.manifestVersion)
        : false,
      version: manifest.version,
    }
  })

  return {
    entries,
    orphaned: Object.keys(state.components)
      .filter((componentName) => !resolvedManifests.some(({ name }) => name === componentName))
      .sort(),
  }
}

export const selectInstalled = (inventory: Inventory) =>
  inventory.entries.filter((entry) => entry.installed !== null)
