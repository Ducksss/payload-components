import { access, readdir, rm, rmdir } from 'node:fs/promises'
import path from 'node:path'

import {
  compareInstalledFiles,
  partitionOwnedFiles,
  resolveRecordedFileHashes,
} from '../component-files'
import { loadManifest } from '../manifest'
import { runPostInstallScript } from '../post-install'
import {
  detectProject,
  removePayloadFragments,
  verifyInstalledPayloadFragments,
} from '../project'
import { loadState, removeRecordedState } from '../state'
import { isPathInside, printHeader } from '../utils'

const fileExists = async (absolutePath: string) => {
  try {
    await access(absolutePath)
    return true
  } catch {
    return false
  }
}

/* Resolve ownership from the baseline recorded at install time, not today's
 * manifests. That matters when a family changed its shared files between
 * releases, and it still works for an orphaned component whose manifest was
 * removed as long as v3 state retained its file hashes. */
const loadOwnership = async ({
  componentName,
  cwd,
  manifest,
}: {
  componentName: string
  cwd: string
  manifest: Awaited<ReturnType<typeof loadManifest>>
}) => {
  const state = await loadState(cwd)
  const installed = state.components[componentName]
  const retainedNames = Object.keys(state.components).filter((name) => name !== componentName)
  const retained: Array<{ files: string[]; name: string }> = []
  const unresolved: string[] = []

  for (const name of retainedNames) {
    const retainedManifest = await loadManifest(name).catch(() => undefined)
    const fileHashes = await resolveRecordedFileHashes({
      componentName: name,
      installed: state.components[name],
      manifest: retainedManifest,
    })

    if (!fileHashes) {
      unresolved.push(name)
      continue
    }

    retained.push({ files: Object.keys(fileHashes), name })
  }

  const targetFileHashes = installed
    ? await resolveRecordedFileHashes({ componentName, installed, manifest })
    : undefined

  return { installed, retained, targetFileHashes, unresolved }
}

/* Remove now-empty directories the component left behind, walking up toward the
 * project root. Anything with surviving entries stops the walk immediately. */
const pruneEmptyDirectories = async ({
  cwd,
  projectPaths,
}: {
  cwd: string
  projectPaths: string[]
}) => {
  const candidateDirs = [
    ...new Set(projectPaths.map((projectPath) => path.dirname(path.join(cwd, projectPath)))),
  ].sort((left, right) => right.length - left.length)

  for (const candidateDir of candidateDirs) {
    let currentDir = candidateDir

    while (isPathInside(cwd, currentDir) && currentDir !== cwd) {
      const entries = await readdir(currentDir).catch(() => undefined)

      if (entries === undefined || entries.length > 0) {
        break
      }

      await rmdir(currentDir).catch(() => undefined)
      currentDir = path.dirname(currentDir)
    }
  }
}

const formatPlan = ({
  componentName,
  cwd,
  dryRun,
  exclusiveFiles,
  forcedModifiedFiles,
  postInstall,
  sharedFiles,
}: {
  componentName: string
  cwd: string
  dryRun: boolean
  exclusiveFiles: string[]
  forcedModifiedFiles: string[]
  postInstall: string[]
  sharedFiles: Array<{ owners: string[]; projectPath: string }>
}) => {
  const verb = dryRun ? 'would ' : ''
  const lines = [
    dryRun
      ? `payload-components: dry run for removing "${componentName}" from ${cwd}`
      : `payload-components: removing "${componentName}" from ${cwd}`,
    '',
    'Component files:',
  ]

  if (exclusiveFiles.length === 0) {
    lines.push('  none exclusively owned by this component')
  } else {
    for (const projectPath of exclusiveFiles) {
      const forceSuffix = forcedModifiedFiles.includes(projectPath)
        ? ' — local edits discarded by --force'
        : ''
      lines.push(`  ${projectPath} (${verb}delete${forceSuffix})`)
    }
  }

  for (const { owners, projectPath } of sharedFiles) {
    lines.push(`  ${projectPath} (keep — still used by ${owners.join(', ')})`)
  }

  lines.push('', 'Payload wiring:', `  ${verb}unregister the block and drop its imports`)

  lines.push('', 'Post-install commands:')

  if (postInstall.length === 0) {
    lines.push('  none')
  } else {
    for (const script of postInstall) {
      lines.push(`  ${script} (${verb}run)`)
    }
  }

  lines.push(
    '',
    'Install state:',
    `  .payload-components/state.json (${verb}drop the "${componentName}" record)`,
  )

  if (dryRun) {
    lines.push('', 'No files were changed and no commands ran.')
  }

  return lines.join('\n')
}

/* Reverse a recorded install: delete the files this component exclusively owns,
 * unwire its block, drop its state record, then regenerate types and the import
 * map so the project compiles again. Package dependencies are intentionally
 * left in place — the CLI cannot know whether other code adopted them. */
export const removeCommand = async ({
  componentName,
  cwd,
  dryRun = false,
  force = false,
}: {
  componentName: string
  cwd: string
  dryRun?: boolean
  force?: boolean
}) => {
  const manifest = await loadManifest(componentName)
  const project = await detectProject(cwd)
  const { installed, retained, targetFileHashes, unresolved } = await loadOwnership({
    componentName,
    cwd,
    manifest,
  })

  if (!installed) {
    const hasFiles = (
      await Promise.all(
        manifest.files.map((projectPath) => fileExists(path.join(cwd, projectPath))),
      )
    ).some(Boolean)
    const fragmentCheck = await verifyInstalledPayloadFragments({
      cwd,
      hostFiles: project.hostFiles,
      manifest,
    }).catch(() => undefined)
    const expectedFragments = manifest.payloadFragments.length * 2
    const hasWiring =
      fragmentCheck === undefined || fragmentCheck.missingFragments.length < expectedFragments

    if (!hasFiles && !hasWiring) {
      printHeader(`payload-components: nothing to remove for "${componentName}".`)
      return
    }

    if (!force) {
      throw new Error(
        `Component "${componentName}" is not recorded in ${cwd}, but matching files or wiring exist. Refusing to delete source with unknown ownership. Inspect it first, then re-run with --force only if those leftovers should be removed.`,
      )
    }

    printHeader(
      `payload-components: "${componentName}" is not recorded in ${cwd}. --force accepted removal of matching leftovers with unknown ownership.`,
    )
  }

  if (installed && !targetFileHashes && !force) {
    throw new Error(
      `Component "${componentName}" has no recorded source baseline for version ${installed.manifestVersion}. Refusing to delete files whose ownership cannot be verified. Copy them out first, then re-run with --force if removal is intended.`,
    )
  }

  if (unresolved.length > 0 && !force) {
    throw new Error(
      `Cannot verify shared-file ownership because these retained installs have no readable manifest or recorded file baseline: ${unresolved.join(', ')}. Refusing removal; restore their manifests or re-run with --force after reviewing the shared files.`,
    )
  }

  if (unresolved.length > 0) {
    printHeader(
      `payload-components: --force accepted incomplete shared-file ownership for: ${unresolved.join(', ')}.`,
    )
  }

  const ownedFiles = targetFileHashes ? Object.keys(targetFileHashes) : manifest.files

  const { exclusiveFiles, sharedFiles } = partitionOwnedFiles({
    files: ownedFiles,
    retainedManifests: retained,
  })
  const fileReport = targetFileHashes
    ? await compareInstalledFiles({
        baselineHashes: targetFileHashes,
        cwd,
        localized: installed?.localized === true,
        manifest: { files: ownedFiles, registryItemName: manifest.registryItemName },
      })
    : undefined
  const modifiedExclusiveFiles = (fileReport?.modified ?? []).filter((projectPath) =>
    exclusiveFiles.includes(projectPath),
  )

  if (modifiedExclusiveFiles.length > 0 && !force) {
    throw new Error(
      `Refusing to remove "${componentName}" because ${modifiedExclusiveFiles.length} exclusively owned file${modifiedExclusiveFiles.length === 1 ? '' : 's'} changed after installation: ${modifiedExclusiveFiles.join(', ')}. Copy your edits out first, or re-run with --force to delete them.`,
    )
  }

  printHeader(
    formatPlan({
      componentName,
      cwd,
      dryRun,
      exclusiveFiles,
      forcedModifiedFiles: force ? modifiedExclusiveFiles : [],
      postInstall: manifest.postInstall,
      sharedFiles,
    }),
  )

  if (dryRun) {
    return
  }

  const deletedFiles: string[] = []

  for (const projectPath of exclusiveFiles) {
    const absolutePath = path.join(cwd, projectPath)

    if (!isPathInside(cwd, absolutePath)) {
      throw new Error(
        `Refusing to delete "${projectPath}" because it resolves outside ${cwd}.`,
      )
    }

    if (await fileExists(absolutePath)) {
      deletedFiles.push(projectPath)
    }

    await rm(absolutePath, { force: true })
  }

  await pruneEmptyDirectories({ cwd, projectPaths: exclusiveFiles })

  const unwiredFiles = await removePayloadFragments(
    cwd,
    manifest.payloadFragments,
    project.hostFiles,
  )
  const changedProject = deletedFiles.length > 0 || unwiredFiles.length > 0

  /* Types and the import map only go stale when files or wiring actually
     changed. A repeat removal touches nothing, so re-running the generators
     would cost minutes of a consumer's time for no effect. */
  if (changedProject) {
    for (const script of manifest.postInstall) {
      printHeader(`payload-components: running ${script}`)

      await runPostInstallScript({
        cwd,
        packageManager: project.packageManager,
        script,
      })
    }
  }

  const wasRecorded = installed
    ? await removeRecordedState({ componentName, cwd })
    : false

  if (!changedProject && !wasRecorded) {
    printHeader(`payload-components: nothing to remove for "${componentName}".`)
    return
  }

  printHeader(
    [
      `payload-components: removed "${componentName}".`,
      `  Deleted ${deletedFiles.length} file${deletedFiles.length === 1 ? '' : 's'}, unwired ${unwiredFiles.length} host file${unwiredFiles.length === 1 ? '' : 's'}.`,
      `  Package dependencies were left installed — remove them yourself if nothing else uses them.`,
      `  Existing Page documents keep their stored block data; delete those blocks in /admin before publishing.`,
    ].join('\n'),
  )
}
