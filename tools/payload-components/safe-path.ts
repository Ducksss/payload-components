import { constants } from 'node:fs'
import { lstat, mkdir, open, readdir, realpath, rename, rm, rmdir } from 'node:fs/promises'
import path from 'node:path'

type FileContents = Parameters<Awaited<ReturnType<typeof open>>['writeFile']>[0]

const noFollow = typeof constants.O_NOFOLLOW === 'number' ? constants.O_NOFOLLOW : 0
let tempFileCounter = 0

/* This boundary rejects lexical escapes and every symlink present when an
 * operation inspects or opens its target. It is not a privilege sandbox against
 * another process running concurrently as the same OS user: Node 20 exposes no
 * portable openat/renameat/unlinkat API, and that process already has authority
 * to write the user's files directly. Never run this CLI elevated against a
 * project tree writable by a less-trusted user. */

const isMissing = (error: unknown) =>
  error instanceof Error && (error as NodeJS.ErrnoException).code === 'ENOENT'

const isPathInside = (parentPath: string, childPath: string) => {
  const relative = path.relative(path.resolve(parentPath), path.resolve(childPath))

  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))
}

const unsafePathError = (targetPath: string, reason: string) =>
  new Error(`Refusing unsafe project path "${targetPath}": ${reason}.`)

const relativeProjectPath = ({
  canonicalRoot,
  cwd,
  targetPath,
}: {
  canonicalRoot: string
  cwd: string
  targetPath: string
}) => {
  const lexicalRoot = path.resolve(cwd)
  const absoluteTarget = path.resolve(targetPath)

  if (isPathInside(lexicalRoot, absoluteTarget)) {
    return path.relative(lexicalRoot, absoluteTarget)
  }

  if (isPathInside(canonicalRoot, absoluteTarget)) {
    return path.relative(canonicalRoot, absoluteTarget)
  }

  throw unsafePathError(targetPath, `it resolves outside ${lexicalRoot}`)
}

const inspectExistingComponents = async ({
  canonicalRoot,
  relativePath,
  targetPath,
}: {
  canonicalRoot: string
  relativePath: string
  targetPath: string
}) => {
  const parts = relativePath.split(path.sep).filter(Boolean)
  let currentPath = canonicalRoot

  for (const [index, part] of parts.entries()) {
    currentPath = path.join(currentPath, part)

    let stats

    try {
      stats = await lstat(currentPath)
    } catch (error) {
      if (isMissing(error)) {
        return
      }

      throw error
    }

    if (stats.isSymbolicLink()) {
      throw unsafePathError(targetPath, `"${currentPath}" is a symbolic link`)
    }

    if (index < parts.length - 1 && !stats.isDirectory()) {
      throw unsafePathError(targetPath, `"${currentPath}" is not a directory`)
    }

    const resolved = await realpath(currentPath)

    if (!isPathInside(canonicalRoot, resolved)) {
      throw unsafePathError(targetPath, `"${currentPath}" escapes the canonical project root`)
    }
  }
}

export const resolveSafeProjectPath = async ({
  allowRoot = false,
  cwd,
  targetPath,
}: {
  allowRoot?: boolean
  cwd: string
  targetPath: string
}) => {
  const canonicalRoot = await realpath(path.resolve(cwd))
  const relativePath = relativeProjectPath({ canonicalRoot, cwd, targetPath })

  if (!allowRoot && relativePath === '') {
    throw unsafePathError(targetPath, 'the project root itself is not a valid file target')
  }

  await inspectExistingComponents({ canonicalRoot, relativePath, targetPath })

  return {
    canonicalRoot,
    path: path.join(canonicalRoot, relativePath),
    relativePath,
  }
}

export const ensureSafeProjectDirectory = async ({
  cwd,
  directoryPath,
}: {
  cwd: string
  directoryPath: string
}) => {
  const resolved = await resolveSafeProjectPath({
    allowRoot: true,
    cwd,
    targetPath: directoryPath,
  })
  let currentPath = resolved.canonicalRoot

  for (const part of resolved.relativePath.split(path.sep).filter(Boolean)) {
    currentPath = path.join(currentPath, part)

    try {
      const stats = await lstat(currentPath)

      if (stats.isSymbolicLink() || !stats.isDirectory()) {
        throw unsafePathError(directoryPath, `"${currentPath}" is not a real directory`)
      }
    } catch (error) {
      if (!isMissing(error)) {
        throw error
      }

      await mkdir(currentPath)
    }

    const canonicalDirectory = await realpath(currentPath)

    if (!isPathInside(resolved.canonicalRoot, canonicalDirectory)) {
      throw unsafePathError(directoryPath, `"${currentPath}" escapes the canonical project root`)
    }
  }

  return resolved.path
}

export const readSafeProjectFile = async ({
  cwd,
  filePath,
  encoding = 'utf8',
}: {
  cwd: string
  filePath: string
  encoding?: BufferEncoding
}) => {
  const resolved = await resolveSafeProjectPath({ cwd, targetPath: filePath })
  const handle = await open(resolved.path, constants.O_RDONLY | noFollow)

  try {
    const stats = await handle.stat()

    if (!stats.isFile()) {
      throw unsafePathError(filePath, 'the target is not a regular file')
    }

    return await handle.readFile({ encoding })
  } finally {
    await handle.close()
  }
}

export const safeProjectFileExists = async ({
  cwd,
  filePath,
}: {
  cwd: string
  filePath: string
}) => {
  const resolved = await resolveSafeProjectPath({ cwd, targetPath: filePath })

  try {
    const stats = await lstat(resolved.path)

    if (!stats.isFile()) {
      throw unsafePathError(filePath, 'the target is not a regular file')
    }

    return true
  } catch (error) {
    if (isMissing(error)) {
      return false
    }

    throw error
  }
}

export const writeSafeProjectFile = async ({
  contents,
  cwd,
  filePath,
}: {
  contents: FileContents
  cwd: string
  filePath: string
}) => {
  const initial = await resolveSafeProjectPath({ cwd, targetPath: filePath })
  await ensureSafeProjectDirectory({ cwd, directoryPath: path.dirname(initial.path) })
  const resolved = await resolveSafeProjectPath({ cwd, targetPath: initial.path })
  let mode = 0o644

  try {
    const existing = await lstat(resolved.path)

    if (existing.isSymbolicLink() || !existing.isFile()) {
      throw unsafePathError(filePath, 'the target is not a regular file')
    }

    mode = existing.mode
  } catch (error) {
    if (!isMissing(error)) {
      throw error
    }
  }

  tempFileCounter += 1
  const tempPath = `${resolved.path}.${process.pid}.${tempFileCounter}.tmp`
  let handle

  try {
    handle = await open(
      tempPath,
      constants.O_CREAT | constants.O_EXCL | constants.O_WRONLY | noFollow,
      mode,
    )
    const openedStats = await handle.stat()

    if (!openedStats.isFile()) {
      throw unsafePathError(filePath, 'the temporary target is not a regular file')
    }

    await handle.writeFile(contents)
    await handle.sync()
    await handle.close()
    handle = undefined

    await resolveSafeProjectPath({ cwd, targetPath: resolved.path })
    await rename(tempPath, resolved.path)
    await resolveSafeProjectPath({ cwd, targetPath: resolved.path })
  } catch (error) {
    await handle?.close().catch(() => undefined)
    await rm(tempPath, { force: true }).catch(() => undefined)
    throw error
  }
}

export const writeSafeProjectJsonFile = async ({
  cwd,
  filePath,
  value,
}: {
  cwd: string
  filePath: string
  value: unknown
}) =>
  await writeSafeProjectFile({
    contents: `${JSON.stringify(value, null, 2)}\n`,
    cwd,
    filePath,
  })

export const removeSafeProjectFile = async ({
  cwd,
  filePath,
}: {
  cwd: string
  filePath: string
}) => {
  const resolved = await resolveSafeProjectPath({ cwd, targetPath: filePath })

  try {
    const stats = await lstat(resolved.path)

    if (stats.isSymbolicLink() || !stats.isFile()) {
      throw unsafePathError(filePath, 'the target is not a regular file')
    }
  } catch (error) {
    if (isMissing(error)) {
      return false
    }

    throw error
  }

  await resolveSafeProjectPath({ cwd, targetPath: resolved.path })
  await rm(resolved.path)
  return true
}

export const removeSafeProjectDirectoryIfEmpty = async ({
  cwd,
  directoryPath,
}: {
  cwd: string
  directoryPath: string
}) => {
  const resolved = await resolveSafeProjectPath({ cwd, targetPath: directoryPath })

  let stats

  try {
    stats = await lstat(resolved.path)
  } catch (error) {
    if (isMissing(error)) {
      return false
    }

    throw error
  }

  if (stats.isSymbolicLink() || !stats.isDirectory()) {
    throw unsafePathError(directoryPath, 'the target is not a real directory')
  }

  if ((await readdir(resolved.path)).length > 0) {
    return false
  }

  await resolveSafeProjectPath({ cwd, targetPath: resolved.path })
  await rmdir(resolved.path)
  return true
}
