import { rm } from 'node:fs/promises'
import path from 'node:path'

import {
  checkDependencyRequirements,
  getRuntimePatchedFiles,
  installManifestDependencies,
} from '../dependencies'
import { resolveInstallPlan } from '../install-plan'
import { loadManifest } from '../manifest'
import {
  applyLocalizedFields,
  applyPayloadFragments,
  assertManifestSupport,
  detectProject,
  isBlockConfigFile,
  LOCALIZE_HELPER_FILE,
  resolveRecoveryPatchedFiles,
  verifyInstalledManifestFiles,
  verifyInstalledPayloadFragments,
} from '../project'
import { copySharedSourceFile } from '../component-files'
import { installNamespacedItem, isNamespacedItem } from '../namespaced'
import { runPostInstallScript } from '../post-install'
import { buildRegistry, installRegistryDependencies, installRegistryItem } from '../registry'
import {
  loadState,
  recordInstalledState,
  recordInstallAttempt,
  recordInstallFailure,
} from '../state'
import { getRunScriptCommand, printHeader } from '../utils'

import type {
  DetectedProject,
  InstallError,
  InstallStage,
  PayloadFragment,
  ResolvedHostFiles,
  ResolvedInstallPlan,
} from '../types'

import { seedCommand } from './seed'

const formatStageError = (error: unknown) => (error instanceof Error ? error.message : 'Unknown error')

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
  message,
  ownedFiles,
  patchedFiles,
  stage,
}: {
  componentName: string
  cwd: string
  message: string
  ownedFiles: string[]
  patchedFiles: string[]
  stage: InstallStage
}) =>
  [
    `payload-components: "${componentName}" failed during ${stage}.`,
    `Last error: ${message}`,
    'Partial state was saved to .payload-components/state.json.',
    `Safest retry: fix the error, then run "payload-components add ${componentName}" from ${cwd}.`,
    `Owned component files: ${formatFileSummary(ownedFiles)}.`,
    `Patched host files: ${formatFileSummary(patchedFiles)}.`,
    'Run "payload-components doctor" to check the install before and after retrying.',
  ].join('\n')

const formatPartialRetryNotice = ({
  componentName,
  lastError,
}: {
  componentName: string
  lastError: InstallError | null
}) => {
  const lastFailure = lastError
    ? ` Last failed stage: ${lastError.stage}. Last error: ${lastError.message}.`
    : ''

  return `payload-components: retrying partial install for "${componentName}".${lastFailure}`
}

const formatDryRunFragment = ({
  fragment,
  hostFiles,
  missingFragments,
}: {
  fragment: PayloadFragment
  hostFiles: ResolvedHostFiles
  missingFragments: string[]
}) => {
  if (fragment.kind === 'renderBlocks') {
    const needsImport = missingFragments.includes(`renderBlocks.import:${fragment.importName}`)
    const needsRegistration = missingFragments.includes(`renderBlocks.block:${fragment.blockSlug}`)

    return [
      `  ${hostFiles.renderBlocks}${needsImport || needsRegistration ? ' (would patch)' : ' (already wired)'}`,
      `    ${needsImport ? 'add' : 'keep'} import { ${fragment.importName} } from '${fragment.importPath}'`,
      `    ${needsRegistration ? 'add' : 'keep'} renderer mapping ${fragment.blockSlug}: ${fragment.importName}`,
    ]
  }

  const needsImport = missingFragments.includes(`pagesLayout.import:${fragment.importName}`)
  const needsRegistration = missingFragments.includes(`pagesLayout.block:${fragment.blockName}`)

  return [
    `  ${hostFiles.pagesLayout}${needsImport || needsRegistration ? ' (would patch)' : ' (already wired)'}`,
    `    ${needsImport ? 'add' : 'keep'} import { ${fragment.importName} } from '${fragment.importPath}'`,
    `    ${needsRegistration ? 'add' : 'keep'} ${fragment.blockName} in the Pages layout blocks`,
  ]
}

const formatDryRunPlan = ({
  cwd,
  dependencyCheck,
  fileCheck,
  fragmentCheck,
  localized,
  plan,
  project,
}: {
  cwd: string
  dependencyCheck: { missing: string[] }
  fileCheck: {
    missingFiles: string[]
    missingRegistryDependencies?: Array<{ name: string; targetFile: string }>
  }
  fragmentCheck: { missingFragments: string[] }
  localized: boolean
  plan: ResolvedInstallPlan
  project: DetectedProject
}) => {
  const missingFiles = new Set(fileCheck.missingFiles)
  const missingRegistryDependencies = new Set(
    (fileCheck.missingRegistryDependencies ?? []).map(({ targetFile }) => targetFile),
  )
  const lines = [
    `payload-components: dry run for "${plan.name}" in ${cwd}`,
    'No files will be changed, no dependencies will be installed, and no commands will run.',
    '',
    'Component files:',
    ...plan.files.map((filePath) =>
      `  ${filePath} (${missingFiles.has(filePath) ? 'would create' : 'already present'})`,
    ),
    ...plan.registryDependencies.map(({ name, targetFile }) =>
      `  ${targetFile} (${missingRegistryDependencies.has(targetFile) ? `would install registry dependency ${name}` : `registry dependency ${name} already present`})`,
    ),
    '',
    'Payload wiring:',
    ...plan.payloadFragments.flatMap((fragment) =>
      formatDryRunFragment({
        fragment,
        hostFiles: project.hostFiles,
        missingFragments: fragmentCheck.missingFragments,
      }),
    ),
    '',
    'Package dependencies:',
  ]

  if (dependencyCheck.missing.length === 0) {
    lines.push('  none')
  } else {
    for (const dependencyName of dependencyCheck.missing) {
      lines.push(
        `  ${dependencyName}@${plan.dependencies[dependencyName]} (would add to package.json and ${project.lockfilePath})`,
      )
    }
  }

  if (localized) {
    lines.push('', 'Localization:')
    lines.push(`  ${LOCALIZE_HELPER_FILE} (would create if absent)`)

    for (const filePath of plan.files.filter((candidate) => isBlockConfigFile(candidate))) {
      lines.push(`  ${filePath} (would wrap fields in localizeFields)`)
    }
  }

  lines.push('', 'Post-install commands:')

  if (plan.postInstall.length === 0) {
    lines.push('  none')
  } else {
    for (const script of plan.postInstall) {
      const command = getRunScriptCommand(project.packageManager, script)
      lines.push(`  ${command.command} ${command.args.join(' ')} (would run)`)
    }
  }

  lines.push(
    '',
    'Install state:',
    `  .payload-components/state.json (would update only after a successful real install)`,
  )

  return lines.join('\n')
}

const installComponent = async ({
  cwd,
  componentName,
  dryRun,
  localized,
}: {
  cwd: string
  componentName: string
  dryRun: boolean
  localized: boolean
}) => {
  const manifest = await loadManifest(componentName)
  const project = await detectProject(cwd)
  const plan = await resolveInstallPlan({ cwd, manifest })

  assertManifestSupport(project, manifest)

  await checkDependencyRequirements({
    allowMissing: false,
    cwd,
    dependencies: plan.peerDependencies,
    label: 'peerDependencies',
  })

  const dependencyCheck = await checkDependencyRequirements({
    allowMissing: true,
    cwd,
    dependencies: plan.dependencies,
    label: 'dependencies',
  })
  const fileCheck = await verifyInstalledManifestFiles({
    cwd,
    manifest: plan,
  })
  const fragmentCheck = await verifyInstalledPayloadFragments({
    cwd,
    hostFiles: project.hostFiles,
    manifest: plan,
  })
  const patchedFiles = getRuntimePatchedFiles({
    dependencies: plan.dependencies,
    lockfilePath: project.lockfilePath,
    recoveryPatchedFiles: resolveRecoveryPatchedFiles({
      hostFiles: project.hostFiles,
      recoveryPatchedFiles: plan.recovery.patchedFiles,
    }),
  })
  const existingState = await loadState(cwd)
  const installedEntry = existingState.components[manifest.name]
  const missingRegistryDependencies = fileCheck.missingRegistryDependencies ?? []
  const onDiskInstallValid =
    fileCheck.isValid && fragmentCheck.isValid && dependencyCheck.missing.length === 0

  if (dryRun) {
    printHeader(
      formatDryRunPlan({
        cwd,
        dependencyCheck,
        fileCheck,
        fragmentCheck,
        localized,
        plan,
        project,
      }),
    )
    return
  }

  if (
    installedEntry?.manifestVersion === manifest.version &&
    installedEntry.registryItemName === manifest.registryItemName &&
    installedEntry.status === 'installed' &&
    installedEntry.targetId === project.target.id &&
    onDiskInstallValid &&
    (!localized || installedEntry.localized === true)
  ) {
    printHeader(`payload-components: "${manifest.name}" is already installed.`)
    return
  }

  if (!installedEntry && onDiskInstallValid && !localized) {
    await recordInstalledState({
      cwd,
      manifest,
      patchedFiles,
      targetId: project.target.id,
    })

    printHeader(`payload-components: "${manifest.name}" is already present. Recorded install state.`)
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
    localized,
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
        localized,
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
          message,
          ownedFiles: plan.files,
          patchedFiles,
          stage,
        }),
      )

      throw error
    }
  }

  if (fileCheck.missingFiles.length > 0) {
    const registryOutputDir = await executeStage('registry-build', () => buildRegistry(project.packageManager))
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

  if (fileCheck.missingFiles.length === 0 && missingRegistryDependencies.length > 0) {
    await executeStage('registry-add', () =>
      installRegistryDependencies({
        dependencies: missingRegistryDependencies.map(({ name }) => name),
        packageManager: project.packageManager,
        targetDir: cwd,
      }),
    )
  }

  if (!fileCheck.isValid) {
    await executeStage('registry-add', async () => {
      const repairedFileCheck = await verifyInstalledManifestFiles({ cwd, manifest: plan })

      if (!repairedFileCheck.isValid) {
        const missing = [
          ...repairedFileCheck.missingFiles,
          ...repairedFileCheck.missingRegistryDependencies.map(({ targetFile }) => targetFile),
        ]

        throw new Error(`Registry install did not create expected files: ${missing.join(', ')}`)
      }
    })
  }

  if (dependencyCheck.missing.length > 0) {
    const missingDependencies = Object.fromEntries(
      dependencyCheck.missing.map((dependencyName) => [dependencyName, plan.dependencies[dependencyName]]),
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
      applyPayloadFragments(cwd, plan.payloadFragments, project.hostFiles),
    )
  }

  if (localized) {
    await executeStage('fragment-apply', async () => {
      await copySharedSourceFile({ cwd, projectPath: LOCALIZE_HELPER_FILE })

      const localizedFiles = await applyLocalizedFields({
        configFiles: plan.files.filter((filePath) => isBlockConfigFile(filePath)),
        cwd,
      })

      printHeader(
        localizedFiles.length > 0
          ? `payload-components: localized ${localizedFiles.join(', ')}`
          : 'payload-components: block config was already localized.',
      )
    })
  }

  for (const script of plan.postInstall) {
    printHeader(`payload-components: running ${script}`)

    await executeStage('post-install', () =>
      runPostInstallScript({
        cwd,
        packageManager: project.packageManager,
        script,
      }),
    )
  }

  await recordInstalledState({
    cwd,
    installedAt: installedEntry?.installedAt ?? undefined,
    localized: localized || installedEntry?.localized,
    manifest,
    patchedFiles,
    targetId: project.target.id,
  })

  printHeader(`payload-components: installed "${manifest.name}" successfully.`)

  const layoutFragment = plan.payloadFragments.find((fragment) => fragment.kind === 'pagesLayout')
  const blockName =
    layoutFragment && 'blockName' in layoutFragment ? layoutFragment.blockName : manifest.name

  printHeader(
    [
      `payload-components: next — use "${manifest.name}" in your Payload admin`,
      `  1. Start your project and open /admin, then edit (or create) a Page.`,
      `  2. Add the "${blockName}" block to its layout, fill the fields, and publish.`,
      ``,
      `  Walkthrough: https://www.payload-components.xyz/docs/first-block`,
    ].join('\n'),
  )
}

export const addCommand = async ({
  cwd,
  componentName,
  demo = false,
  dryRun = false,
  localized = false,
}: {
  cwd: string
  componentName: string
  demo?: boolean
  dryRun?: boolean
  localized?: boolean
}) => {
  /* `@scope/item` addresses someone else's registry. It has no manifest here, so
     none of the wrapper pipeline applies — hand it to shadcn and say plainly
     what did and did not happen. */
  if (isNamespacedItem(componentName)) {
    if (demo || localized) {
      throw new Error(
        `"${componentName}" is a third-party registry item. --demo and --localized need a payload-components manifest, which only first-party components have.`,
      )
    }

    const project = await detectProject(cwd)

    if (dryRun) {
      printHeader(
        [
          `payload-components: dry run for "${componentName}" in ${cwd}`,
          '  Would install files only, through shadcn, from the configured registry.',
          '  No Payload wiring, no install state.',
        ].join('\n'),
      )
      return
    }

    await installNamespacedItem({
      cwd,
      name: componentName,
      packageManager: project.packageManager,
    })
    return
  }

  await installComponent({ cwd, componentName, dryRun, localized })

  if (demo && !dryRun) {
    await seedCommand({ cwd, componentName })
  }
}
