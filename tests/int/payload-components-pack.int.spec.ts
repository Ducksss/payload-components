import { execFile } from 'node:child_process'
import { mkdtemp, readdir, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'

import { afterAll, describe, expect, it } from 'vitest'

import { expectInstalledComponents } from './payload-components-assertions'
import { createInstallFixture } from './payload-components-fixture'

const execFileAsync = promisify(execFile)
const repoRoot = process.cwd()

// This test is heavy (it packs the tarball, installs it, and reaches the network
// for shadcn). It only runs when explicitly requested via `pnpm test:pack` so the
// default int gate stays fast. It is the only test that exercises the *published*
// artifact end to end: dist builds, the files whitelist ships the assets, the
// runtime deps resolve, the asset anchor resolves from an installed location, and
// the bin runs under plain Node with no tsx.
const runPackTest = process.env.RUN_PACK_TEST === '1'

const listFilesRecursive = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        return listFilesRecursive(entryPath)
      }

      return [path.relative(dir, entryPath)]
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
    await execFileAsync('pnpm', ['pack', '--pack-destination', packDir], {
      cwd: repoRoot,
      env: process.env,
      maxBuffer: 10_000_000,
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
    await execFileAsync('npm', ['install', tarballPath, '--no-audit', '--no-fund'], {
      cwd: toolDir,
      env: process.env,
      maxBuffer: 10_000_000,
    })

    const installedPackageDir = path.join(toolDir, 'node_modules', 'payload-components')
    const cliEntry = path.join(installedPackageDir, 'dist', 'cli.js')
    const filesBefore = await listFilesRecursive(installedPackageDir)

    const { fixtureDir, manifest } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)

    // Run the *installed* bin under plain Node (no tsx) against the fixture.
    await execFileAsync(process.execPath, [cliEntry, 'add', manifest.name, '--cwd', fixtureDir], {
      cwd: toolDir,
      env: process.env,
      maxBuffer: 10_000_000,
    })

    await expectInstalledComponents(fixtureDir, [manifest])

    // The install must not write into the package dir (it may be read-only under
    // a global npx cache); all writes go to an OS tmpdir and the target project.
    const filesAfter = await listFilesRecursive(installedPackageDir)
    expect(filesAfter).toEqual(filesBefore)
  }, 600000)
})
