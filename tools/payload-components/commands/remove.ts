import { access, readdir, rm, rmdir } from 'node:fs/promises'
import path from 'node:path'

import { partitionOwnedFiles } from '../component-files'
import { loadManifest } from '../manifest'
import { runPostInstallScript } from '../post-install'
import { detectProject, removePayloadFragments } from '../project'
import { loadState, removeRecordedState } from '../state'
import { isPathInside, printHeader } from '../utils'

import type { ComponentManifest } from '../types'

const fileExists = async (absolutePath: string) => {
  try {
    await access(absolutePath)
    return true
  } catch {
    return false
  }
}

/* Load the manifests of everything that stays recorded, so shared family files
 * are never deleted out from under a sibling variant. A recorded component
 * whose manifest has since disappeared is skipped rather than fatal — removal
 * must still work against an older state file. */
const loadRetainedManifests = async ({
  componentName,
  cwd,
}: {
  componentName: string
  cwd: string
}) => {
  const state = await loadState(cwd)
  const retainedNames = Object.keys(state.components).filter((name) => name !== componentName)
  const manifests: ComponentManifest[] = []

  for (const name of retainedNames) {
    const manifest = await loadManifest(name).catch(() => undefined)

    if (manifest) {
      manifests.push(manifest)
    }
  }

  return { isRecorded: Boolean(state.components[componentName]), manifests }
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
  postInstall,
  sharedFiles,
}: {
  componentName: string
  cwd: string
  dryRun: boolean
  exclusiveFiles: string[]
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
      lines.push(`  ${projectPath} (${verb}delete)`)
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
}: {
  componentName: string
  cwd: string
  dryRun?: boolean
}) => {
  const manifest = await loadManifest(componentName)
  const project = await detectProject(cwd)
  const { isRecorded, manifests: retainedManifests } = await loadRetainedManifests({
    componentName,
    cwd,
  })

  if (!isRecorded) {
    printHeader(
      `payload-components: "${componentName}" is not recorded in ${cwd}. Removing any leftover files and wiring anyway.`,
    )
  }

  const { exclusiveFiles, sharedFiles } = partitionOwnedFiles({
    files: manifest.files,
    retainedManifests,
  })

  printHeader(
    formatPlan({
      componentName,
      cwd,
      dryRun,
      exclusiveFiles,
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

  const wasRecorded = await removeRecordedState({ componentName, cwd })

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
