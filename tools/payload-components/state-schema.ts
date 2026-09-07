import semver from 'semver'

import { INSTALL_STAGES } from './constants'
import type { InstallState, InstallStateV1, InstallStateV2 } from './types'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
const strings = (value: unknown) =>
  Array.isArray(value) && value.every((item) => typeof item === 'string')

/** Validate persisted ownership before any command can use or replace it. */
export function assertInstallState(
  value: unknown,
): asserts value is InstallState | InstallStateV1 | InstallStateV2 {
  if (!isRecord(value) || ![1, 2, 3].includes(value.version as number)) {
    throw new Error(
      `Unsupported payload-components state version "${isRecord(value) ? String(value.version) : 'unknown'}".`,
    )
  }
  if (!isRecord(value.components)) {
    throw new Error('Install state must contain a components object and a numeric version.')
  }
  for (const [name, entry] of Object.entries(value.components)) {
    const invalid = () =>
      new Error(
        `Invalid install state entry "${name}". Restore state.json from a known-good backup before retrying.`,
      )
    if (
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name) ||
      !isRecord(entry) ||
      typeof entry.manifestVersion !== 'string' ||
      !semver.valid(entry.manifestVersion) ||
      !['installed', 'partial'].includes(String(entry.status))
    )
      throw invalid()
    if (value.version === 1) {
      if (typeof entry.installedAt !== 'string' || !strings(entry.touchedFiles)) throw invalid()
      continue
    }
    if (
      (entry.installedAt !== null && typeof entry.installedAt !== 'string') ||
      typeof entry.lastAttemptAt !== 'string' ||
      typeof entry.registryItemName !== 'string' ||
      typeof entry.targetId !== 'string' ||
      !strings(entry.patchedFiles) ||
      (entry.localized !== undefined && typeof entry.localized !== 'boolean')
    )
      throw invalid()
    const lastError = entry.lastError
    if (
      lastError != null &&
      (!isRecord(lastError) ||
        typeof lastError.message !== 'string' ||
        !INSTALL_STAGES.some((stage) => stage === lastError.stage))
    )
      throw invalid()
    if (
      value.version === 3 &&
      (!isRecord(entry.fileHashes) ||
        !Object.values(entry.fileHashes).every((hash) => typeof hash === 'string'))
    )
      throw invalid()
  }
}
