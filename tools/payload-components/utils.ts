import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { PackageManager } from './types'

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
export const shadcnCliPackage = 'shadcn@4.7.0'

export const isPathInside = (parentPath: string, childPath: string) => {
  const relative = path.relative(path.resolve(parentPath), path.resolve(childPath))

  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative))
}

export const readJsonFile = async <T>(filePath: string): Promise<T> => {
  const raw = await readFile(filePath, 'utf8')

  try {
    return JSON.parse(raw) as T
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    throw new Error(`Invalid JSON in ${filePath}: ${reason}`)
  }
}

export const writeJsonFile = async (filePath: string, value: unknown) => {
  await mkdir(path.dirname(filePath), { recursive: true })

  // Write to a temp sibling then rename so an interrupted write (disk full,
  // SIGINT) can never leave a half-written file behind — rename is atomic on
  // the same filesystem, and the temp lives in the target dir to guarantee it.
  const tempPath = `${filePath}.${process.pid}.tmp`

  try {
    await writeFile(tempPath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
    await rename(tempPath, filePath)
  } catch (error) {
    await rm(tempPath, { force: true })
    throw error
  }
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

export const detectPackageManager = async (cwd: string): Promise<PackageManager> => {
  const lockfiles: Array<[PackageManager, string]> = [
    ['pnpm', getLockfileName('pnpm')],
    ['bun', getLockfileName('bun')],
    ['yarn', getLockfileName('yarn')],
    ['npm', getLockfileName('npm')],
  ]

  for (const [manager, lockfile] of lockfiles) {
    try {
      await readFile(path.join(cwd, lockfile), 'utf8')
      return manager
    } catch {
      // Continue checking the remaining lockfiles.
    }
  }

  return 'npm'
}

export const getLockfileName = (packageManager: PackageManager) => {
  if (packageManager === 'pnpm') {
    return 'pnpm-lock.yaml'
  }

  if (packageManager === 'bun') {
    return 'bun.lockb'
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
  command,
  cwd,
  env,
  stdin,
}: {
  args: string[]
  command: string
  cwd: string
  env?: NodeJS.ProcessEnv
  stdin?: string
}) => {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env: env ?? process.env,
      stdio: [stdin ? 'pipe' : 'inherit', 'inherit', 'inherit'],
    })

    if (stdin) {
      // Without an 'error' listener, an EPIPE (child closes stdin early) is an
      // unhandled stream error that crashes the whole CLI.
      child.stdin?.on('error', reject)
      child.stdin?.end(stdin)
    }

    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) {
        resolve()
        return
      }

      reject(new Error(`Command failed: ${command} ${args.join(' ')}`))
    })
  })
}

export const printHeader = (message: string) => {
  process.stdout.write(`\n${message}\n`)
}
