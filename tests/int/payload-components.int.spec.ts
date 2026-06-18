import { rm } from 'node:fs/promises'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

import { afterEach, describe, expect, it } from 'vitest'

import { loadManifest } from '../../tools/payload-components/manifest'

import { expectInstalledComponents, readInstallState } from './payload-components-assertions'
import { createInstallFixture, createInstallFixtureForComponents } from './payload-components-fixture'

const execFileAsync = promisify(execFile)
const repoRoot = process.cwd()
const payloadComponentBin = path.join(repoRoot, 'bin', 'payload-components.mjs')
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

const runAddCommand = async (fixtureDir: string, componentName: string) =>
  execFileAsync(process.execPath, [payloadComponentBin, 'add', componentName, '--cwd', fixtureDir], {
    cwd: repoRoot,
    env: process.env,
    maxBuffer: 10_000_000,
  })

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
    'content-split-rows',
    'content-rows',
    'content-image-frame',
    'content-stats',
    'content-list',
    'content-list-columns',
    'content-list-icons',
    'team-roster',
    'team-grid',
  ])('installs %s into a supported repo and records state', async (componentName) => {
    const { fixtureDir, manifest } = await createInstallFixture(componentName)
    tempDirs.push(fixtureDir)

    await runAddCommand(fixtureDir, manifest.name)

    const parsedState = await readInstallState(fixtureDir)

    expect(parsedState.version).toBe(2)
    await expectInstalledComponents(fixtureDir, [manifest])
  }, 180000)

  it('installs call-to-action-centered into a supported repo and records state', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('call-to-action-centered')
    tempDirs.push(fixtureDir)

    await runAddCommand(fixtureDir, manifest.name)

    const parsedState = await readInstallState(fixtureDir)

    expect(parsedState.version).toBe(2)
    await expectInstalledComponents(fixtureDir, [manifest])
  }, 180000)

  it('installs call-to-action-boxed into a supported repo and records state', async () => {
    const { fixtureDir, manifest } = await createInstallFixture('call-to-action-boxed')
    tempDirs.push(fixtureDir)

    await runAddCommand(fixtureDir, manifest.name)

    const parsedState = await readInstallState(fixtureDir)

    expect(parsedState.version).toBe(2)
    await expectInstalledComponents(fixtureDir, [manifest])
  }, 180000)

  /* call-to-action-signup is intentionally not given an install+state test: like
     logo-cloud-marquee (which adds `motion`), it ships an npm dependency
     (`lucide-react`), so the dependency-install stage rewrites package.json /
     pnpm-lock.yaml and records them as patched — which the strict patchedFiles
     assertion above does not model. Its files, registry deps, and demo-twin
     fidelity are covered by the registry and demo-twin specs instead. */

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
