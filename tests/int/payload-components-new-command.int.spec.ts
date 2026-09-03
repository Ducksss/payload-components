import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { deriveComponentNames } from '../../tools/payload-components/commands/new'

/* `new` writes into the repository it is run from, so this spec runs it against a
 * throwaway copy of that layout instead of the real checkout — vitest runs spec
 * files in parallel, and mutating shared files like registry.json underneath
 * another spec that is reading them is a genuine race, not a theoretical one.
 *
 * The isolation works by mocking `repoRoot`: every path in the command is derived
 * from it at module load, so redirecting it moves the whole command. */

const repoRoot = process.cwd()
const SLUG = 'aa-scaffold-probe'
const PASCAL = 'AaScaffoldProbe'

const tempDirs: string[] = []

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dir) => rm(dir, { force: true, recursive: true })))
  vi.resetModules()
  vi.restoreAllMocks()
})

/* The minimum layout `new` reads from and appends to. */
const createScaffoldRoot = async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'payload-components-new-'))
  tempDirs.push(root)

  await mkdir(path.join(root, 'payload-components', 'templates'), { recursive: true })
  await mkdir(path.join(root, 'payload-components', 'manifests'), { recursive: true })
  await mkdir(path.join(root, 'content', 'docs', 'components'), { recursive: true })
  await mkdir(path.join(root, 'src', 'components', 'site', 'demos'), { recursive: true })
  await mkdir(path.join(root, 'tools', 'payload-components'), { recursive: true })

  /* Real inputs: the canonical scaffold, the schema the manifest is validated
     against, and one real block so the dbName uniqueness scan has something to
     collide with. */
  await cp(
    path.join(repoRoot, 'payload-components', 'templates', 'component-template'),
    path.join(root, 'payload-components', 'templates', 'component-template'),
    { recursive: true },
  )
  await cp(
    path.join(repoRoot, 'payload-components', 'schema'),
    path.join(root, 'payload-components', 'schema'),
    { recursive: true },
  )
  await cp(
    path.join(repoRoot, 'payload-components', 'source', 'blocks', 'HeroBasic'),
    path.join(root, 'payload-components', 'source', 'blocks', 'HeroBasic'),
    { recursive: true },
  )
  await cp(
    path.join(repoRoot, 'payload-components', 'manifests', 'hero-basic.json'),
    path.join(root, 'payload-components', 'manifests', 'hero-basic.json'),
  )

  await Promise.all([
    writeFile(
      path.join(root, 'payload-components', 'registry.json'),
      `${JSON.stringify(
        {
          $schema: 'https://ui.shadcn.com/schema/registry.json',
          name: 'payload-components',
          homepage: 'https://www.payload-components.xyz',
          items: [{ name: 'hero-basic' }],
        },
        null,
        2,
      )}\n`,
      'utf8',
    ),
    writeFile(
      path.join(root, 'content', 'docs', 'components', 'meta.json'),
      `${JSON.stringify({ title: 'Components', pages: ['hero-basic'] }, null, 2)}\n`,
      'utf8',
    ),
    writeFile(
      path.join(root, 'src', 'components', 'site', 'demos', 'registry.ts'),
      [
        "import { HeroBasicDemo } from '@/components/site/demos/HeroBasicDemo'",
        '',
        'export const demosBySlug = {',
        "  'hero-basic': HeroBasicDemo,",
        '}',
        '',
      ].join('\n'),
      'utf8',
    ),
    writeFile(
      path.join(root, 'tools', 'payload-components', 'cli.ts'),
      [
        'export const usage = `payload-components',
        '',
        'Current components:',
        '  hero-basic',
        '`',
        '',
      ].join('\n'),
      'utf8',
    ),
    writeFile(
      path.join(root, 'README.md'),
      [
        '<!-- COMPONENT-INVENTORY:START -->',
        '',
        '| Component    | Install command                        |',
        '| ------------ | -------------------------------------- |',
        '| `hero-basic` | `npx payload-components add hero-basic` |',
        '',
        '<!-- COMPONENT-INVENTORY:END -->',
        '',
      ].join('\n'),
      'utf8',
    ),
  ])

  return root
}

const runScaffold = async (root: string) => {
  vi.doMock('../../tools/payload-components/utils', async () => {
    const actual = await vi.importActual<typeof import('../../tools/payload-components/utils')>(
      '../../tools/payload-components/utils',
    )

    return { ...actual, repoRoot: root }
  })

  const output: string[] = []

  vi.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
    output.push(String(chunk))
    return true
  })

  const { newCommand } = await import('../../tools/payload-components/commands/new')

  await newCommand({ componentSlug: SLUG })

  return { newCommand, output: output.join('') }
}

const readRootFile = (root: string, ...segments: string[]) =>
  readFile(path.join(root, ...segments), 'utf8')

describe('deriveComponentNames', () => {
  it('derives every casing the bundle needs from the slug alone', () => {
    expect(deriveComponentNames('hero-split')).toEqual({
      blockSlug: 'heroSplit',
      camel: 'heroSplit',
      dbNameSuggestion: 'pc_her_spl',
      interfaceName: 'HeroSplitBlock',
      pascal: 'HeroSplit',
      slug: 'hero-split',
      title: 'Hero Split',
    })
  })

  it('rejects a slug that is not kebab-case', () => {
    for (const slug of ['HeroSplit', 'hero_split', 'hero--split', '-hero', 'hero-']) {
      expect(() => deriveComponentNames(slug)).toThrow('not a valid component slug')
    }
  })

  it('keeps the dbName suggestion within the 18-character cap', () => {
    expect(
      deriveComponentNames('extremely-long-component-name-here').dbNameSuggestion.length,
    ).toBeLessThanOrEqual(18)
  })
})

describe('payload-components new', () => {
  it('scaffolds a manifest the real loader accepts', async () => {
    const root = await createScaffoldRoot()

    await runScaffold(root)

    /* The strongest check available: the generated manifest goes through the same
       schema, changelog, registry-item, and recovery validation as a shipped one. */
    const { loadManifest } = await import('../../tools/payload-components/manifest')
    const manifest = await loadManifest(SLUG)

    expect(manifest).toMatchObject({ name: SLUG, registryItemName: SLUG, version: '0.1.0' })
    expect(manifest.changelog).toEqual([{ summary: 'Initial release.', version: '0.1.0' }])
    expect(manifest.files).toEqual([
      `src/blocks/${PASCAL}/config.ts`,
      `src/blocks/${PASCAL}/Component.tsx`,
    ])
  })

  it('renames every identifier in the copied source', async () => {
    const root = await createScaffoldRoot()

    await runScaffold(root)

    const config = await readRootFile(
      root,
      'payload-components',
      'source',
      'blocks',
      PASCAL,
      'config.ts',
    )

    expect(config).toContain(`export const ${PASCAL}: Block`)
    expect(config).toContain("slug: 'aaScaffoldProbe'")
    expect(config).toContain(`interfaceName: '${PASCAL}Block'`)
    expect(config).not.toContain('ExampleBasic')
  })

  it('appends to every mechanical list, keeping each file parseable', async () => {
    const root = await createScaffoldRoot()

    await runScaffold(root)

    const [registry, demoRegistry, docsMeta, readme, siteCatalog] = await Promise.all([
      readRootFile(root, 'payload-components', 'registry.json'),
      readRootFile(root, 'src', 'components', 'site', 'demos', 'registry.ts'),
      readRootFile(root, 'content', 'docs', 'components', 'meta.json'),
      readRootFile(root, 'README.md'),
      readRootFile(root, 'src', 'generated', 'component-catalog.json'),
    ])

    /* registry.json and meta.json are spliced as text to preserve their
       prettier-ignored formatting, so "still valid JSON" is the thing to prove. */
    expect(JSON.parse(registry).items.map(({ name }: { name: string }) => name)).toEqual([
      'hero-basic',
      SLUG,
    ])
    expect(JSON.parse(docsMeta).pages).toEqual(['hero-basic', SLUG])
    expect(demoRegistry).toContain(`import { ${PASCAL}Demo }`)
    expect(demoRegistry).toContain(`'${SLUG}': ${PASCAL}Demo,`)
    expect(readme).toContain(`| \`${SLUG}\``)
    expect(readme).toContain(`npx payload-components add ${SLUG}`)
    expect(JSON.parse(siteCatalog).components.at(-1)).toEqual({
      slug: SLUG,
      version: '0.1.0',
    })
  })

  it('prints the curated decisions instead of guessing at them', async () => {
    const root = await createScaffoldRoot()
    const { output } = await runScaffold(root)

    expect(output).toContain('componentEditorialEntries')
    expect(output).toContain('commands, routes, family, and version are derived')
    expect(output).toContain('src/generated/component-catalog.json')
    expect(output).toContain('Visual baselines cannot be generated here')
    /* The dbName suggestion is checked against the blocks that already exist. */
    expect(output).toContain('pc_aa_sca')
    expect(output).toContain('(free)')
  })

  it('reports a dbName suggestion that is already taken', async () => {
    const root = await createScaffoldRoot()

    vi.doMock('../../tools/payload-components/utils', async () => {
      const actual = await vi.importActual<typeof import('../../tools/payload-components/utils')>(
        '../../tools/payload-components/utils',
      )

      return { ...actual, repoRoot: root }
    })

    const output: string[] = []

    vi.spyOn(process.stdout, 'write').mockImplementation((chunk) => {
      output.push(String(chunk))
      return true
    })

    const { newCommand } = await import('../../tools/payload-components/commands/new')

    /* hero-basic already occupies pc_her_bas. */
    await newCommand({ componentSlug: 'hero-basically' })

    expect(output.join('')).toContain('ALREADY TAKEN')
  })

  it('refuses to overwrite an existing component', async () => {
    const root = await createScaffoldRoot()
    const { newCommand } = await runScaffold(root)

    await expect(newCommand({ componentSlug: SLUG })).rejects.toThrow(
      'Refusing to overwrite existing file',
    )
  })

  it('leaves the repository unchanged when generated catalog validation fails', async () => {
    const root = await createScaffoldRoot()
    const existingPaths = [
      ['payload-components', 'registry.json'],
      ['src', 'components', 'site', 'demos', 'registry.ts'],
      ['content', 'docs', 'components', 'meta.json'],
      ['README.md'],
    ]
    const heroManifestPath = path.join(root, 'payload-components', 'manifests', 'hero-basic.json')
    const heroManifest = JSON.parse(await readFile(heroManifestPath, 'utf8')) as Record<
      string,
      unknown
    >

    /* The existing registry projection fails only after every new file and
       insertion has been prepared. This used to strand all of those earlier
       writes in the repository. */
    heroManifest.name = 'mismatched-existing-manifest'
    await writeFile(heroManifestPath, `${JSON.stringify(heroManifest, null, 2)}\n`, 'utf8')
    const before = await Promise.all(
      existingPaths.map((segments) => readRootFile(root, ...segments)),
    )

    vi.doMock('../../tools/payload-components/utils', async () => {
      const actual = await vi.importActual<typeof import('../../tools/payload-components/utils')>(
        '../../tools/payload-components/utils',
      )

      return { ...actual, repoRoot: root }
    })

    const { newCommand } = await import('../../tools/payload-components/commands/new')

    await expect(newCommand({ componentSlug: SLUG })).rejects.toThrow(
      'Registry item "hero-basic" has no matching manifest contract.',
    )

    await expect(
      Promise.all(existingPaths.map((segments) => readRootFile(root, ...segments))),
    ).resolves.toEqual(before)

    for (const segments of [
      ['payload-components', 'source', 'blocks', PASCAL, 'config.ts'],
      ['payload-components', 'source', 'blocks', PASCAL, 'Component.tsx'],
      ['payload-components', 'manifests', `${SLUG}.json`],
      ['content', 'docs', 'components', `${SLUG}.mdx`],
      ['src', 'components', 'site', 'demos', `${PASCAL}Demo.tsx`],
      ['src', 'generated', 'component-catalog.json'],
    ]) {
      await expect(readRootFile(root, ...segments)).rejects.toMatchObject({ code: 'ENOENT' })
    }
  })
})
