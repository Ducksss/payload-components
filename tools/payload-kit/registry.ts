import { mkdtemp } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import type { PackageManager } from './types'

import { getShadcnCommand, readJsonFile, repoRoot, runCommand, writeJsonFile } from './utils'

const registryDefinitionPath = path.join(repoRoot, 'payload-kits', 'registry.json')
const skipExistingFilePrompts = Array.from({ length: 20 }, () => 'n').join('\n') + '\n'

type BuiltRegistryItem = {
  registryDependencies?: string[]
  [key: string]: unknown
}

const stripRegistryDependenciesForWrapperInstall = async (itemFilePath: string) => {
  const item = await readJsonFile<BuiltRegistryItem>(itemFilePath)

  if (!item.registryDependencies?.length) {
    return
  }

  const { registryDependencies: _registryDependencies, ...wrapperItem } = item

  await writeJsonFile(itemFilePath, wrapperItem)
}

export const buildRegistry = async (packageManager: PackageManager) => {
  const outputDir = await mkdtemp(path.join(os.tmpdir(), 'payload-kit-registry-'))
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

  await stripRegistryDependenciesForWrapperInstall(itemFilePath)

  await runCommand({
    args: [...shadcn.args, 'add', itemFilePath, '--cwd', targetDir, '--yes'],
    command: shadcn.command,
    cwd: repoRoot,
    stdin: skipExistingFilePrompts,
  })
}
