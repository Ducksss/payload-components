import { spawn } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { PackageManager } from './types'

export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

export const readJsonFile = async <T>(filePath: string): Promise<T> => {
  const raw = await readFile(filePath, 'utf8')

  return JSON.parse(raw) as T
}

export const writeJsonFile = async (filePath: string, value: unknown) => {
  await mkdir(path.dirname(filePath), { recursive: true })
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
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
      args: ['dlx', 'shadcn@latest'],
      command: 'pnpm',
    }
  }

  if (packageManager === 'yarn') {
    return {
      args: ['dlx', 'shadcn@latest'],
      command: 'yarn',
    }
  }

  if (packageManager === 'bun') {
    return {
      args: ['shadcn@latest'],
      command: 'bunx',
    }
  }

  return {
    args: ['shadcn@latest'],
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
}: {
  args: string[]
  command: string
  cwd: string
  env?: NodeJS.ProcessEnv
}) => {
  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      env: env ?? process.env,
      stdio: 'inherit',
    })

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
