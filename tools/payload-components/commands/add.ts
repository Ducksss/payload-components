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
  readPayloadLocalization,
  resolveRecoveryPatchedFiles,
  verifyInstalledManifestFiles,
  verifyInstalledPayloadFragments,
} from '../project'
import {
  compareInstalledFiles,
  copySharedSourceFile,
  resolveRecordedFileHashes,
} from '../component-files'
import { installNamespacedItem, isNamespacedItem } from '../namespaced'
import { runPostInstallScript } from '../post-install'
import { buildRegistry, installRegistryDependencies, installRegistryItem } from '../registry'
import { readSafeProjectFile } from '../safe-path'
import {
  loadState,
  recordInstalledState,
  recordInstallAttempt,
  recordInstallFailure,
} from '../state'
import { getRunScriptCommand, printHeader } from '../utils'

import { getPayloadConfigFile } from './seed'

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
  localesDeclared,
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
  localesDeclared: boolean
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

    if (!localesDeclared) {
      lines.push(
        '  note: your Payload config declares no locales, so this alone changes nothing —',
        '        run "payload-components localize --locales en,zh" to declare them',
      )
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

/* What the project's Payload config says about locales, or undefined when there
   is no config to read. */
const readDeclaredLocales = async ({ cwd, project }: { cwd: string; project: DetectedProject }) => {
  const configFileRelPath = await getPayloadConfigFile(project).catch(() => undefined)

  if (!configFileRelPath) {
    return undefined
  }

  const configSource = await readSafeProjectFile({
    cwd,
    filePath: path.join(cwd, configFileRelPath),
  }).catch(() => undefined)

  if (configSource === undefined) {
    return undefined
  }

  return { configFileRelPath, declared: readPayloadLocalization(configSource) }
}

/* An unreadable config file is not this command's business to second-guess. A
   readable config with no localization property plainly has no locales; a
   localization object that computes them at runtime does. */
const hasDeclaredLocales = async (options: { cwd: string; project: DetectedProject }) => {
  const read = await readDeclaredLocales(options)

  if (!read) {
    return true
  }

  return (
    read.declared !== undefined &&
    (read.declared.locales.length > 0 || !read.declared.localesEnumerable)
  )
}

/* `localized: true` is inert until the Payload config declares locales, and
   nothing about the install itself reveals that. Say so at the moment the wrap
   lands, and name the command that fixes it. Reporting only — a config we cannot
   read is not a reason to fail an otherwise clean install. */
export const warnWhenNoLocalesDeclared = async (options: {
  cwd: string
  project: DetectedProject
}) => {
  const read = await readDeclaredLocales(options)

  if (!read || (await hasDeclaredLocales(options))) {
    return
  }

  printHeader(
    [
      `payload-components: ${read.configFileRelPath} does not declare any locales, so localized: true has no effect yet.`,
      '  Declare them with:',
      '    payload-components localize --locales en,zh',
    ].join('\n'),
  )
}

const installComponent = async ({
  acceptLocalizationPolicyChange,
  cwd,
  componentName,
  deferLocaleNotice,
  dryRun,
  localized,
}: {
  acceptLocalizationPolicyChange: boolean
  cwd: string
  componentName: string
  /* Set by a caller installing several blocks at once, which reports the locale
     situation itself rather than repeating it per block. */
  deferLocaleNotice: boolean
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
  const effectiveLocalized = localized || installedEntry?.localized === true

  if (
    installedEntry?.localized === true &&
    installedEntry.localizationPolicy !== 'semantic-v1' &&
    !acceptLocalizationPolicyChange
  ) {
    throw new Error(
      `Component "${manifest.name}" uses the legacy type-inferred localization policy. Repair it through "payload-components update ${manifest.name} --accept-localization-policy-change" after migrating stored operational values; plain add cannot silently change that schema.`,
    )
  }
  const missingRegistryDependencies = fileCheck.missingRegistryDependencies ?? []
  const onDiskInstallValid =
    fileCheck.isValid && fragmentCheck.isValid && dependencyCheck.missing.length === 0

  /* Converting an existing install must not bless a consumer-edited config as
   * the new clean baseline. `localize --force` is the explicit path for that. */
  if (localized && installedEntry && installedEntry.localized !== true) {
    const baselineHashes = await resolveRecordedFileHashes({
      componentName: manifest.name,
      installed: installedEntry,
      manifest,
    })

    if (!baselineHashes) {
      throw new Error(
        `Refusing to localize "${manifest.name}" because its recorded source baseline is unavailable. Inspect the block config, then run "payload-components localize ${manifest.name} --force" only if those bytes should become the new baseline.`,
      )
    }

    const configFiles = plan.files.filter((filePath) => isBlockConfigFile(filePath))
    const fileReport = await compareInstalledFiles({
      baselineHashes,
      cwd,
      manifest: { files: configFiles, registryItemName: manifest.registryItemName },
    })

    if (fileReport.modified.length > 0) {
      throw new Error(
        `Refusing to localize "${manifest.name}" because its block config changed after installation: ${fileReport.modified.join(', ')}. Run "payload-components localize ${manifest.name} --force" to accept and wrap those edits, or restore them first.`,
      )
    }
  }

  if (dryRun) {
    printHeader(
      formatDryRunPlan({
        cwd,
        dependencyCheck,
        fileCheck,
        fragmentCheck,
        localesDeclared: effectiveLocalized ? await hasDeclaredLocales({ cwd, project }) : true,
        localized: effectiveLocalized,
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

  if (!installedEntry && onDiskInstallValid && !effectiveLocalized) {
    await recordInstalledState({
      cwd,
      manifest,
      patchedFiles,
      rewrittenFiles: [],
      targetId: project.target.id,
    })

    printHeader(`payload-components: "${manifest.name}" is already present. Recorded install state.`)
    return
  }

  printHeader(`payload-components: installing "${manifest.name}" into ${cwd}`)
  const rewrittenFiles = new Set(fileCheck.missingFiles)

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
    localized: effectiveLocalized,
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
        localized: effectiveLocalized,
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

  if (effectiveLocalized) {
    await executeStage('fragment-apply', async () => {
      await copySharedSourceFile({ cwd, projectPath: LOCALIZE_HELPER_FILE })

      const localizedFiles = await applyLocalizedFields({
        configFiles: plan.files.filter((filePath) => isBlockConfigFile(filePath)),
        cwd,
      })

      for (const filePath of localizedFiles) {
        rewrittenFiles.add(filePath)
      }

      printHeader(
        localizedFiles.length > 0
          ? `payload-components: localized ${localizedFiles.join(', ')}`
          : 'payload-components: block config was already localized.',
      )

      if (!deferLocaleNotice) {
        await warnWhenNoLocalesDeclared({ cwd, project })
      }
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
    localized: effectiveLocalized,
    manifest,
    patchedFiles,
    rewrittenFiles: [...rewrittenFiles],
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
  acceptLocalizationPolicyChange = false,
  cwd,
  componentName,
  deferLocaleNotice = false,
  demo = false,
  dryRun = false,
  localized = false,
}: {
  /* Internal update hand-off after the operator accepted semantic-v1. */
  acceptLocalizationPolicyChange?: boolean
  cwd: string
  componentName: string
  /* For callers installing a whole set — see installComponent. */
  deferLocaleNotice?: boolean
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

  await installComponent({
    acceptLocalizationPolicyChange,
    cwd,
    componentName,
    deferLocaleNotice,
    dryRun,
    localized,
  })

  if (demo && !dryRun) {
    await seedCommand({ cwd, componentName })
  }
}
