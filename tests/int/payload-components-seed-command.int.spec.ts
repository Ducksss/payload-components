import { execFile } from 'node:child_process'
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'

import { afterEach, describe, expect, it } from 'vitest'

import { loadManifest } from '../../tools/payload-components/manifest'
import { applyPayloadFragments } from '../../tools/payload-components/project'
import { recordInstallFailure } from '../../tools/payload-components/state'
import {
  SEED_SCRIPT_OWNERSHIP_HEADER,
  SMOKE_SEED_TARGET,
  writeSeedScript,
} from '../../tools/payload-components/seed/seed-script'
import { CURRENT_ALPHA_TARGET_ID } from '../../tools/payload-components/constants'
import type { ComponentManifest } from '../../tools/payload-components/types'

import { createInstallFixture } from './payload-components-fixture'

const execFileAsync = promisify(execFile)
const repoRoot = process.cwd()
const cliPath = path.join(repoRoot, 'bin', 'payload-components.mjs')

const getSeedScriptPath = (cwd: string, componentName: string) =>
  path.join(cwd, 'payload-components', `seed-${componentName}.ts`)

const writeManifestFiles = async (cwd: string, manifest: ComponentManifest) => {
  await Promise.all(
    manifest.files.map(async (filePath) => {
      const absolutePath = path.join(cwd, filePath)

      await mkdir(path.dirname(absolutePath), { recursive: true })
      await writeFile(absolutePath, '// installed fixture file\n', 'utf8')
    }),
  )
}

const runSeed = (cwd: string, componentName: string) =>
  execFileAsync(process.execPath, [cliPath, 'seed', componentName, '--cwd', cwd], {
    cwd: repoRoot,
    env: process.env,
    maxBuffer: 10_000_000,
  })

const expectMissing = async (filePath: string) => {
  await expect(access(filePath)).rejects.toThrow()
}

describe('payload-components seed command', () => {
  const tempDirs: string[] = []

  afterEach(async () => {
    await Promise.all(tempDirs.map((tempDir) => rm(tempDir, { force: true, recursive: true })))
    tempDirs.length = 0
  })

  it('refuses to write when both manifest files and Payload fragments are missing', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)

    await expect(runSeed(fixtureDir, manifest.name)).rejects.toMatchObject({
      stderr: expect.stringContaining('is not fully installed'),
    })
    await expectMissing(getSeedScriptPath(fixtureDir, manifest.name))
  })

  it('refuses to write when manifest files exist but Payload fragments are missing', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)
    await writeManifestFiles(fixtureDir, manifest)

    await expect(runSeed(fixtureDir, manifest.name)).rejects.toMatchObject({
      stderr: expect.stringContaining('Missing Payload fragments'),
    })
    await expectMissing(getSeedScriptPath(fixtureDir, manifest.name))
  })

  it('refuses to write when Payload fragments exist but manifest files are missing', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)
    await applyPayloadFragments(fixtureDir, manifest.payloadFragments)

    await expect(runSeed(fixtureDir, manifest.name)).rejects.toMatchObject({
      stderr: expect.stringContaining('Missing manifest files'),
    })
    await expectMissing(getSeedScriptPath(fixtureDir, manifest.name))
  })

  it('refuses a recorded partial install even when its files and fragments are present', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)
    await writeManifestFiles(fixtureDir, manifest)
    await applyPayloadFragments(fixtureDir, manifest.payloadFragments)
    await recordInstallFailure({
      cwd: fixtureDir,
      manifest,
      message: 'generate:types failed',
      patchedFiles: manifest.recovery.patchedFiles,
      stage: 'post-install',
      targetId: CURRENT_ALPHA_TARGET_ID,
    })

    await expect(runSeed(fixtureDir, manifest.name)).rejects.toMatchObject({
      stderr: expect.stringContaining('has a recorded partial install'),
    })
    await expectMissing(getSeedScriptPath(fixtureDir, manifest.name))
  })

  it('writes a draft, ownership-safe script from a fully installed real fixture', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)
    await writeManifestFiles(fixtureDir, manifest)
    await applyPayloadFragments(fixtureDir, manifest.payloadFragments)

    const { stdout } = await runSeed(fixtureDir, manifest.name)
    const scriptPath = getSeedScriptPath(fixtureDir, manifest.name)
    const script = await readFile(scriptPath, 'utf8')

    await expectMissing(path.join(fixtureDir, '.payload-components', 'state.json'))
    expect(stdout).toContain(`pnpm exec payload run payload-components/seed-${manifest.name}.ts`)
    expect(script).toContain("await import('../src/payload.config')")
    expect(script).toContain(`const demoSlug = 'payload-components-demo-${manifest.name}'`)
    expect(script).toContain(`const demoMarker = 'payload-components:demo:${manifest.name}'`)
    expect(script).toContain(`const demoTitle = 'Payload Components demo — ${manifest.title}'`)
    expect(script.startsWith(`${SEED_SCRIPT_OWNERSHIP_HEADER}\n`)).toBe(true)
    expect(script).toContain("_status: 'draft'")
    expect(script).toContain("collection.slug === 'pages'")
    expect(script).toContain('requires drafts to be enabled')
    expect(script).toContain('draft: true')
    expect(script).toContain('const existingPages = await payload.find({')
    expect(script).toContain('const isOwnedDemoPage =')
    expect(script).toContain('page.title === demoTitle')
    expect(script).toContain('firstBlock.id === demoMarker')
    expect(script).toContain('Refusing to change')
    expect(script).toContain('await payload.update({')
    expect(script).toContain('id: existingPage.id')
    expect(script).not.toContain("collection: 'pages',\n    context: mutationContext,\n    id:")
    expect(script).not.toContain('.catch(() => undefined)')
    expect(script.match(/pagination: false/g)).toHaveLength(2)
    expect(script.indexOf('const existingPages = await payload.find({')).toBeLessThan(
      script.indexOf('await payload.update({'),
    )
  })

  it('marks, removes, and recreates only component-owned placeholder media', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('logo-cloud-grid')
    tempDirs.push(fixtureDir)
    await writeManifestFiles(fixtureDir, manifest)
    await applyPayloadFragments(fixtureDir, manifest.payloadFragments)

    await runSeed(fixtureDir, manifest.name)
    const script = await readFile(getSeedScriptPath(fixtureDir, manifest.name), 'utf8')

    expect(script).toContain('const needsDemoMedia = true')
    expect(script).toContain(`const demoMediaMarker = 'payload-components:demo:${manifest.name}:media'`)
    expect(script).toContain("collection: 'media'")
    expect(script).toContain('alt: {')
    expect(script).toContain('equals: demoMediaAlt')
    expect(script).not.toContain('media.alt === demoMediaAlt')
    expect(script).toContain('alt: demoMediaAlt')
    expect(script).toContain('context: mutationContext')
    expect(script).toContain('overrideAccess: true')
    expect(script.indexOf('filePath: mediaPath')).toBeLessThan(
      script.indexOf('id: duplicateMedia.id'),
    )
  })

  it('refuses to overwrite an unowned seed file and preserves it byte-for-byte', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)
    await writeManifestFiles(fixtureDir, manifest)
    await applyPayloadFragments(fixtureDir, manifest.payloadFragments)
    const scriptPath = getSeedScriptPath(fixtureDir, manifest.name)
    const unownedSource = '// maintained by the consumer\n'

    await mkdir(path.dirname(scriptPath), { recursive: true })
    await writeFile(scriptPath, unownedSource, 'utf8')

    await expect(runSeed(fixtureDir, manifest.name)).rejects.toMatchObject({
      stderr: expect.stringContaining('Refusing to overwrite unowned seed script'),
    })
    expect(await readFile(scriptPath, 'utf8')).toBe(unownedSource)
  })

  it('refuses seed-file and parent-directory symlinks', async () => {
    const manifest = await loadManifest('hero-basic')
    const targetDir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-seed-safety-'))
    const outsideDir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-seed-outside-'))
    tempDirs.push(targetDir, outsideDir)
    const scriptPath = path.join(targetDir, SMOKE_SEED_TARGET.scriptRelPath)
    const outsideFile = path.join(outsideDir, 'outside.ts')

    await mkdir(path.dirname(scriptPath), { recursive: true })
    await writeFile(outsideFile, `${SEED_SCRIPT_OWNERSHIP_HEADER}\n`, 'utf8')
    await symlink(outsideFile, scriptPath)

    await expect(writeSeedScript(targetDir, [manifest])).rejects.toThrow(
      'Refusing to replace symbolic link',
    )
    expect(await readFile(outsideFile, 'utf8')).toBe(`${SEED_SCRIPT_OWNERSHIP_HEADER}\n`)

    await rm(path.dirname(scriptPath), { force: true, recursive: true })
    await symlink(outsideDir, path.dirname(scriptPath))
    await expect(writeSeedScript(targetDir, [manifest])).rejects.toThrow(
      'Refusing to use symbolic link in seed script path',
    )
    expect(await readdir(outsideDir)).toEqual(['outside.ts'])
  })

  it('rejects path escapes and atomically replaces only owned generated scripts', async () => {
    const manifest = await loadManifest('hero-basic')
    const targetDir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-seed-atomic-'))
    tempDirs.push(targetDir)
    const escapeName = `${path.basename(targetDir)}-escape.ts`
    const escapePath = path.join(path.dirname(targetDir), escapeName)

    await expect(
      writeSeedScript(targetDir, [manifest], {
        ...SMOKE_SEED_TARGET,
        scriptRelPath: path.join('..', escapeName),
      }),
    ).rejects.toThrow('must stay inside the target project')
    await expectMissing(escapePath)

    await expect(
      writeSeedScript(targetDir, [manifest], {
        ...SMOKE_SEED_TARGET,
        configFileRelPath: path.join('..', 'payload.config.ts'),
      }),
    ).rejects.toThrow('Payload config path must stay inside the target project')

    const scriptPath = await writeSeedScript(targetDir, [manifest])
    await writeFile(
      scriptPath,
      `${SEED_SCRIPT_OWNERSHIP_HEADER}\n// stale generated body\n`,
      'utf8',
    )
    await writeSeedScript(targetDir, [manifest])

    const source = await readFile(scriptPath, 'utf8')
    const siblings = await readdir(path.dirname(scriptPath))
    expect(source.startsWith(`${SEED_SCRIPT_OWNERSHIP_HEADER}\n`)).toBe(true)
    expect(source).not.toContain('stale generated body')
    expect(siblings).toEqual([path.basename(scriptPath)])
  })
})
