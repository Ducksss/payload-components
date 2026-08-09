import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

import { checkDependencyRequirements } from '../dependencies'
import { resolveInstallPlan } from '../install-plan'
import { loadManifest } from '../manifest'
import {
  assertManifestSupport,
  detectProject,
  verifyInstalledManifestFiles,
  verifyInstalledPayloadFragments,
} from '../project'
import { loadState } from '../state'
import { repoRoot } from '../utils'

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
  JSON.parse(await readFile(path.join(cwd, 'package.json'), 'utf8')) as PackageJson

const checkPostInstallScripts = async (cwd: string, manifests: ComponentManifest[], log: Log) => {
  const packageJson = await readPackageJson(cwd)
  const scripts = packageJson.scripts ?? {}
  const requiredScripts = [
    ...new Set(manifests.flatMap((manifest) => manifest.postInstall)),
  ].sort()
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
    log('warn', `Run "payload-components add ${componentName}" to retry the install.`, componentName)
    return false
  }

  if (entry.status === 'partial') {
    isHealthy = false
    const errorSuffix = entry.lastError
      ? ` (${entry.lastError.stage}: ${entry.lastError.message})`
      : ''

    log('error', `${componentName}: install is partial${errorSuffix}`, componentName)
    log('warn', `${componentName}: owned component files ${formatRecordedFiles(manifest.files)}`, componentName)
    log('warn', `${componentName}: patched host files ${formatRecordedFiles(entry.patchedFiles)}`, componentName)
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
    log('error', `${componentName}: missing files ${formatList(fileCheck.missingFiles)}`, componentName)
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
    log('warn', `Run "payload-components add ${componentName}" to retry the install.`, componentName)
  }

  return isHealthy
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

  process.stdout.write(json ? `${JSON.stringify(report, null, 2)}\n` : renderText(report))

  return exitCode
}
