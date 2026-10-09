import { spawnSync } from 'node:child_process'
import { cp, mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import * as prettier from 'prettier'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  buildManifest,
  deriveComponentNames,
  deriveSupport,
} from '../../tools/payload-components/commands/new'

import type { SupportMatrix } from '../../tools/payload-components/types'

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

/* The static import above loads commands/new against the real repoRoot. Every
   test that mocks repoRoot then imports it again, which only yields a fresh,
   mocked module once the registry is reset. Resetting here, rather than relying
   on an earlier test's afterEach, keeps a filtered run (-t) or a reordered file
   from scaffolding into the real checkout. */
beforeEach(() => {
  vi.resetModules()
})

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
  await mkdir(path.join(root, 'src', 'lib'), { recursive: true })
  await mkdir(path.join(root, 'messages'), { recursive: true })
  await mkdir(path.join(root, 'tools', 'payload-components'), { recursive: true })

  /* Real inputs: the canonical scaffold, the schema the manifest is validated
     against, and one real block so the dbName uniqueness scan has something to
     collide with. */
  await cp(
    path.join(repoRoot, 'payload-components', 'component-template'),
    path.join(root, 'payload-components', 'component-template'),
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
  /* What the --file-only path reads: the support matrix its manifest is derived
     from, and the catalog copy and Posts entries it appends to. */
  for (const segments of [
    ['payload-components', 'support-matrix.json'],
    ['messages', 'en.json'],
    ['src', 'lib', 'component-catalog.ts'],
  ]) {
    await cp(path.join(repoRoot, ...segments), path.join(root, ...segments))
  }

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
        "import { HeroBasicDemo } from './HeroBasicDemo'",
        '',
        'export const demosBySlug: Record<string, unknown> = {',
        "  'hero-basic': HeroBasicDemo,",
        '}',
        '',
        'export function hasComponentDemo(slug: string) {',
        '  return slug in demosBySlug',
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

const runScaffold = async (
  root: string,
  { componentSlug = SLUG, fileOnly = false }: { componentSlug?: string; fileOnly?: boolean } = {},
) => {
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

  await newCommand({ componentSlug, fileOnly })

  return { newCommand, output: output.join('') }
}

/* The inventory table's data rows, header to the blank line that closes it. */
const inventoryTable = (readme: string) => {
  const lines = readme.split('\n')
  const header = lines.findIndex((line) => line.startsWith('| Component'))
  const close = lines.indexOf('', header)

  return { close, lines, rows: lines.slice(header + 2, close) }
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
    expect(demoRegistry).toContain(`import { ${PASCAL}Demo } from './${PASCAL}Demo'`)
    expect(demoRegistry).toContain(`'${SLUG}': ${PASCAL}Demo,\n}`)
    expect(demoRegistry.indexOf(`'${SLUG}': ${PASCAL}Demo,`)).toBeLessThan(
      demoRegistry.indexOf('export function hasComponentDemo'),
    )
    expect(demoRegistry).toContain(
      'export function hasComponentDemo(slug: string) {\n  return slug in demosBySlug\n}',
    )
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

describe('payload-components new: README inventory row', () => {
  it("inserts the row as the table's last row, not after the blank line that closes it", async () => {
    const root = await createScaffoldRoot()

    await runScaffold(root)

    const { close, lines, rows } = inventoryTable(await readRootFile(root, 'README.md'))

    /* Prettier keeps one blank line between the table and the end marker. The row
       used to land after that line, where markdown no longer reads it as a row. */
    expect(rows).toEqual([
      '| `hero-basic` | `npx payload-components add hero-basic` |',
      `| \`${SLUG}\`| \`npx payload-components add ${SLUG}\`|`,
    ])
    expect(lines[close + 1]).toBe('<!-- COMPONENT-INVENTORY:END -->')
  })

  it('pads the row to the existing column widths', async () => {
    const root = await createScaffoldRoot()

    /* The repository table is wider than any slug, so new rows align with it. */
    await writeFile(
      path.join(root, 'README.md'),
      [
        '<!-- COMPONENT-INVENTORY:START -->',
        '',
        '| Component                 | Install command                                        |',
        '| ------------------------- | ------------------------------------------------------ |',
        '| `hero-basic`              | `npx payload-components add hero-basic`                |',
        '',
        '<!-- COMPONENT-INVENTORY:END -->',
        '',
      ].join('\n'),
      'utf8',
    )
    await runScaffold(root)

    const { rows } = inventoryTable(await readRootFile(root, 'README.md'))

    expect(rows.at(-1)).toBe(
      `| \`${SLUG}\`       | \`npx payload-components add ${SLUG}\`         |`,
    )
    expect(new Set(rows.map((row) => row.length)).size).toBe(1)
  })
})

describe('payload-components new: Pages-block path', () => {
  it('still scaffolds from the block templates and leaves the file-only targets alone', async () => {
    const root = await createScaffoldRoot()
    const untouched = [
      ['messages', 'en.json'],
      ['src', 'lib', 'component-catalog.ts'],
    ]
    const before = await Promise.all(untouched.map((segments) => readRootFile(root, ...segments)))

    await runScaffold(root)

    const template = (file: string) =>
      readRootFile(repoRoot, 'payload-components', 'component-template', file).then((source) =>
        source
          .replaceAll('ExampleBasicBlock', `${PASCAL}Block`)
          .replaceAll('ExampleBasic', PASCAL)
          .replaceAll('exampleBasic', 'aaScaffoldProbe')
          .replaceAll('example-basic', SLUG)
          .replaceAll('Example Basic', 'Aa Scaffold Probe'),
      )

    expect(
      await readRootFile(root, 'payload-components', 'source', 'blocks', PASCAL, 'config.ts'),
    ).toBe(await template('config.ts'))
    expect(
      await readRootFile(root, 'payload-components', 'source', 'blocks', PASCAL, 'Component.tsx'),
    ).toBe(await template('Component.tsx'))
    expect(await readRootFile(root, 'content', 'docs', 'components', `${SLUG}.mdx`)).toBe(
      await template('doc-page.mdx'),
    )
    expect(await readRootFile(root, 'payload-components', 'manifests', `${SLUG}.json`)).toBe(
      buildManifest(deriveComponentNames(SLUG)),
    )
    expect(
      await readRootFile(root, 'src', 'components', 'site', 'demos', `${PASCAL}Demo.tsx`),
    ).toContain('<section aria-hidden="true" className="container">')

    const item = JSON.parse(
      await readRootFile(root, 'payload-components', 'registry.json'),
    ).items.at(-1)
    expect(item.type).toBe('registry:block')
    expect(item.meta.payloadComponent.postInstall).toEqual(['generate:types', 'generate:importmap'])

    await expect(
      Promise.all(untouched.map((segments) => readRootFile(root, ...segments))),
    ).resolves.toEqual(before)
    await expect(
      readdir(path.join(root, 'payload-components', 'source', 'components')),
    ).rejects.toMatchObject({ code: 'ENOENT' })
  })
})

describe('payload-components new --file-only', () => {
  const FILE_SLUG = 'author-probe'
  const FILE_PASCAL = 'AuthorProbe'

  it('scaffolds a file-only article component the real loader accepts', async () => {
    const root = await createScaffoldRoot()

    await runScaffold(root, { componentSlug: FILE_SLUG, fileOnly: true })

    const { loadManifest } = await import('../../tools/payload-components/manifest')
    const manifest = await loadManifest(FILE_SLUG)

    expect(manifest).toMatchObject({
      files: [`src/components/${FILE_PASCAL}/Component.tsx`],
      installMode: 'file-only',
      name: FILE_SLUG,
      payloadFragments: [],
      postInstall: [],
      recovery: { patchedFiles: [] },
      registryItemName: FILE_SLUG,
      version: '0.1.0',
    })

    const item = JSON.parse(
      await readRootFile(root, 'payload-components', 'registry.json'),
    ).items.at(-1)
    expect(item).toMatchObject({
      files: [
        {
          path: `payload-components/source/components/${FILE_PASCAL}/Component.tsx`,
          target: `~/src/components/${FILE_PASCAL}/Component.tsx`,
          type: 'registry:file',
        },
      ],
      meta: {
        payloadComponent: {
          installCommand: `payload-components add ${FILE_SLUG}`,
          postInstall: [],
          requiresPayloadComponentWrapper: false,
        },
      },
      name: FILE_SLUG,
      registryDependencies: [],
      type: 'registry:component',
    })
    expect(item.docs).toContain(`payload-components add ${FILE_SLUG}`)
    expect(item.docs).toContain(`/r/${FILE_SLUG}.json`)

    const component = await readRootFile(
      root,
      'payload-components',
      'source',
      'components',
      FILE_PASCAL,
      'Component.tsx',
    )
    expect(component).toContain(`export function ${FILE_PASCAL}(`)
    for (const prop of ['id?: string', 'className?: string', 'disableInnerContainer?: boolean']) {
      expect(component).toContain(prop)
    }
    expect(component).not.toMatch(/from '@\/|from 'next|from 'payload/)
    await expect(
      readdir(path.join(root, 'payload-components', 'source', 'blocks', FILE_PASCAL)),
    ).rejects.toMatchObject({ code: 'ENOENT' })
  })

  it('derives Payload and Next.js support from the support matrix', async () => {
    const root = await createScaffoldRoot()
    const matrixPath = path.join(root, 'payload-components', 'support-matrix.json')
    const matrix = JSON.parse(await readFile(matrixPath, 'utf8')) as SupportMatrix

    /* A matrix that moves on must move the scaffold with it. */
    for (const target of matrix.targets) {
      target.allowedPayloadMajors = [...target.allowedPayloadMajors, 5]
    }
    await writeFile(matrixPath, `${JSON.stringify(matrix, null, 2)}\n`, 'utf8')
    await runScaffold(root, { componentSlug: FILE_SLUG, fileOnly: true })

    const manifest = JSON.parse(
      await readRootFile(root, 'payload-components', 'manifests', `${FILE_SLUG}.json`),
    )
    expect(manifest.supports).toEqual({ payloadMajors: [3, 4, 5], nextMajors: [15, 16] })
    expect(manifest.peerDependencies).toEqual({
      next: '^15.0.0 || ^16.0.0',
      payload: '^3.0.0 || ^4.0.0 || ^5.0.0-0',
      react: '^19.0.0',
    })
    expect(manifest.supportedTargets).toEqual(matrix.targets.map((target) => target.id))
    expect(manifest.supports).toEqual(deriveSupport(matrix).supports)
  })

  it('appends the catalog projections and lands every file prettier-clean', async () => {
    const root = await createScaffoldRoot()
    const { output } = await runScaffold(root, { componentSlug: FILE_SLUG, fileOnly: true })

    const [registry, demoRegistry, docsMeta, readme, siteCatalog, messages, catalog, twin, doc] =
      await Promise.all([
        readRootFile(root, 'payload-components', 'registry.json'),
        readRootFile(root, 'src', 'components', 'site', 'demos', 'registry.ts'),
        readRootFile(root, 'content', 'docs', 'components', 'meta.json'),
        readRootFile(root, 'README.md'),
        readRootFile(root, 'src', 'generated', 'component-catalog.json'),
        readRootFile(root, 'messages', 'en.json'),
        readRootFile(root, 'src', 'lib', 'component-catalog.ts'),
        readRootFile(root, 'src', 'components', 'site', 'demos', `${FILE_PASCAL}Demo.tsx`),
        readRootFile(root, 'content', 'docs', 'components', `${FILE_SLUG}.mdx`),
      ])

    expect(JSON.parse(registry).items.map(({ name }: { name: string }) => name)).toEqual([
      'hero-basic',
      FILE_SLUG,
    ])
    expect(demoRegistry).toContain(`'${FILE_SLUG}': ${FILE_PASCAL}Demo,\n}`)
    expect(JSON.parse(docsMeta).pages).toEqual(['hero-basic', FILE_SLUG])
    expect(inventoryTable(readme).rows.at(-1)).toContain(`\`${FILE_SLUG}\``)
    expect(JSON.parse(siteCatalog).components.at(-1)).toEqual({
      slug: FILE_SLUG,
      version: '0.1.0',
    })

    /* The catalog label, and a Posts entry whose category the slug names. */
    expect(JSON.parse(messages).Components[FILE_SLUG]).toMatchObject({ title: 'Author Probe' })
    expect(catalog).toContain(
      [
        '  {',
        "    category: 'author',",
        `    description: englishMessages.Components['${FILE_SLUG}'].description,`,
        "    fields: ['title', 'description'],",
        `    slug: '${FILE_SLUG}',`,
        `    target: englishMessages.Components['${FILE_SLUG}'].target,`,
        `    title: englishMessages.Components['${FILE_SLUG}'].title,`,
        '  },',
        '] as const',
      ].join('\n'),
    )

    /* The doc page is the file-only format: a React usage example, no Pages steps. */
    expect(doc).toMatch(/^---\ntitle: Author Probe\n/)
    expect(doc.match(/^## .+$/gm)).toEqual([
      '## Installation',
      '## What it installs',
      '## Content model',
      '## Usage',
      '## Requirements',
    ])
    expect(doc).toContain(`<ComponentUsage slug="${FILE_SLUG}" />`)
    expect(doc).toContain(`import { ${FILE_PASCAL} } from '@/components/${FILE_PASCAL}/Component'`)
    expect(doc).toContain(`npx payload-components add ${FILE_SLUG}`)
    expect(doc).toContain(`/r/${FILE_SLUG}.json`)

    /* The twin mirrors every class group of the scaffolded component, stays
       presentational, and is reached only through demosBySlug, which every
       surface renders inside .preview-scope. */
    const component = await readRootFile(
      root,
      'payload-components',
      'source',
      'components',
      FILE_PASCAL,
      'Component.tsx',
    )
    const classGroups = [...component.matchAll(/className=(?:"([^"]+)"|\{([^}]*)\})/g)].flatMap(
      ([, literal, expression]) =>
        literal
          ? [literal]
          : [...(expression ?? '').matchAll(/'([^']+)'/g)]
              .map(([, value]) => value)
              .filter((value) => value.trim()),
    )
    expect(classGroups.length).toBeGreaterThan(3)
    for (const group of classGroups) {
      expect(twin).toContain(`className="${group}"`)
    }
    expect(twin).toContain('aria-hidden="true"')
    expect(twin.replace(/\/\*[\s\S]*?\*\//g, '')).not.toMatch(/<(a|button|h[1-6])[\s>]/)

    /* format:check runs over these files, so the scaffold must not leave work for it. */
    for (const [file, source] of [
      ['src/lib/component-catalog.ts', catalog],
      ['messages/en.json', messages],
      [`src/components/site/demos/${FILE_PASCAL}Demo.tsx`, twin],
      ['src/components/site/demos/registry.ts', demoRegistry],
    ] as const) {
      const options = await prettier.resolveConfig(path.join(repoRoot, file))
      await expect(
        prettier.check(source, { ...options, filepath: path.join(repoRoot, file) }),
        `${file} is not prettier-clean`,
      ).resolves.toBe(true)
    }

    expect(output).toContain('as a file-only article component')
    expect(output).toContain("uses category\n   'author', matched from the slug")
    expect(output).toContain('zh has no English fallback')
    expect(output).toContain('pnpm registry:snapshot')
    expect(output).not.toContain('dbName')
  })

  it('prints the Posts entry when no word of the slug names a Posts category', async () => {
    const root = await createScaffoldRoot()
    const catalogBefore = await readRootFile(root, 'src', 'lib', 'component-catalog.ts')
    const { output } = await runScaffold(root, { componentSlug: 'reading-time', fileOnly: true })

    expect(await readRootFile(root, 'src', 'lib', 'component-catalog.ts')).toBe(catalogBefore)
    expect(output).toContain("     category: 'TODO',")
    expect(output).toContain('(cards, archive, header, index, author, newsletter, related)')
    expect(output).not.toContain('  src/lib/component-catalog.ts\n')
  })

  it('keeps an existing catalog label and titles the doc page with it', async () => {
    const root = await createScaffoldRoot()
    const messagesPath = path.join(root, 'messages', 'en.json')
    const messages = JSON.parse(await readFile(messagesPath, 'utf8'))

    messages.Components['related-probe'] = {
      title: 'Related Reading',
      description: 'A planned related-reading list.',
      target: 'Post footer',
    }
    await writeFile(messagesPath, `${JSON.stringify(messages, null, 2)}\n`, 'utf8')
    const before = await readFile(messagesPath, 'utf8')
    const { output } = await runScaffold(root, { componentSlug: 'related-probe', fileOnly: true })

    expect(await readFile(messagesPath, 'utf8')).toBe(before)
    expect(await readRootFile(root, 'content', 'docs', 'components', 'related-probe.mdx')).toMatch(
      /^---\ntitle: Related Reading\n/,
    )
    expect(output).toContain('already existed and was kept')
  })

  it('accepts --file-only on the contributor command line and refuses other flags', () => {
    const run = (...args: string[]) =>
      spawnSync(process.execPath, [path.join(repoRoot, 'bin', 'payload-components.mjs'), ...args], {
        cwd: repoRoot,
        encoding: 'utf8',
      })

    /* Both fail during argument parsing, before the command touches any file. */
    const unknown = run('new', 'author-probe', '--file')
    expect(unknown.status).toBe(1)
    expect(unknown.stderr).toContain('does not accept "--file". Its only option is --file-only.')

    const missing = run('new', '--file-only')
    expect(missing.status).toBe(1)
    expect(missing.stderr).toContain('payload-components new requires a component name')
  }, 30_000)
})
