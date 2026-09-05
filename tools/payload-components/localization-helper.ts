import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { hashSource } from './component-files'
import { LOCALIZE_HELPER_FILE } from './project'
import { readSafeProjectFile } from './safe-path'
import { loadState } from './state'
import { commitFileChanges, repoRoot, type FileChange } from './utils'

// Exact normalized bytes shipped before semantic-v1. Older installers did not
// record helper ownership, so only this known release can be adopted safely.
const legacyHelperHash = '49302617b5ac5fabab57be1dcabfaba5bb7cee46ba8132954246b1ffb694a060'

export async function prepareLocalizationHelper({
  cwd,
  acceptLegacyPolicyChange = false,
  migratingComponents = [],
}: {
  cwd: string
  acceptLegacyPolicyChange?: boolean
  migratingComponents?: string[]
}): Promise<FileChange[]> {
  const filePath = path.join(cwd, LOCALIZE_HELPER_FILE)
  const canonical = await readFile(
    path.join(repoRoot, 'payload-components/source/blocks/shared/localizeFields.ts'),
    'utf8',
  )
  const installed = await readSafeProjectFile({ cwd, filePath }).catch((error: NodeJS.ErrnoException) => {
    if (error.code === 'ENOENT') return undefined
    throw error
  })

  if (installed !== undefined && hashSource(installed) === hashSource(canonical)) return []

  if (installed !== undefined && hashSource(installed) !== legacyHelperHash) {
    throw new Error(
      `Refusing to replace edited or unrecognized ${LOCALIZE_HELPER_FILE}. Preserve your changes and reconcile this shared helper with the current shipped source before retrying.`,
    )
  }

  const state = await loadState(cwd)
  const legacyOwners = Object.entries(state.components)
    .filter(([, entry]) => entry.localized && entry.localizationPolicy !== 'semantic-v1')
    .map(([name]) => name)
  const retainedOwners = legacyOwners.filter((name) => !migratingComponents.includes(name))

  if (
    (installed !== undefined || legacyOwners.length > 0) &&
    (!acceptLegacyPolicyChange || retainedOwners.length > 0)
  ) {
    throw new Error(
      `The shared localization helper still uses the legacy field policy. Migrate stored data and update all its legacy owners together with --accept-localization-policy-change: ${legacyOwners.join(', ') || 'the existing localized blocks'}. No helper or component files were changed.`,
    )
  }

  return [{ content: canonical, filePath }]
}

export async function ensureLocalizationHelper(cwd: string) {
  await commitFileChanges(await prepareLocalizationHelper({ cwd }), { cwd })
}
