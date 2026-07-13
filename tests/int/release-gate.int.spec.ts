import { execFile } from 'node:child_process'
import { mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'

import { ESLint } from 'eslint'
import { describe, expect, it } from 'vitest'

const execFileAsync = promisify(execFile)
const repoRoot = process.cwd()

const getWorkflowJob = (workflow: string, jobName: string) => {
  const startMarker = `  ${jobName}:\n`
  const start = workflow.indexOf(startMarker)

  expect(start, `missing workflow job ${jobName}`).toBeGreaterThan(-1)

  const remaining = workflow.slice(start + startMarker.length)
  const nextJob = remaining.search(/^  [a-z0-9-]+:\n/m)

  return nextJob === -1 ? remaining : remaining.slice(0, nextJob)
}

const listTypeScriptFiles = async (directory: string): Promise<string[]> => {
  const entries = await readdir(directory, { withFileTypes: true })
  const nestedFiles = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(directory, entry.name)

      if (entry.isDirectory()) {
        return listTypeScriptFiles(entryPath)
      }

      return /\.tsx?$/.test(entry.name) ? [entryPath] : []
    }),
  )

  return nestedFiles.flat().sort()
}

describe('release gate configuration', () => {
  it('lints every installable target source file while the site TypeScript project excludes it', async () => {
    const sourceRoot = path.join(repoRoot, 'payload-components', 'source')
    const expectedFiles = await listTypeScriptFiles(sourceRoot)
    const eslint = new ESLint({ cwd: repoRoot })
    const lintResult = await eslint
      .lintFiles(['payload-components/source/**/*.{ts,tsx}'])
      .catch((error: unknown) => error)

    expect(Array.isArray(lintResult), String(lintResult)).toBe(true)
    if (!Array.isArray(lintResult)) return

    const lintedFiles = lintResult.map((result) => result.filePath).sort()
    expect(lintedFiles).toEqual(expectedFiles)
    expect(lintedFiles).toContain(
      path.join(sourceRoot, 'blocks', 'HeroBasic', 'config.ts'),
    )
    expect(lintedFiles).toContain(
      path.join(sourceRoot, 'components', 'ui', 'infinite-slider.tsx'),
    )

    const tsconfig = JSON.parse(await readFile(path.join(repoRoot, 'tsconfig.json'), 'utf8')) as {
      exclude?: string[]
    }
    expect(tsconfig.exclude).toContain('payload-components/source')
  }, 60_000)

  it('runs the production build before E2E and selects next start in production mode', async () => {
    const packageJson = JSON.parse(await readFile(path.join(repoRoot, 'package.json'), 'utf8')) as {
      scripts?: Record<string, string>
    }
    const releaseScript = packageJson.scripts?.['test:release'] ?? ''
    const buildIndex = releaseScript.indexOf('pnpm build:e2e')
    const e2eIndex = releaseScript.indexOf('pnpm run test:e2e')

    expect(buildIndex).toBeGreaterThan(-1)
    expect(e2eIndex).toBeGreaterThan(buildIndex)
    expect(releaseScript).toContain('PLAYWRIGHT_SERVER_MODE=production')

    const probe = [
      "import config from './playwright.config.ts'",
      "const webServer = Array.isArray(config.webServer) ? config.webServer[0] : config.webServer",
      "process.stdout.write(String(webServer?.command ?? ''))",
    ].join(';')
    const { stdout } = await execFileAsync(
      process.execPath,
      ['--import', 'tsx/esm', '--input-type=module', '--eval', probe],
      {
        cwd: repoRoot,
        env: { ...process.env, PLAYWRIGHT_SERVER_MODE: 'production' },
        timeout: 10_000,
      },
    )

    expect(stdout).toBe('pnpm start')
    expect(packageJson.scripts?.start).toContain('next start')
  })

  it('builds production E2E metadata with the same origin as the Playwright server', async () => {
    const packageJson = JSON.parse(await readFile(path.join(repoRoot, 'package.json'), 'utf8')) as {
      scripts?: Record<string, string>
    }
    const buildModule = (await import('../../tools/payload-components/build-e2e').catch(
      () => ({}),
    )) as {
      getE2ESiteUrl?: (port?: string) => string
    }

    expect(buildModule.getE2ESiteUrl).toBeTypeOf('function')
    expect(buildModule.getE2ESiteUrl?.('4321')).toBe('http://localhost:4321')

    const probe = [
      "import config from './playwright.config.ts'",
      "import { getE2ESiteUrl } from './tools/payload-components/build-e2e.ts'",
      "const webServer = Array.isArray(config.webServer) ? config.webServer[0] : config.webServer",
      "process.stdout.write(JSON.stringify({ port: webServer?.env?.PORT, siteUrl: getE2ESiteUrl() }))",
    ].join(';')
    const probeEnv = { ...process.env }
    delete probeEnv.E2E_PORT
    const { stdout } = await execFileAsync(
      process.execPath,
      ['--import', 'tsx/esm', '--input-type=module', '--eval', probe],
      {
        cwd: repoRoot,
        env: probeEnv,
        timeout: 10_000,
      },
    )
    const defaults = JSON.parse(stdout) as { port?: string; siteUrl?: string }

    expect(defaults.port).toBeTruthy()
    expect(defaults.siteUrl).toBeTruthy()
    expect(new URL(defaults.siteUrl ?? '').port).toBe(defaults.port)
    expect(packageJson.scripts?.['build:e2e']).toContain(
      'tools/payload-components/build-e2e.ts',
    )
    expect(packageJson.scripts?.['test:release']).toContain('pnpm build:e2e')
  })

  it('requires all four bounded fresh-consumer shards in the PR gate', async () => {
    const workflow = await readFile(
      path.join(repoRoot, '.github', 'workflows', 'registry-verification.yml'),
      'utf8',
    )
    const jobNames = [
      'release-gate',
      'node-20-compat',
      'quick-checks',
      'pr-gate',
      'fresh-payload-smoke',
    ]

    expect(workflow).toMatch(/fresh-payload-smoke:\n\s+runs-on:/)
    expect(workflow).toMatch(/matrix:\n\s+shard-index: \[0, 1, 2, 3\]/)
    expect(workflow).toContain('--shard-index "${{ matrix.shard-index }}"')
    expect(workflow).toContain('fresh-payload-artifacts-${{ matrix.shard-index }}')
    expect(workflow).toContain('SMOKE_REGISTRY_URL:')
    expect(workflow).not.toMatch(/^\s+REGISTRY_URL:/m)
    expect(getWorkflowJob(workflow, 'release-gate')).toContain(
      'npm install --global bun@1.3.14',
    )
    expect(getWorkflowJob(workflow, 'node-20-compat')).toContain(
      'npm install --global bun@1.3.14',
    )

    for (const jobName of jobNames) {
      expect(getWorkflowJob(workflow, jobName), `${jobName} must have a timeout`).toMatch(
        /timeout-minutes: \d+/,
      )
    }

    const prGate = getWorkflowJob(workflow, 'pr-gate')
    expect(prGate).toContain('fresh-payload-smoke')
    expect(prGate).toContain('always()')
    expect(prGate).toContain('needs.fresh-payload-smoke.result')
    expect(prGate).toContain('exit 1')
  })
})

describe('package publish guard', () => {
  it('rejects a release tag that does not exactly match the package version', async () => {
    const guardModule = (await import('../../tools/payload-components/publish-guard').catch(
      () => ({}),
    )) as {
      assertPublishAllowed?: (input: {
        packageVersion: string
        releaseCommitOnMain: boolean
        releaseTag: string
      }) => void
    }

    expect(guardModule.assertPublishAllowed).toBeTypeOf('function')
    expect(() =>
      guardModule.assertPublishAllowed?.({
        packageVersion: '1.2.3',
        releaseCommitOnMain: true,
        releaseTag: 'v1.2.4',
      }),
    ).toThrow(/v1\.2\.3/)
  })

  it('rejects a release commit that is not reachable from main', async () => {
    const guardModule = (await import('../../tools/payload-components/publish-guard').catch(
      () => ({}),
    )) as {
      assertPublishAllowed?: (input: {
        packageVersion: string
        releaseCommitOnMain: boolean
        releaseTag: string
      }) => void
    }

    expect(guardModule.assertPublishAllowed).toBeTypeOf('function')
    expect(() =>
      guardModule.assertPublishAllowed?.({
        packageVersion: '1.2.3',
        releaseCommitOnMain: false,
        releaseTag: 'v1.2.3',
      }),
    ).toThrow(/main/)
  })

  it('reads the package version from the candidate tag instead of the trusted worktree', async () => {
    const guardModule = (await import('../../tools/payload-components/publish-guard').catch(
      () => ({}),
    )) as {
      getCandidatePackageVersion?: (input: {
        cwd: string
        releaseTag: string
      }) => Promise<string>
    }

    expect(guardModule.getCandidatePackageVersion).toBeTypeOf('function')
    if (!guardModule.getCandidatePackageVersion) return

    const tempDir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-publish-guard-'))
    const runGit = (args: string[]) =>
      execFileAsync('git', args, {
        cwd: tempDir,
        timeout: 10_000,
      })

    try {
      await runGit(['init', '--initial-branch=main'])
      await runGit(['config', 'user.email', 'test@example.com'])
      await runGit(['config', 'user.name', 'Publish Guard Test'])
      await writeFile(
        path.join(tempDir, 'package.json'),
        `${JSON.stringify({ version: '9.9.9' }, null, 2)}\n`,
      )
      await runGit(['add', 'package.json'])
      await runGit(['commit', '-m', 'trusted main'])
      await runGit(['checkout', '-b', 'candidate'])
      await writeFile(
        path.join(tempDir, 'package.json'),
        `${JSON.stringify({ version: '1.2.3' }, null, 2)}\n`,
      )
      await runGit(['add', 'package.json'])
      await runGit(['commit', '-m', 'candidate release'])
      await runGit(['tag', 'v1.2.3'])
      await runGit(['checkout', 'main'])

      const trustedPackage = JSON.parse(
        await readFile(path.join(tempDir, 'package.json'), 'utf8'),
      ) as { version: string }

      expect(trustedPackage.version).toBe('9.9.9')
      await expect(
        guardModule.getCandidatePackageVersion({
          cwd: tempDir,
          releaseTag: 'v1.2.3',
        }),
      ).resolves.toBe('1.2.3')
    } finally {
      await rm(tempDir, { force: true, recursive: true })
    }
  })

  it('validates from trusted main before candidate checkout, install, and publish gates', async () => {
    const workflow = await readFile(
      path.join(repoRoot, '.github', 'workflows', 'package-publish.yml'),
      'utf8',
    )

    expect(workflow).toContain('release:')
    expect(workflow).toContain('- published')
    expect(workflow).not.toContain('workflow_dispatch')
    expect(workflow).toContain('environment: npm-production')
    expect(workflow).toMatch(/publish:\n[\s\S]*?timeout-minutes: \d+/)
    expect(workflow).toContain('fetch-depth: 0')
    expect(workflow).toContain('ref: main')
    expect(workflow).not.toContain('ref: ${{ github.event.release.tag_name }}')
    expect(workflow).toContain('refs/remotes/origin/main')
    expect(workflow).toContain('tools/payload-components/publish-guard.ts')
    expect(workflow).toContain('pnpm install --frozen-lockfile --ignore-scripts')
    expect(workflow).toContain('npm install --global bun@1.3.14')

    const fetchCandidateIndex = workflow.indexOf('Fetch candidate release tag')
    const trustedInstallIndex = workflow.indexOf('Install trusted guard dependencies')
    const guardIndex = workflow.indexOf('Verify candidate from trusted main')
    const checkoutCandidateIndex = workflow.indexOf('Checkout validated release candidate')
    const installCandidateIndex = workflow.indexOf('Install validated release dependencies')
    const releaseGateIndex = workflow.indexOf('pnpm test:release')
    const packGateIndex = workflow.indexOf('pnpm test:pack')
    const publishIndex = workflow.indexOf('npm publish --provenance')

    expect(fetchCandidateIndex).toBeGreaterThan(-1)
    expect(trustedInstallIndex).toBeGreaterThan(fetchCandidateIndex)
    expect(guardIndex).toBeGreaterThan(trustedInstallIndex)
    expect(checkoutCandidateIndex).toBeGreaterThan(guardIndex)
    expect(installCandidateIndex).toBeGreaterThan(checkoutCandidateIndex)
    expect(releaseGateIndex).toBeGreaterThan(installCandidateIndex)
    expect(packGateIndex).toBeGreaterThan(releaseGateIndex)
    expect(publishIndex).toBeGreaterThan(packGateIndex)
  })
})
