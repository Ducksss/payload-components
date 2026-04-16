import { cp, mkdtemp as fsMkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

import { afterEach, describe, expect, it } from 'vitest'

const execFileAsync = promisify(execFile)
const repoRoot = process.cwd()
const payloadKitBin = path.join(repoRoot, 'bin', 'payload-kit.mjs')

const copyProjectFixture = async () => {
  const tempDir = await fsMkdtemp(path.join(os.tmpdir(), 'payload-kit-fixture-'))
  await cp(repoRoot, tempDir, {
    filter: (source) => {
      const relative = path.relative(repoRoot, source)

      if (!relative) {
        return true
      }

      const ignoredRoots = [
        '.git',
        '.next',
        '.payload-kit',
        '.playwright-cli',
        'node_modules',
        'output',
        'playwright-report',
        'test-results',
      ]

      return !ignoredRoots.some((ignoredRoot) => relative === ignoredRoot || relative.startsWith(`${ignoredRoot}${path.sep}`))
    },
    recursive: true,
  })

  await symlink(path.join(repoRoot, 'node_modules'), path.join(tempDir, 'node_modules'), 'dir')

  return tempDir
}

const stripInstalledHeroBasic = async (fixtureDir: string) => {
  await rm(path.join(fixtureDir, 'src', 'blocks', 'HeroBasic'), { force: true, recursive: true })

  const renderBlocksPath = path.join(fixtureDir, 'src', 'blocks', 'RenderBlocks.tsx')
  const renderBlocksSource = await readFile(renderBlocksPath, 'utf8')
  const resetRenderBlocks = renderBlocksSource
    .replace("import { HeroBasicBlock } from '@/blocks/HeroBasic/Component'\n", '')
    .replace('  heroBasic: HeroBasicBlock,\n', '')

  await writeFile(renderBlocksPath, resetRenderBlocks, 'utf8')

  const pagesIndexPath = path.join(fixtureDir, 'src', 'collections', 'Pages', 'index.ts')
  const pagesIndexSource = await readFile(pagesIndexPath, 'utf8')
  const resetPagesIndex = pagesIndexSource
    .replace("import { HeroBasic } from '../../blocks/HeroBasic/config'\n", '')
    .replace(
      '              blocks: [CallToAction, Content, MediaBlock, Archive, FormBlock, HeroBasic],',
      '              blocks: [CallToAction, Content, MediaBlock, Archive, FormBlock],',
    )

  await writeFile(pagesIndexPath, resetPagesIndex, 'utf8')
}

describe('payload-kit add', () => {
  const tempDirs: string[] = []

  afterEach(async () => {
    await Promise.all(tempDirs.map((tempDir) => rm(tempDir, { force: true, recursive: true })))
  })

  it(
    'installs hero-basic into a supported repo and records state',
    async () => {
      const fixtureDir = await copyProjectFixture()
      tempDirs.push(fixtureDir)
      await stripInstalledHeroBasic(fixtureDir)

      await execFileAsync(process.execPath, [payloadKitBin, 'add', 'hero-basic', '--cwd', fixtureDir], {
        cwd: repoRoot,
        env: process.env,
        maxBuffer: 10_000_000,
      })

      await expect(readFile(path.join(fixtureDir, 'src', 'blocks', 'HeroBasic', 'config.ts'), 'utf8')).resolves.toContain(
        "slug: 'heroBasic'",
      )
      await expect(readFile(path.join(fixtureDir, 'src', 'blocks', 'RenderBlocks.tsx'), 'utf8')).resolves.toContain(
        'heroBasic: HeroBasicBlock',
      )
      await expect(readFile(path.join(fixtureDir, 'src', 'collections', 'Pages', 'index.ts'), 'utf8')).resolves.toContain(
        'FormBlock, HeroBasic',
      )
      await expect(readFile(path.join(fixtureDir, '.payload-kit', 'state.json'), 'utf8')).resolves.toContain(
        '"status": "installed"',
      )
    },
    180000,
  )

  it(
    'treats a second install as idempotent',
    async () => {
      const fixtureDir = await copyProjectFixture()
      tempDirs.push(fixtureDir)
      await stripInstalledHeroBasic(fixtureDir)

      await execFileAsync(process.execPath, [payloadKitBin, 'add', 'hero-basic', '--cwd', fixtureDir], {
        cwd: repoRoot,
        env: process.env,
        maxBuffer: 10_000_000,
      })

      const secondRun = await execFileAsync(
        process.execPath,
        [payloadKitBin, 'add', 'hero-basic', '--cwd', fixtureDir],
        {
          cwd: repoRoot,
          env: process.env,
          maxBuffer: 10_000_000,
        },
      )

      expect(secondRun.stdout).toContain('"hero-basic" is already installed')
    },
    180000,
  )
})
