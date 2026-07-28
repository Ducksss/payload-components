import { spawn, type SpawnOptions } from 'node:child_process'
import { readdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

type E2eBatch = {
  args: string[]
  name: 'frontend' | 'remaining' | 'requested' | 'templates-a11y' | 'templates-visual' | 'visual'
}

type E2eInvocation = {
  args: string[]
  command: string
  options: SpawnOptions
}

type RunInvocation = (batch: E2eBatch, invocation: E2eInvocation) => Promise<void>

const require = createRequire(import.meta.url)
const defaultPlaywrightCli = require.resolve('@playwright/test/cli')
const isolatedSpecs = [
  {
    name: 'frontend' as const,
    path: 'tests/e2e/frontend.e2e.spec.ts',
  },
  {
    name: 'visual' as const,
    path: 'tests/e2e/components-visual.e2e.spec.ts',
  },
  {
    name: 'templates-visual' as const,
    path: 'tests/e2e/templates-visual.e2e.spec.ts',
  },
  {
    name: 'templates-a11y' as const,
    path: 'tests/e2e/templates-a11y.e2e.spec.ts',
  },
]

export const discoverE2eSpecs = async (root: string): Promise<string[]> => {
  const testDirectory = path.join(root, 'tests', 'e2e')
  const discovered: string[] = []

  const visit = async (directory: string) => {
    const entries = await readdir(directory, { withFileTypes: true })

    for (const entry of entries.sort((left, right) => left.name.localeCompare(right.name))) {
      const absolutePath = path.join(directory, entry.name)

      if (entry.isDirectory()) {
        await visit(absolutePath)
      } else if (entry.isFile() && /\.(?:spec|test)\.(?:[cm]?[jt]sx?)$/.test(entry.name)) {
        discovered.push(path.relative(root, absolutePath).split(path.sep).join('/'))
      }
    }
  }

  await visit(testDirectory)

  return discovered.sort()
}

export const buildE2eBatches = (args: string[], specFiles: string[]): E2eBatch[] => {
  if (args.length > 0) {
    return [{ args, name: 'requested' }]
  }

  // The frontend and visual specs each walk 58 routes, and the template a11y
  // sweep runs ~40 axe passes plus a painted-pixel contrast pass per concept.
  // Keeping them in separate Playwright processes also gives each one a fresh
  // Next dev server, so Turbopack does not retain both compiled route sets in
  // one heap.
  const uniqueSpecs = [...new Set(specFiles)].sort()
  const batches = isolatedSpecs
    .filter((isolated) => uniqueSpecs.includes(isolated.path))
    .map<E2eBatch>((isolated) => ({
      args: [isolated.path],
      name: isolated.name,
    }))
  const isolatedPaths = new Set(isolatedSpecs.map((isolated) => isolated.path))
  const remainingSpecs = uniqueSpecs.filter((spec) => !isolatedPaths.has(spec))

  if (remainingSpecs.length > 0) {
    batches.push({ args: remainingSpecs, name: 'remaining' })
  }

  return batches
}

export const buildE2eInvocation = (
  batch: E2eBatch,
  env: NodeJS.ProcessEnv = process.env,
  playwrightCli = defaultPlaywrightCli,
): E2eInvocation => {
  const requestedReportDir = env.PLAYWRIGHT_HTML_OUTPUT_DIR
  const reportDir =
    batch.name === 'requested' && requestedReportDir
      ? requestedReportDir
      : path.join('playwright-report', batch.name)

  return {
    args: [playwrightCli, 'test', '--config=playwright.config.ts', ...batch.args],
    command: process.execPath,
    options: {
      env: {
        ...env,
        NODE_OPTIONS: [env.NODE_OPTIONS, '--no-deprecation'].filter(Boolean).join(' '),
        PLAYWRIGHT_HTML_OPEN: 'never',
        PLAYWRIGHT_HTML_OUTPUT_DIR: reportDir,
      },
      shell: false,
      stdio: 'inherit',
    },
  }
}

const spawnInvocation: RunInvocation = (batch, invocation) =>
  new Promise<void>((resolve, reject) => {
    const child = spawn(invocation.command, invocation.args, invocation.options)

    child.once('error', reject)
    child.once('exit', (code, signal) => {
      if (code === 0) {
        resolve()
        return
      }

      reject(
        new Error(
          signal
            ? `Playwright batch "${batch.name}" exited on signal ${signal}.`
            : `Playwright batch "${batch.name}" exited with code ${code ?? 'unknown'}.`,
        ),
      )
    })
  })

export const runE2e = async (
  args: string[],
  {
    env = process.env,
    playwrightCli = defaultPlaywrightCli,
    runInvocation = spawnInvocation,
    specFiles,
  }: {
    env?: NodeJS.ProcessEnv
    playwrightCli?: string
    runInvocation?: RunInvocation
    specFiles?: string[]
  } = {},
) => {
  const discoveredSpecs = args.length > 0 ? [] : (specFiles ?? (await discoverE2eSpecs(process.cwd())))

  if (args.length === 0 && discoveredSpecs.length === 0) {
    throw new Error('No Playwright specs were discovered under tests/e2e.')
  }

  for (const batch of buildE2eBatches(args, discoveredSpecs)) {
    await runInvocation(batch, buildE2eInvocation(batch, env, playwrightCli))
  }
}

const entrypoint = process.argv[1]

if (entrypoint && import.meta.url === pathToFileURL(path.resolve(entrypoint)).href) {
  await runE2e(process.argv.slice(2))
}
