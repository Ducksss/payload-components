import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

import { createSiteCatalog, siteCatalogPath } from '../build-site-catalog'
import { readSafeProjectFile } from '../safe-path'
import { commitFileChanges, isPathInside, printHeader, repoRoot } from '../utils'

import type { ComponentManifest, RegistryDefinition, SupportMatrix } from '../types'
import type { FileChange } from '../utils'

/* Scaffolds a component bundle in THIS repo — the authoring side, not the
 * consumer side. Adding a component touches a dozen files and the shape of every
 * one of them is derivable from the slug, so the mechanical parts are written
 * here and the parts that need judgment are printed as snippets.
 *
 * The split is deliberate. Editorial catalog context, dbName abbreviations,
 * Content model prose, and demo sample copy need human judgment. Registry order,
 * versions, commands, and routes are mechanical projections.
 *
 * `--file-only` scaffolds an article template component instead of a Pages
 * block (see newFileOnlyCommand below); the block path is the default. */

const templateDir = path.join(repoRoot, 'payload-components', 'component-template')
const fileOnlyTemplateDir = path.join(templateDir, 'file-only')
const sourceBlocksDir = path.join(repoRoot, 'payload-components', 'source', 'blocks')
const sourceComponentsDir = path.join(repoRoot, 'payload-components', 'source', 'components')
const manifestsDir = path.join(repoRoot, 'payload-components', 'manifests')
const componentDocsDir = path.join(repoRoot, 'content', 'docs', 'components')
const demosDir = path.join(repoRoot, 'src', 'components', 'site', 'demos')
const registryPath = path.join(repoRoot, 'payload-components', 'registry.json')
const supportMatrixPath = path.join(repoRoot, 'payload-components', 'support-matrix.json')
const messagesPath = path.join(repoRoot, 'messages', 'en.json')
const catalogSourcePath = path.join(repoRoot, 'src', 'lib', 'component-catalog.ts')

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

type PreparedFile = {
  change: FileChange
  relativePath: string
}

const prepareNewFile = async (filePath: string, contents: string): Promise<PreparedFile> => {
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

  return {
    change: { content: contents, filePath },
    relativePath: path.relative(repoRoot, filePath),
  }
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

// Exported so tests/int/payload-components-support-matrix.int.spec.ts can hold
// new manifests to the support matrix.
export const buildManifest = (names: ComponentNames) =>
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
      peerDependencies: { next: '^15.0.0 || ^16.0.0', payload: '^3.0.0 || ^4.0.0-0' },
      supportedTargets: ['payload-website-starter', 'payload-blocks-app'],
      supports: { payloadMajors: [3, 4], nextMajors: [15, 16] },
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
const prepareRegistryItem = async (
  names: ComponentNames,
  item: object = buildRegistryItem(names),
): Promise<PreparedFile> => {
  const source = await readSafeProjectFile({ cwd: repoRoot, filePath: registryPath })

  if (source.includes(`"name": "${names.slug}"`)) {
    throw new Error(`registry.json already has an item named "${names.slug}".`)
  }

  const serialized = JSON.stringify(item, null, 2)
    .split('\n')
    .map((line) => `    ${line}`)
    .join('\n')
  const closing = source.lastIndexOf('\n  ]\n}')

  if (closing === -1) {
    throw new Error('Could not find the end of the registry items array in registry.json.')
  }

  return {
    change: {
      content: `${source.slice(0, closing)},\n${serialized}${source.slice(closing)}`,
      filePath: registryPath,
    },
    relativePath: path.relative(repoRoot, registryPath),
  }
}

const prepareDemoRegistryEntry = async (names: ComponentNames): Promise<PreparedFile> => {
  const registryFile = path.join(demosDir, 'registry.ts')
  const source = await readSafeProjectFile({ cwd: repoRoot, filePath: registryFile })
  const demoName = `${names.pascal}Demo`
  const importLine = `import { ${demoName} } from './${demoName}'\n`
  const lastImportEnd = source.lastIndexOf("'\n", source.indexOf('export')) + 2
  const withImport = `${source.slice(0, lastImportEnd)}${importLine}${source.slice(lastImportEnd)}`
  // The registry may export helpers after this flat map; the file's final brace
  // belongs to those helpers, not necessarily demosBySlug.
  const mapStart = withImport.search(/export const demosBySlug(?:\s*:[^=]+)?\s*=\s*\{/)
  const mapClose = mapStart === -1 ? -1 : withImport.indexOf('\n}', mapStart)

  if (mapClose === -1) {
    throw new Error('Could not find the end of demosBySlug in the demo registry.')
  }

  return {
    change: {
      content: `${withImport.slice(0, mapClose)}\n  '${names.slug}': ${demoName},${withImport.slice(mapClose)}`,
      filePath: registryFile,
    },
    relativePath: path.relative(repoRoot, registryFile),
  }
}

const prepareDocsMetaEntry = async (names: ComponentNames): Promise<PreparedFile> => {
  const metaPath = path.join(componentDocsDir, 'meta.json')
  const source = await readSafeProjectFile({ cwd: repoRoot, filePath: metaPath })
  const closing = source.lastIndexOf('\n  ]')

  if (closing === -1) {
    throw new Error('Could not find the end of the docs meta pages array.')
  }

  return {
    change: {
      content: `${source.slice(0, closing)},\n    "${names.slug}"${source.slice(closing)}`,
      filePath: metaPath,
    },
    relativePath: path.relative(repoRoot, metaPath),
  }
}

const prepareReadmeInventoryRow = async (names: ComponentNames): Promise<PreparedFile> => {
  const readmePath = path.join(repoRoot, 'README.md')
  const source = await readSafeProjectFile({ cwd: repoRoot, filePath: readmePath })
  const start = source.indexOf('<!-- COMPONENT-INVENTORY:START -->')
  const end = source.indexOf('\n<!-- COMPONENT-INVENTORY:END -->')

  if (end === -1) {
    throw new Error('Could not find the COMPONENT-INVENTORY end marker in README.md.')
  }

  /* The table is followed by a blank line before the end marker (prettier keeps
     one), so the row goes directly after the table's last line. Inserting at the
     marker put it after the blank line, outside the table. */
  const tableEnd = source.lastIndexOf('\n|', end)

  if (tableEnd === -1 || tableEnd < start) {
    throw new Error('Could not find the component inventory table in README.md.')
  }

  const insertAt = source.indexOf('\n', tableEnd + 1)
  const rows = source.slice(0, end).split('\n')
  const lastRow = [...rows].reverse().find((line) => line.startsWith('| `'))
  const width = lastRow ? lastRow.split('|')[1].length : names.slug.length + 4
  const commandWidth = lastRow ? lastRow.split('|')[2].length : 0
  const nameCell = ` \`${names.slug}\``.padEnd(width, ' ')
  const commandCell = ` \`npx payload-components add ${names.slug}\``.padEnd(commandWidth, ' ')

  /* The rows are column-aligned; a ragged one would show up as a diff on every
     neighbouring line the next time anyone reformats the table. */
  return {
    change: {
      content: `${source.slice(0, insertAt)}\n|${nameCell}|${commandCell}|${source.slice(insertAt)}`,
      filePath: readmePath,
    },
    relativePath: path.relative(repoRoot, readmePath),
  }
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

export const newCommand = async ({
  componentSlug,
  fileOnly = false,
}: {
  componentSlug: string
  fileOnly?: boolean
}) => {
  const names = deriveComponentNames(componentSlug)

  if (fileOnly) {
    return newFileOnlyCommand(names)
  }

  const [configTemplate, componentTemplate, docTemplate, usedDbNames] = await Promise.all([
    readFile(path.join(templateDir, 'config.ts'), 'utf8'),
    readFile(path.join(templateDir, 'Component.tsx'), 'utf8'),
    readFile(path.join(templateDir, 'doc-page.mdx'), 'utf8'),
    collectUsedDbNames(),
  ])

  const manifestSource = buildManifest(names)
  const written = await Promise.all([
    prepareNewFile(
      path.join(sourceBlocksDir, names.pascal, 'config.ts'),
      renameTemplate(configTemplate, names),
    ),
    prepareNewFile(
      path.join(sourceBlocksDir, names.pascal, 'Component.tsx'),
      renameTemplate(componentTemplate, names),
    ),
    prepareNewFile(path.join(manifestsDir, `${names.slug}.json`), manifestSource),
    prepareNewFile(
      path.join(componentDocsDir, `${names.slug}.mdx`),
      renameTemplate(docTemplate, names),
    ),
    prepareNewFile(path.join(demosDir, `${names.pascal}Demo.tsx`), buildDemoTwin(names)),
  ])

  const appended = await Promise.all([
    prepareRegistryItem(names),
    prepareDemoRegistryEntry(names),
    prepareDocsMetaEntry(names),
    prepareReadmeInventoryRow(names),
  ])
  const registry = JSON.parse(appended[0].change.content!) as RegistryDefinition
  const manifest = JSON.parse(manifestSource) as ComponentManifest
  const catalog = await createSiteCatalog({
    manifestOverrides: { [names.slug]: manifest },
    registry,
  })
  const generated: PreparedFile = {
    change: {
      content: `${JSON.stringify(catalog, null, 2)}\n`,
      filePath: siteCatalogPath,
    },
    relativePath: path.relative(repoRoot, siteCatalogPath),
  }

  /* No repository bytes change until every template, insertion anchor, and
   * generated projection has been prepared successfully. The final commit is
   * rollback-capable, so `new` either lands the complete scaffold or nothing. */
  await commitFileChanges(
    [...written, ...appended, generated].map(({ change }) => change),
    { cwd: repoRoot },
  )

  printHeader(
    [
      `payload-components: scaffolded "${names.slug}".`,
      '',
      'Created:',
      ...written.map(({ relativePath }) => `  ${relativePath}`),
      '',
      'Appended:',
      ...appended.map(({ relativePath }) => `  ${relativePath}`),
      '',
      'Generated:',
      `  ${generated.relativePath}`,
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

/* ------------------------------------------------------------------------ */
/* File-only article components (`new <slug> --file-only`)                   */
/* ------------------------------------------------------------------------ */

/* The shape post-hero, author-card, newsletter-callout, and related-posts ship:
 * one React component under source/components, composed by the consumer's post
 * template with public props. installMode 'file-only' means no Payload fragments,
 * no post-install generators, and no recovery paths; the registry item is a
 * registry:component. Everything here is a projection of the slug and the
 * support matrix; the category, copy, and real props stay curated decisions. */

/* Support comes straight from support-matrix.json, so a new Payload or Next.js
 * major reaches scaffolded manifests without a code change. Majors are the union
 * of every target's; each peer range admits its majors' stable lines, and the
 * newest Payload major also admits prereleases, because create-payload-app pins
 * exact canaries. tests/int/payload-components-support-matrix.int.spec.ts holds
 * the result to the matrix. */
export const deriveSupport = (matrix: SupportMatrix) => {
  const majors = (allowed: (target: SupportMatrix['targets'][number]) => number[]) =>
    [...new Set(matrix.targets.flatMap(allowed))].sort((left, right) => left - right)
  const caretRange = (list: number[], newestPrereleases: boolean) =>
    list
      .map((major, index) =>
        newestPrereleases && index === list.length - 1 ? `^${major}.0.0-0` : `^${major}.0.0`,
      )
      .join(' || ')
  const payloadMajors = majors((target) => target.allowedPayloadMajors)
  const nextMajors = majors((target) => target.allowedNextMajors)

  return {
    peerDependencies: {
      next: caretRange(nextMajors, false),
      payload: caretRange(payloadMajors, true),
    },
    supportedTargets: matrix.targets.map((target) => target.id),
    supports: { payloadMajors, nextMajors },
  }
}

/* React is not part of the support matrix; every file-only component is a React
 * 19 component, as the shipped ones declare. */
const FILE_ONLY_REACT_PEER = '^19.0.0'

export const buildFileOnlyManifest = (names: ComponentNames, matrix: SupportMatrix) => {
  const support = deriveSupport(matrix)

  return `${JSON.stringify(
    {
      $schema: '../schema/poc-manifest.schema.json',
      name: names.slug,
      version: '0.1.0',
      changelog: [{ version: '0.1.0', summary: 'Initial release.' }],
      title: names.title,
      description: `TODO: one sentence on what ${names.title} is for.`,
      registryItemName: names.slug,
      dependencies: {},
      peerDependencies: { ...support.peerDependencies, react: FILE_ONLY_REACT_PEER },
      supportedTargets: support.supportedTargets,
      supports: support.supports,
      files: [`src/components/${names.pascal}/Component.tsx`],
      payloadFragments: [],
      postInstall: [],
      preview: { summary: `TODO: one sentence of preview copy for ${names.title}.` },
      sampleContent: { title: `TODO: sample heading for ${names.title}.` },
      recovery: { patchedFiles: [] },
      installMode: 'file-only',
    },
    null,
    2,
  )}\n`
}

const buildFileOnlyRegistryItem = (names: ComponentNames, supportedTargets: string[]) => ({
  name: names.slug,
  type: 'registry:component',
  title: names.title,
  description: `TODO: one sentence on what ${names.title} is for.`,
  docs: `File-only article template component. Import ${names.pascal} from @/components/${names.pascal}/Component and pass the content explicitly. No Pages or RenderBlocks edits and no generators. Direct install: pnpm dlx shadcn@latest add https://www.payload-components.xyz/r/${names.slug}.json Optional tracked install in a supported Payload project: payload-components add ${names.slug}.`,
  meta: {
    payloadComponent: {
      installCommand: `payload-components add ${names.slug}`,
      postInstall: [],
      requiresPayloadComponentWrapper: false,
      supportedTargets,
    },
  },
  files: [
    {
      path: `payload-components/source/components/${names.pascal}/Component.tsx`,
      type: 'registry:file',
      target: `~/src/components/${names.pascal}/Component.tsx`,
    },
  ],
  registryDependencies: [],
})

type CatalogLabel = { description: string; target: string; title: string }

/* Catalog copy lives in messages/en.json. Components.<slug> is the one namespace
 * the Crowdin gate lets most draft locales fall back to English; zh has no
 * fallback, and the scaffold never writes a stand-in translation, so the printed
 * steps send that to Crowdin. An existing label, such as one written for a former
 * upcoming entry, is kept as written. en.json round-trips through JSON.stringify
 * byte for byte, so it is rewritten rather than spliced. */
const prepareCatalogLabel = async (
  names: ComponentNames,
): Promise<{ file?: PreparedFile; label: CatalogLabel }> => {
  const source = await readSafeProjectFile({ cwd: repoRoot, filePath: messagesPath })
  const messages = JSON.parse(source) as { Components?: Record<string, CatalogLabel> }

  if (!messages.Components) {
    throw new Error('Could not find the Components namespace in messages/en.json.')
  }

  const existing = messages.Components[names.slug]

  if (existing) {
    return { label: existing }
  }

  const label: CatalogLabel = {
    title: names.title,
    description: `TODO: one catalog sentence on what ${names.title} is for.`,
    target: 'TODO: where it sits in a post, for example Post footer',
  }
  messages.Components[names.slug] = label

  return {
    file: {
      change: { content: `${JSON.stringify(messages, null, 2)}\n`, filePath: messagesPath },
      relativePath: path.relative(repoRoot, messagesPath),
    },
    label,
  }
}

/* The Posts section of componentEditorialEntries. Its category is a curated
 * decision: a new Posts category also needs a CatalogBrowser.categories label in
 * every draft locale (tests/int/crowdin-sync.int.spec.ts), so the scaffold never
 * invents one. When a word of the slug names an existing Posts category
 * (author-*, newsletter-*, related-*), the entry is written with it; otherwise it
 * is printed for the author to place. */
const preparePostsCatalogEntry = async (
  names: ComponentNames,
): Promise<{ category?: string; file?: PreparedFile; postsCategories: string[] }> => {
  const source = await readSafeProjectFile({ cwd: repoRoot, filePath: catalogSourcePath })
  const categoriesStart = source.indexOf('export const componentCategories = {')
  const categoriesEnd = source.indexOf('\n} as const', categoriesStart)
  const entriesEnd = source.indexOf('\n] as const\n\nconst editorialBySlug')

  if (categoriesStart === -1 || categoriesEnd === -1 || entriesEnd === -1) {
    throw new Error(
      'Could not find componentCategories and componentEditorialEntries in src/lib/component-catalog.ts.',
    )
  }

  if (source.includes(`slug: '${names.slug}',`)) {
    throw new Error(`src/lib/component-catalog.ts already has an entry for "${names.slug}".`)
  }

  const postsCategories = [
    ...source
      .slice(categoriesStart, categoriesEnd)
      .matchAll(/^ {2}([a-z][a-z0-9]*): \{\n {4}family: 'posts',/gm),
  ].map((match) => match[1])
  const category = names.slug.split('-').find((word) => postsCategories.includes(word))

  if (!category) {
    return { postsCategories }
  }

  const entry = [
    '  {',
    `    category: '${category}',`,
    `    description: englishMessages.Components['${names.slug}'].description,`,
    `    fields: ['title', 'description'],`,
    `    slug: '${names.slug}',`,
    `    target: englishMessages.Components['${names.slug}'].target,`,
    `    title: englishMessages.Components['${names.slug}'].title,`,
    '  },',
  ].join('\n')

  return {
    category,
    file: {
      change: {
        content: `${source.slice(0, entriesEnd)}\n${entry}${source.slice(entriesEnd)}`,
        filePath: catalogSourcePath,
      },
      relativePath: path.relative(repoRoot, catalogSourcePath),
    },
    postsCategories,
  }
}

const formatFileOnlyCuratedSteps = (
  names: ComponentNames,
  {
    category,
    labelReused,
    postsCategories,
  }: { category?: string; labelReused: boolean; postsCategories: string[] },
) =>
  [
    '',
    'Now the parts that need a decision — none of these were written for you:',
    '',
    ...(category
      ? [
          `1. src/lib/component-catalog.ts → the Posts entry for ${names.slug} uses category`,
          `   '${category}', matched from the slug. Confirm it, or move it to another Posts`,
          `   category (${postsCategories.join(', ')}).`,
        ]
      : [
          `1. src/lib/component-catalog.ts → componentEditorialEntries: add ${names.slug} after`,
          '   the last Posts entry. No word of the slug names a Posts category, so pick one',
          `   (${postsCategories.join(', ')}):`,
          '',
          '   {',
          `     category: 'TODO',`,
          `     description: englishMessages.Components['${names.slug}'].description,`,
          `     fields: ['title', 'description'],`,
          `     slug: '${names.slug}',`,
          `     target: englishMessages.Components['${names.slug}'].target,`,
          `     title: englishMessages.Components['${names.slug}'].title,`,
          '   },',
        ]),
    '   A new Posts category also needs componentCategories and a CatalogBrowser.categories',
    '   label in every draft locale (tests/int/crowdin-sync.int.spec.ts).',
    '',
    ...(labelReused
      ? [`2. messages/en.json → Components.${names.slug} already existed and was kept; check it.`]
      : [
          `2. messages/en.json → Components.${names.slug}: replace the TODO description and target.`,
          '   zh has no English fallback (src/i18n/catalog-policy.ts), so',
          `   messages/locales/zh.json needs Components.${names.slug} translated through Crowdin or`,
          '   a native reviewer; tests/int/crowdin-sync.int.spec.ts fails until it is.',
        ]),
    '',
    `3. payload-components/source/components/${names.pascal}/Component.tsx → the real props and`,
    `   markup. Keep src/components/site/demos/${names.pascal}Demo.tsx mirroring every class group.`,
    '',
    '4. Fill every TODO in the manifest, the registry item, and the doc page: description,',
    '   preview.summary, sampleContent, the Content model TypeTable, the usage example, and',
    '   where the component goes in the post template.',
    '',
    '5. tests/int/article-components.int.spec.tsx → add it to the React typecheck list and the',
    '   direct shadcn delivery and lifecycle it.each, and add a render test. Update the literal',
    '   catalog counts in tests/int/fumadocs-site.int.spec.ts and the Posts list in',
    '   tests/int/site-catalog.int.spec.ts.',
    '',
    '6. Visual baselines cannot be generated here — dispatch the visual-baselines workflow',
    '   for components-visual, and for frontend too if the footer gains a category link.',
    '',
    'Then, once the source is final: pnpm registry:snapshot && pnpm registry:build &&',
    'pnpm test:registry && pnpm run test:int',
  ].join('\n')

const newFileOnlyCommand = async (names: ComponentNames) => {
  const [componentTemplate, demoTemplate, docTemplate, matrixSource] = await Promise.all([
    readFile(path.join(fileOnlyTemplateDir, 'Component.tsx'), 'utf8'),
    readFile(path.join(fileOnlyTemplateDir, 'Demo.tsx'), 'utf8'),
    readFile(path.join(fileOnlyTemplateDir, 'doc-page.mdx'), 'utf8'),
    readSafeProjectFile({ cwd: repoRoot, filePath: supportMatrixPath }),
  ])
  const matrix = JSON.parse(matrixSource) as SupportMatrix
  const manifestSource = buildFileOnlyManifest(names, matrix)
  const catalogLabel = await prepareCatalogLabel(names)
  const catalogEntry = await preparePostsCatalogEntry(names)
  /* The doc page title must equal the catalog title (the component-page e2e loop
     asserts H1 === title), which an existing label may spell differently. */
  const docPage = renameTemplate(docTemplate, names).replace(
    /^title: .*$/m,
    `title: ${catalogLabel.label.title}`,
  )

  const written = await Promise.all([
    prepareNewFile(
      path.join(sourceComponentsDir, names.pascal, 'Component.tsx'),
      renameTemplate(componentTemplate, names),
    ),
    prepareNewFile(path.join(manifestsDir, `${names.slug}.json`), manifestSource),
    prepareNewFile(path.join(componentDocsDir, `${names.slug}.mdx`), docPage),
    prepareNewFile(
      path.join(demosDir, `${names.pascal}Demo.tsx`),
      renameTemplate(demoTemplate, names),
    ),
  ])

  const appended = [
    ...(await Promise.all([
      prepareRegistryItem(
        names,
        buildFileOnlyRegistryItem(names, deriveSupport(matrix).supportedTargets),
      ),
      prepareDemoRegistryEntry(names),
      prepareDocsMetaEntry(names),
      prepareReadmeInventoryRow(names),
    ])),
    ...(catalogLabel.file ? [catalogLabel.file] : []),
    ...(catalogEntry.file ? [catalogEntry.file] : []),
  ]
  const registry = JSON.parse(appended[0].change.content!) as RegistryDefinition
  const manifest = JSON.parse(manifestSource) as ComponentManifest
  const catalog = await createSiteCatalog({
    manifestOverrides: { [names.slug]: manifest },
    registry,
  })
  const generated: PreparedFile = {
    change: {
      content: `${JSON.stringify(catalog, null, 2)}\n`,
      filePath: siteCatalogPath,
    },
    relativePath: path.relative(repoRoot, siteCatalogPath),
  }

  /* Same all-or-nothing commit as the block path. */
  await commitFileChanges(
    [...written, ...appended, generated].map(({ change }) => change),
    { cwd: repoRoot },
  )

  printHeader(
    [
      `payload-components: scaffolded "${names.slug}" as a file-only article component.`,
      '',
      'Created:',
      ...written.map(({ relativePath }) => `  ${relativePath}`),
      '',
      'Appended:',
      ...appended.map(({ relativePath }) => `  ${relativePath}`),
      '',
      'Generated:',
      `  ${generated.relativePath}`,
      formatFileOnlyCuratedSteps(names, {
        category: catalogEntry.category,
        labelReused: !catalogLabel.file,
        postsCategories: catalogEntry.postsCategories,
      }),
    ].join('\n'),
  )
}
