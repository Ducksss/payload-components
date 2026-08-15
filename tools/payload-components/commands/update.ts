import { rm } from 'node:fs/promises'
import path from 'node:path'

import { compareInstalledFiles } from '../component-files'
import { buildInventory, selectInstalled } from '../inventory'
import { loadManifest } from '../manifest'

import type { ChangelogEntry } from '../types'
import { isPathInside, printHeader } from '../utils'

import { addCommand } from './add'

type UpdatePlan = {
  blockedFiles: string[]
  componentName: string
  /* Whether install state records what this CLI wrote for the blocked files. If
     it does not, "modified" is a guess: an untouched file from the recorded
     version is indistinguishable from an edited one, and the skip message has to
     say so rather than accuse the consumer of edits they did not make. */
  editsTracked: boolean
  files: string[]
  localized: boolean
  /* Files superseded by a newer version but never touched locally. They are
     overwritten like any other file; listing them keeps the plan honest about
     what changed under the consumer. */
  outdatedFiles: string[]
  pendingChangelog: ChangelogEntry[]
  recordedVersion: string
  registryVersion: string
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
      ...plan.pendingChangelog.map(
        (entry) => `  ${entry.version}: ${entry.summary}`,
      ),
      ...plan.files.map((filePath) =>
        plan.outdatedFiles.includes(filePath)
          ? `  ${filePath} (${verb}overwrite — unedited ${plan.recordedVersion} file)`
          : `  ${filePath} (${verb}overwrite)`,
      ),
    )

    if (plan.blockedFiles.length > 0) {
      lines.push(
        ...plan.blockedFiles.map(
          (filePath) => `  ${filePath} (${verb}overwrite — local edits discarded by --force)`,
        ),
      )
    }
  }

  for (const plan of skipped) {
    lines.push(
      '',
      `${plan.componentName}: skipped — ${plan.blockedFiles.length} locally modified file${plan.blockedFiles.length === 1 ? '' : 's'}`,
      ...plan.blockedFiles.map((filePath) => `  ${filePath} (modified)`),
    )

    if (!plan.editsTracked) {
      lines.push(
        `  This install was recorded before this CLI tracked file contents, so an`,
        `  untouched ${plan.recordedVersion} file reads the same as an edited one. If you have not`,
        `  edited these files, --force only restores them to ${plan.registryVersion}.`,
      )
    }

    lines.push(
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

    lines.push(
      `  Migrate your existing documents, then re-run with --accept-breaking.`,
    )
  }

  if (dryRun) {
    lines.push('', 'No files were changed and no commands ran.')
  }

  return lines.join('\n')
}

/* Re-install a recorded component at the version this CLI ships. Files are
 * deleted first so the registry install rewrites them: `add` treats present
 * files as satisfied, which is right for a fresh install and wrong for an
 * upgrade. Local edits are protected — a modified file blocks the component
 * until the caller passes --force. */
export const updateCommand = async ({
  acceptBreaking = false,
  componentNames = [],
  cwd,
  dryRun = false,
  force = false,
}: {
  acceptBreaking?: boolean
  componentNames?: string[]
  cwd: string
  dryRun?: boolean
  force?: boolean
}) => {
  const inventory = await buildInventory({ cwd })
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
      : installed.filter((entry) => entry.updateAvailable || entry.installed?.status === 'partial')

  if (targets.length === 0) {
    printHeader(
      installed.length === 0
        ? `payload-components: no recorded components in ${cwd}. Nothing to update.`
        : `payload-components: all ${installed.length} recorded component${installed.length === 1 ? '' : 's'} are already at the version this CLI ships.`,
    )
    return
  }

  const plans: UpdatePlan[] = []
  const skipped: UpdatePlan[] = []
  const breaking: UpdatePlan[] = []

  for (const entry of targets) {
    const manifest = await loadManifest(entry.name)
    const localized = entry.installed?.localized === true
    const recordedHashes = entry.installed?.fileHashes
    /* An outdated file — different from what ships now, identical to what the
       install wrote — is exactly what this command exists to replace. Comparing
       against the recorded hashes is what keeps it out of blockedFiles. */
    const fileReport = await compareInstalledFiles({ cwd, localized, manifest, recordedHashes })
    const plan: UpdatePlan = {
      blockedFiles: fileReport.modified,
      componentName: entry.name,
      editsTracked: recordedHashes !== undefined,
      files: manifest.files.filter((filePath) => !fileReport.modified.includes(filePath)),
      /* A localized install stays localized: re-running plain `add` would
         rewrite the config without the wrapper and silently drop it. */
      localized,
      outdatedFiles: fileReport.outdated,
      pendingChangelog: entry.pendingChangelog,
      recordedVersion: entry.installed?.manifestVersion ?? 'unknown',
      registryVersion: manifest.version,
    }

    /* A breaking entry means the upgrade invalidates content already stored in
       Payload. Rewriting the files is the easy half; the operator still has to
       migrate documents, so this needs its own explicit consent — --force means
       "discard my local edits", which is a different decision entirely. */
    if (entry.breakingUpdate && !acceptBreaking) {
      breaking.push(plan)
      continue
    }

    if (fileReport.modified.length > 0 && !force) {
      skipped.push(plan)
      continue
    }

    plans.push(plan)
  }

  printHeader(formatPlan({ breaking, cwd, dryRun, plans, skipped }))

  if (dryRun) {
    return
  }

  for (const plan of plans) {
    for (const projectPath of [...plan.files, ...plan.blockedFiles]) {
      const absolutePath = path.join(cwd, projectPath)

      if (!isPathInside(cwd, absolutePath)) {
        throw new Error(`Refusing to overwrite "${projectPath}" because it resolves outside ${cwd}.`)
      }

      await rm(absolutePath, { force: true })
    }

    await addCommand({ componentName: plan.componentName, cwd, localized: plan.localized })
  }

  if (skipped.length > 0 || breaking.length > 0) {
    process.exitCode = 1
  }
}
