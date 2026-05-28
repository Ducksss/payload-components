import { checkDependencyRequirements } from '../dependencies'
import { listManifestNames, loadManifest } from '../manifest'
import {
  detectProject,
  verifyInstalledManifestFiles,
  verifyInstalledPayloadFragments,
} from '../project'
import { loadState } from '../state'

import type { InstallStateEntry, KitManifest } from '../types'

type FileCheck = {
  isValid: boolean
  missingFiles: string[]
}

type FragmentCheck = {
  isValid: boolean
  missingFragments: string[]
}

export type DoctorStatus =
  | 'fully-installed'
  | 'missing'
  | 'missing-payload-registration'
  | 'partial'
  | 'shadcn-only'

export type DoctorReport = {
  actions: string[]
  details: string[]
  kitName: string
  status: DoctorStatus
  summary: string
}

export const classifyKitInstall = ({
  dependencyProblems,
  fileCheck,
  fragmentCheck,
  manifest,
  stateEntry,
}: {
  dependencyProblems: string[]
  fileCheck: FileCheck
  fragmentCheck: FragmentCheck
  manifest: KitManifest
  stateEntry?: InstallStateEntry
}): DoctorReport => {
  const kitName = manifest.name
  const installCommand = `pnpm dlx payload-kit add ${kitName}`
  const directCommand = `pnpm dlx shadcn@latest add @payload-kits/${kitName}`
  const hasAnyInstalledFile = fileCheck.missingFiles.length < manifest.files.length

  if (stateEntry?.status === 'partial') {
    const lastError = stateEntry.lastError
      ? ` Last failure: ${stateEntry.lastError.stage}: ${stateEntry.lastError.message}`
      : ''

    return {
      actions: [installCommand],
      details: [...dependencyProblems, ...fileCheck.missingFiles, ...fragmentCheck.missingFragments],
      kitName,
      status: 'partial',
      summary: `partial install recorded.${lastError}`,
    }
  }

  if (!hasAnyInstalledFile && !stateEntry) {
    return {
      actions: [installCommand, directCommand],
      details: fileCheck.missingFiles,
      kitName,
      status: 'missing',
      summary: 'not installed.',
    }
  }

  if (dependencyProblems.length > 0 || !fileCheck.isValid) {
    return {
      actions: [installCommand],
      details: [...dependencyProblems, ...fileCheck.missingFiles],
      kitName,
      status: 'partial',
      summary: 'files or dependencies are incomplete.',
    }
  }

  if (manifest.installMode === 'shadcn-native') {
    return {
      actions: [directCommand],
      details: [],
      kitName,
      status: 'fully-installed',
      summary: 'fully installed as a shadcn-native kit.',
    }
  }

  if (fragmentCheck.isValid && stateEntry?.status === 'installed') {
    return {
      actions: [],
      details: [],
      kitName,
      status: 'fully-installed',
      summary: 'fully installed with payload-kit state, files, dependencies, and Payload registration.',
    }
  }

  if (fragmentCheck.isValid) {
    return {
      actions: [installCommand],
      details: [],
      kitName,
      status: 'partial',
      summary: 'files and Payload registration are present, but payload-kit recovery state is missing.',
    }
  }

  if (stateEntry?.status === 'installed') {
    return {
      actions: [installCommand],
      details: fragmentCheck.missingFragments,
      kitName,
      status: 'missing-payload-registration',
      summary: 'Payload registration is missing even though payload-kit state says the kit was installed.',
    }
  }

  return {
    actions: [installCommand],
    details: fragmentCheck.missingFragments,
    kitName,
    status: 'shadcn-only',
    summary: 'shadcn-only copied: files are present, but Payload registration is missing.',
  }
}

const formatDetails = (details: string[]) => {
  if (details.length === 0) {
    return []
  }

  return [`  Details: ${details.join(', ')}`]
}

export const formatDoctorReports = (reports: DoctorReport[]) => {
  const lines = ['payload-kit doctor']

  for (const report of reports) {
    lines.push(`- ${report.kitName}: ${report.status} - ${report.summary}`)
    lines.push(...formatDetails(report.details))

    if (report.actions.length > 0) {
      lines.push(`  Next: ${report.actions.join(' or ')}`)
    }
  }

  return `${lines.join('\n')}\n`
}

const safeFileCheck = async (cwd: string, manifest: KitManifest): Promise<FileCheck> => {
  try {
    return await verifyInstalledManifestFiles({
      cwd,
      manifest,
    })
  } catch {
    return {
      isValid: false,
      missingFiles: manifest.files,
    }
  }
}

const safeFragmentCheck = async ({
  cwd,
  manifest,
  projectDetected,
}: {
  cwd: string
  manifest: KitManifest
  projectDetected: boolean
}): Promise<FragmentCheck> => {
  if (manifest.installMode === 'shadcn-native') {
    return {
      isValid: true,
      missingFragments: [],
    }
  }

  if (!projectDetected) {
    return {
      isValid: false,
      missingFragments: ['project.unsupported'],
    }
  }

  try {
    return await verifyInstalledPayloadFragments({
      cwd,
      manifest,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown fragment verification error'

    return {
      isValid: false,
      missingFragments: [message],
    }
  }
}

const getDependencyProblems = async (cwd: string, manifest: KitManifest) => {
  const problems: string[] = []

  for (const [label, dependencies] of [
    ['peerDependencies', manifest.peerDependencies],
    ['dependencies', manifest.dependencies],
  ] as const) {
    try {
      const result = await checkDependencyRequirements({
        allowMissing: true,
        cwd,
        dependencies,
        label,
      })

      problems.push(...result.missing.map((dependencyName) => `${label}.${dependencyName} is missing`))
    } catch (error) {
      problems.push(error instanceof Error ? error.message : `Unable to validate ${label}.`)
    }
  }

  return problems
}

export const getDoctorReports = async (cwd: string) => {
  const [kitNames, state] = await Promise.all([listManifestNames(), loadState(cwd)])
  const manifests = await Promise.all(kitNames.map((kitName) => loadManifest(kitName)))
  let projectDetected = false

  try {
    await detectProject(cwd)
    projectDetected = true
  } catch {
    projectDetected = false
  }

  return Promise.all(
    manifests.map(async (manifest) =>
      classifyKitInstall({
        dependencyProblems: await getDependencyProblems(cwd, manifest),
        fileCheck: await safeFileCheck(cwd, manifest),
        fragmentCheck: await safeFragmentCheck({
          cwd,
          manifest,
          projectDetected,
        }),
        manifest,
        stateEntry: state.kits[manifest.name],
      }),
    ),
  )
}

export const doctorCommand = async ({ cwd }: { cwd: string }) => {
  process.stdout.write(formatDoctorReports(await getDoctorReports(cwd)))
}
