import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterAll, describe, expect, it } from 'vitest'

import { expectInstalledComponents } from './payload-components-assertions'
import { createInstallFixture } from './payload-components-fixture'
import { runCommand } from '../../tools/payload-components/utils'

const repoRoot = process.cwd()
const packCommandTimeoutMs = 5 * 60 * 1000

// This test is heavy (it packs the tarball, installs it, and reaches the network
// for shadcn). It only runs when explicitly requested via `pnpm test:pack` so the
// default int gate stays fast. It is the only test that exercises the *published*
// artifact end to end: dist builds, the files whitelist ships the assets, the
// runtime deps resolve, the asset anchor resolves from an installed location, and
// the bin runs under plain Node with no tsx.
const runPackTest = process.env.RUN_PACK_TEST === '1'

/* Paths are relative to `root`, not to the directory being walked, so nested
   entries keep their full package-relative path. */
const listFilesRecursive = async (dir: string, root = dir): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        return listFilesRecursive(entryPath, root)
      }

      return [path.relative(root, entryPath).split(path.sep).join('/')]
    }),
  )

  return files.flat().sort()
}

;(runPackTest ? describe : describe.skip)('payload-components packed artifact', () => {
  const tempDirs: string[] = []

  afterAll(async () => {
    await Promise.all(tempDirs.map((tempDir) => rm(tempDir, { force: true, recursive: true })))
  })

  it('installs hero-basic via the bin from an installed tarball', async () => {
    const packDir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-pack-'))
    const toolDir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-tool-'))
    tempDirs.push(packDir, toolDir)

    // `pnpm pack` runs the prepack hook (pnpm build:cli) and emits the tarball.
    await runCommand({
      args: ['pack', '--pack-destination', packDir],
      captureOutput: true,
      command: 'pnpm',
      cwd: repoRoot,
      env: process.env,
      timeoutMs: packCommandTimeoutMs,
    })

    const packEntries = await readdir(packDir)
    const tarball = packEntries.find((entry) => entry.endsWith('.tgz'))

    expect(tarball, 'pnpm pack should produce a .tgz').toBeTruthy()

    const tarballPath = path.join(packDir, tarball as string)

    // Install the tarball into an isolated harness so only the package's real
    // runtime deps (ajv + semver) are pulled — never the Next.js site deps.
    await writeFile(
      path.join(toolDir, 'package.json'),
      `${JSON.stringify({ name: 'payload-components-pack-harness', private: true }, null, 2)}\n`,
      'utf8',
    )
    await runCommand({
      args: ['install', tarballPath, '--no-audit', '--no-fund'],
      captureOutput: true,
      command: 'npm',
      cwd: toolDir,
      env: process.env,
      timeoutMs: packCommandTimeoutMs,
    })

    const installedPackageDir = path.join(toolDir, 'node_modules', 'payload-components')
    const cliEntry = path.join(installedPackageDir, 'dist', 'cli.js')
    const filesBefore = await listFilesRecursive(installedPackageDir)
    const installedPackageJson = JSON.parse(
      await readFile(path.join(installedPackageDir, 'package.json'), 'utf8'),
    ) as { dependencies?: Record<string, string> }
    const bundledCli = await readFile(cliEntry, 'utf8')

    expect(Object.keys(installedPackageJson.dependencies ?? {}).sort()).toEqual(['ajv', 'semver'])
    expect(bundledCli).not.toContain('@playwright/test')
    expect(bundledCli).not.toContain('playwright')

    /* Every data asset the CLI reads at runtime has to be in the files
       allowlist, or a command silently stops working once published. */
    for (const asset of [
      'payload-components/registry.json',
      'payload-components/support-matrix.json',
      'payload-components/manifests/hero-basic.json',
      'payload-components/templates/saas-launch.json',
      'payload-components/source/blocks/shared/localizeFields.ts',
    ]) {
      expect(filesBefore, `${asset} must ship in the package`).toContain(asset)
    }

    const { fixtureDir, manifest } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)

    // Run the *installed* bin under plain Node (no tsx) against the fixture.
    await runCommand({
      args: [cliEntry, 'add', manifest.name, '--cwd', fixtureDir, '--demo'],
      captureOutput: true,
      command: process.execPath,
      cwd: toolDir,
      env: process.env,
      timeoutMs: packCommandTimeoutMs,
    })

    await expectInstalledComponents(fixtureDir, [manifest])
    const demoScript = await readFile(
      path.join(fixtureDir, 'payload-components', `seed-${manifest.name}.ts`),
      'utf8',
    )
    const demoState = JSON.parse(
      await readFile(
        path.join(fixtureDir, '.payload-components', 'demo-state', `${manifest.name}.json`),
        'utf8',
      ),
    ) as { component: string; pageId: unknown; token: string }

    expect(demoScript).toContain("_status: 'draft'")
    expect(demoScript).toContain(`const ownershipToken = '${demoState.token}'`)
    expect(demoState).toMatchObject({
      component: manifest.name,
      pageId: null,
    })

    // The install must not write into the package dir (it may be read-only under
    // a global npx cache); all writes go to an OS tmpdir and the target project.
    const filesAfter = await listFilesRecursive(installedPackageDir)
    expect(filesAfter).toEqual(filesBefore)
  }, 600000)
})
