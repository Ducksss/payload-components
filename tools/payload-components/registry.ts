import { access, mkdtemp } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import type { PackageManager } from './types'

import { getShadcnCommand, isPathInside, readJsonFile, repoRoot, runCommand, writeJsonFile } from './utils'

const registryDefinitionPath = path.join(repoRoot, 'payload-components', 'registry.json')
const skipExistingFilePrompts = Array.from({ length: 20 }, () => 'n').join('\n') + '\n'

type BuiltRegistryItem = {
  registryDependencies?: string[]
  [key: string]: unknown
}

type ComponentsJson = {
  aliases?: {
    components?: string
    ui?: string
  }
}

export const resolveAliasPath = (targetDir: string, aliasPath: string) => {
  let resolvedPath: string

  if (aliasPath.startsWith('@/')) {
    resolvedPath = path.join(targetDir, 'src', aliasPath.slice(2))
  } else if (aliasPath.startsWith('~/')) {
    resolvedPath = path.join(targetDir, aliasPath.slice(2))
  } else {
    resolvedPath = path.resolve(targetDir, aliasPath)
  }

  if (!isPathInside(targetDir, resolvedPath)) {
    throw new Error(`components.json alias "${aliasPath}" resolves outside the target project.`)
  }

  return resolvedPath
}

const getShadcnUiDir = async (targetDir: string) => {
  const componentsJson = await readJsonFile<ComponentsJson>(path.join(targetDir, 'components.json'))
  const uiAlias =
    componentsJson.aliases?.ui ??
    (componentsJson.aliases?.components ? `${componentsJson.aliases.components}/ui` : '@/components/ui')

  return resolveAliasPath(targetDir, uiAlias)
}

const fileExists = async (filePath: string) => {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

const getMissingRegistryDependencies = async ({
  dependencies,
  targetDir,
}: {
  dependencies: string[]
  targetDir: string
}) => {
  if (dependencies.length === 0) {
    return []
  }

  const uiDir = await getShadcnUiDir(targetDir)
  const missingDependencies = await Promise.all(
    dependencies.map(async (dependency) => ({
      dependency,
      isMissing: !(await fileExists(path.join(uiDir, `${dependency}.tsx`))),
    })),
  )

  return missingDependencies
    .filter(({ isMissing }) => isMissing)
    .map(({ dependency }) => dependency)
}

const stripRegistryDependenciesForWrapperInstall = async (itemFilePath: string) => {
  const item = await readJsonFile<BuiltRegistryItem>(itemFilePath)

  if (!item.registryDependencies?.length) {
    return []
  }

  const { registryDependencies, ...wrapperItem } = item

  await writeJsonFile(itemFilePath, wrapperItem)

  return registryDependencies
}

const installMissingRegistryDependencies = async ({
  dependencies,
  packageManager,
  targetDir,
}: {
  dependencies: string[]
  packageManager: PackageManager
  targetDir: string
}) => {
  const missingDependencies = await getMissingRegistryDependencies({
    dependencies,
    targetDir,
  })

  if (missingDependencies.length === 0) {
    return
  }

  const shadcn = getShadcnCommand(packageManager)

  await runCommand({
    args: [...shadcn.args, 'add', ...missingDependencies, '--cwd', targetDir, '--yes'],
    command: shadcn.command,
    cwd: repoRoot,
  })
}

export const buildRegistry = async (packageManager: PackageManager) => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-registry-'))
  const shadcn = getShadcnCommand(packageManager)

  await runCommand({
    args: [...shadcn.args, 'build', registryDefinitionPath, '--output', outputDir, '--cwd', repoRoot],
    command: shadcn.command,
    cwd: repoRoot,
  })

  return outputDir
}

export const installRegistryItem = async ({
  itemFilePath,
  packageManager,
  targetDir,
}: {
  itemFilePath: string
  packageManager: PackageManager
  targetDir: string
}) => {
  const shadcn = getShadcnCommand(packageManager)
  const registryDependencies = await stripRegistryDependenciesForWrapperInstall(itemFilePath)

  await installMissingRegistryDependencies({
    dependencies: registryDependencies,
    packageManager,
    targetDir,
  })

  await runCommand({
    args: [...shadcn.args, 'add', itemFilePath, '--cwd', targetDir, '--yes'],
    command: shadcn.command,
    cwd: repoRoot,
    stdin: skipExistingFilePrompts,
  })
}
