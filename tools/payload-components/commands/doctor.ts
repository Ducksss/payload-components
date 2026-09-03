import { readdir } from 'node:fs/promises'
import path from 'node:path'

import { checkDependencyRequirements } from '../dependencies'
import { writeCommandOutput } from '../command-output'
import { BASE_BUNDLE_DEPENDENCIES, inspectBaseBundle } from '../base-bundle'
import { resolveInstallPlan } from '../install-plan'
import { loadManifest } from '../manifest'
import { formatLocaleList, resolveLocales } from '../locales'
import {
  assertManifestSupport,
  detectProject,
  readPayloadLocalization,
  verifyInstalledManifestFiles,
  verifyInstalledPayloadFragments,
  LOCALIZE_HELPER_FILE,
} from '../project'
import { loadState } from '../state'
import { readSafeProjectFile, safeProjectFileExists } from '../safe-path'
import { repoRoot } from '../utils'

import { getPayloadConfigFile } from './seed'

import type {
  ComponentManifest,
  DetectedProject,
  InstallStateEntry,
  ResolvedHostFiles,
} from '../types'

const manifestsDir = path.join(repoRoot, 'payload-components', 'manifests')

type PackageJson = {
  scripts?: Record<string, string>
}

export type DoctorStatus = 'error' | 'ok' | 'warn'

export type DoctorFinding = {
  message: string
  /* 'project' | 'scripts' | 'state' for environment checks, otherwise the
     component name — so JSON consumers can group without parsing messages. */
  scope: string
  status: DoctorStatus
}

/* 0 healthy · 1 a recorded install needs attention · 2 the project itself cannot
   accept installs. Distinct codes let CI tell "your repo is wrong" apart from
   "one component drifted", which need different responses. */
export type DoctorExitCode = 0 | 1 | 2

export type DoctorReport = {
  components: Array<{ healthy: boolean; name: string }>
  exitCode: DoctorExitCode
  findings: DoctorFinding[]
  healthy: boolean
}

const PROJECT_SCOPES = new Set(['project', 'scripts', 'state'])

/* Findings are collected rather than printed as they happen so the same run can
   render either the human report or JSON. Emission order is preserved, so the
   text rendering is byte-identical to what this command has always printed. */
const createFindings = () => {
  const findings: DoctorFinding[] = []

  return {
    findings,
    log: (status: DoctorStatus, message: string, scope = 'project') => {
      findings.push({ message, scope, status })
    },
  }
}

type Log = ReturnType<typeof createFindings>['log']

const renderText = (report: DoctorReport) =>
  report.findings.map(({ message, status }) => `[${status}] ${message}\n`).join('')

const resolveExitCode = (findings: DoctorFinding[]): DoctorExitCode => {
  const errors = findings.filter(({ status }) => status === 'error')

  if (errors.some(({ scope }) => PROJECT_SCOPES.has(scope))) {
    return 2
  }

  return errors.length > 0 ? 1 : 0
}

const formatList = (values: string[]) => values.join(', ')

const formatRecordedFiles = (values: string[]) =>
  values.length > 0 ? formatList(values) : 'none recorded'

const loadKnownManifests = async () => {
  const files = await readdir(manifestsDir)
  const names = files
    .filter((file) => file.endsWith('.json'))
    .map((file) => file.replace(/\.json$/, ''))
    .sort()

  return await Promise.all(names.map((name) => loadManifest(name)))
}

const readPackageJson = async (cwd: string) =>
  JSON.parse(
    await readSafeProjectFile({ cwd, filePath: path.join(cwd, 'package.json') }),
  ) as PackageJson

const checkPostInstallScripts = async (cwd: string, manifests: ComponentManifest[], log: Log) => {
  const packageJson = await readPackageJson(cwd)
  const scripts = packageJson.scripts ?? {}
  const requiredScripts = [...new Set(manifests.flatMap((manifest) => manifest.postInstall))].sort()
  let isHealthy = true

  for (const script of requiredScripts) {
    if (scripts[script]) {
      log('ok', `scripts: ${script}`, 'scripts')
      continue
    }

    isHealthy = false
    log('error', `scripts: missing ${script}`, 'scripts')
  }

  return isHealthy
}

const checkRecordedComponent = async ({
  componentName,
  cwd,
  hostFiles,
  log,
  manifest,
  targetId,
  entry,
}: {
  componentName: string
  cwd: string
  hostFiles: ResolvedHostFiles
  log: Log
  manifest: ComponentManifest
  targetId: string
  entry: InstallStateEntry
}) => {
  let isHealthy = true
  let plan: Awaited<ReturnType<typeof resolveInstallPlan>>

  try {
    plan = await resolveInstallPlan({ cwd, manifest })
  } catch (error) {
    log(
      'error',
      `${componentName}: ${error instanceof Error ? error.message : 'failed to resolve install plan'}`,
      componentName,
    )
    log(
      'warn',
      `Run "payload-components add ${componentName}" to retry the install.`,
      componentName,
    )
    return false
  }

  if (entry.status === 'partial') {
    isHealthy = false
    const errorSuffix = entry.lastError
      ? ` (${entry.lastError.stage}: ${entry.lastError.message})`
      : ''

    log('error', `${componentName}: install is partial${errorSuffix}`, componentName)
    log(
      'warn',
      `${componentName}: owned component files ${formatRecordedFiles(manifest.files)}`,
      componentName,
    )
    log(
      'warn',
      `${componentName}: patched host files ${formatRecordedFiles(entry.patchedFiles)}`,
      componentName,
    )
  }

  if (entry.manifestVersion !== manifest.version) {
    isHealthy = false
    log(
      'error',
      `${componentName}: state has manifest ${entry.manifestVersion}, current manifest is ${manifest.version}`,
      componentName,
    )
  }

  if (entry.registryItemName !== manifest.registryItemName) {
    isHealthy = false
    log(
      'error',
      `${componentName}: state has registry item ${entry.registryItemName}, manifest expects ${manifest.registryItemName}`,
      componentName,
    )
  }

  if (entry.targetId !== targetId) {
    isHealthy = false
    log(
      'error',
      `${componentName}: state target ${entry.targetId}, detected target is ${targetId}`,
      componentName,
    )
  }

  try {
    await checkDependencyRequirements({
      allowMissing: false,
      cwd,
      dependencies: plan.peerDependencies,
      label: 'peerDependencies',
    })
    log('ok', `${componentName}: peer dependencies`, componentName)
  } catch (error) {
    isHealthy = false
    log(
      'error',
      `${componentName}: ${error instanceof Error ? error.message : 'peer dependency check failed'}`,
      componentName,
    )
  }

  try {
    const dependencyCheck = await checkDependencyRequirements({
      allowMissing: true,
      cwd,
      dependencies: plan.dependencies,
      label: 'dependencies',
    })

    if (dependencyCheck.missing.length > 0) {
      isHealthy = false
      log(
        'error',
        `${componentName}: missing dependencies ${formatList(dependencyCheck.missing)}`,
        componentName,
      )
    } else {
      log('ok', `${componentName}: dependencies`, componentName)
    }
  } catch (error) {
    isHealthy = false
    log(
      'error',
      `${componentName}: ${error instanceof Error ? error.message : 'dependency check failed'}`,
      componentName,
    )
  }

  const fileCheck = await verifyInstalledManifestFiles({ cwd, manifest: plan })

  if (fileCheck.missingFiles.length === 0) {
    log('ok', `${componentName}: files`, componentName)
  } else {
    isHealthy = false
    log(
      'error',
      `${componentName}: missing files ${formatList(fileCheck.missingFiles)}`,
      componentName,
    )
  }

  if (fileCheck.missingRegistryDependencies.length > 0) {
    isHealthy = false
    log(
      'error',
      `${componentName}: missing registry dependencies ${fileCheck.missingRegistryDependencies
        .map(({ name, targetFile }) => `${name} (${targetFile})`)
        .join(', ')}`,
      componentName,
    )
  } else {
    log('ok', `${componentName}: registry dependencies`, componentName)
  }

  const fragmentCheck = await verifyInstalledPayloadFragments({ cwd, hostFiles, manifest: plan })

  if (fragmentCheck.isValid) {
    log('ok', `${componentName}: Payload fragments`, componentName)
  } else {
    isHealthy = false
    log(
      'error',
      `${componentName}: missing Payload fragments ${formatList(fragmentCheck.missingFragments)}`,
      componentName,
    )
  }

  if (!isHealthy) {
    log(
      'warn',
      `Run "payload-components add ${componentName}" to retry the install.`,
      componentName,
    )
  }

  return isHealthy
}

/* Internationalization only works when both halves agree: the config declares
   locales, and installed blocks mark their text localized. Each half is silently
   inert without the other, which is exactly the class of misconfiguration a
   doctor should name. Never an error — a project with no localization at all is
   perfectly healthy, and one that is half-configured still installs fine. */
const checkLocalization = async ({
  cwd,
  log,
  project,
  state,
}: {
  cwd: string
  log: Log
  project: DetectedProject
  state: Awaited<ReturnType<typeof loadState>>
}) => {
  const recorded = Object.entries(state.components)
  const localized = recorded.filter(([, entry]) => entry.localized === true).map(([name]) => name)
  const unlocalized = recorded.filter(([, entry]) => entry.localized !== true).map(([name]) => name)

  if (localized.length > 0) {
    const helperPresent = await safeProjectFileExists({
      cwd,
      filePath: path.join(cwd, LOCALIZE_HELPER_FILE),
    })

    if (!helperPresent) {
      log(
        'error',
        `localization: missing ${LOCALIZE_HELPER_FILE}, required by ${localized.join(', ')} — run "payload-components update ${localized[0]}" to restore it`,
        'localization',
      )
    }
  }

  const configFileRelPath = await getPayloadConfigFile(project).catch(() => undefined)

  if (!configFileRelPath) {
    return
  }

  const source = await readSafeProjectFile({
    cwd,
    filePath: path.join(cwd, configFileRelPath),
  }).catch(() => undefined)

  if (source === undefined) {
    return
  }

  const declared = readPayloadLocalization(source)
  const warnForUnlocalizedComponents = () => {
    for (const componentName of unlocalized) {
      log(
        'warn',
        `localization: ${componentName} does not mark its text localized, so every locale stores the same copy — run "payload-components localize ${componentName}"`,
        'localization',
      )
    }
  }

  if (!declared) {
    log(
      localized.length > 0 ? 'warn' : 'ok',
      localized.length > 0
        ? `localization: ${localized.join(', ')} ${localized.length === 1 ? 'marks its' : 'mark their'} text localized, but ${configFileRelPath} declares no locales — run "payload-components localize --locales en,zh"`
        : 'localization: not configured',
      'localization',
    )
    return
  }

  if (declared.disabled) {
    log(
      localized.length > 0 ? 'warn' : 'ok',
      localized.length > 0
        ? `localization: ${configFileRelPath} sets localization: false, so localized text in ${localized.join(', ')} has no effect`
        : `localization: disabled in ${configFileRelPath}`,
      'localization',
    )
    return
  }

  if (declared.localesStatus === 'computed') {
    log(
      'ok',
      `localization: enabled in ${configFileRelPath} (locales resolved at runtime)`,
      'localization',
    )
    warnForUnlocalizedComponents()
    return
  }

  if (declared.localesStatus === 'absent') {
    log(
      'warn',
      `localization: ${configFileRelPath} declares localization but no locales — Payload needs at least one locale`,
      'localization',
    )
    return
  }

  /* Payload v3 requires both `locales` and `defaultLocale`. A config missing
     either is one Payload rejects, so name the missing half rather than
     reporting a healthy locale count around the hole. */
  if (declared.locales.length === 0) {
    log(
      'warn',
      `localization: ${configFileRelPath} declares an empty locales array — Payload needs at least one locale`,
      'localization',
    )
    return
  }

  /* Labels only — the default locale is validated separately below rather than
     through resolveLocales, so a config Payload would reject is reported instead
     of throwing out of the whole doctor run. */
  const { locales } = resolveLocales({ codes: declared.locales })

  log(
    'ok',
    `localization: ${locales.length} locale${locales.length === 1 ? '' : 's'} — ${formatLocaleList(locales)}${
      declared.defaultLocale
        ? `, default ${declared.defaultLocale}`
        : declared.defaultLocaleStatus === 'computed'
          ? ', default resolved at runtime'
          : ''
    }`,
    'localization',
  )

  if (declared.defaultLocaleStatus === 'absent') {
    log(
      'warn',
      `localization: ${configFileRelPath} declares locales but no defaultLocale — Payload requires one`,
      'localization',
    )
  } else if (
    declared.defaultLocaleStatus === 'literal' &&
    declared.defaultLocale &&
    !declared.locales.includes(declared.defaultLocale)
  ) {
    log(
      'warn',
      `localization: defaultLocale "${declared.defaultLocale}" is not one of the locales ${configFileRelPath} declares — Payload requires it to be`,
      'localization',
    )
  }

  warnForUnlocalizedComponents()
}

const logProjectSummary = (project: DetectedProject, log: Log) => {
  log(
    'ok',
    `project: ${project.target.id} (Payload ${project.payloadMajor}, Next ${project.nextMajor}, ${project.packageManager})`,
  )
  log('ok', `wiring: ${project.hostFiles.renderBlocks} + ${project.hostFiles.pagesLayout}`)
}

const inspectProject = async ({
  components,
  cwd,
  log,
}: {
  components: DoctorReport['components']
  cwd: string
  log: Log
}) => {
  try {
    const [project, manifests] = await Promise.all([detectProject(cwd), loadKnownManifests()])

    logProjectSummary(project, log)

    for (const manifest of manifests) {
      try {
        assertManifestSupport(project, manifest)
      } catch (error) {
        log(
          'error',
          `${manifest.name}: ${error instanceof Error ? error.message : 'unsupported manifest'}`,
          manifest.name,
        )
      }
    }

    await checkPostInstallScripts(cwd, manifests, log)

    const state = await loadState(cwd).catch((error) => {
      log('error', `state: ${error instanceof Error ? error.message : 'Unknown error'}`, 'state')
      return undefined
    })

    if (!state) {
      return
    }

    await checkLocalization({ cwd, log, project, state })

    if (state.base) {
      const base = await inspectBaseBundle({ cwd, installed: state.base })
      const baseDependencies = await checkDependencyRequirements({
        allowMissing: true,
        cwd,
        dependencies: BASE_BUNDLE_DEPENDENCIES,
        label: 'dependencies',
      }).catch((error) => {
        log(
          'error',
          `starter base: ${error instanceof Error ? error.message : 'dependency check failed'}`,
          'base',
        )
        return undefined
      })

      if (base.isClean) {
        log('ok', 'starter base: managed files are current', 'base')
      } else {
        if (base.updateAvailable) {
          log(
            'error',
            'starter base: a newer managed base ships with this CLI — run "payload-components init --scaffold"',
            'base',
          )
        }

        if (base.modifiedFiles.length > 0) {
          log(
            'error',
            `starter base: locally modified managed files ${formatList(base.modifiedFiles)} — review them, then keep them or run "payload-components init --scaffold --force"`,
            'base',
          )
        }

        if (base.missingFiles.length > 0) {
          log(
            'error',
            `starter base: missing managed files ${formatList(base.missingFiles)} — run "payload-components init --scaffold"`,
            'base',
          )
        }
      }

      if (baseDependencies && baseDependencies.missing.length > 0) {
        log(
          'error',
          `starter base: missing dependencies ${formatList(baseDependencies.missing)} — run "payload-components init --scaffold"`,
          'base',
        )
      }
    }

    const entries = Object.entries(state.components)

    if (entries.length === 0) {
      log('ok', 'state: no recorded components', 'state')
      return
    }

    log(
      'ok',
      `state: ${entries.length} recorded component${entries.length === 1 ? '' : 's'}`,
      'state',
    )

    for (const [componentName, entry] of entries) {
      const manifest = manifests.find((candidate) => candidate.name === componentName)

      if (!manifest) {
        log('error', `${componentName}: no matching manifest`, componentName)
        components.push({ healthy: false, name: componentName })
        continue
      }

      components.push({
        healthy: await checkRecordedComponent({
          componentName,
          cwd,
          entry,
          hostFiles: project.hostFiles,
          log,
          manifest,
          targetId: project.target.id,
        }),
        name: componentName,
      })
    }
  } catch (error) {
    log('error', `project: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export const doctorCommand = async ({
  cwd,
  json = false,
}: {
  cwd: string
  json?: boolean
}): Promise<DoctorExitCode> => {
  const components: DoctorReport['components'] = []
  const { findings, log } = createFindings()

  await inspectProject({ components, cwd, log })

  const exitCode = resolveExitCode(findings)
  const report: DoctorReport = { components, exitCode, findings, healthy: exitCode === 0 }

  writeCommandOutput(json ? `${JSON.stringify(report, null, 2)}\n` : renderText(report))

  return exitCode
}
