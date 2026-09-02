import { mkdtemp } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import type { PackageManager } from './types'

import { assertSafePackageManagerTargets } from './dependencies'
import { readSafeProjectFile, resolveSafeProjectPath, safeProjectFileExists } from './safe-path'
import { getShadcnCommand, isPathInside, readJsonFile, repoRoot, runCommand, writeJsonFile } from './utils'

const registryDefinitionPath = path.join(repoRoot, 'payload-components', 'registry.json')
const skipExistingFilePrompts = Array.from({ length: 20 }, () => 'n').join('\n') + '\n'

type BuiltRegistryItem = {
  files?: Array<{ path?: string; target?: string; type?: string }>
  registryDependencies?: string[]
  type?: string
  [key: string]: unknown
}

type ComponentsJson = {
  aliases?: {
    components?: string
    hooks?: string
    lib?: string
    ui?: string
    utils?: string
  }
}

type WritableAlias = 'components' | 'hooks' | 'lib' | 'ui'

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

export const getShadcnUiDir = async (targetDir: string) => {
  const componentsJson = JSON.parse(
    await readSafeProjectFile({
      cwd: targetDir,
      filePath: path.join(targetDir, 'components.json'),
    }),
  ) as ComponentsJson
  const uiAlias =
    componentsJson.aliases?.ui ??
    (componentsJson.aliases?.components ? `${componentsJson.aliases.components}/ui` : '@/components/ui')

  return resolveAliasPath(targetDir, uiAlias)
}

const getShadcnWritablePaths = async (targetDir: string) => {
  const componentsJson = JSON.parse(
    await readSafeProjectFile({
      cwd: targetDir,
      filePath: path.join(targetDir, 'components.json'),
    }),
  ) as ComponentsJson
  const componentsAlias = componentsJson.aliases?.components ?? '@/components'
  const aliases: Record<WritableAlias, string> = {
    components: componentsAlias,
    hooks: componentsJson.aliases?.hooks ?? '@/hooks',
    lib: componentsJson.aliases?.lib ?? '@/lib',
    ui: componentsJson.aliases?.ui ?? `${componentsAlias}/ui`,
  }

  return Object.fromEntries(
    await Promise.all(
      Object.entries(aliases).map(async ([name, alias]) => {
        const resolved = resolveAliasPath(targetDir, alias)

        await resolveSafeProjectPath({ cwd: targetDir, targetPath: resolved })

        return [name, resolved]
      }),
    ),
  ) as Record<WritableAlias, string>
}

const assertSafeRegistrySourcePath = (sourcePath: string) => {
  const hasParentTraversal = sourcePath.split(/[\\/]+/).includes('..')

  if (path.posix.isAbsolute(sourcePath) || path.win32.isAbsolute(sourcePath) || hasParentTraversal) {
    throw new Error(`Registry file path "${sourcePath}" is not a safe relative path.`)
  }
}

const getDefaultRegistryDestination = ({
  file,
  writablePaths,
}: {
  file: NonNullable<BuiltRegistryItem['files']>[number]
  writablePaths: Record<WritableAlias, string>
}) => {
  const destinationRoot =
    file.type === 'registry:ui'
      ? writablePaths.ui
      : file.type === 'registry:lib'
        ? writablePaths.lib
        : file.type === 'registry:hook'
          ? writablePaths.hooks
          : writablePaths.components
  const sourcePath = file.path

  if (!sourcePath) {
    throw new Error('Registry files without an explicit target must declare a source path.')
  }

  assertSafeRegistrySourcePath(sourcePath)

  const sourceParts = sourcePath.split(/[\\/]+/).filter(Boolean)
  const rootName = path.basename(destinationRoot)
  const rootIndex = sourceParts.findIndex((part) => part === rootName)
  const relativeDestination =
    rootIndex === -1 ? sourceParts.at(-1) : sourceParts.slice(rootIndex + 1).join(path.sep)

  if (!relativeDestination) {
    throw new Error(`Registry file path "${sourcePath}" does not name a destination file.`)
  }

  return path.resolve(destinationRoot, relativeDestination)
}

const validateRegistryFileDestinations = async ({
  item,
  targetDir,
}: {
  item: BuiltRegistryItem
  targetDir: string
}) => {
  const writablePaths = await getShadcnWritablePaths(targetDir)

  for (const file of item.files ?? []) {
    if (!file.target) {
      await resolveSafeProjectPath({
        cwd: targetDir,
        targetPath: getDefaultRegistryDestination({ file, writablePaths }),
      })
      continue
    }

    const targetAlias = file.target.match(/^@(components|hooks|lib|ui)\/(.+)$/)

    if (targetAlias) {
      const [, aliasName, aliasRemainder] = targetAlias
      const aliasRoot = writablePaths[aliasName as WritableAlias]
      const destination = path.resolve(aliasRoot, aliasRemainder)

      if (!isPathInside(aliasRoot, destination)) {
        throw new Error(
          `Registry target "${file.target}" escapes the configured ${aliasName} alias root.`,
        )
      }

      await resolveSafeProjectPath({ cwd: targetDir, targetPath: destination })
      continue
    }

    const projectPath = file.target.replace(/^~\//, '').replace(/^@/, '')

    await resolveSafeProjectPath({
      cwd: targetDir,
      targetPath: path.resolve(targetDir, projectPath),
    })

    /* shadcn places non-~/ relative targets under src/ when the detected
     * framework uses a src directory. Validate that possible effective path as
     * well, so a symlinked src ancestor cannot bypass the preflight. */
    if (!file.target.startsWith('~/')) {
      await resolveSafeProjectPath({
        cwd: targetDir,
        targetPath: path.resolve(targetDir, 'src', projectPath.replace(/^src[\\/]/, '')),
      })
    }
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
  await resolveSafeProjectPath({ cwd: targetDir, targetPath: uiDir })
  const missingDependencies = await Promise.all(
    dependencies.map(async (dependency) => ({
      dependency,
      isMissing: !(await safeProjectFileExists({
        cwd: targetDir,
        filePath: path.join(uiDir, `${dependency}.tsx`),
      })),
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

export const installRegistryDependencies = async ({
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
  const uiDir = await getShadcnUiDir(targetDir)

  for (const dependency of missingDependencies) {
    await resolveSafeProjectPath({
      cwd: targetDir,
      targetPath: path.join(uiDir, `${dependency}.tsx`),
    })
  }

  await assertSafePackageManagerTargets({ cwd: targetDir, packageManager })

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
  const item = await readJsonFile<BuiltRegistryItem>(itemFilePath)

  await assertSafePackageManagerTargets({ cwd: targetDir, packageManager })
  await validateRegistryFileDestinations({ item, targetDir })

  await installRegistryDependencies({
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
