import { compareInstalledFiles } from '../component-files'
import { buildInventory, selectInstalled } from '../inventory'
import { loadManifest, selectPendingChangelog } from '../manifest'
import { CANONICAL_HOST_FILES, detectProject, verifyInstalledPayloadFragments } from '../project'

import type { ChangelogEntry, ResolvedHostFiles } from '../types'

export type ComponentDiff = {
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
  components: ComponentDiff[]
  isClean: boolean
}

const resolveComponentDiff = async ({
  componentName,
  cwd,
  hostFiles,
  localized,
  recordedVersion,
}: {
  componentName: string
  cwd: string
  hostFiles: ResolvedHostFiles
  localized: boolean
  recordedVersion: string
}): Promise<ComponentDiff> => {
  const manifest = await loadManifest(componentName)
  const fileReport = await compareInstalledFiles({ cwd, localized, manifest })
  const fragmentCheck = await verifyInstalledPayloadFragments({ cwd, hostFiles, manifest }).catch(
    () => undefined,
  )
  const updateAvailable = manifest.version !== recordedVersion
  const pendingChangelog = selectPendingChangelog({
    changelog: manifest.changelog,
    recordedVersion,
  })

  return {
    breakingUpdate: pendingChangelog.some((entry) => entry.breaking === true),
    isClean:
      fileReport.missing.length === 0 &&
      fileReport.modified.length === 0 &&
      !updateAvailable &&
      fragmentCheck?.isValid === true,
    missingFiles: fileReport.missing,
    missingFragments: fragmentCheck?.missingFragments ?? [],
    modifiedFiles: fileReport.modified,
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
      lines.push(`    ${entry.breaking ? 'BREAKING' : 'change  '}  ${entry.version} ${entry.summary}`)

      if (entry.dataMigration) {
        lines.push(`              migration: ${entry.dataMigration}`)
      }
    }
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
  /* Wiring lives wherever this project keeps it, not at the canonical starter
     paths — checking the wrong file would report every install on a non-starter
     layout as unwired. An undetectable project falls back to the canonical
     paths, which then fail to read and surface as unreadable wiring. */
  const project = await detectProject(cwd).catch(() => undefined)
  const hostFiles = project?.hostFiles ?? CANONICAL_HOST_FILES

  for (const componentName of targetNames) {
    const entry = inventory.entries.find(({ name }) => name === componentName)

    components.push(
      await resolveComponentDiff({
        componentName,
        cwd,
        hostFiles,
        localized: entry?.installed?.localized === true,
        recordedVersion: entry?.installed?.manifestVersion ?? 'unknown',
      }),
    )
  }

  const report: DiffReport = {
    components,
    isClean: components.every(({ isClean }) => isClean),
  }

  if (json) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
    return report.isClean
  }

  if (targetNames.length === 0) {
    process.stdout.write(
      `payload-components: no recorded components in ${cwd}. Nothing to diff.\n`,
    )
    return true
  }

  const lines = [
    `payload-components: comparing ${targetNames.length} recorded component${targetNames.length === 1 ? '' : 's'} in ${cwd} against the registry`,
    '',
    ...components.flatMap((diff) => formatComponentDiff(diff)),
  ]

  if (!report.isClean) {
    lines.push(
      '',
      'Locally modified files are never overwritten by "payload-components update" unless you pass --force.',
    )
  }

  process.stdout.write(`${lines.join('\n')}\n`)

  return report.isClean
}
