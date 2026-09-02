import { spawn, type ChildProcess } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { constants as fsConstants, existsSync, readFileSync } from 'node:fs'
import { chmod, copyFile, lstat, mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { PackageManager } from './types'

import { writeCommandOutput } from './command-output'
import {
  ensureSafeProjectDirectory,
  resolveSafeProjectPath,
  safeProjectFileExists,
} from './safe-path'

// Resolve the directory that holds the bundled data assets (registry.json,
// manifests, schema, support matrix, block source). This must work in two
// layouts: running from source under tsx (this file lives at
// tools/payload-components/utils.ts → repo root is two up) and running from the
// published, bundled CLI (dist/cli.js → assets ship at the package root one up).
const resolveRepoRoot = () => {
  const startDir = path.dirname(fileURLToPath(import.meta.url))
  const { root } = path.parse(startDir)
  let currentDir = startDir

  while (true) {
    if (existsSync(path.join(currentDir, 'payload-components', 'registry.json'))) {
      return currentDir
    }

    if (currentDir === root) {
      // Fall back to the historical two-up source layout.
      return path.resolve(startDir, '..', '..')
    }

    currentDir = path.dirname(currentDir)
  }
}

export const repoRoot = resolveRepoRoot()

// Build-time constant injected by tsup (see tsup.config.ts). Declared as
// optional so the source path — vitest and tsx, which do not run the bundler —
// falls back to reading the pin off the repo's package.json.
declare const __SHADCN_CLI_VERSION__: string | undefined

// Pin the shadcn CLI to the exact version the registry artifacts are built
// with, so `payload-components add` and `pnpm registry:build` always agree.
// The version lives in exactly one place: the `shadcn` devDependency.
const resolveShadcnVersion = () => {
  if (typeof __SHADCN_CLI_VERSION__ === 'string') {
    return __SHADCN_CLI_VERSION__
  }

  const { devDependencies } = JSON.parse(
    readFileSync(path.join(repoRoot, 'package.json'), 'utf8'),
  ) as { devDependencies?: Record<string, string> }
  const version = devDependencies?.shadcn

  if (!version) {
    throw new Error('Unable to resolve the shadcn CLI version from package.json devDependencies.')
  }

  return version
}

export const shadcnCliPackage = `shadcn@${resolveShadcnVersion()}`
export const DEFAULT_COMMAND_TIMEOUT_MS = 2 * 60 * 1000

export type CommandResult = {
  stderr: string
  stdout: string
}

const PROCESS_TERMINATION_GRACE_MS = 2_000
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const signalProcessTree = (child: ChildProcess, signal: NodeJS.Signals) => {
  if (!child.pid) {
    return
  }

  if (process.platform === 'win32') {
    child.kill(signal)
    return
  }

  try {
    process.kill(-child.pid, signal)
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code

    // A process group can outlive its leader briefly on macOS. If ownership
    // changes while it drains, signalling the stale group can return EPERM;
    // there is no further cleanup this process is allowed to perform.
    if (code !== 'ESRCH' && code !== 'EPERM') {
      throw error
    }
  }
}

const isProcessTreeAlive = (child: ChildProcess) => {
  if (!child.pid) {
    return false
  }

  if (process.platform === 'win32') {
    return child.exitCode === null && child.signalCode === null
  }

  try {
    process.kill(-child.pid, 0)
    return true
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code

    if (code === 'ESRCH' || code === 'EPERM') {
      return false
    }

    throw error
  }
}

export const terminateProcessTree = async (
  child: ChildProcess,
  graceMs = PROCESS_TERMINATION_GRACE_MS,
) => {
  signalProcessTree(child, 'SIGTERM')
  const deadline = Date.now() + graceMs

  while (Date.now() < deadline && isProcessTreeAlive(child)) {
    await sleep(25)
  }

  if (isProcessTreeAlive(child)) {
    signalProcessTree(child, 'SIGKILL')
  }

  await Promise.race([
    child.exitCode !== null || child.signalCode !== null
      ? Promise.resolve()
      : new Promise<void>((resolve) => child.once('close', () => resolve())),
    sleep(graceMs),
  ])
}

const abortError = (command: string, args: string[]) => {
  const error = new Error(`Command aborted: ${command} ${args.join(' ')}`)
  error.name = 'AbortError'
  return error
}

export const isPathInside = (parentPath: string, childPath: string) => {
  const relative = path.relative(path.resolve(parentPath), path.resolve(childPath))

  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))
}

export const readJsonFile = async <T>(filePath: string): Promise<T> => {
  const raw = await readFile(filePath, 'utf8')

  return JSON.parse(raw) as T
}

export type FileChange = {
  content: string | null
  filePath: string
}

/* Stage every replacement before touching a destination, then commit with
 * sibling renames. If any rename fails, restore every destination already
 * moved in this batch. This gives fragment/config/source mutations one failure
 * boundary instead of exposing half of a multi-file edit. */
export const commitFileChanges = async (
  changes: FileChange[],
  { cwd }: { cwd?: string } = {},
) => {
  if (changes.length === 0) {
    return
  }

  const unique = new Set<string>()

  for (const { filePath } of changes) {
    if (unique.has(filePath)) {
      throw new Error(`Cannot commit two changes for the same file: ${filePath}`)
    }

    unique.add(filePath)
  }

  const resolvedUnique = new Set<string>()
  const staged: Array<{
    backedUp: boolean
    backupPath: string
    content: string | null
    existed: boolean
    filePath: string
    installed: boolean
    mode?: number
    preserveBackup: boolean
    tempCreated: boolean
    tempPath: string
  }> = []

  try {
    for (const { content, filePath: requestedPath } of changes) {
      const initialPath = cwd
        ? (await resolveSafeProjectPath({ cwd, targetPath: requestedPath })).path
        : requestedPath

      if (content !== null) {
        if (cwd) {
          await ensureSafeProjectDirectory({ cwd, directoryPath: path.dirname(initialPath) })
        } else {
          await mkdir(path.dirname(initialPath), { recursive: true })
        }
      }

      const filePath = cwd
        ? (await resolveSafeProjectPath({ cwd, targetPath: initialPath })).path
        : initialPath

      if (resolvedUnique.has(filePath)) {
        throw new Error(`Cannot commit two changes for the same file: ${filePath}`)
      }

      resolvedUnique.add(filePath)
      const suffix = `${process.pid}.${randomUUID()}`
      const tempPath = `${filePath}.${suffix}.tmp`
      const backupPath = `${filePath}.${suffix}.bak`
      const existing = await lstat(filePath).catch((error: NodeJS.ErrnoException) => {
        if (error.code === 'ENOENT') return undefined
        throw error
      })

      if (existing && !existing.isFile()) {
        throw new Error(`Refusing to replace a non-regular file: ${filePath}`)
      }

      const entry = {
        backedUp: false,
        backupPath,
        content,
        existed: existing !== undefined,
        filePath,
        installed: false,
        ...(existing ? { mode: existing.mode } : {}),
        preserveBackup: false,
        tempCreated: false,
        tempPath,
      }
      staged.push(entry)

      if (content !== null) {
        await writeFile(tempPath, content, { encoding: 'utf8', flag: 'wx' })
        entry.tempCreated = true

        if (existing) {
          await chmod(tempPath, existing.mode)
        }
      }
    }
  } catch (error) {
    await Promise.all(
      staged.flatMap(({ tempCreated, tempPath }) =>
        tempCreated ? [rm(tempPath, { force: true })] : [],
      ),
    )
    throw error
  }

  try {
    for (const entry of staged) {
      if (cwd) {
        await resolveSafeProjectPath({ cwd, targetPath: entry.filePath })
      }

      if (entry.existed) {
        await copyFile(entry.filePath, entry.backupPath, fsConstants.COPYFILE_EXCL)
        entry.backedUp = true

        if (entry.mode !== undefined) {
          await chmod(entry.backupPath, entry.mode)
        }
      }

      if (entry.content !== null) {
        await rename(entry.tempPath, entry.filePath)
        entry.installed = true
      } else if (entry.existed) {
        await rm(entry.filePath, { force: true })
        entry.installed = true
      }
    }
  } catch (error) {
    const rollbackErrors: Error[] = []

    for (const entry of [...staged].reverse()) {
      try {
        if (entry.installed) {
          if (cwd) {
            await resolveSafeProjectPath({ cwd, targetPath: entry.filePath })
          }

          await rm(entry.filePath, { force: true })

          if (entry.backedUp) {
            await rename(entry.backupPath, entry.filePath)
            entry.backedUp = false
          }
        }
      } catch (rollbackError) {
        entry.preserveBackup = entry.backedUp
        rollbackErrors.push(
          new Error(`Could not restore ${entry.filePath}; recovery backup: ${entry.backupPath}`, {
            cause: rollbackError,
          }),
        )
      }
    }

    if (rollbackErrors.length > 0) {
      throw new AggregateError(
        [error, ...rollbackErrors],
        'The file transaction failed and could not be fully rolled back. Recovery backups were left beside the affected files.',
      )
    }

    throw error
  } finally {
    await Promise.all(
      staged.flatMap((entry) => [
        ...(entry.tempCreated ? [rm(entry.tempPath, { force: true })] : []),
        ...(entry.backedUp && !entry.preserveBackup
          ? [rm(entry.backupPath, { force: true })]
          : []),
      ]),
    )
  }
}

export const writeTextFile = async (filePath: string, content: string) => {
  await commitFileChanges([{ content, filePath }])
}

export const writeJsonFile = async (filePath: string, value: unknown) => {
  await writeTextFile(filePath, `${JSON.stringify(value, null, 2)}\n`)
}

export const ensureDir = async (dirPath: string) => {
  await mkdir(dirPath, { recursive: true })
}

export const extractMajor = (version: string | undefined, dependencyName: string) => {
  const match = version?.match(/(\d+)/)

  if (!match) {
    throw new Error(`Unable to determine the installed major version for "${dependencyName}".`)
  }

  return Number(match[1])
}

export const detectPackageManagerDetails = async (
  cwd: string,
): Promise<{
  lockfilePath: string
  packageManager: PackageManager
}> => {
  const lockfiles: Array<[PackageManager, string]> = [
    ['pnpm', getLockfileName('pnpm')],
    ['bun', 'bun.lock'],
    ['bun', 'bun.lockb'],
    ['yarn', getLockfileName('yarn')],
    ['npm', getLockfileName('npm')],
  ]

  for (const [manager, lockfile] of lockfiles) {
    if (await safeProjectFileExists({ cwd, filePath: path.join(cwd, lockfile) })) {
      return {
        lockfilePath: lockfile,
        packageManager: manager,
      }
    }
  }

  return {
    lockfilePath: getLockfileName('npm'),
    packageManager: 'npm',
  }
}

export const detectPackageManager = async (cwd: string): Promise<PackageManager> =>
  (await detectPackageManagerDetails(cwd)).packageManager

export const getLockfileName = (packageManager: PackageManager) => {
  if (packageManager === 'pnpm') {
    return 'pnpm-lock.yaml'
  }

  if (packageManager === 'bun') {
    return 'bun.lock'
  }

  if (packageManager === 'yarn') {
    return 'yarn.lock'
  }

  return 'package-lock.json'
}

export const getShadcnCommand = (packageManager: PackageManager) => {
  if (packageManager === 'pnpm') {
    return {
      args: ['dlx', shadcnCliPackage],
      command: 'pnpm',
    }
  }

  if (packageManager === 'yarn') {
    return {
      args: ['dlx', shadcnCliPackage],
      command: 'yarn',
    }
  }

  if (packageManager === 'bun') {
    return {
      args: [shadcnCliPackage],
      command: 'bunx',
    }
  }

  return {
    args: [shadcnCliPackage],
    command: 'npx',
  }
}

export const getRunScriptCommand = (packageManager: PackageManager, script: string) => {
  if (packageManager === 'pnpm') {
    return {
      args: [script],
      command: 'pnpm',
    }
  }

  if (packageManager === 'yarn') {
    return {
      args: [script],
      command: 'yarn',
    }
  }

  if (packageManager === 'bun') {
    return {
      args: ['run', script],
      command: 'bun',
    }
  }

  return {
    args: ['run', script],
    command: 'npm',
  }
}

export const runCommand = async ({
  args,
  captureOutput = false,
  command,
  cwd,
  env,
  signal,
  stdin,
  timeoutMs = DEFAULT_COMMAND_TIMEOUT_MS,
}: {
  args: string[]
  captureOutput?: boolean
  command: string
  cwd: string
  env?: NodeJS.ProcessEnv
  signal?: AbortSignal
  stdin?: string
  timeoutMs?: number
}) => {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) {
    throw new Error(`Command timeout must be a positive number. Received "${timeoutMs}".`)
  }

  if (signal?.aborted) {
    throw abortError(command, args)
  }

  return new Promise<CommandResult>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      detached: process.platform !== 'win32',
      env: env ?? process.env,
      stdio: captureOutput
        ? [stdin ? 'pipe' : 'ignore', 'pipe', 'pipe']
        : [stdin ? 'pipe' : 'inherit', 'inherit', 'inherit'],
    })
    let stderr = ''
    let settled = false
    let stdout = ''
    let terminating = false

    const cleanup = () => {
      clearTimeout(timeout)
      signal?.removeEventListener('abort', onAbort)
    }

    const finish = (error?: Error) => {
      if (settled) {
        return
      }

      settled = true
      cleanup()

      if (error) {
        Object.assign(error, { stderr, stdout })
        reject(error)
      } else {
        resolve({ stderr, stdout })
      }
    }

    const terminate = async (error: Error) => {
      if (settled || terminating) {
        return
      }

      terminating = true

      try {
        await terminateProcessTree(child)
        finish(error)
      } catch (terminationError) {
        finish(
          new Error(`${error.message} Process cleanup failed: ${String(terminationError)}`, {
            cause: terminationError,
          }),
        )
      }
    }

    const onAbort = () => {
      void terminate(abortError(command, args))
    }

    const timeout = setTimeout(() => {
      void terminate(
        new Error(`Command timed out after ${timeoutMs}ms: ${command} ${args.join(' ')}`),
      )
    }, timeoutMs)

    if (stdin && child.stdin) {
      child.stdin.on('error', (error: NodeJS.ErrnoException) => {
        if (error.code !== 'EPIPE') {
          finish(error)
        }
      })
      child.stdin.end(stdin)
    }

    child.stdout?.setEncoding('utf8')
    child.stdout?.on('data', (chunk: string) => {
      stdout += chunk
    })
    child.stderr?.setEncoding('utf8')
    child.stderr?.on('data', (chunk: string) => {
      stderr += chunk
    })

    signal?.addEventListener('abort', onAbort, { once: true })
    if (signal?.aborted) {
      onAbort()
    }
    child.on('error', (error) => finish(error))
    child.on('close', (code) => {
      if (terminating) {
        return
      }

      if (code === 0) {
        finish()
        return
      }

      const error = new Error(`Command failed: ${command} ${args.join(' ')}`)
      Object.assign(error, { code, stderr, stdout })
      finish(error)
    })
  })
}

export const printHeader = (message: string) => {
  writeCommandOutput(`\n${message}\n`)
}
