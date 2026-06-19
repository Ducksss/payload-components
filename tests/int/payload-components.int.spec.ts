import { readdir, readFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

import { afterEach, describe, expect, it } from 'vitest'

import { PAGES_LAYOUT_FILE, RENDER_BLOCKS_FILE } from '../../tools/payload-components/constants'
import { loadManifest } from '../../tools/payload-components/manifest'

import { expectInstalledComponents, readInstallState } from './payload-components-assertions'
import { createInstallFixture, createInstallFixtureForComponents } from './payload-components-fixture'

const execFileAsync = promisify(execFile)
const repoRoot = process.cwd()
const payloadComponentBin = path.join(repoRoot, 'bin', 'payload-components.mjs')
const manifestsDir = path.join(repoRoot, 'payload-components', 'manifests')
const registryPath = path.join(repoRoot, 'payload-components', 'registry.json')

type RegistryDefinition = {
  items: Array<{
    files?: Array<{ path: string; target?: string }>
    name: string
  }>
}

const representativeInstallComponents = [
  'embed-basic',
  'hero-basic',
  'feature-grid-basic',
  'logo-cloud-marquee',
  'call-to-action-signup',
  'team-grid',
  'pricing-cards',
] as const

const idempotencyComponents = ['hero-basic', 'logo-cloud-marquee'] as const

const readJson = async <T>(filePath: string): Promise<T> =>
  JSON.parse(await readFile(filePath, 'utf8')) as T

const manifestNames = async () =>
  (await readdir(manifestsDir))
    .filter((entry) => entry.endsWith('.json'))
    .map((entry) => entry.replace(/\.json$/, ''))
    .sort()

const runAddCommand = async (fixtureDir: string, componentName: string) =>
  execFileAsync(process.execPath, [payloadComponentBin, 'add', componentName, '--cwd', fixtureDir], {
    cwd: repoRoot,
    env: process.env,
    maxBuffer: 10_000_000,
  })

describe('payload-components manifests', () => {
  it('keeps every manifest wired to registry source, docs, and recovery targets', async () => {
    const [registry, names] = await Promise.all([
      readJson<RegistryDefinition>(registryPath),
      manifestNames(),
    ])
    const registryByName = new Map(registry.items.map((item) => [item.name, item]))
    const expectedPatchFor = (kind: string) =>
      kind === 'renderBlocks' ? RENDER_BLOCKS_FILE : PAGES_LAYOUT_FILE

    expect(names.length).toBeGreaterThan(0)

    for (const name of names) {
      const manifest = await loadManifest(name)
      const registryItem = registryByName.get(manifest.registryItemName)

      expect(registryItem, `${name} missing registry item`).toBeTruthy()

      const registryTargets = (registryItem?.files ?? [])
        .map((file) => file.target?.replace(/^~\//, ''))
        .filter(Boolean)
        .sort()

      expect(registryTargets).toEqual([...manifest.files].sort())

      for (const file of registryItem?.files ?? []) {
        await expect(readFile(path.join(repoRoot, file.path), 'utf8')).resolves.toBeTruthy()
      }

      await expect(
        readFile(path.join(repoRoot, 'content', 'docs', 'components', `${name}.mdx`), 'utf8'),
      ).resolves.toContain(`npx payload-components add ${name}`)

      for (const fragment of manifest.payloadFragments) {
        expect(manifest.recovery.patchedFiles).toContain(expectedPatchFor(fragment.kind))
      }
    }
  })
})

describe('payload-components add', () => {
  const tempDirs: string[] = []

  afterEach(async () => {
    await Promise.all(tempDirs.map((tempDir) => rm(tempDir, { force: true, recursive: true })))
  })

  it.each(representativeInstallComponents)('installs %s into a supported repo and records state', async (componentName) => {
    const { fixtureDir, manifest } = await createInstallFixture(componentName)
    tempDirs.push(fixtureDir)

    await runAddCommand(fixtureDir, manifest.name)

    const parsedState = await readInstallState(fixtureDir)

    expect(parsedState.version).toBe(2)
    await expectInstalledComponents(fixtureDir, [manifest])
  }, 180000)

  it('installs multiple components without duplicate registrations', async () => {
    const componentNames = ['hero-basic', 'feature-grid-basic', 'logo-cloud-marquee']
    const { fixtureDir, manifests } = await createInstallFixtureForComponents(componentNames)
    tempDirs.push(fixtureDir)

    for (const componentName of componentNames) {
      await runAddCommand(fixtureDir, componentName)
    }

    await expectInstalledComponents(fixtureDir, manifests)
  }, 180000)

  it.each(idempotencyComponents)('treats a second %s install as idempotent', async (componentName) => {
    const manifest = await loadManifest(componentName)
    const { fixtureDir } = await createInstallFixture(manifest.name)
    tempDirs.push(fixtureDir)

    await runAddCommand(fixtureDir, manifest.name)

    const secondRun = await runAddCommand(fixtureDir, manifest.name)

    expect(secondRun.stdout).toContain(`"${manifest.name}" is already installed`)
  }, 180000)
})
