import path from 'node:path'

import {
  compareInstalledFiles,
  hashSource,
  replaceCanonicalComponentFiles,
  resolveCanonicalFileHashes,
  resolveRecordedFileHashes,
} from '../component-files'
import { buildInventory, selectInstalled } from '../inventory'
import { loadManifest } from '../manifest'
import { readSafeProjectFile } from '../safe-path'
import { loadState } from '../state'

import type { ChangelogEntry } from '../types'
import { printHeader } from '../utils'

import { addCommand } from './add'

type UpdatePlan = {
  baselineUnavailable: boolean
  blockedFiles: string[]
  componentName: string
  files: string[]
  localized: boolean
  localizationPolicyChange: boolean
  ownershipConflicts: Array<{ owners: string[]; projectPath: string }>
  pendingChangelog: ChangelogEntry[]
  recordedVersion: string
  registryVersion: string
  retainedFiles: Array<{ owners: string[]; projectPath: string }>
}

type RecordedFileOwner = {
  canonicalHash?: string
  hash?: string
  name: string
}

const loadRecordedFileOwners = async (state: Awaited<ReturnType<typeof loadState>>) => {
  const entries = await Promise.all(
    Object.entries(state.components).map(async ([componentName, installed]) => {
      const manifest = await loadManifest(componentName).catch(() => undefined)
      const fileHashes = await resolveRecordedFileHashes({
        componentName,
        installed,
        manifest,
      })
      const canonicalHashes = manifest
        ? await resolveCanonicalFileHashes({
            localized: installed.localized === true,
            manifest,
          })
        : undefined

      return { canonicalHashes, componentName, fileHashes, manifest }
    }),
  )
  const owners = new Map<string, RecordedFileOwner[]>()
  const unresolved = entries
    .filter(({ fileHashes, manifest }) => !fileHashes && !manifest)
    .map(({ componentName }) => componentName)

  for (const { canonicalHashes, componentName, fileHashes, manifest } of entries) {
    const ownedFiles = fileHashes ? Object.keys(fileHashes) : (manifest?.files ?? [])

    for (const projectPath of ownedFiles) {
      owners.set(projectPath, [
        ...(owners.get(projectPath) ?? []),
        {
          canonicalHash: canonicalHashes?.[projectPath],
          hash: fileHashes?.[projectPath],
          name: componentName,
        },
      ])
    }
  }

  return { owners, unresolved }
}

const formatPlan = ({
  breaking,
  cwd,
  dryRun,
  plans,
  skipped,
}: {
  breaking: UpdatePlan[]
  cwd: string
  dryRun: boolean
  plans: UpdatePlan[]
  skipped: UpdatePlan[]
}) => {
  const verb = dryRun ? 'would ' : ''
  const lines = [
    dryRun
      ? `payload-components: dry run for updating ${plans.length + skipped.length} component${plans.length + skipped.length === 1 ? '' : 's'} in ${cwd}`
      : `payload-components: updating ${plans.length} component${plans.length === 1 ? '' : 's'} in ${cwd}`,
  ]

  for (const plan of plans) {
    lines.push(
      '',
      `${plan.componentName}: ${plan.recordedVersion} → ${plan.registryVersion}`,
      ...(plan.localizationPolicyChange
        ? [
            '  localization policy: legacy type inference → semantic-v1',
            '  no database migration will run; existing documents must already be migrated',
          ]
        : []),
      ...plan.pendingChangelog.map((entry) => `  ${entry.version}: ${entry.summary}`),
      ...plan.files.map((filePath) => `  ${filePath} (${verb}overwrite)`),
      ...plan.retainedFiles.map(
        ({ owners, projectPath }) => `  ${projectPath} (keep — still used by ${owners.join(', ')})`,
      ),
    )

    if (plan.blockedFiles.length > 0) {
      lines.push(
        ...plan.blockedFiles.map(
          (filePath) =>
            `  ${filePath} (${verb}overwrite — ${
              plan.baselineUnavailable
                ? 'source baseline unavailable, accepted by --force'
                : 'local edits discarded by --force'
            })`,
        ),
      )
    }
  }

  for (const plan of skipped) {
    if (plan.ownershipConflicts.length > 0) {
      lines.push(
        '',
        `${plan.componentName}: skipped — shared-file ownership conflict`,
        ...plan.ownershipConflicts.map(
          ({ owners, projectPath }) =>
            `  ${projectPath} (retained owners do not accept these bytes: ${owners.join(', ')})`,
        ),
        `  Update the owning components together only when they ship identical bytes.`,
      )
      continue
    }

    if (plan.baselineUnavailable) {
      lines.push(
        '',
        `${plan.componentName}: skipped — recorded source baseline unavailable`,
        `  This CLI cannot distinguish that older release from local edits.`,
        `  Re-run with --force to overwrite, or copy your files out first.`,
      )
      continue
    }

    lines.push(
      '',
      `${plan.componentName}: skipped — ${plan.blockedFiles.length} locally modified file${plan.blockedFiles.length === 1 ? '' : 's'}`,
      ...plan.blockedFiles.map((filePath) => `  ${filePath} (modified)`),
      `  Re-run with --force to overwrite, or copy your edits out first.`,
      `  Inspect with "payload-components diff ${plan.componentName}".`,
    )
  }

  for (const plan of breaking) {
    const entries = plan.pendingChangelog.filter((entry) => entry.breaking)

    lines.push(
      '',
      `${plan.componentName}: held back — ${plan.recordedVersion} → ${plan.registryVersion} changes stored content`,
    )

    for (const entry of entries) {
      lines.push(`  ${entry.version}: ${entry.summary}`)

      if (entry.dataMigration) {
        lines.push(`    migrate first: ${entry.dataMigration}`)
      }
    }

    lines.push(`  Migrate your existing documents, then re-run with --accept-breaking.`)
  }

  if (dryRun) {
    lines.push('', 'No files were changed and no commands ran.')
  }

  return lines.join('\n')
}

/* Re-install a recorded component at the version this CLI ships. Source files
 * are staged and replaced as one batch before add reconciles dependencies,
 * wiring, generators, and state. Local edits are protected — a modified file
 * blocks the component until the caller passes --force. */
export const updateCommand = async ({
  acceptBreaking = false,
  acceptLocalizationPolicyChange = false,
  componentNames = [],
  cwd,
  dryRun = false,
  force = false,
}: {
  acceptBreaking?: boolean
  acceptLocalizationPolicyChange?: boolean
  componentNames?: string[]
  cwd: string
  dryRun?: boolean
  force?: boolean
}) => {
  const inventory = await buildInventory({ cwd })
  const state = await loadState(cwd)
  const recordedOwnership = await loadRecordedFileOwners(state)
  const installed = selectInstalled(inventory)
  const installedNames = installed.map(({ name }) => name)

  for (const componentName of componentNames) {
    if (!installedNames.includes(componentName)) {
      throw new Error(
        `Component "${componentName}" is not recorded as installed in ${cwd}. Run "payload-components add ${componentName}" to install it.`,
      )
    }
  }

  const targets =
    componentNames.length > 0
      ? installed.filter(({ name }) => componentNames.includes(name))
      : installed.filter(
          (entry) =>
            entry.updateAvailable ||
            entry.installed?.status === 'partial' ||
            (entry.installed?.localized === true &&
              entry.installed.localizationPolicy !== 'semantic-v1'),
        )

  if (targets.length === 0) {
    printHeader(
      installed.length === 0
        ? `payload-components: no recorded components in ${cwd}. Nothing to update.`
        : `payload-components: all ${installed.length} recorded component${installed.length === 1 ? '' : 's'} are already at the version this CLI ships.`,
    )
    return true
  }

  const plans: UpdatePlan[] = []
  const skipped: UpdatePlan[] = []
  const breaking: UpdatePlan[] = []

  for (const entry of targets) {
    const manifest = await loadManifest(entry.name)
    const localized = entry.installed?.localized === true
    const installedEntry = state.components[entry.name]

    if (!installedEntry) {
      throw new Error(`Component "${entry.name}" disappeared from install state while updating.`)
    }

    const localizationPolicyChange =
      localized && installedEntry.localizationPolicy !== 'semantic-v1'

    if (localizationPolicyChange && !acceptLocalizationPolicyChange) {
      throw new Error(
        `Component "${entry.name}" uses the legacy type-inferred localization policy. The semantic-v1 policy keeps URLs, form actions, prices, metrics, and identifiers global, which can change stored Payload data. Migrate existing documents first, then re-run with --accept-localization-policy-change. No database migration is run automatically.`,
      )
    }

    const baselineHashes = await resolveRecordedFileHashes({
      componentName: entry.name,
      installed: installedEntry,
      manifest,
    })
    /* Compare and replace the union of the old recorded file set and today's
       manifest. Otherwise an upgrade that removes or renames a source file
       leaves the old owned file behind in the consumer project. */
    const currentFiles = new Set(manifest.files)
    const recordedFiles = Object.keys(baselineHashes ?? {})
    const retainedFiles = recordedFiles
      .filter((projectPath) => !currentFiles.has(projectPath))
      .map((projectPath) => ({
        owners: (recordedOwnership.owners.get(projectPath) ?? [])
          .filter(({ name }) => name !== entry.name)
          .map(({ name }) => name)
          .sort(),
        projectPath,
      }))
      .filter(({ owners }) => owners.length > 0)
    const retainedPaths = new Set(retainedFiles.map(({ projectPath }) => projectPath))
    const files = [...new Set([...manifest.files, ...recordedFiles])].filter(
      (projectPath) => !retainedPaths.has(projectPath),
    )
    const fileReport = await compareInstalledFiles({
      ...(baselineHashes ? { baselineHashes } : {}),
      cwd,
      localized,
      manifest: { files, registryItemName: manifest.registryItemName },
    })
    const blockedFiles = fileReport.modified
    const plan: UpdatePlan = {
      baselineUnavailable: baselineHashes === undefined,
      blockedFiles,
      componentName: entry.name,
      files: files.filter((filePath) => !blockedFiles.includes(filePath)),
      /* A localized install stays localized: re-running plain `add` would
         rewrite the config without the wrapper and silently drop it. */
      localized,
      localizationPolicyChange,
      ownershipConflicts: [],
      pendingChangelog: entry.pendingChangelog,
      recordedVersion: entry.installed?.manifestVersion ?? 'unknown',
      registryVersion: manifest.version,
      retainedFiles,
    }

    /* A breaking entry means the upgrade invalidates content already stored in
       Payload. Rewriting the files is the easy half; the operator still has to
       migrate documents, so this needs its own explicit consent — --force means
       "discard my local edits", which is a different decision entirely. */
    if (entry.breakingUpdate && !acceptBreaking) {
      breaking.push(plan)
      continue
    }

    if ((blockedFiles.length > 0 || plan.baselineUnavailable) && !force) {
      skipped.push(plan)
      continue
    }

    plans.push(plan)
  }

  /* Shared-file consent is evaluated only after local-edit and breaking checks
   * establish which components will really update. A targeted-but-skipped owner
   * still counts as retained. Removing one conflicting plan can therefore make
   * another unsafe, so repeat until the eligible set is stable. */
  let eligiblePlans = plans

  while (eligiblePlans.length > 0) {
    const eligibleNames = new Set(eligiblePlans.map(({ componentName }) => componentName))
    const nextEligible: UpdatePlan[] = []
    let removedPlan = false

    for (const plan of eligiblePlans) {
      const manifest = await loadManifest(plan.componentName)
      const prospectiveHashes = await resolveCanonicalFileHashes({
        localized: plan.localized,
        manifest,
      })
      const replacementFiles = [...new Set([...plan.files, ...plan.blockedFiles])]
      const ownershipConflicts: Array<{ owners: string[]; projectPath: string }> = []

      for (const projectPath of replacementFiles) {
        const otherOwners = (recordedOwnership.owners.get(projectPath) ?? []).filter(
          ({ name }) => name !== plan.componentName,
        )

        if (otherOwners.length === 0) {
          continue
        }

        const installedSource = await readSafeProjectFile({
          cwd,
          filePath: path.join(cwd, projectPath),
        }).catch(() => undefined)
        const installedHash = installedSource === undefined ? undefined : hashSource(installedSource)
        const prospectiveHash = prospectiveHashes?.[projectPath]
        const conflictingOwners = otherOwners
          .filter(({ canonicalHash, hash, name }) => {
            const ownerWillUpdate = eligibleNames.has(name)
            const acceptedHash = ownerWillUpdate ? canonicalHash : hash

            return (
              !prospectiveHash ||
              !acceptedHash ||
              prospectiveHash !== acceptedHash ||
              (!ownerWillUpdate && installedHash !== undefined && hash !== installedHash)
            )
          })
          .map(({ name }) => name)

        if (conflictingOwners.length > 0) {
          ownershipConflicts.push({ owners: conflictingOwners.sort(), projectPath })
        }
      }

      const unresolvedOwners = recordedOwnership.unresolved
        .filter((name) => name !== plan.componentName)
        .sort()

      if (unresolvedOwners.length > 0) {
        for (const projectPath of replacementFiles) {
          const existing = ownershipConflicts.find(
            (conflict) => conflict.projectPath === projectPath,
          )

          if (existing) {
            existing.owners = [...new Set([...existing.owners, ...unresolvedOwners])].sort()
          } else {
            ownershipConflicts.push({ owners: unresolvedOwners, projectPath })
          }
        }
      }

      if (ownershipConflicts.length > 0) {
        plan.ownershipConflicts = ownershipConflicts
        skipped.push(plan)
        removedPlan = true
      } else {
        nextEligible.push(plan)
      }
    }

    eligiblePlans = nextEligible

    if (!removedPlan) {
      break
    }
  }

  plans.splice(0, plans.length, ...eligiblePlans)

  printHeader(formatPlan({ breaking, cwd, dryRun, plans, skipped }))

  if (dryRun) {
    return true
  }

  for (const plan of plans) {
    const manifest = await loadManifest(plan.componentName)
    const replacedFiles = [...plan.files, ...plan.blockedFiles]
    const currentFiles = new Set(manifest.files)

    await replaceCanonicalComponentFiles({
      cwd,
      deleteFiles: replacedFiles.filter((projectPath) => !currentFiles.has(projectPath)),
      localized: plan.localized,
      manifest,
    })

    await addCommand({
      ...(plan.localizationPolicyChange ? { acceptLocalizationPolicyChange: true } : {}),
      componentName: plan.componentName,
      cwd,
      localized: plan.localized,
      prewrittenFiles: manifest.files.filter((projectPath) => replacedFiles.includes(projectPath)),
    })
  }

  return skipped.length === 0 && breaking.length === 0
}
