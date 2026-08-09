import { mkdir, readdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it } from 'vitest'

import { loadManifest } from '../../tools/payload-components/manifest'
import * as smokeHarness from '../../tools/payload-components/smoke/fresh-payload-repo'

const { sampleContentNeedsSmokeMedia, writeSeedScript } = smokeHarness

const repoRoot = process.cwd()

describe('fresh Payload smoke component selection', () => {
  const tempDirs: string[] = []

  afterEach(async () => {
    await Promise.all(tempDirs.map((tempDir) => rm(tempDir, { force: true, recursive: true })))
  })

  it('assigns every renderable registry block to exactly one deterministic shard', async () => {
    const { getInstallableComponentSlugs, getSmokeShard, SMOKE_SHARD_COUNT } =
      smokeHarness as typeof smokeHarness & {
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
    ) as { items: Array<{ name: string; type?: string }> }
    const manifestSlugs = (await readdir(path.join(repoRoot, 'payload-components', 'manifests')))
      .filter((entry) => entry.endsWith('.json'))
      .map((entry) => entry.replace(/\.json$/, ''))
      .sort()
    const registryBlockSlugs = registry.items
      .filter((item) => item.type === 'registry:block')
      .map((item) => item.name)
      .sort()
    const installableSlugs = await getInstallableComponentSlugs()
    const selection = await smokeHarness.getDefaultSmokeSelection()
    const shards = Array.from({ length: SMOKE_SHARD_COUNT }, (_, shardIndex) =>
      getSmokeShard(installableSlugs, shardIndex),
    )
    const assignments = shards.flat()

    expect(installableSlugs).toEqual(registryBlockSlugs)
    expect(installableSlugs).toEqual(manifestSlugs)
    expect(selection.components).toEqual(installableSlugs)
    expect(
      [...selection.components, ...selection.exclusions.map((exclusion) => exclusion.name)].sort(),
    ).toEqual(registry.items.map((item) => item.name).sort())
    expect(selection.exclusions).toEqual(
      registry.items
        .filter((item) => item.type !== 'registry:block')
        .map((item) => ({
          name: item.name,
          reason: smokeHarness.DEFAULT_SMOKE_EXCLUSION_REASON,
          type: item.type,
        }))
        .sort((left, right) => left.name.localeCompare(right.name)),
    )
    expect([...assignments].sort()).toEqual(installableSlugs)
    expect(new Set(assignments).size).toBe(installableSlugs.length)

    shards.forEach((shard, shardIndex) => {
      expect(shard).toEqual(
        installableSlugs.filter((_, sortedIndex) => sortedIndex % SMOKE_SHARD_COUNT === shardIndex),
      )
    })

    for (const slug of installableSlugs) {
      expect(
        assignments.filter((assignment) => assignment === slug),
        slug,
      ).toHaveLength(1)
      const manifest = await loadManifest(slug)

      expect(smokeHarness.getRenderableSampleBlockType(manifest), slug).toBe(
        manifest.sampleContent.blockType,
      )
    }
  })

  it('rejects default coverage for a block without renderable sample content', async () => {
    const manifest = await loadManifest('hero-basic')

    expect(() =>
      smokeHarness.getRenderableSampleBlockType({
        ...manifest,
        sampleContent: {},
      }),
    ).toThrow(/sampleContent\.blockType/)
    expect(() =>
      smokeHarness.getRenderableSampleBlockType({
        ...manifest,
        sampleContent: {
          blockType: '   ',
        },
      }),
    ).toThrow(/sampleContent\.blockType/)
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
      smokeHarness.parseSmokeArgs(['--components', 'hero-basic', '--shard-index', '0']),
    ).toThrow(/cannot be used together/)
  })

  it('scaffolds the website template by default and the blank one for the bare scenario', () => {
    const base = { projectName: 'p' }

    /* The template literal is the whole difference between "starter app" and
       "bare app" — the scenario the base bundle exists for. */
    expect(smokeHarness.getCreatePayloadAppArgs(base)).toContain('website')
    expect(smokeHarness.getCreatePayloadAppArgs({ ...base, template: 'blank' })).toContain('blank')
    expect(smokeHarness.getCreatePayloadAppArgs({ ...base, template: 'blank' })).not.toContain(
      'website',
    )
  })

  it('parses --scenario and defaults to running both', () => {
    expect(smokeHarness.parseSmokeArgs([]).scenario).toBe('all')
    expect(smokeHarness.parseSmokeArgs(['--scenario', 'bare']).scenario).toBe('bare')
    expect(smokeHarness.parseSmokeArgs(['--scenario', 'website']).scenario).toBe('website')
    expect(smokeHarness.parseSmokeArgs(['--', '--scenario', 'bare']).scenario).toBe('bare')
    expect(() => smokeHarness.parseSmokeArgs(['--scenario', 'nope'])).toThrow(
      /"all", "bare", or "website"/,
    )
  })

  it('covers every base-bundle primitive with the blocks the bare scenario installs', async () => {
    const manifests = await Promise.all(
      smokeHarness.BARE_SMOKE_COMPONENTS.map((component) => loadManifest(component)),
    )
    const sources = await Promise.all(
      manifests.flatMap((manifest) =>
        manifest.files.map((file) =>
          readFile(
            path.join(repoRoot, 'payload-components', 'source', file.replace(/^src\//, '')),
            'utf8',
          ),
        ),
      ),
    )
    const combined = sources.join('\n')

    /* If the chosen blocks stopped importing one of these, the bare scenario
       would typecheck without ever exercising that primitive. */
    for (const primitive of [
      '@/utilities/ui',
      '@/components/Link',
      '@/components/Media',
      '@/fields/linkGroup',
    ]) {
      expect(combined, `bare smoke must exercise ${primitive}`).toContain(primitive)
    }
  })

  it('passes the selected database URL to direct target commands', () => {
    expect(
      smokeHarness.smokeEnvForTarget({
        databaseUrl: 'file:./payload-components-smoke-target.db',
        serverUrl: 'http://127.0.0.1:3100',
      }),
    ).toMatchObject({
      DATABASE_URL: 'file:./payload-components-smoke-target.db',
      NEXT_PUBLIC_SERVER_URL: 'http://127.0.0.1:3100',
    })
  })

  it('treats a blank database URL as absent and trims a configured URL', () => {
    expect(smokeHarness.normalizeSmokeDatabaseConnectionString('')).toBeUndefined()
    expect(smokeHarness.normalizeSmokeDatabaseConnectionString('   ')).toBeUndefined()
    expect(
      smokeHarness.normalizeSmokeDatabaseConnectionString(
        '  postgres://localhost/payload_components  ',
      ),
    ).toBe('postgres://localhost/payload_components')
  })

  it('adds a client boundary when the generated Payload button imports Radix Slot', async () => {
    const tempDir = await mkdtemp(path.join(tmpdir(), 'payload-components-smoke-template-'))
    const buttonPath = path.join(tempDir, 'src', 'components', 'ui', 'button.tsx')
    tempDirs.push(tempDir)
    await mkdir(path.dirname(buttonPath), { recursive: true })
    await writeFile(
      buttonPath,
      "import { Slot } from '@radix-ui/react-slot'\n\nexport const Button = Slot\n",
    )

    await expect(smokeHarness.applyFreshPayloadTemplateCompatibility(tempDir)).resolves.toBe(true)
    await expect(readFile(buttonPath, 'utf8')).resolves.toBe(
      "'use client'\n\nimport { Slot } from '@radix-ui/react-slot'\n\nexport const Button = Slot\n",
    )
    await expect(smokeHarness.applyFreshPayloadTemplateCompatibility(tempDir)).resolves.toBe(false)
  })

  it('leaves generated buttons without Radix Slot unchanged', async () => {
    const tempDir = await mkdtemp(path.join(tmpdir(), 'payload-components-smoke-template-'))
    const buttonPath = path.join(tempDir, 'src', 'components', 'ui', 'button.tsx')
    const source = 'export const Button = (props: unknown) => <button {...props} />\n'
    tempDirs.push(tempDir)
    await mkdir(path.dirname(buttonPath), { recursive: true })
    await writeFile(buttonPath, source)

    await expect(smokeHarness.applyFreshPayloadTemplateCompatibility(tempDir)).resolves.toBe(false)
    await expect(readFile(buttonPath, 'utf8')).resolves.toBe(source)
  })
})

describe('fresh Payload smoke seed generation', () => {
  const tempDirs: string[] = []

  afterEach(async () => {
    await Promise.all(tempDirs.map((tempDir) => rm(tempDir, { force: true, recursive: true })))
  })

  it('terminates the one-shot seed process after Payload opens database handles', async () => {
    const manifest = await loadManifest('hero-basic')
    const tempDir = await mkdtemp(path.join(tmpdir(), 'payload-components-smoke-seed-'))
    tempDirs.push(tempDir)

    const scriptPath = await writeSeedScript(tempDir, [manifest])
    const script = await readFile(scriptPath, 'utf8')

    expect(script).toContain("console.log('Seeded /payload-components-smoke')\nprocess.exit(0)")
  })

  it('loads the generated project environment before importing Payload config', async () => {
    const manifest = await loadManifest('hero-basic')
    const tempDir = await mkdtemp(path.join(tmpdir(), 'payload-components-smoke-seed-'))
    tempDirs.push(tempDir)

    const scriptPath = await writeSeedScript(tempDir, [manifest])
    const script = await readFile(scriptPath, 'utf8')

    expect(script).toContain("import 'dotenv/config'")
    expect(script.indexOf("import 'dotenv/config'")).toBeLessThan(
      script.indexOf("await import('../src/payload.config')"),
    )
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

  it('declares placeholder slots for every curated block with required uploads', async () => {
    const manifests = await Promise.all(
      ['hero-video', 'hero-product-tilt', 'feature-cards-media'].map((name) => loadManifest(name)),
    )

    expect(
      manifests.map((manifest) => sampleContentNeedsSmokeMedia(manifest.sampleContent)),
    ).toEqual([true, true, true])
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

    expect(
      manifests.every((manifest) => sampleContentNeedsSmokeMedia(manifest.sampleContent)),
    ).toBe(true)
    expect(script).toContain("members: 'avatar'")
    expect(script).toContain('addSmokeUploadReferences(nestedValue, mediaID, key)')
  })

  it('hydrates every missing upload representation without replacing existing references', () => {
    const { addSmokeUploadReferences } = smokeHarness as typeof smokeHarness & {
      addSmokeUploadReferences?: (value: unknown, mediaID: unknown) => unknown
    }

    expect(addSmokeUploadReferences).toBeTypeOf('function')
    if (!addSmokeUploadReferences) return

    expect(
      addSmokeUploadReferences(
        {
          members: [
            { avatar: undefined, name: 'Undefined' },
            { avatar: null, name: 'Null' },
            { avatar: '', name: 'Empty' },
            { avatar: 'existing-media', name: 'Existing' },
          ],
        },
        'smoke-media',
      ),
    ).toEqual({
      members: [
        { avatar: 'smoke-media', name: 'Undefined' },
        { avatar: 'smoke-media', name: 'Null' },
        { avatar: 'smoke-media', name: 'Empty' },
        { avatar: 'existing-media', name: 'Existing' },
      ],
    })
  })

  it('hydrates named upload fields at the block root and inside arbitrary arrays', () => {
    const { addSmokeUploadReferences } = smokeHarness as typeof smokeHarness & {
      addSmokeUploadReferences?: (value: unknown, mediaID: unknown) => unknown
    }
    const sample = {
      items: [{ image: null, title: 'Media card' }],
      poster: '',
      productImage: undefined,
      video: 'existing-video',
    }

    expect(sampleContentNeedsSmokeMedia(sample)).toBe(true)
    expect(addSmokeUploadReferences?.(sample, 'smoke-media')).toEqual({
      items: [{ image: 'smoke-media', title: 'Media card' }],
      poster: 'smoke-media',
      productImage: 'smoke-media',
      video: 'existing-video',
    })
  })
})
