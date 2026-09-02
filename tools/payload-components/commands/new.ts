import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

import { buildSiteCatalog, siteCatalogPath } from '../build-site-catalog'
import { readSafeProjectFile, writeSafeProjectFile } from '../safe-path'
import { isPathInside, printHeader, repoRoot } from '../utils'

/* Scaffolds a component bundle in THIS repo — the authoring side, not the
 * consumer side. Adding a component touches a dozen files and the shape of every
 * one of them is derivable from the slug, so the mechanical parts are written
 * here and the parts that need judgment are printed as snippets.
 *
 * The split is deliberate. Editorial catalog context, dbName abbreviations,
 * Content model prose, and demo sample copy need human judgment. Registry order,
 * versions, commands, and routes are mechanical projections. */

const templateDir = path.join(repoRoot, 'payload-components', 'templates', 'component-template')
const sourceBlocksDir = path.join(repoRoot, 'payload-components', 'source', 'blocks')
const manifestsDir = path.join(repoRoot, 'payload-components', 'manifests')
const componentDocsDir = path.join(repoRoot, 'content', 'docs', 'components')
const demosDir = path.join(repoRoot, 'src', 'components', 'site', 'demos')
const registryPath = path.join(repoRoot, 'payload-components', 'registry.json')

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
/* dbName is capped at 18 characters and must be unique across the catalog. */
const DB_NAME_MAX_LENGTH = 18

export type ComponentNames = {
  blockSlug: string
  camel: string
  dbNameSuggestion: string
  interfaceName: string
  pascal: string
  slug: string
  title: string
}

export const deriveComponentNames = (slug: string): ComponentNames => {
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error(
      `"${slug}" is not a valid component slug. Use lowercase words joined by single hyphens, for example "hero-split".`,
    )
  }

  const words = slug.split('-')
  const pascal = words.map((word) => word[0].toUpperCase() + word.slice(1)).join('')
  const camel = pascal[0].toLowerCase() + pascal.slice(1)

  return {
    blockSlug: camel,
    camel,
    /* A starting point only — the caller must confirm it reads well and is free. */
    dbNameSuggestion: `pc_${words.map((word) => word.slice(0, 3)).join('_')}`.slice(
      0,
      DB_NAME_MAX_LENGTH,
    ),
    interfaceName: `${pascal}Block`,
    pascal,
    slug,
    title: words.map((word) => word[0].toUpperCase() + word.slice(1)).join(' '),
  }
}

const renameTemplate = (source: string, names: ComponentNames) =>
  source
    .replaceAll('ExampleBasicBlock', names.interfaceName)
    .replaceAll('ExampleBasic', names.pascal)
    .replaceAll('exampleBasic', names.camel)
    .replaceAll('example-basic', names.slug)
    .replaceAll('Example Basic', names.title)

const writeNewFile = async (filePath: string, contents: string) => {
  if (!isPathInside(repoRoot, filePath)) {
    throw new Error(`Refusing to write "${filePath}" outside the repository.`)
  }

  const exists = await readSafeProjectFile({ cwd: repoRoot, filePath }).then(
    () => true,
    () => false,
  )

  if (exists) {
    throw new Error(`Refusing to overwrite existing file: ${path.relative(repoRoot, filePath)}`)
  }

  await writeSafeProjectFile({ contents, cwd: repoRoot, filePath })

  return path.relative(repoRoot, filePath)
}

/* Every dbName already in the catalog, so a suggestion can be checked rather
   than guessed at. A collision silently breaks the database mapping. */
const collectUsedDbNames = async () => {
  const used = new Set<string>()
  const entries = await readdir(sourceBlocksDir, { withFileTypes: true })

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue
    }

    const config = await readFile(
      path.join(sourceBlocksDir, entry.name, 'config.ts'),
      'utf8',
    ).catch(() => '')
    const match = /dbName:\s*'([^']+)'/.exec(config)

    if (match) {
      used.add(match[1])
    }
  }

  return used
}

const buildManifest = (names: ComponentNames) =>
  `${JSON.stringify(
    {
      $schema: '../schema/poc-manifest.schema.json',
      name: names.slug,
      version: '0.1.0',
      changelog: [{ version: '0.1.0', summary: 'Initial release.' }],
      title: names.title,
      description: `TODO: one sentence on what ${names.title} is for.`,
      registryItemName: names.slug,
      dependencies: {},
      peerDependencies: { next: '^15.0.0 || ^16.0.0', payload: '^3.0.0' },
      supportedTargets: ['payload-website-starter', 'payload-blocks-app'],
      supports: { payloadMajors: [3], nextMajors: [15, 16] },
      files: [`src/blocks/${names.pascal}/config.ts`, `src/blocks/${names.pascal}/Component.tsx`],
      payloadFragments: [
        {
          kind: 'renderBlocks',
          importName: names.interfaceName,
          importPath: `@/blocks/${names.pascal}/Component`,
          blockSlug: names.blockSlug,
        },
        {
          kind: 'pagesLayout',
          importName: names.pascal,
          importPath: `../../blocks/${names.pascal}/config`,
          blockName: names.pascal,
        },
      ],
      postInstall: ['generate:types', 'generate:importmap'],
      preview: { summary: `TODO: editor-facing preview copy for ${names.title}.` },
      sampleContent: {
        blockType: names.blockSlug,
        title: `TODO: sample headline for ${names.title}.`,
      },
      recovery: {
        patchedFiles: ['src/blocks/RenderBlocks.tsx', 'src/collections/Pages/index.ts'],
      },
    },
    null,
    2,
  )}\n`

const buildRegistryItem = (names: ComponentNames) => ({
  name: names.slug,
  type: 'registry:block',
  title: names.title,
  description: `TODO: one sentence on what ${names.title} is for.`,
  docs: [
    'Payload Components installs this as a Payload CMS block for the Payload website starter shape.',
    '',
    'Recommended install:',
    '',
    '```bash',
    `pnpm payload-components add ${names.slug}`,
    '```',
    '',
    'Direct shadcn install URL:',
    '',
    '```bash',
    `pnpm dlx shadcn@latest add https://www.payload-components.xyz/r/${names.slug}.json`,
    '```',
    '',
    `Direct shadcn installs only copy the block source files and shadcn UI dependencies. Use \`payload-components add ${names.slug}\` when you also want Payload layout registration, \`RenderBlocks\` wiring, \`generate:types\`, and \`generate:importmap\` handled for you.`,
  ].join('\n'),
  meta: {
    payloadComponent: {
      installCommand: `payload-components add ${names.slug}`,
      postInstall: ['generate:types', 'generate:importmap'],
      requiresPayloadComponentWrapper: true,
      supportedTargets: ['payload-website-starter', 'payload-blocks-app'],
    },
  },
  files: [
    {
      path: `payload-components/source/blocks/${names.pascal}/config.ts`,
      type: 'registry:file',
      target: `~/src/blocks/${names.pascal}/config.ts`,
    },
    {
      path: `payload-components/source/blocks/${names.pascal}/Component.tsx`,
      type: 'registry:file',
      target: `~/src/blocks/${names.pascal}/Component.tsx`,
    },
  ],
})

/* registry.json is prettier-ignored, so the item is serialized to match the
   surrounding two-space style and spliced in before the closing bracket rather
   than round-tripped through JSON.parse. */
const appendRegistryItem = async (names: ComponentNames) => {
  const source = await readSafeProjectFile({ cwd: repoRoot, filePath: registryPath })

  if (source.includes(`"name": "${names.slug}"`)) {
    throw new Error(`registry.json already has an item named "${names.slug}".`)
  }

  const serialized = JSON.stringify(buildRegistryItem(names), null, 2)
    .split('\n')
    .map((line) => `    ${line}`)
    .join('\n')
  const closing = source.lastIndexOf('\n  ]\n}')

  if (closing === -1) {
    throw new Error('Could not find the end of the registry items array in registry.json.')
  }

  await writeSafeProjectFile({
    contents: `${source.slice(0, closing)},\n${serialized}${source.slice(closing)}`,
    cwd: repoRoot,
    filePath: registryPath,
  })

  return path.relative(repoRoot, registryPath)
}

const appendDemoRegistryEntry = async (names: ComponentNames) => {
  const registryFile = path.join(demosDir, 'registry.ts')
  const source = await readSafeProjectFile({ cwd: repoRoot, filePath: registryFile })
  const demoName = `${names.pascal}Demo`
  const importLine = `import { ${demoName} } from '@/components/site/demos/${demoName}'\n`
  const lastImportEnd = source.lastIndexOf("'\n", source.indexOf('export')) + 2
  const withImport = `${source.slice(0, lastImportEnd)}${importLine}${source.slice(lastImportEnd)}`
  const mapClose = withImport.lastIndexOf('\n}')

  if (mapClose === -1) {
    throw new Error('Could not find the end of demosBySlug in the demo registry.')
  }

  await writeSafeProjectFile({
    contents: `${withImport.slice(0, mapClose)}\n  '${names.slug}': ${demoName},${withImport.slice(mapClose)}`,
    cwd: repoRoot,
    filePath: registryFile,
  })

  return path.relative(repoRoot, registryFile)
}

const appendDocsMetaEntry = async (names: ComponentNames) => {
  const metaPath = path.join(componentDocsDir, 'meta.json')
  const source = await readSafeProjectFile({ cwd: repoRoot, filePath: metaPath })
  const closing = source.lastIndexOf('\n  ]')

  if (closing === -1) {
    throw new Error('Could not find the end of the docs meta pages array.')
  }

  await writeSafeProjectFile({
    contents: `${source.slice(0, closing)},\n    "${names.slug}"${source.slice(closing)}`,
    cwd: repoRoot,
    filePath: metaPath,
  })

  return path.relative(repoRoot, metaPath)
}

const appendReadmeInventoryRow = async (names: ComponentNames) => {
  const readmePath = path.join(repoRoot, 'README.md')
  const source = await readSafeProjectFile({ cwd: repoRoot, filePath: readmePath })
  const end = source.indexOf('\n<!-- COMPONENT-INVENTORY:END -->')

  if (end === -1) {
    throw new Error('Could not find the COMPONENT-INVENTORY end marker in README.md.')
  }

  const rows = source.slice(0, end).split('\n')
  const lastRow = [...rows].reverse().find((line) => line.startsWith('| `'))
  const width = lastRow ? lastRow.split('|')[1].length : names.slug.length + 4
  const commandWidth = lastRow ? lastRow.split('|')[2].length : 0
  const nameCell = ` \`${names.slug}\``.padEnd(width, ' ')
  const commandCell = ` \`npx payload-components add ${names.slug}\``.padEnd(commandWidth, ' ')

  /* The rows are column-aligned; a ragged one would show up as a diff on every
     neighbouring line the next time anyone reformats the table. */
  await writeSafeProjectFile({
    contents: `${source.slice(0, end)}\n|${nameCell}|${commandCell}|${source.slice(end)}`,
    cwd: repoRoot,
    filePath: readmePath,
  })

  return path.relative(repoRoot, readmePath)
}

const formatCuratedSteps = (names: ComponentNames, dbNameIsFree: boolean) =>
  [
    '',
    'Now the parts that need a decision — none of these were written for you:',
    '',
    `1. src/lib/component-catalog.ts → componentEditorialEntries: add ${names.slug}`,
    '   beside its family. Registry order drives the catalog and docs prev/next arrows;',
    '   commands, routes, family, and version are derived rather than repeated here.',
    '',
    '   {',
    `     category: 'TODO',`,
    `     description: 'TODO',`,
    `     fields: ['TODO'],`,
    `     slug: '${names.slug}',`,
    `     target: 'TODO',`,
    `     title: '${names.title}',`,
    '   },',
    '',
    `2. ${`payload-components/source/blocks/${names.pascal}/config.ts`} → dbName: pick a readable`,
    `   abbreviation of at most ${DB_NAME_MAX_LENGTH} characters. Suggested: "${names.dbNameSuggestion}"` +
      (dbNameIsFree ? ' (free).' : ' — ALREADY TAKEN, choose another.'),
    '',
    '3. Fill every TODO in the manifest, the registry item, and the doc page: title,',
    '   description, preview.summary, sampleContent, and the Content model TypeTable.',
    '',
    `4. src/lib/demo-content.ts → sample content for the twin, unless the family already`,
    '   shares a shape.',
    '',
    '5. Only if this is a new family: src/lib/component-catalog.ts componentCategories,',
    '   src/lib/component-page-tree.tsx FAMILIES, CatalogFamilyTeaser familyRepresentatives,',
    '   and tests/int/payload-components.int.spec.ts representativeInstallComponents.',
    '',
    '6. Visual baselines cannot be generated here — run',
    `   pnpm test:e2e components-visual --update-snapshots for darwin, and the`,
    '   visual-baselines workflow for linux.',
    '',
    'Then: pnpm registry:build && pnpm test:registry && pnpm run test:int',
  ].join('\n')

export const newCommand = async ({ componentSlug }: { componentSlug: string }) => {
  const names = deriveComponentNames(componentSlug)
  const [configTemplate, componentTemplate, docTemplate, usedDbNames] = await Promise.all([
    readFile(path.join(templateDir, 'config.ts'), 'utf8'),
    readFile(path.join(templateDir, 'Component.tsx'), 'utf8'),
    readFile(path.join(templateDir, 'doc-page.mdx'), 'utf8'),
    collectUsedDbNames(),
  ])

  const written = [
    await writeNewFile(
      path.join(sourceBlocksDir, names.pascal, 'config.ts'),
      renameTemplate(configTemplate, names),
    ),
    await writeNewFile(
      path.join(sourceBlocksDir, names.pascal, 'Component.tsx'),
      renameTemplate(componentTemplate, names),
    ),
    await writeNewFile(path.join(manifestsDir, `${names.slug}.json`), buildManifest(names)),
    await writeNewFile(
      path.join(componentDocsDir, `${names.slug}.mdx`),
      renameTemplate(docTemplate, names),
    ),
    await writeNewFile(path.join(demosDir, `${names.pascal}Demo.tsx`), buildDemoTwin(names)),
  ]

  const appended = [
    await appendRegistryItem(names),
    await appendDemoRegistryEntry(names),
    await appendDocsMetaEntry(names),
    await appendReadmeInventoryRow(names),
  ]
  await buildSiteCatalog()
  const generated = [path.relative(repoRoot, siteCatalogPath)]

  printHeader(
    [
      `payload-components: scaffolded "${names.slug}".`,
      '',
      'Created:',
      ...written.map((file) => `  ${file}`),
      '',
      'Appended:',
      ...appended.map((file) => `  ${file}`),
      '',
      'Generated:',
      ...generated.map((file) => `  ${file}`),
      formatCuratedSteps(names, !usedDbNames.has(names.dbNameSuggestion)),
    ].join('\n'),
  )
}

/* A twin has to keep each source class group attached to one preview element.
   That only makes sense once the component has real markup, so this is a valid,
   passing skeleton rather than a guess at the finished mirror. */
const buildDemoTwin = (names: ComponentNames) =>
  [
    `/* Demo twin for ${names.slug}.`,
    ' *',
    ' * Keep every className="…" group from',
    ` * payload-components/source/blocks/${names.pascal}/Component.tsx on one corresponding element — this is`,
    ' * enforced by tests/int/demo-twins.int.spec.ts. Keep the root aria-hidden, and use no',
    ' * interactive elements or headings: <h2> becomes <div>, CMSLink becomes <DemoLink>,',
    ' * <Media> becomes a bg-muted placeholder.',
    ' */',
    '',
    `export function ${names.pascal}Demo() {`,
    '  return (',
    '    <section aria-hidden="true" className="container">',
    '      <div className="mx-auto max-w-3xl text-center">',
    `        <div className="text-3xl font-semibold tracking-tight">${names.title}</div>`,
    '      </div>',
    '    </section>',
    '  )',
    '}',
    '',
  ].join('\n')
