import { readFile } from 'node:fs/promises'
import path from 'node:path'

import semver from 'semver'

import type { DependencyMap, PackageManager } from './types'

import { PACKAGE_JSON_FILE } from './constants'
import { resolveSafeProjectPath, readSafeProjectFile } from './safe-path'
import { detectPackageManagerDetails, runCommand } from './utils'

type PackageJson = {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

type DependencyCheckResult = {
  installed: Record<string, string>
  missing: string[]
}

const readPackageJson = async (cwd: string): Promise<PackageJson> => {
  const raw = await readSafeProjectFile({
    cwd,
    filePath: path.join(cwd, PACKAGE_JSON_FILE),
  })

  return JSON.parse(raw) as PackageJson
}

export const assertSafePackageManagerTargets = async ({
  cwd,
  packageManager,
}: {
  cwd: string
  packageManager: PackageManager
}) => {
  await readSafeProjectFile({ cwd, filePath: path.join(cwd, PACKAGE_JSON_FILE) })
  const detected = await detectPackageManagerDetails(cwd)

  if (detected.packageManager !== packageManager) {
    throw new Error(
      `Refusing package-manager write: expected ${packageManager}, but the current project lockfile selects ${detected.packageManager}.`,
    )
  }

  await resolveSafeProjectPath({
    cwd,
    targetPath: path.join(cwd, detected.lockfilePath),
  })
  await resolveSafeProjectPath({ cwd, targetPath: path.join(cwd, 'node_modules') })
}

const getDeclaredDependencies = async (cwd: string) => {
  const packageJson = await readPackageJson(cwd)

  return {
    ...packageJson.devDependencies,
    ...packageJson.dependencies,
  }
}

// npm package names, scoped or not. Nothing else is ever joined onto a path.
const packageNamePattern = /^(?:@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/

/* Reads the version the package manager actually installed. pnpm links
 * node_modules/<name> into its store, so unlike the project-file reads this
 * follows that symlink on purpose: it writes nothing and returns only a valid
 * semver version, never file content. */
const readInstalledVersion = async ({
  cwd,
  dependencyName,
}: {
  cwd: string
  dependencyName: string
}) => {
  if (!packageNamePattern.test(dependencyName)) {
    return undefined
  }

  try {
    const manifest = JSON.parse(
      await readFile(path.join(cwd, 'node_modules', dependencyName, PACKAGE_JSON_FILE), 'utf8'),
    ) as { name?: unknown; version?: unknown }

    return manifest.name === dependencyName && typeof manifest.version === 'string'
      ? (semver.valid(manifest.version) ?? undefined)
      : undefined
  } catch {
    return undefined
  }
}

/* A spec names a version only when it is a semver range with a digit in it.
 * "*" and "x" are valid ranges, but they match anything, so on their own they
 * say nothing about what is installed. */
const versionedRange = (spec: string) => (/\d/.test(spec) ? semver.validRange(spec) : null)

/* Some projects name a dependency without naming a version: create-payload-app
 * --version latest writes "latest" for every Payload package, workspaces use
 * "workspace:*" or "catalog:", and some projects declare a bare "*". Those carry
 * no major or range to check, so this falls back to the installed version. A
 * declared range always wins, and an unversioned spec with nothing installed
 * comes back unchanged for the caller to reject. */
export const resolveDeclaredVersion = async ({
  cwd,
  declared,
  dependencyName,
}: {
  cwd: string
  declared: string | undefined
  dependencyName: string
}) => {
  if (declared === undefined || versionedRange(declared)) {
    return declared
  }

  return (await readInstalledVersion({ cwd, dependencyName })) ?? declared
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
  const normalizedRange = versionedRange(installedRange)

  if (!normalizedRange) {
    throw new Error(
      `Cannot validate installed ${label} entry "${dependencyName}" because the target project declares "${installedRange}", which names no version, and has no installed version to check instead. Install the project's dependencies, or declare a semver range.`,
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
    const declaredRange = declaredDependencies[dependencyName]

    if (!declaredRange) {
      if (allowMissing) {
        missing.push(dependencyName)
        continue
      }

      throw new Error(
        `Missing required ${label} package "${dependencyName}". Install a version that satisfies "${requiredRange}" before running payload-components.`,
      )
    }

    const installedRange =
      (await resolveDeclaredVersion({ cwd, declared: declaredRange, dependencyName })) ??
      declaredRange
    const normalizedInstalledRange = validateDeclaredRange({
      dependencyName,
      installedRange,
      label,
    })

    /* includePrerelease: without it semver tests each comparator on its own, so
     * "<5.0.0-0" rejects 4.0.0-canary.37 and an installed prerelease never
     * intersects "^4.0.0-0" even though it satisfies it. The "-0" bounds on
     * every required range keep prereleases inside their own major. */
    if (!semver.intersects(normalizedInstalledRange, requiredRange, { includePrerelease: true })) {
      const installedNote = installedRange === declaredRange ? '' : ` (installed ${installedRange})`

      throw new Error(
        `The target project declares ${label} package "${dependencyName}" as "${declaredRange}"${installedNote}, which does not satisfy the required range "${requiredRange}".`,
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

  await assertSafePackageManagerTargets({ cwd, packageManager })

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
  lockfilePath,
  recoveryPatchedFiles,
}: {
  dependencies: DependencyMap
  lockfilePath: string
  recoveryPatchedFiles: string[]
}) => {
  const patchedFiles = new Set(recoveryPatchedFiles)

  if (Object.keys(dependencies).length > 0) {
    patchedFiles.add(PACKAGE_JSON_FILE)
    patchedFiles.add(lockfilePath)
  }

  return [...patchedFiles].sort()
}
