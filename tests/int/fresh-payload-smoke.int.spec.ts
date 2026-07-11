import { readdir, mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { loadManifest } from '../../tools/payload-components/manifest'
import * as smokeHarness from '../../tools/payload-components/smoke/fresh-payload-repo'

const { sampleContentNeedsSmokeMedia, writeSeedScript } = smokeHarness

const repoRoot = process.cwd()

describe('fresh Payload smoke component selection', () => {
  it('assigns every registry and manifest slug to exactly one of four deterministic shards', async () => {
    const { getInstallableComponentSlugs, getSmokeShard, SMOKE_SHARD_COUNT } = smokeHarness as typeof smokeHarness & {
      getInstallableComponentSlugs?: () => Promise<string[]>
      getSmokeShard?: (slugs: string[], shardIndex: number) => string[]
      SMOKE_SHARD_COUNT?: number
    }

    expect(getInstallableComponentSlugs).toBeTypeOf('function')
    expect(getSmokeShard).toBeTypeOf('function')
    expect(SMOKE_SHARD_COUNT).toBe(4)
    if (!getInstallableComponentSlugs || !getSmokeShard || !SMOKE_SHARD_COUNT) return

    const registry = JSON.parse(
      await readFile(path.join(repoRoot, 'payload-components', 'registry.json'), 'utf8'),
    ) as { items: Array<{ name: string }> }
    const manifestSlugs = (await readdir(path.join(repoRoot, 'payload-components', 'manifests')))
      .filter((entry) => entry.endsWith('.json'))
      .map((entry) => entry.replace(/\.json$/, ''))
      .sort()
    const registrySlugs = registry.items.map((item) => item.name).sort()
    const installableSlugs = await getInstallableComponentSlugs()
    const shards = Array.from({ length: SMOKE_SHARD_COUNT }, (_, shardIndex) =>
      getSmokeShard(installableSlugs, shardIndex),
    )
    const assignments = shards.flat()

    expect(installableSlugs).toEqual(registrySlugs)
    expect(installableSlugs).toEqual(manifestSlugs)
    expect([...assignments].sort()).toEqual(installableSlugs)
    expect(new Set(assignments).size).toBe(installableSlugs.length)

    shards.forEach((shard, shardIndex) => {
      expect(shard).toEqual(
        installableSlugs.filter((_, sortedIndex) => sortedIndex % SMOKE_SHARD_COUNT === shardIndex),
      )
    })

    for (const slug of installableSlugs) {
      expect(assignments.filter((assignment) => assignment === slug), slug).toHaveLength(1)
    }
  })

  it('renders the production build from the fresh consumer fixture', () => {
    const { getFreshServerArgs } = smokeHarness as typeof smokeHarness & {
      getFreshServerArgs?: (port: number) => string[]
    }

    expect(getFreshServerArgs).toBeTypeOf('function')
    expect(getFreshServerArgs?.(4321)).toEqual([
      'start',
      '--hostname',
      '127.0.0.1',
      '--port',
      '4321',
    ])
  })

  it('resolves the default and CLI shard selections from registry-backed slugs', async () => {
    const installableSlugs = await smokeHarness.getInstallableComponentSlugs()
    const defaultOptions = smokeHarness.parseSmokeArgs([])
    const shardOptions = smokeHarness.parseSmokeArgs(['--shard-index', '2'])
    const pnpmForwardedOptions = smokeHarness.parseSmokeArgs(['--', '--shard-index', '2'])

    await expect(smokeHarness.resolveSmokeComponents(defaultOptions)).resolves.toEqual(
      installableSlugs,
    )
    await expect(smokeHarness.resolveSmokeComponents(shardOptions)).resolves.toEqual(
      smokeHarness.getSmokeShard(installableSlugs, 2),
    )
    await expect(smokeHarness.resolveSmokeComponents(pnpmForwardedOptions)).resolves.toEqual(
      smokeHarness.getSmokeShard(installableSlugs, 2),
    )
    expect(() => smokeHarness.parseSmokeArgs(['--shard-index', '4'])).toThrow(/0 to 3/)
    expect(() =>
      smokeHarness.parseSmokeArgs([
        '--components',
        'hero-basic',
        '--shard-index',
        '0',
      ]),
    ).toThrow(/cannot be used together/)
  })
})

describe('fresh Payload smoke seed generation', () => {
  const tempDirs: string[] = []

  afterEach(async () => {
    await Promise.all(tempDirs.map((tempDir) => rm(tempDir, { force: true, recursive: true })))
  })

  it('adds placeholder media seeding when sample content has required upload slots', async () => {
    const manifest = await loadManifest('logo-cloud-grid')
    const tempDir = await mkdtemp(path.join(tmpdir(), 'payload-components-smoke-seed-'))
    tempDirs.push(tempDir)

    const scriptPath = await writeSeedScript(tempDir, [manifest])
    const script = await readFile(scriptPath, 'utf8')

    expect(sampleContentNeedsSmokeMedia(manifest.sampleContent)).toBe(true)
    expect(script).toContain('const needsSmokeMedia = true')
    expect(script).toContain("collection: 'media'")
    expect(script).toContain("logos: 'logo'")
  })

  it('does not create placeholder media for sample content without upload slots', async () => {
    const manifest = await loadManifest('hero-basic')
    const tempDir = await mkdtemp(path.join(tmpdir(), 'payload-components-smoke-seed-'))
    tempDirs.push(tempDir)

    const scriptPath = await writeSeedScript(tempDir, [manifest])
    const script = await readFile(scriptPath, 'utf8')

    expect(sampleContentNeedsSmokeMedia(manifest.sampleContent)).toBe(false)
    expect(script).toContain('const needsSmokeMedia = false')
  })

  it('seeds deterministic render IDs for components without a title or heading', async () => {
    const manifests = await Promise.all([
      loadManifest('testimonials-quote'),
      loadManifest('testimonials-spotlight'),
    ])
    const tempDir = await mkdtemp(path.join(tmpdir(), 'payload-components-smoke-seed-'))
    tempDirs.push(tempDir)

    const scriptPath = await writeSeedScript(tempDir, manifests)
    const script = await readFile(scriptPath, 'utf8')

    expect(script).toContain('"id": "smoke-testimonials-quote"')
    expect(script).toContain('"id": "smoke-testimonials-spotlight"')
  })

  it('recursively seeds required member avatars in flat and grouped team samples', async () => {
    const manifests = await Promise.all([loadManifest('team-grid'), loadManifest('team-roster')])
    const tempDir = await mkdtemp(path.join(tmpdir(), 'payload-components-smoke-seed-'))
    tempDirs.push(tempDir)

    const scriptPath = await writeSeedScript(tempDir, manifests)
    const script = await readFile(scriptPath, 'utf8')

    expect(manifests.every((manifest) => sampleContentNeedsSmokeMedia(manifest.sampleContent))).toBe(
      true,
    )
    expect(script).toContain("members: 'avatar'")
    expect(script).toContain('addSmokeUploadReferences(nestedValue, mediaID, key)')
  })
})
