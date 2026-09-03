import path from 'node:path'

import { inspectBaseBundle } from '../base-bundle'
import { compareInstalledFiles, resolveRecordedFileHashes } from '../component-files'
import { writeCommandOutput } from '../command-output'
import { buildInventory, selectInstalled } from '../inventory'
import { loadManifest, selectPendingChangelog } from '../manifest'
import {
  CANONICAL_HOST_FILES,
  detectProject,
  LOCALIZE_HELPER_FILE,
  verifyInstalledPayloadFragments,
} from '../project'
import { loadState } from '../state'
import { safeProjectFileExists } from '../safe-path'

import type { ChangelogEntry, InstallStateEntry, ResolvedHostFiles } from '../types'

export type ComponentDiff = {
  baselineAvailable: boolean
  breakingUpdate: boolean
  isClean: boolean
  missingFiles: string[]
  missingFragments: string[]
  modifiedFiles: string[]
  name: string
  pendingChangelog: ChangelogEntry[]
  recordedVersion: string
  registryVersion: string
  updateAvailable: boolean
  wiringReadable: boolean
}

export type DiffReport = {
  base: Awaited<ReturnType<typeof inspectBaseBundle>> | null
  components: ComponentDiff[]
  isClean: boolean
}

const formatBaseDiff = (base: NonNullable<DiffReport['base']>) => {
  if (base.isClean) {
    return ['  starter-base: clean']
  }

  const lines = ['  starter-base:']

  if (base.updateAvailable) {
    lines.push('    version   a newer starter base ships with this CLI')
  }

  for (const filePath of base.modifiedFiles) {
    lines.push(`    modified  ${filePath}`)
  }

  for (const filePath of base.missingFiles) {
    lines.push(`    missing   ${filePath}`)
  }

  lines.push('    repair    payload-components init --scaffold')

  return lines
}

const resolveComponentDiff = async ({
  componentName,
  cwd,
  hostFiles,
  localized,
  installed,
  recordedVersion,
}: {
  componentName: string
  cwd: string
  hostFiles: ResolvedHostFiles
  localized: boolean
  installed: InstallStateEntry
  recordedVersion: string
}): Promise<ComponentDiff> => {
  const manifest = await loadManifest(componentName)
  const baselineHashes = await resolveRecordedFileHashes({
    componentName,
    installed,
    manifest,
  })
  const files = [...new Set([...manifest.files, ...Object.keys(baselineHashes ?? {})])]
  const fileReport = await compareInstalledFiles({
    ...(baselineHashes ? { baselineHashes } : {}),
    cwd,
    localized,
    manifest: { files, registryItemName: manifest.registryItemName },
  })
  /* The helper is shared, intentionally user-editable, and therefore has no
   * source baseline. A localized config still imports it, so only its presence
   * participates in drift reporting. */
  const localizationHelperMissing =
    localized &&
    !(await safeProjectFileExists({ cwd, filePath: path.join(cwd, LOCALIZE_HELPER_FILE) }))
  const missingFiles = localizationHelperMissing
    ? [...fileReport.missing, LOCALIZE_HELPER_FILE]
    : fileReport.missing
  const fragmentCheck = await verifyInstalledPayloadFragments({ cwd, hostFiles, manifest }).catch(
    () => undefined,
  )
  const updateAvailable = manifest.version !== recordedVersion
  const pendingChangelog = selectPendingChangelog({
    changelog: manifest.changelog,
    recordedVersion,
  })

  return {
    baselineAvailable: baselineHashes !== undefined,
    breakingUpdate: pendingChangelog.some((entry) => entry.breaking === true),
    isClean:
      missingFiles.length === 0 &&
      baselineHashes !== undefined &&
      fileReport.modified.length === 0 &&
      !updateAvailable &&
      fragmentCheck?.isValid === true,
    missingFiles,
    missingFragments: fragmentCheck?.missingFragments ?? [],
    modifiedFiles: baselineHashes ? fileReport.modified : [],
    name: componentName,
    pendingChangelog,
    recordedVersion,
    registryVersion: manifest.version,
    updateAvailable,
    wiringReadable: fragmentCheck !== undefined,
  }
}

const formatComponentDiff = (diff: ComponentDiff) => {
  if (diff.isClean) {
    return [`  ${diff.name}: clean (${diff.registryVersion})`]
  }

  const lines = [`  ${diff.name}:`]

  if (diff.updateAvailable) {
    lines.push(
      `    version   ${diff.recordedVersion} installed, ${diff.registryVersion} in the registry`,
    )

    /* What the upgrade would actually do. Recording a changelog is the whole
       point: "0.1.0 → 0.2.0" on its own is not a decision anyone can make. */
    for (const entry of diff.pendingChangelog) {
      lines.push(
        `    ${entry.breaking ? 'BREAKING' : 'change  '}  ${entry.version} ${entry.summary}`,
      )

      if (entry.dataMigration) {
        lines.push(`              migration: ${entry.dataMigration}`)
      }
    }
  }

  if (!diff.baselineAvailable) {
    lines.push('    unverified recorded source baseline is unavailable; update requires --force')
  }

  for (const filePath of diff.modifiedFiles) {
    lines.push(`    modified  ${filePath}`)
  }

  for (const filePath of diff.missingFiles) {
    lines.push(`    missing   ${filePath}`)
  }

  for (const fragment of diff.missingFragments) {
    lines.push(`    unwired   ${fragment}`)
  }

  if (!diff.wiringReadable) {
    lines.push('    unwired   could not read the host wiring files')
  }

  return lines
}

/* Report what changed between a recorded install and the registry it came
 * from, so `update` can be trusted not to clobber local edits. Returns whether
 * every inspected component is clean; the CLI turns that into an exit code so
 * CI can gate on install drift. */
export const diffCommand = async ({
  componentNames = [],
  cwd,
  json = false,
}: {
  componentNames?: string[]
  cwd: string
  json?: boolean
}) => {
  const inventory = await buildInventory({ cwd })
  const state = await loadState(cwd)
  const installedNames = selectInstalled(inventory).map(({ name }) => name)

  for (const componentName of componentNames) {
    if (!installedNames.includes(componentName)) {
      throw new Error(
        `Component "${componentName}" is not recorded as installed in ${cwd}. Run "payload-components list" to see what is.`,
      )
    }
  }

  const targetNames = componentNames.length > 0 ? componentNames : installedNames
  const components: ComponentDiff[] = []
  const base =
    componentNames.length === 0 && state.base
      ? await inspectBaseBundle({ cwd, installed: state.base })
      : null
  /* Wiring lives wherever this project keeps it, not at the canonical starter
     paths — checking the wrong file would report every install on a non-starter
     layout as unwired. An undetectable project falls back to the canonical
     paths, which then fail to read and surface as unreadable wiring. */
  const project = await detectProject(cwd).catch(() => undefined)
  const hostFiles = project?.hostFiles ?? CANONICAL_HOST_FILES

  for (const componentName of targetNames) {
    const entry = inventory.entries.find(({ name }) => name === componentName)
    const installedEntry = state.components[componentName]

    if (!installedEntry) {
      throw new Error(`Component "${componentName}" disappeared from install state while diffing.`)
    }

    components.push(
      await resolveComponentDiff({
        componentName,
        cwd,
        hostFiles,
        installed: installedEntry,
        localized: entry?.installed?.localized === true,
        recordedVersion: entry?.installed?.manifestVersion ?? 'unknown',
      }),
    )
  }

  const report: DiffReport = {
    base,
    components,
    isClean: (base?.isClean ?? true) && components.every(({ isClean }) => isClean),
  }

  if (json) {
    writeCommandOutput(`${JSON.stringify(report, null, 2)}\n`)
    return report.isClean
  }

  if (targetNames.length === 0 && !base) {
    writeCommandOutput(`payload-components: no recorded components in ${cwd}. Nothing to diff.\n`)
    return true
  }

  const lines = [
    base
      ? `payload-components: comparing managed install state in ${cwd} against shipped contracts`
      : `payload-components: comparing ${targetNames.length} recorded component${targetNames.length === 1 ? '' : 's'} in ${cwd} against the registry`,
    '',
    ...(base ? formatBaseDiff(base) : []),
    ...(base && components.length > 0 ? [''] : []),
    ...components.flatMap((diff) => formatComponentDiff(diff)),
  ]

  if (!report.isClean) {
    lines.push(
      '',
      'Locally modified files are never overwritten by "payload-components update" unless you pass --force.',
    )
  }

  writeCommandOutput(`${lines.join('\n')}\n`)

  return report.isClean
}
