import { execFile } from 'node:child_process'
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  rm,
  stat,
  symlink,
  writeFile,
} from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'

import { afterEach, describe, expect, it } from 'vitest'

import { loadManifest } from '../../tools/payload-components/manifest'
import { applyPayloadFragments } from '../../tools/payload-components/project'
import {
  recordInstalledState,
  recordInstallFailure,
  saveState,
} from '../../tools/payload-components/state'
import {
  SEED_SCRIPT_OWNERSHIP_HEADER,
  writeSeedScript,
} from '../../tools/payload-components/seed/seed-script'
import { CURRENT_ALPHA_TARGET_ID } from '../../tools/payload-components/constants'
import type {
  ComponentManifest,
  InstallState,
} from '../../tools/payload-components/types'

import { createInstallFixture } from './payload-components-fixture'

const execFileAsync = promisify(execFile)
const repoRoot = process.cwd()
const cliPath = path.join(repoRoot, 'bin', 'payload-components.mjs')

const getSeedScriptPath = (cwd: string, componentName: string) =>
  path.join(cwd, 'payload-components', `seed-${componentName}.ts`)

const getSeedStatePath = (cwd: string, componentName: string) =>
  path.join(cwd, '.payload-components', 'demo-state', `${componentName}.json`)

const writeManifestFiles = async (cwd: string, manifest: ComponentManifest) => {
  await Promise.all(
    manifest.files.map(async (filePath) => {
      const absolutePath = path.join(cwd, filePath)

      await mkdir(path.dirname(absolutePath), { recursive: true })
      await writeFile(absolutePath, '// installed fixture file\n', 'utf8')
    }),
  )
}

const recordInstalled = async (
  cwd: string,
  manifest: ComponentManifest,
  overrides: Partial<InstallState['components'][string]> = {},
) => {
  await recordInstalledState({
    cwd,
    manifest,
    patchedFiles: manifest.recovery.patchedFiles,
    targetId: CURRENT_ALPHA_TARGET_ID,
  })

  if (Object.keys(overrides).length > 0) {
    const statePath = path.join(cwd, '.payload-components', 'state.json')
    const state = JSON.parse(await readFile(statePath, 'utf8')) as InstallState

    state.components[manifest.name] = {
      ...state.components[manifest.name],
      ...overrides,
    }
    await saveState(cwd, state)
  }
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
      stderr: expect.stringContaining('has no matching installed-state record'),
    })
    await expectMissing(getSeedScriptPath(fixtureDir, manifest.name))
  })

  it('refuses to write when manifest files exist but Payload fragments are missing', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)
    await writeManifestFiles(fixtureDir, manifest)
    await recordInstalled(fixtureDir, manifest)

    await expect(runSeed(fixtureDir, manifest.name)).rejects.toMatchObject({
      stderr: expect.stringContaining('Missing Payload fragments'),
    })
    await expectMissing(getSeedScriptPath(fixtureDir, manifest.name))
  })

  it('refuses to write when Payload fragments exist but manifest files are missing', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)
    await applyPayloadFragments(fixtureDir, manifest.payloadFragments)
    await recordInstalled(fixtureDir, manifest)

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

  it('refuses files and fragments that have no matching installed-state record', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)
    await writeManifestFiles(fixtureDir, manifest)
    await applyPayloadFragments(fixtureDir, manifest.payloadFragments)

    await expect(runSeed(fixtureDir, manifest.name)).rejects.toMatchObject({
      stderr: expect.stringContaining('has no matching installed-state record'),
    })
    await expectMissing(getSeedScriptPath(fixtureDir, manifest.name))
    await expectMissing(getSeedStatePath(fixtureDir, manifest.name))
  })

  it.each([
    ['manifest version', { manifestVersion: '0.0.0' }, 'state has manifest 0.0.0'],
    ['registry item', { registryItemName: 'forged-item' }, 'state has registry item forged-item'],
    ['target', { targetId: 'another-target' }, 'state target another-target'],
  ])('refuses stale installed state for %s', async (_label, overrides, expectedError) => {
    const { fixtureDir, manifest } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)
    await writeManifestFiles(fixtureDir, manifest)
    await applyPayloadFragments(fixtureDir, manifest.payloadFragments)
    await recordInstalled(fixtureDir, manifest, overrides)

    await expect(runSeed(fixtureDir, manifest.name)).rejects.toMatchObject({
      stderr: expect.stringContaining(expectedError),
    })
    await expectMissing(getSeedScriptPath(fixtureDir, manifest.name))
  })

  it('refuses a missing shadcn registry dependency even when manifest files exist', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)
    await writeManifestFiles(fixtureDir, manifest)
    await applyPayloadFragments(fixtureDir, manifest.payloadFragments)
    await recordInstalled(fixtureDir, manifest)
    await rm(path.join(fixtureDir, 'src', 'components', 'ui', 'badge.tsx'))

    await expect(runSeed(fixtureDir, manifest.name)).rejects.toMatchObject({
      stderr: expect.stringContaining(
        'Missing registry dependencies: badge (src/components/ui/badge.tsx)',
      ),
    })
    await expectMissing(getSeedScriptPath(fixtureDir, manifest.name))
  })

  it('writes a draft script and private ownership state from a healthy install', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)
    await writeManifestFiles(fixtureDir, manifest)
    await applyPayloadFragments(fixtureDir, manifest.payloadFragments)
    await recordInstalled(fixtureDir, manifest)

    const { stdout } = await runSeed(fixtureDir, manifest.name)
    const scriptPath = getSeedScriptPath(fixtureDir, manifest.name)
    const ownershipStatePath = getSeedStatePath(fixtureDir, manifest.name)
    const script = await readFile(scriptPath, 'utf8')
    const ownershipState = JSON.parse(await readFile(ownershipStatePath, 'utf8')) as {
      component: string
      manifestVersion: string
      mediaId: null
      mediaOperationToken: null
      pageId: null
      pageOperationToken: null
      token: string
      version: number
    }

    expect(stdout).toContain(`pnpm exec payload run payload-components/seed-${manifest.name}.ts`)
    expect(script).toContain("await import('../src/payload.config')")
    expect(script).toContain("import type { Page } from '../src/payload-types'")
    expect(script).toContain("type DemoPageLayout = NonNullable<Page['layout']>")
    expect(script).toContain('assertDemoPageLayout(layoutCandidate)')
    expect(script).toContain(`const demoSlug = 'payload-components-demo-${manifest.name}'`)
    expect(script).toContain(`const demoMarkerPrefix = 'payload-components:demo:${manifest.name}'`)
    expect(script).toContain(`const demoTitle = 'Payload Components demo — ${manifest.title}'`)
    expect(script.startsWith(`${SEED_SCRIPT_OWNERSHIP_HEADER}\n`)).toBe(true)
    expect(script).toContain("_status: 'draft'")
    expect(script).toContain("collection.slug === 'pages'")
    expect(script).toContain('requires drafts to be enabled')
    expect(script).toContain('draft: true')
    expect(script).toContain('const existingPages = await payload.find({')
    expect(script).toContain('const isOwnedDemoPage =')
    expect(script).toContain(
      "demoMarkerPrefix + ':' + ownershipToken + ':' + ownershipState.pageOperationToken",
    )
    expect(script).toContain('const pageOperationToken = await journalPageOperation()')
    expect(script).toContain('ownershipState.pageId')
    expect(script).toContain('ownershipState.mediaId')
    expect(script).toContain('Refusing to change')
    expect(script).toContain('await payload.update({')
    expect(script).toContain('id: existingPageID')
    expect(script).toContain('overrideLock: false')
    expect(script).not.toContain('await payload.delete({')
    expect(script).not.toContain('.catch(() => undefined)')
    expect(script.match(/pagination: false/g)).toHaveLength(2)
    expect(script.indexOf('const existingPages = await payload.find({')).toBeLessThan(
      script.indexOf('await payload.update({'),
    )
    expect(ownershipState).toMatchObject({
      component: manifest.name,
      manifestVersion: manifest.version,
      mediaId: null,
      mediaOperationToken: null,
      pageId: null,
      pageOperationToken: null,
      version: 1,
    })
    expect(ownershipState.token).toMatch(/^[0-9a-f-]{36}$/)
    expect(script).toContain(`const ownershipToken = '${ownershipState.token}'`)
    expect((await stat(ownershipStatePath)).mode & 0o777).toBe(0o600)
  })

  it('uses private media ownership and never emits duplicate-media deletion', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('logo-cloud-grid')
    tempDirs.push(fixtureDir)
    await writeManifestFiles(fixtureDir, manifest)
    await applyPayloadFragments(fixtureDir, manifest.payloadFragments)
    await recordInstalled(fixtureDir, manifest)

    await runSeed(fixtureDir, manifest.name)
    const script = await readFile(getSeedScriptPath(fixtureDir, manifest.name), 'utf8')

    expect(script).toContain('const needsDemoMedia = true')
    expect(script).toContain(
      `const demoMediaMarkerPrefix = 'payload-components:demo:${manifest.name}:media'`,
    )
    expect(script).toContain("collection: 'media'")
    expect(script).toContain('alt: {')
    expect(script).toContain('equals: demoMediaAlt')
    expect(script).not.toContain('media.alt === demoMediaAlt')
    expect(script).toContain('alt: demoMediaAlt')
    expect(script).toContain('context: mutationContext')
    expect(script).toContain('overrideAccess: true')
    expect(script).toContain('const mediaOperationToken = await journalMediaOperation()')
    expect(script).toContain('ownershipState.mediaId')
    expect(script).not.toContain('duplicateMedia')
    expect(script).not.toContain('payload.delete')
  })

  it('refuses to overwrite an unowned seed file and preserves it byte-for-byte', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)
    await writeManifestFiles(fixtureDir, manifest)
    await applyPayloadFragments(fixtureDir, manifest.payloadFragments)
    await recordInstalled(fixtureDir, manifest)
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
    const target = {
      configFileRelPath: path.join('src', 'payload.config.ts'),
      marker: `payload-components:demo:${manifest.name}`,
      ownershipStateRelPath: path.join(
        '.payload-components',
        'demo-state',
        `${manifest.name}.json`,
      ),
      scriptRelPath: path.join('payload-components', `seed-${manifest.name}.ts`),
      slug: `payload-components-demo-${manifest.name}`,
      title: `Payload Components demo — ${manifest.title}`,
    }
    const scriptPath = path.join(targetDir, target.scriptRelPath)
    const outsideFile = path.join(outsideDir, 'outside.ts')

    await mkdir(path.dirname(scriptPath), { recursive: true })
    await writeFile(outsideFile, `${SEED_SCRIPT_OWNERSHIP_HEADER}\n`, 'utf8')
    await symlink(outsideFile, scriptPath)

    await expect(writeSeedScript(targetDir, [manifest], target)).rejects.toThrow(
      'Refusing to replace symbolic link',
    )
    expect(await readFile(outsideFile, 'utf8')).toBe(`${SEED_SCRIPT_OWNERSHIP_HEADER}\n`)

    await rm(path.dirname(scriptPath), { force: true, recursive: true })
    await symlink(outsideDir, path.dirname(scriptPath))
    await expect(writeSeedScript(targetDir, [manifest], target)).rejects.toThrow(
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
    const target = {
      configFileRelPath: path.join('src', 'payload.config.ts'),
      marker: `payload-components:demo:${manifest.name}`,
      ownershipStateRelPath: path.join(
        '.payload-components',
        'demo-state',
        `${manifest.name}.json`,
      ),
      scriptRelPath: path.join('payload-components', `seed-${manifest.name}.ts`),
      slug: `payload-components-demo-${manifest.name}`,
      title: `Payload Components demo — ${manifest.title}`,
    }

    await expect(
      writeSeedScript(targetDir, [manifest], {
        ...target,
        scriptRelPath: path.join('..', escapeName),
      }),
    ).rejects.toThrow('must stay inside the target project')
    await expectMissing(escapePath)

    await expect(
      writeSeedScript(targetDir, [manifest], {
        ...target,
        configFileRelPath: path.join('..', 'payload.config.ts'),
      }),
    ).rejects.toThrow('Payload config path must stay inside the target project')

    await expect(
      writeSeedScript(targetDir, [manifest], {
        ...target,
        ownershipStateRelPath: path.join('..', 'demo-state.json'),
      }),
    ).rejects.toThrow('Demo ownership state path must stay inside the target project')

    const scriptPath = await writeSeedScript(targetDir, [manifest], target)
    await writeFile(
      scriptPath,
      `${SEED_SCRIPT_OWNERSHIP_HEADER}\n// stale generated body\n`,
      'utf8',
    )
    await writeSeedScript(targetDir, [manifest], target)

    const source = await readFile(scriptPath, 'utf8')
    const siblings = await readdir(path.dirname(scriptPath))
    expect(source.startsWith(`${SEED_SCRIPT_OWNERSHIP_HEADER}\n`)).toBe(true)
    expect(source).not.toContain('stale generated body')
    expect(siblings).toEqual([path.basename(scriptPath)])
  })

  it('refuses a symbolic link at the private ownership-state path', async () => {
    const manifest = await loadManifest('hero-basic')
    const targetDir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-seed-state-'))
    const outsideDir = await mkdtemp(path.join(os.tmpdir(), 'payload-components-seed-outside-'))
    tempDirs.push(targetDir, outsideDir)
    const target = {
      configFileRelPath: path.join('src', 'payload.config.ts'),
      marker: `payload-components:demo:${manifest.name}`,
      ownershipStateRelPath: path.join(
        '.payload-components',
        'demo-state',
        `${manifest.name}.json`,
      ),
      scriptRelPath: path.join('payload-components', `seed-${manifest.name}.ts`),
      slug: `payload-components-demo-${manifest.name}`,
      title: `Payload Components demo — ${manifest.title}`,
    }
    const statePath = path.join(targetDir, target.ownershipStateRelPath)
    const outsideState = path.join(outsideDir, 'state.json')
    const outsideSource = '{"consumerOwned":true}\n'

    await mkdir(path.dirname(statePath), { recursive: true })
    await writeFile(outsideState, outsideSource, 'utf8')
    await symlink(outsideState, statePath)

    await expect(writeSeedScript(targetDir, [manifest], target)).rejects.toThrow(
      'Refusing symbolic link at demo ownership state path',
    )
    expect(await readFile(outsideState, 'utf8')).toBe(outsideSource)
    await expectMissing(getSeedScriptPath(targetDir, manifest.name))
  })
})
