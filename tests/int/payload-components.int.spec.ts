import { readFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

import { afterEach, describe, expect, it } from 'vitest'

import { loadManifest } from '../../tools/payload-components/manifest'

import { createInstallFixture, createInstallFixtureForComponents } from './payload-components-fixture'

import type { InstallState, ComponentManifest, PayloadFragment } from '../../tools/payload-components/types'

const execFileAsync = promisify(execFile)
const repoRoot = process.cwd()
const payloadComponentBin = path.join(repoRoot, 'bin', 'payload-components.mjs')
const layoutAnchor = "name: 'layout'"
const logoCloudComponents = [
  'logo-cloud-grid',
  'logo-cloud-hover',
  'logo-cloud-marquee',
  'logo-cloud-inline',
  'logo-cloud-inline-wrap',
] as const
const integrationComponents = [
  'integration-grid',
  'integration-cluster',
  'integration-split',
  'integration-connect',
  'integration-orbit',
  'integration-list',
  'integration-marquee',
  'integration-testimonial',
] as const

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const normalizeFileList = (files: string[]) => [...new Set(files)].sort()

const runAddCommand = async (fixtureDir: string, componentName: string) =>
  execFileAsync(process.execPath, [payloadComponentBin, 'add', componentName, '--cwd', fixtureDir], {
    cwd: repoRoot,
    env: process.env,
    maxBuffer: 10_000_000,
  })

const readFixtureFile = (fixtureDir: string, filePath: string) =>
  readFile(path.join(fixtureDir, filePath), 'utf8')

const readInstallState = async (fixtureDir: string) =>
  JSON.parse(
    await readFixtureFile(fixtureDir, path.join('.payload-components', 'state.json')),
  ) as InstallState

const countOccurrences = (source: string, text: string) =>
  source.match(new RegExp(escapeRegExp(text), 'g'))?.length ?? 0

const getLayoutBlockEntries = (source: string) => {
  const layoutIndex = source.indexOf(layoutAnchor)

  if (layoutIndex === -1) {
    throw new Error('Unable to find the layout tab in Pages collection config.')
  }

  const layoutSlice = source.slice(layoutIndex)
  const blocksMatch = layoutSlice.match(/blocks:\s*\[([\s\S]*?)\],/)

  if (!blocksMatch?.[1]) {
    throw new Error('Unable to find the layout block list in Pages collection config.')
  }

  return blocksMatch[1]
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
}

const getPayloadFragment = <TKind extends PayloadFragment['kind']>(
  manifest: ComponentManifest,
  kind: TKind,
): Extract<PayloadFragment, { kind: TKind }> => {
  const fragment = manifest.payloadFragments.find((candidate) => candidate.kind === kind)

  if (!fragment) {
    throw new Error(`Unable to find the ${kind} payload fragment for "${manifest.name}".`)
  }

  return fragment as Extract<PayloadFragment, { kind: TKind }>
}

const expectManifestFilesInstalled = async (fixtureDir: string, manifest: ComponentManifest) => {
  await Promise.all(
    manifest.files.map(async (filePath) => {
      const installedSource = await readFixtureFile(fixtureDir, filePath)
      expect(installedSource.length).toBeGreaterThan(0)
    }),
  )
}

const expectUniqueRegistrations = ({
  manifest,
  pagesSource,
  renderBlocksSource,
}: {
  manifest: ComponentManifest
  pagesSource: string
  renderBlocksSource: string
}) => {
  const renderBlocksFragment = getPayloadFragment(manifest, 'renderBlocks')
  const pagesLayoutFragment = getPayloadFragment(manifest, 'pagesLayout')

  expect(
    countOccurrences(
      renderBlocksSource,
      `import { ${renderBlocksFragment.importName} } from '${renderBlocksFragment.importPath}'`,
    ),
  ).toBe(1)
  expect(
    countOccurrences(
      renderBlocksSource,
      `${renderBlocksFragment.blockSlug}: ${renderBlocksFragment.importName}`,
    ),
  ).toBe(1)

  expect(
    countOccurrences(
      pagesSource,
      `import { ${pagesLayoutFragment.importName} } from '${pagesLayoutFragment.importPath}'`,
    ),
  ).toBe(1)
  expect(
    getLayoutBlockEntries(pagesSource).filter((entry) => entry === pagesLayoutFragment.blockName),
  ).toHaveLength(1)
}

const expectInstalledStateEntry = (state: InstallState, manifest: ComponentManifest) => {
  const expectedPatchedFiles = normalizeFileList([
    ...manifest.recovery.patchedFiles,
    ...(Object.keys(manifest.dependencies).length > 0 ? ['package.json', 'pnpm-lock.yaml'] : []),
  ])

  expect(state.components[manifest.name]).toMatchObject({
    installedFiles: normalizeFileList(manifest.files),
    manifestVersion: manifest.version,
    patchedFiles: expectedPatchedFiles,
    registryItemName: manifest.registryItemName,
    status: 'installed',
  })
  expect(state.components[manifest.name]?.installedAt).toBeTruthy()
}

const expectInstalledComponents = async (fixtureDir: string, manifests: ComponentManifest[]) => {
  await Promise.all(manifests.map((manifest) => expectManifestFilesInstalled(fixtureDir, manifest)))

  const [renderBlocksSource, pagesSource, state] = await Promise.all([
    readFixtureFile(fixtureDir, path.join('src', 'blocks', 'RenderBlocks.tsx')),
    readFixtureFile(fixtureDir, path.join('src', 'collections', 'Pages', 'index.ts')),
    readInstallState(fixtureDir),
  ])

  for (const manifest of manifests) {
    expectUniqueRegistrations({
      manifest,
      pagesSource,
      renderBlocksSource,
    })
    expectInstalledStateEntry(state, manifest)
  }
}

describe('payload-components add', () => {
  const tempDirs: string[] = []

  afterEach(async () => {
    await Promise.all(tempDirs.map((tempDir) => rm(tempDir, { force: true, recursive: true })))
  })

  it('installs hero-basic into a supported repo and records state', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('hero-basic')
    tempDirs.push(fixtureDir)

    await runAddCommand(fixtureDir, manifest.name)

    const parsedState = await readInstallState(fixtureDir)

    expect(parsedState.version).toBe(2)
    await expectInstalledComponents(fixtureDir, [manifest])
  }, 180000)

  it('installs feature-grid-basic into a supported repo and records state', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('feature-grid-basic')
    tempDirs.push(fixtureDir)

    await runAddCommand(fixtureDir, manifest.name)

    const parsedState = await readInstallState(fixtureDir)

    expect(parsedState.version).toBe(2)
    await expectInstalledComponents(fixtureDir, [manifest])
  }, 180000)

  it('installs feature-split into a supported repo and records state', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('feature-split')
    tempDirs.push(fixtureDir)

    await runAddCommand(fixtureDir, manifest.name)

    const parsedState = await readInstallState(fixtureDir)

    expect(parsedState.version).toBe(2)
    await expectInstalledComponents(fixtureDir, [manifest])
  }, 180000)

  it('installs feature-bento into a supported repo and records state', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('feature-bento')
    tempDirs.push(fixtureDir)

    await runAddCommand(fixtureDir, manifest.name)

    const parsedState = await readInstallState(fixtureDir)

    expect(parsedState.version).toBe(2)
    await expectInstalledComponents(fixtureDir, [manifest])
  }, 180000)

  it('installs feature-steps into a supported repo and records state', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('feature-steps')
    tempDirs.push(fixtureDir)

    await runAddCommand(fixtureDir, manifest.name)

    const parsedState = await readInstallState(fixtureDir)

    expect(parsedState.version).toBe(2)
    await expectInstalledComponents(fixtureDir, [manifest])
  }, 180000)

  it('installs embed-basic into a supported repo and records state', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('embed-basic')
    tempDirs.push(fixtureDir)

    await runAddCommand(fixtureDir, manifest.name)

    const parsedState = await readInstallState(fixtureDir)

    expect(parsedState.version).toBe(2)
    await expectInstalledComponents(fixtureDir, [manifest])
  }, 180000)

  it.each(logoCloudComponents)('installs %s into a supported repo and records state', async (componentName) => {
    const { fixtureDir, manifest } = await createInstallFixture(componentName)
    tempDirs.push(fixtureDir)

    await runAddCommand(fixtureDir, manifest.name)

    const parsedState = await readInstallState(fixtureDir)

    expect(parsedState.version).toBe(2)
    await expectInstalledComponents(fixtureDir, [manifest])
  }, 180000)

  it.each([
    'content-columns',
    'content-image-lead',
    'content-feature-media',
    'content-feature-split',
    'content-showcase',
    'content-quote',
    'content-community',
  ])('installs %s into a supported repo and records state', async (componentName) => {
    const { fixtureDir, manifest } = await createInstallFixture(componentName)
    tempDirs.push(fixtureDir)

    await runAddCommand(fixtureDir, manifest.name)

    const parsedState = await readInstallState(fixtureDir)

    expect(parsedState.version).toBe(2)
    await expectInstalledComponents(fixtureDir, [manifest])
  }, 180000)

  it('installs hero-basic followed by feature-grid-basic without duplicate registrations', async () => {
    const { fixtureDir, manifests } = await createInstallFixtureForComponents([
      'hero-basic',
      'feature-grid-basic',
    ])
    tempDirs.push(fixtureDir)

    await runAddCommand(fixtureDir, 'hero-basic')
    await runAddCommand(fixtureDir, 'feature-grid-basic')

    await expectInstalledComponents(fixtureDir, manifests)
  }, 180000)

  it('installs feature-grid-basic followed by hero-basic without duplicate registrations', async () => {
    const { fixtureDir, manifests } = await createInstallFixtureForComponents([
      'feature-grid-basic',
      'hero-basic',
    ])
    tempDirs.push(fixtureDir)

    await runAddCommand(fixtureDir, 'feature-grid-basic')
    await runAddCommand(fixtureDir, 'hero-basic')

    await expectInstalledComponents(fixtureDir, manifests)
  }, 180000)

  it('installs logo-cloud-grid followed by hero-basic without duplicate registrations', async () => {
    const { fixtureDir, manifests } = await createInstallFixtureForComponents([
      'logo-cloud-grid',
      'hero-basic',
    ])
    tempDirs.push(fixtureDir)

    await runAddCommand(fixtureDir, 'logo-cloud-grid')
    await runAddCommand(fixtureDir, 'hero-basic')

    await expectInstalledComponents(fixtureDir, manifests)
  }, 180000)

  it('treats a second install as idempotent', async () => {
    const manifest = await loadManifest('hero-basic')
    const { fixtureDir } = await createInstallFixture(manifest.name)
    tempDirs.push(fixtureDir)

    await runAddCommand(fixtureDir, manifest.name)

    const secondRun = await runAddCommand(fixtureDir, manifest.name)

    expect(secondRun.stdout).toContain(`"${manifest.name}" is already installed`)
  }, 180000)

  it('treats a second feature-grid-basic install as idempotent', async () => {
    const manifest = await loadManifest('feature-grid-basic')
    const { fixtureDir } = await createInstallFixture(manifest.name)
    tempDirs.push(fixtureDir)

    await runAddCommand(fixtureDir, manifest.name)

    const secondRun = await runAddCommand(fixtureDir, manifest.name)

    expect(secondRun.stdout).toContain(`"${manifest.name}" is already installed`)
  }, 180000)

  it.each(logoCloudComponents)('treats a second %s install as idempotent', async (componentName) => {
    const manifest = await loadManifest(componentName)
    const { fixtureDir } = await createInstallFixture(manifest.name)
    tempDirs.push(fixtureDir)

    await runAddCommand(fixtureDir, manifest.name)

    const secondRun = await runAddCommand(fixtureDir, manifest.name)

    expect(secondRun.stdout).toContain(`"${manifest.name}" is already installed`)
  }, 180000)

  it.each(integrationComponents)('installs %s into a supported repo and records state', async (componentName) => {
    const { fixtureDir, manifest } = await createInstallFixture(componentName)
    tempDirs.push(fixtureDir)

    await runAddCommand(fixtureDir, manifest.name)

    const parsedState = await readInstallState(fixtureDir)

    expect(parsedState.version).toBe(2)
    await expectInstalledComponents(fixtureDir, [manifest])
  }, 180000)

  it('installs integration-grid followed by hero-basic without duplicate registrations', async () => {
    const { fixtureDir, manifests } = await createInstallFixtureForComponents([
      'integration-grid',
      'hero-basic',
    ])
    tempDirs.push(fixtureDir)

    await runAddCommand(fixtureDir, 'integration-grid')
    await runAddCommand(fixtureDir, 'hero-basic')

    await expectInstalledComponents(fixtureDir, manifests)
  }, 180000)

  it.each(integrationComponents)('treats a second %s install as idempotent', async (componentName) => {
    const manifest = await loadManifest(componentName)
    const { fixtureDir } = await createInstallFixture(manifest.name)
    tempDirs.push(fixtureDir)

    await runAddCommand(fixtureDir, manifest.name)

    const secondRun = await runAddCommand(fixtureDir, manifest.name)

    expect(secondRun.stdout).toContain(`"${manifest.name}" is already installed`)
  }, 180000)
})
