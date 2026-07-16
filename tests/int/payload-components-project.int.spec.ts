import { rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { getRuntimePatchedFiles } from '../../tools/payload-components/dependencies'
import { detectProject } from '../../tools/payload-components/project'

import { createInstallFixture } from './payload-components-fixture'

describe('payload-components project detection', () => {
  const tempDirs: string[] = []

  afterEach(async () => {
    await Promise.all(tempDirs.splice(0).map((tempDir) => rm(tempDir, { force: true, recursive: true })))
  })

  it('retains bun.lock as the recovery lockfile when both Bun formats exist', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)
    await rm(path.join(fixtureDir, 'pnpm-lock.yaml'))
    await Promise.all([
      writeFile(path.join(fixtureDir, 'bun.lock'), 'bun modern lockfile\n', 'utf8'),
      writeFile(path.join(fixtureDir, 'bun.lockb'), 'bun legacy lockfile\n', 'utf8'),
    ])

    const project = await detectProject(fixtureDir)
    const patchedFiles = getRuntimePatchedFiles({
      dependencies: { example: '^1.0.0' },
      lockfilePath: project.lockfilePath,
      recoveryPatchedFiles: manifest.recovery.patchedFiles,
    })

    expect(project.packageManager).toBe('bun')
    expect(project.lockfilePath).toBe('bun.lock')
    expect(patchedFiles).toContain('bun.lock')
    expect(patchedFiles).not.toContain('bun.lockb')
  })

  it('retains legacy bun.lockb as the recovery lockfile when it is discovered', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)
    await rm(path.join(fixtureDir, 'pnpm-lock.yaml'))
    await writeFile(path.join(fixtureDir, 'bun.lockb'), 'bun legacy lockfile\n', 'utf8')

    const project = await detectProject(fixtureDir)
    const patchedFiles = getRuntimePatchedFiles({
      dependencies: { example: '^1.0.0' },
      lockfilePath: project.lockfilePath,
      recoveryPatchedFiles: manifest.recovery.patchedFiles,
    })

    expect(project.packageManager).toBe('bun')
    expect(project.lockfilePath).toBe('bun.lockb')
    expect(patchedFiles).toContain('bun.lockb')
    expect(patchedFiles).not.toContain('bun.lock')
  })
})
