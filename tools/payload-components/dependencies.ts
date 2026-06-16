import { readFile } from 'node:fs/promises'
import path from 'node:path'

import semver from 'semver'

import type { DependencyMap, PackageManager } from './types'

import { PACKAGE_JSON_FILE } from './constants'
import { getLockfileName, runCommand } from './utils'

type PackageJson = {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

type DependencyCheckResult = {
  installed: Record<string, string>
  missing: string[]
}

const readPackageJson = async (cwd: string): Promise<PackageJson> => {
  const raw = await readFile(path.join(cwd, PACKAGE_JSON_FILE), 'utf8')

  return JSON.parse(raw) as PackageJson
}

const getDeclaredDependencies = async (cwd: string) => {
  const packageJson = await readPackageJson(cwd)

  return {
    ...packageJson.devDependencies,
    ...packageJson.dependencies,
  }
}

const validateDeclaredRange = ({
  dependencyName,
  installedRange,
  label,
}: {
  dependencyName: string
  installedRange: string
  label: 'dependencies' | 'peerDependencies'
}) => {
  const normalizedRange = semver.validRange(installedRange)

  if (!normalizedRange) {
    throw new Error(
      `Cannot validate installed ${label} entry "${dependencyName}" because the target project declares an invalid semver range "${installedRange}".`,
    )
  }

  return normalizedRange
}

export const validateDependencyMap = ({
  dependencies,
  fieldName,
}: {
  dependencies: DependencyMap
  fieldName: 'dependencies' | 'peerDependencies'
}) => {
  for (const [dependencyName, dependencyRange] of Object.entries(dependencies)) {
    if (!dependencyName.trim()) {
      throw new Error(`Manifest "${fieldName}" contains an empty package name.`)
    }

    if (!semver.validRange(dependencyRange)) {
      throw new Error(
        `Manifest "${fieldName}.${dependencyName}" must be a valid semver range. Received "${dependencyRange}".`,
      )
    }
  }
}

export const checkDependencyRequirements = async ({
  cwd,
  dependencies,
  label,
  allowMissing,
}: {
  cwd: string
  dependencies: DependencyMap
  label: 'dependencies' | 'peerDependencies'
  allowMissing: boolean
}): Promise<DependencyCheckResult> => {
  const declaredDependencies = await getDeclaredDependencies(cwd)
  const missing: string[] = []
  const installed: Record<string, string> = {}

  for (const [dependencyName, requiredRange] of Object.entries(dependencies)) {
    const installedRange = declaredDependencies[dependencyName]

    if (!installedRange) {
      if (allowMissing) {
        missing.push(dependencyName)
        continue
      }

      throw new Error(
        `Missing required ${label} package "${dependencyName}". Install a version that satisfies "${requiredRange}" before running payload-components.`,
      )
    }

    const normalizedInstalledRange = validateDeclaredRange({
      dependencyName,
      installedRange,
      label,
    })

    if (!semver.intersects(normalizedInstalledRange, requiredRange)) {
      throw new Error(
        `The target project declares ${label} package "${dependencyName}" as "${installedRange}", which does not satisfy the required range "${requiredRange}".`,
      )
    }

    installed[dependencyName] = installedRange
  }

  return {
    installed,
    missing,
  }
}

export const installManifestDependencies = async ({
  cwd,
  dependencies,
  packageManager,
}: {
  cwd: string
  dependencies: DependencyMap
  packageManager: PackageManager
}) => {
  const entries = Object.entries(dependencies)

  if (!entries.length) {
    return
  }

  const packages = entries
    .sort(([leftName], [rightName]) => leftName.localeCompare(rightName))
    .map(([dependencyName, dependencyRange]) => `${dependencyName}@${dependencyRange}`)

  if (packageManager === 'pnpm') {
    await runCommand({
      command: 'pnpm',
      args: ['add', ...packages],
      cwd,
    })
    return
  }

  if (packageManager === 'yarn') {
    await runCommand({
      command: 'yarn',
      args: ['add', ...packages],
      cwd,
    })
    return
  }

  if (packageManager === 'bun') {
    await runCommand({
      command: 'bun',
      args: ['add', ...packages],
      cwd,
    })
    return
  }

  await runCommand({
    command: 'npm',
    args: ['install', ...packages],
    cwd,
  })
}

export const getRuntimePatchedFiles = ({
  dependencies,
  recoveryPatchedFiles,
  packageManager,
}: {
  dependencies: DependencyMap
  recoveryPatchedFiles: string[]
  packageManager: PackageManager
}) => {
  const patchedFiles = new Set(recoveryPatchedFiles)

  if (Object.keys(dependencies).length > 0) {
    patchedFiles.add(PACKAGE_JSON_FILE)
    patchedFiles.add(getLockfileName(packageManager))
  }

  return [...patchedFiles].sort()
}
