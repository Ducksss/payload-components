import { checkDependencyRequirements } from '../dependencies'
import { listManifestNames, loadManifest } from '../manifest'
import {
  detectProject,
  verifyInstalledManifestFiles,
  verifyInstalledPayloadFragments,
} from '../project'
import { loadState } from '../state'

import type { DetectedProject, InstallStateEntry, KitManifest } from '../types'

type FileCheck = {
  isValid: boolean
  missingFiles: string[]
}

type FragmentCheck = {
  isValid: boolean
  missingFragments: string[]
}

type DependencyCheck = {
  missing: string[]
}

export type DoctorSeverity = 'healthy' | 'info' | 'recoverable' | 'fatal'

export type DoctorStatus =
  | 'healthy'
  | 'missing-dependencies'
  | 'missing-files'
  | 'missing-payload-registration'
  | 'not-installed'
  | 'partial'
  | 'shadcn-only'
  | 'stale-state'
  | 'unsupported-project'

export type DoctorFinding = {
  actions: string[]
  details: string[]
  kitName: string
  severity: DoctorSeverity
  status: DoctorStatus
  summary: string
}

export type DoctorReport = {
  exitCode: 0 | 1 | 2
  findings: DoctorFinding[]
  project:
    | {
        cwd: string
        nextMajor: number
        payloadMajor: number
        supported: true
        targetId: string
      }
    | {
        cwd: string
        error: string
        supported: false
      }
}

const installCommand = (kitName: string) => `pnpm dlx payload-kit add ${kitName}`
const directCommand = (kitName: string) =>
  `pnpm dlx shadcn@latest add https://payload-components.xyz/r/${kitName}.json`

const hasVersionDrift = ({
  manifest,
  project,
  stateEntry,
}: {
  manifest: KitManifest
  project: DetectedProject
  stateEntry?: InstallStateEntry
}) =>
  Boolean(
    stateEntry &&
      (stateEntry.manifestVersion !== manifest.version ||
        stateEntry.registryItemName !== manifest.registryItemName ||
        stateEntry.targetId !== project.target.id),
  )

export const classifyKitInstall = ({
  dependencies,
  fileCheck,
  fragmentCheck,
  manifest,
  project,
  stateEntry,
}: {
  dependencies: DependencyCheck
  fileCheck: FileCheck
  fragmentCheck: FragmentCheck
  manifest: KitManifest
  project: DetectedProject
  stateEntry?: InstallStateEntry
}): DoctorFinding => {
  const kitName = manifest.name
  const hasAnyInstalledFile = fileCheck.missingFiles.length < manifest.files.length
  const hasAnyInstallTrace = Boolean(stateEntry || hasAnyInstalledFile)

  if (!hasAnyInstallTrace) {
    return {
      actions: [installCommand(kitName), directCommand(kitName)],
      details: [],
      kitName,
      severity: 'info',
      status: 'not-installed',
      summary: 'not installed in this project.',
    }
  }

  if (stateEntry?.status === 'partial') {
    const lastError = stateEntry.lastError
      ? ` Last failure: ${stateEntry.lastError.stage}: ${stateEntry.lastError.message}`
      : ''

    return {
      actions: [installCommand(kitName)],
      details: [...dependencies.missing, ...fileCheck.missingFiles, ...fragmentCheck.missingFragments],
      kitName,
      severity: 'recoverable',
      status: 'partial',
      summary: `partial install recorded.${lastError}`,
    }
  }

  if (hasVersionDrift({ manifest, project, stateEntry })) {
    return {
      actions: [installCommand(kitName)],
      details: [
        `state.manifestVersion=${stateEntry?.manifestVersion ?? 'missing'}`,
        `manifest.version=${manifest.version}`,
        `state.registryItemName=${stateEntry?.registryItemName ?? 'missing'}`,
        `manifest.registryItemName=${manifest.registryItemName}`,
        `state.targetId=${stateEntry?.targetId ?? 'missing'}`,
        `project.targetId=${project.target.id}`,
      ],
      kitName,
      severity: 'recoverable',
      status: 'stale-state',
      summary: 'payload-kit state no longer matches the current manifest or target.',
    }
  }

  if (dependencies.missing.length > 0) {
    return {
      actions: [installCommand(kitName)],
      details: dependencies.missing,
      kitName,
      severity: 'recoverable',
      status: 'missing-dependencies',
      summary: 'required dependencies are missing from the target project.',
    }
  }

  if (!fileCheck.isValid) {
    return {
      actions: [installCommand(kitName)],
      details: fileCheck.missingFiles,
      kitName,
      severity: 'recoverable',
      status: 'missing-files',
      summary: 'one or more kit-owned files are missing.',
    }
  }

  if (!fragmentCheck.isValid && stateEntry?.status === 'installed') {
    return {
      actions: [installCommand(kitName)],
      details: fragmentCheck.missingFragments,
      kitName,
      severity: 'recoverable',
      status: 'missing-payload-registration',
      summary: 'Payload registration is missing even though payload-kit state says the kit was installed.',
    }
  }

  if (!fragmentCheck.isValid) {
    return {
      actions: [installCommand(kitName)],
      details: fragmentCheck.missingFragments,
      kitName,
      severity: 'recoverable',
      status: 'shadcn-only',
      summary: 'files are present, but Payload registration and payload-kit state are incomplete.',
    }
  }

  if (!stateEntry) {
    return {
      actions: [installCommand(kitName)],
      details: [],
      kitName,
      severity: 'recoverable',
      status: 'stale-state',
      summary: 'files and Payload registration are present, but payload-kit recovery state is missing.',
    }
  }

  return {
    actions: [],
    details: [],
    kitName,
    severity: 'healthy',
    status: 'healthy',
    summary: 'installed with valid files, dependencies, Payload registration, and recovery state.',
  }
}

export const getDoctorExitCode = (findings: DoctorFinding[]): 0 | 1 => {
  if (findings.some((finding) => finding.severity === 'recoverable')) {
    return 1
  }

  return 0
}

const safeFileCheck = async (cwd: string, manifest: KitManifest): Promise<FileCheck> => {
  try {
    return await verifyInstalledManifestFiles({ cwd, manifest })
  } catch {
    return {
      isValid: false,
      missingFiles: manifest.files,
    }
  }
}

const safeFragmentCheck = async (cwd: string, manifest: KitManifest): Promise<FragmentCheck> => {
  try {
    return await verifyInstalledPayloadFragments({ cwd, manifest })
  } catch (error) {
    return {
      isValid: false,
      missingFragments: [error instanceof Error ? error.message : 'Unknown fragment verification error'],
    }
  }
}

const getDependencyCheck = async ({
  cwd,
  manifest,
  relevant,
}: {
  cwd: string
  manifest: KitManifest
  relevant: boolean
}): Promise<DependencyCheck> => {
  if (!relevant) {
    return {
      missing: [],
    }
  }

  const missing: string[] = []

  for (const [label, dependencies] of [
    ['peerDependencies', manifest.peerDependencies],
    ['dependencies', manifest.dependencies],
  ] as const) {
    const result = await checkDependencyRequirements({
      allowMissing: true,
      cwd,
      dependencies,
      label,
    })

    missing.push(...result.missing.map((dependencyName) => `${label}.${dependencyName}`))
  }

  return {
    missing,
  }
}

export const getDoctorReport = async (cwd: string): Promise<DoctorReport> => {
  let project: DetectedProject

  try {
    project = await detectProject(cwd)
  } catch (error) {
    return {
      exitCode: 2,
      findings: [
        {
          actions: [],
          details: [error instanceof Error ? error.message : 'Unknown project detection error'],
          kitName: '*',
          severity: 'fatal',
          status: 'unsupported-project',
          summary: 'unsupported project shape or fatal project detection failure.',
        },
      ],
      project: {
        cwd,
        error: error instanceof Error ? error.message : 'Unknown project detection error',
        supported: false,
      },
    }
  }

  const [kitNames, state] = await Promise.all([listManifestNames(), loadState(cwd)])
  const manifests = await Promise.all(kitNames.map((kitName) => loadManifest(kitName)))
  const findings = await Promise.all(
    manifests.map(async (manifest) => {
      const fileCheck = await safeFileCheck(cwd, manifest)
      const stateEntry = state.kits[manifest.name]
      const relevant = Boolean(stateEntry || fileCheck.missingFiles.length < manifest.files.length)

      return classifyKitInstall({
        dependencies: await getDependencyCheck({ cwd, manifest, relevant }),
        fileCheck,
        fragmentCheck: await safeFragmentCheck(cwd, manifest),
        manifest,
        project,
        stateEntry,
      })
    }),
  )

  return {
    exitCode: getDoctorExitCode(findings),
    findings,
    project: {
      cwd,
      nextMajor: project.nextMajor,
      payloadMajor: project.payloadMajor,
      supported: true,
      targetId: project.target.id,
    },
  }
}

const formatDetails = (details: string[]) => (details.length ? [`  Details: ${details.join(', ')}`] : [])

export const formatDoctorReport = (report: DoctorReport) => {
  const lines = [
    `payload-kit doctor: ${report.project.supported ? 'supported project' : 'unsupported project'} (${report.exitCode})`,
  ]

  for (const finding of report.findings) {
    lines.push(`- ${finding.kitName}: ${finding.status} - ${finding.summary}`)
    lines.push(...formatDetails(finding.details))

    if (finding.actions.length > 0) {
      lines.push(`  Next: ${finding.actions.join(' or ')}`)
    }
  }

  return `${lines.join('\n')}\n`
}

export const doctorCommand = async ({ cwd, json }: { cwd: string; json: boolean }) => {
  let report: DoctorReport

  try {
    report = await getDoctorReport(cwd)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown doctor failure'

    report = {
      exitCode: 2,
      findings: [
        {
          actions: [],
          details: [message],
          kitName: '*',
          severity: 'fatal',
          status: 'unsupported-project',
          summary: 'fatal doctor command failure.',
        },
      ],
      project: {
        cwd,
        error: message,
        supported: false,
      },
    }
  }

  if (json) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
  } else {
    process.stdout.write(formatDoctorReport(report))
  }

  process.exitCode = report.exitCode
}
