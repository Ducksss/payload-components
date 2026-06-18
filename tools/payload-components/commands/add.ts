import { rm } from 'node:fs/promises'
import path from 'node:path'

import {
  checkDependencyRequirements,
  getRuntimePatchedFiles,
  installManifestDependencies,
} from '../dependencies'
import { loadManifest } from '../manifest'
import {
  applyPayloadFragments,
  assertManifestSupport,
  detectProject,
  verifyInstalledManifestFiles,
  verifyInstalledPayloadFragments,
} from '../project'
import { buildRegistry, installRegistryItem } from '../registry'
import {
  loadState,
  recordInstalledState,
  recordInstallAttempt,
  recordInstallFailure,
} from '../state'
import { getRunScriptCommand, printHeader, runCommand } from '../utils'

import type { InstallStage } from '../types'

const postInstallEnv = {
  ...process.env,
  CRON_SECRET: process.env.CRON_SECRET ?? 'payload-components-poc-cron-secret',
  NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000',
  PAYLOAD_SECRET: process.env.PAYLOAD_SECRET ?? 'payload-components-poc-secret',
  POSTGRES_URL: process.env.POSTGRES_URL ?? 'postgres://127.0.0.1:5432/payload-components-poc',
  PREVIEW_SECRET: process.env.PREVIEW_SECRET ?? 'payload-components-poc-preview-secret',
}

const normalizeFileList = (files: string[]) => [...new Set(files)].sort()

const formatStageError = (error: unknown) =>
  error instanceof Error ? error.message : 'Unknown error'

const formatFileSummary = (files: string[]) => {
  if (files.length === 0) {
    return 'none recorded'
  }

  const visibleFiles = files.slice(0, 4)
  const suffix =
    files.length > visibleFiles.length ? ` and ${files.length - visibleFiles.length} more` : ''

  return `${visibleFiles.join(', ')}${suffix}`
}

const formatRetryGuidance = ({
  componentName,
  cwd,
  installedFiles,
  message,
  patchedFiles,
  stage,
}: {
  componentName: string
  cwd: string
  installedFiles: string[]
  message: string
  patchedFiles: string[]
  stage: InstallStage
}) =>
  [
    `payload-components: "${componentName}" failed during ${stage}.`,
    `Last error: ${message}`,
    'Partial state was saved to .payload-components/state.json.',
    `Safest retry: fix the error, then run "payload-components add ${componentName}" from ${cwd}.`,
    `Owned component files recorded: ${formatFileSummary(installedFiles)}.`,
    `Patched host files recorded: ${formatFileSummary(patchedFiles)}.`,
    `Run "payload-components doctor" to check the install before and after retrying.`,
  ].join('\n')

const formatPartialRetryNotice = ({
  componentName,
  lastError,
}: {
  componentName: string
  lastError: { message: string; stage: InstallStage } | null
}) => {
  const lastFailure = lastError
    ? ` Last failed stage: ${lastError.stage}. Last error: ${lastError.message}.`
    : ''

  return `payload-components: retrying partial install for "${componentName}".${lastFailure}`
}

export const addCommand = async ({
  cwd,
  componentName,
}: {
  cwd: string
  componentName: string
}) => {
  const manifest = await loadManifest(componentName)
  const project = await detectProject(cwd)

  assertManifestSupport(project, manifest)

  await checkDependencyRequirements({
    allowMissing: false,
    cwd,
    dependencies: manifest.peerDependencies,
    label: 'peerDependencies',
  })

  const dependencyCheck = await checkDependencyRequirements({
    allowMissing: true,
    cwd,
    dependencies: manifest.dependencies,
    label: 'dependencies',
  })
  const fileCheck = await verifyInstalledManifestFiles({
    cwd,
    manifest,
  })
  const fragmentCheck = await verifyInstalledPayloadFragments({
    cwd,
    manifest,
  })
  const installedFiles = normalizeFileList([...manifest.files])
  const patchedFiles = getRuntimePatchedFiles({
    dependencies: manifest.dependencies,
    packageManager: project.packageManager,
    recoveryPatchedFiles: manifest.recovery.patchedFiles,
  })
  const existingState = await loadState(cwd)
  const installedEntry = existingState.components[manifest.name]
  const onDiskInstallValid =
    fileCheck.isValid && fragmentCheck.isValid && dependencyCheck.missing.length === 0

  if (
    installedEntry?.manifestVersion === manifest.version &&
    installedEntry.registryItemName === manifest.registryItemName &&
    installedEntry.status === 'installed' &&
    installedEntry.targetId === project.target.id &&
    onDiskInstallValid
  ) {
    printHeader(`payload-components: "${manifest.name}" is already installed.`)
    return
  }

  if (!installedEntry && onDiskInstallValid) {
    await recordInstalledState({
      cwd,
      installedFiles,
      manifest,
      patchedFiles,
      targetId: project.target.id,
    })

    printHeader(
      `payload-components: "${manifest.name}" is already present. Recorded alpha install state.`,
    )
    return
  }

  printHeader(`payload-components: installing "${manifest.name}" into ${cwd}`)

  if (installedEntry?.status === 'partial') {
    printHeader(
      formatPartialRetryNotice({
        componentName: manifest.name,
        lastError: installedEntry.lastError,
      }),
    )
  }

  await recordInstallAttempt({
    cwd,
    installedFiles,
    manifest,
    patchedFiles,
    targetId: project.target.id,
  })

  const executeStage = async <T>(stage: InstallStage, action: () => Promise<T>) => {
    try {
      return await action()
    } catch (error) {
      const message = formatStageError(error)

      await recordInstallFailure({
        cwd,
        installedFiles,
        manifest,
        patchedFiles,
        stage,
        targetId: project.target.id,
        message,
      })

      printHeader(
        formatRetryGuidance({
          componentName: manifest.name,
          cwd,
          installedFiles,
          message,
          patchedFiles,
          stage,
        }),
      )

      throw error
    }
  }

  if (!fileCheck.isValid) {
    const registryOutputDir = await executeStage('registry-build', () =>
      buildRegistry(project.packageManager),
    )
    const registryItemPath = path.join(registryOutputDir, `${manifest.registryItemName}.json`)

    try {
      await executeStage('registry-add', () =>
        installRegistryItem({
          itemFilePath: registryItemPath,
          packageManager: project.packageManager,
          targetDir: cwd,
        }),
      )
    } finally {
      await rm(registryOutputDir, { force: true, recursive: true })
    }
  }

  if (dependencyCheck.missing.length > 0) {
    const missingDependencies = Object.fromEntries(
      dependencyCheck.missing.map((dependencyName) => [
        dependencyName,
        manifest.dependencies[dependencyName],
      ]),
    )

    await executeStage('dependency-install', () =>
      installManifestDependencies({
        cwd,
        dependencies: missingDependencies,
        packageManager: project.packageManager,
      }),
    )
  }

  if (!fragmentCheck.isValid) {
    await executeStage('fragment-apply', () =>
      applyPayloadFragments(cwd, manifest.payloadFragments),
    )
  }

  for (const script of manifest.postInstall) {
    const command = getRunScriptCommand(project.packageManager, script)

    printHeader(`payload-components: running ${script}`)

    await executeStage('post-install', () =>
      runCommand({
        args: command.args,
        command: command.command,
        cwd,
        env: postInstallEnv,
      }),
    )
  }

  await recordInstalledState({
    cwd,
    installedAt: installedEntry?.installedAt ?? undefined,
    installedFiles,
    manifest,
    patchedFiles,
    targetId: project.target.id,
  })

  printHeader(`payload-components: installed "${manifest.name}" successfully.`)
}
