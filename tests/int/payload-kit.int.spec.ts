import { readFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

import { afterEach, describe, expect, it } from 'vitest'

import { createInstallFixture } from './payload-kit-fixture'

const execFileAsync = promisify(execFile)
const repoRoot = process.cwd()
const payloadKitBin = path.join(repoRoot, 'bin', 'payload-kit.mjs')

describe('payload-kit add', () => {
  const tempDirs: string[] = []

  afterEach(async () => {
    await Promise.all(tempDirs.map((tempDir) => rm(tempDir, { force: true, recursive: true })))
  })

  it(
    'installs hero-basic into a supported repo and records state',
    async () => {
      const { fixtureDir } = await createInstallFixture('hero-basic')
      tempDirs.push(fixtureDir)

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
      const rawState = await readFile(path.join(fixtureDir, '.payload-kit', 'state.json'), 'utf8')
      const parsedState = JSON.parse(rawState) as {
        kits: Record<
          string,
          {
            installedFiles: string[]
            patchedFiles: string[]
            status: string
          }
        >
        version: number
      }

      expect(parsedState.version).toBe(2)
      expect(parsedState.kits['hero-basic']?.status).toBe('installed')
      expect(parsedState.kits['hero-basic']?.installedFiles).toEqual([
        'src/blocks/HeroBasic/Component.tsx',
        'src/blocks/HeroBasic/config.ts',
      ])
      expect(parsedState.kits['hero-basic']?.patchedFiles).toEqual([
        'src/blocks/RenderBlocks.tsx',
        'src/collections/Pages/index.ts',
      ])
    },
    180000,
  )

  it(
    'treats a second install as idempotent',
    async () => {
      const { fixtureDir } = await createInstallFixture('hero-basic')
      tempDirs.push(fixtureDir)

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
