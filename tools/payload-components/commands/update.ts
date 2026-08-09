import { rm } from 'node:fs/promises'
import path from 'node:path'

import { compareInstalledFiles } from '../component-files'
import { buildInventory, selectInstalled } from '../inventory'
import { loadManifest } from '../manifest'
import { isPathInside, printHeader } from '../utils'

import { addCommand } from './add'

type UpdatePlan = {
  blockedFiles: string[]
  componentName: string
  files: string[]
  localized: boolean
  recordedVersion: string
  registryVersion: string
}

const formatPlan = ({
  cwd,
  dryRun,
  plans,
  skipped,
}: {
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
      ...plan.files.map((filePath) => `  ${filePath} (${verb}overwrite)`),
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
      `  Re-run with --force to overwrite, or copy your edits out first.`,
      `  Inspect with "payload-components diff ${plan.componentName}".`,
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
  componentNames = [],
  cwd,
  dryRun = false,
  force = false,
}: {
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

  for (const entry of targets) {
    const manifest = await loadManifest(entry.name)
    const localized = entry.installed?.localized === true
    const fileReport = await compareInstalledFiles({ cwd, localized, manifest })
    const plan: UpdatePlan = {
      blockedFiles: fileReport.modified,
      componentName: entry.name,
      files: manifest.files.filter((filePath) => !fileReport.modified.includes(filePath)),
      /* A localized install stays localized: re-running plain `add` would
         rewrite the config without the wrapper and silently drop it. */
      localized,
      recordedVersion: entry.installed?.manifestVersion ?? 'unknown',
      registryVersion: manifest.version,
    }

    if (fileReport.modified.length > 0 && !force) {
      skipped.push(plan)
      continue
    }

    plans.push(plan)
  }

  printHeader(formatPlan({ cwd, dryRun, plans, skipped }))

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

  if (skipped.length > 0) {
    process.exitCode = 1
  }
}
