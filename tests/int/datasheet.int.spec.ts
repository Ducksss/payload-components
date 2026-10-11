import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { isDeepStrictEqual } from 'node:util'

import ts from 'typescript'
import { describe, expect, it } from 'vitest'

import { getComponentDatasheet, getComponentInputs } from '../../src/lib/component-datasheet'
import { heroDatasheet } from '../../src/lib/datasheet'

const repoRoot = process.cwd()
const sourceRoot = path.join(repoRoot, 'payload-components', 'source')

type Manifest = {
  files: string[]
  installMode?: string
  name: string
  sampleContent?: Record<string, unknown>
}

async function manifests() {
  const directory = path.join(repoRoot, 'payload-components', 'manifests')
  const files = (await readdir(directory)).filter((file) => file.endsWith('.json')).sort()
  return Promise.all(
    files.map(
      async (file) => JSON.parse(await readFile(path.join(directory, file), 'utf8')) as Manifest,
    ),
  )
}

/* An independent reading of the same inputs through the TypeScript parser, so
 * the site's small text scanner (src/lib/component-datasheet.ts) is checked
 * against a real AST for every component the registry ships. */
async function parse(file: string) {
  const text = await readFile(file, 'utf8')
  return ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
}

function resolveSpecifier(specifier: string, from: string) {
  const bases = specifier.startsWith('@/')
    ? [path.join(sourceRoot, specifier.slice(2)), path.join(sourceRoot, 'base', specifier.slice(2))]
    : [path.resolve(path.dirname(from), specifier)]
  return bases.flatMap((base) => [`${base}.ts`, `${base}.tsx`])
}

async function declaration(
  name: string,
  file: ts.SourceFile,
): Promise<[ts.Expression, ts.SourceFile]> {
  let found: ts.Expression | undefined
  const visit = (node: ts.Node) => {
    if (ts.isVariableDeclaration(node) && node.name.getText() === name && node.initializer) {
      found = node.initializer
    }
    ts.forEachChild(node, visit)
  }
  visit(file)
  if (found) return [found, file]

  for (const statement of file.statements) {
    if (!ts.isImportDeclaration(statement)) continue
    const bindings = statement.importClause?.namedBindings
    if (!bindings || !ts.isNamedImports(bindings)) continue
    if (!bindings.elements.some((element) => element.name.text === name)) continue
    const specifier = (statement.moduleSpecifier as ts.StringLiteral).text
    for (const candidate of resolveSpecifier(specifier, file.fileName)) {
      try {
        return await declaration(name, await parse(candidate))
      } catch {
        /* next candidate */
      }
    }
  }
  throw new Error(`${name} not found from ${file.fileName}`)
}

const property = (object: ts.ObjectLiteralExpression, name: string) =>
  object.properties.find(
    (member): member is ts.PropertyAssignment =>
      ts.isPropertyAssignment(member) && member.name.getText() === name,
  )?.initializer

function field(object: ts.ObjectLiteralExpression, shared?: string) {
  const name = (property(object, 'name') as ts.StringLiteral).text
  const type = (property(object, 'type') as ts.StringLiteral).text
  return {
    label: type === 'array' ? `${name}[]` : name,
    name,
    required: property(object, 'required')?.kind === ts.SyntaxKind.TrueKeyword,
    ...(shared ? { shared } : {}),
    type,
  }
}

function firstFieldObject(node: ts.Node): ts.ObjectLiteralExpression | undefined {
  if (ts.isObjectLiteralExpression(node) && property(node, 'name') && property(node, 'type')) {
    return node
  }
  return ts.forEachChild(node, firstFieldObject)
}

async function fieldList(
  elements: ts.NodeArray<ts.Expression>,
  file: ts.SourceFile,
  shared?: string,
): Promise<ReturnType<typeof field>[]> {
  const pins: ReturnType<typeof field>[] = []
  for (const element of elements) {
    if (ts.isObjectLiteralExpression(element)) {
      pins.push(field(element, shared))
      continue
    }
    const identifier = ts.isSpreadElement(element)
      ? element.expression
      : ts.isCallExpression(element)
        ? element.expression
        : element
    const [value, definition] = await declaration(identifier.getText(), file)
    const sharedName =
      definition !== file && definition.fileName.includes(`${path.sep}shared${path.sep}`)
        ? path.basename(definition.fileName, '.ts')
        : shared
    if (ts.isCallExpression(element)) {
      const pin = field(firstFieldObject(value) as ts.ObjectLiteralExpression, sharedName)
      const [options] = element.arguments
      const overrides =
        options && ts.isObjectLiteralExpression(options)
          ? property(options, 'overrides')
          : undefined
      const rename =
        overrides && ts.isObjectLiteralExpression(overrides)
          ? property(overrides, 'name')
          : undefined
      if (rename && ts.isStringLiteral(rename)) {
        pin.name = rename.text
        pin.label = pin.type === 'array' ? `${rename.text}[]` : rename.text
      }
      pins.push(pin)
    } else if (ts.isArrayLiteralExpression(value)) {
      pins.push(...(await fieldList(value.elements, definition, sharedName)))
    } else {
      pins.push(field(value as ts.ObjectLiteralExpression, sharedName))
    }
  }
  return pins
}

async function astInputs(manifest: Manifest) {
  if (manifest.installMode === 'file-only') {
    const file = await parse(
      path.join(sourceRoot, manifest.files.find((entry) => entry.endsWith('.tsx'))!.slice(4)),
    )
    const alias = file.statements.find(
      (statement): statement is ts.TypeAliasDeclaration =>
        ts.isTypeAliasDeclaration(statement) && statement.name.text.endsWith('Props'),
    )
    const members = (alias!.type as ts.TypeLiteralNode).members.filter(ts.isPropertySignature)
    return members
      .filter(
        (member) => !['className', 'disableInnerContainer', 'id'].includes(member.name.getText()),
      )
      .map((member) => member.name.getText())
  }
  const file = await parse(
    path.join(sourceRoot, manifest.files.find((entry) => entry.endsWith('/config.ts'))!.slice(4)),
  )
  let fields: ts.ArrayLiteralExpression | undefined
  const visit = (node: ts.Node) => {
    if (
      !fields &&
      ts.isVariableDeclaration(node) &&
      node.type?.getText() === 'Block' &&
      node.initializer &&
      ts.isObjectLiteralExpression(node.initializer)
    ) {
      fields = property(node.initializer, 'fields') as ts.ArrayLiteralExpression
    }
    ts.forEachChild(node, visit)
  }
  visit(file)
  return fieldList(fields!.elements, file)
}

describe('component datasheets', () => {
  it('reads every component’s inputs exactly as the TypeScript parser does', async () => {
    const all = await manifests()
    expect(all.length).toBeGreaterThan(80)

    const mismatches: string[] = []
    for (const manifest of all) {
      const scanned = await getComponentInputs(manifest)
      const parsed = await astInputs(manifest)
      const actual = manifest.installMode === 'file-only' ? scanned.map((pin) => pin.name) : scanned
      if (!isDeepStrictEqual(actual, parsed)) {
        mismatches.push(`${manifest.name}: ${JSON.stringify(actual)} vs ${JSON.stringify(parsed)}`)
      }
    }
    expect(mismatches).toEqual([])
  })

  it('covers every field the manifest sample content fills', async () => {
    /* Sample content is a second, hand-written source of field names: each key
       it sets must be a pin, or the drawing is missing an input. */
    const missing: string[] = []
    for (const manifest of await manifests()) {
      const names = new Set((await getComponentInputs(manifest)).map((pin) => pin.name))
      for (const key of Object.keys(manifest.sampleContent ?? {})) {
        if (key !== 'blockType' && !names.has(key)) missing.push(`${manifest.name}.${key}`)
      }
    }
    expect(missing).toEqual([])
  })

  it('draws the landing hero from the same data as its docs datasheet', async () => {
    expect(await getComponentDatasheet('hero-basic')).toEqual(heroDatasheet)
  })

  it('wires blocks to five outputs and file-only components to their own folder', async () => {
    const formOnly = await getComponentDatasheet('related-posts')
    expect(formOnly).toMatchObject({
      inputKind: 'props',
      outputs: ['RelatedPosts/'],
      part: 'PC-RELATED-POSTS',
    })
    expect(formOnly?.inputs.map((pin) => pin.label)).toEqual([
      'currentHref',
      'posts[]',
      'title',
      'locale',
    ])

    const query = await getComponentDatasheet('collection-query')
    expect(query?.inputKind).toBe('fields')
    expect(query?.outputs).toEqual([
      'CollectionQuery/',
      'Pages/index.ts',
      'RenderBlocks.tsx',
      'payload-types.ts',
      'importMap.js',
    ])
  })
})

/* Codepoints a TrueType font maps to a real glyph (cmap formats 4 and 12). */
function coveredCodepoints(font: Buffer) {
  const tables = font.readUInt16BE(4)
  let cmap = -1
  for (let index = 0; index < tables; index++) {
    const record = 12 + index * 16
    if (font.toString('latin1', record, record + 4) === 'cmap') cmap = font.readUInt32BE(record + 8)
  }
  const covered = new Set<number>()
  const subtables = font.readUInt16BE(cmap + 2)
  for (let index = 0; index < subtables; index++) {
    const table = cmap + font.readUInt32BE(cmap + 4 + index * 8 + 4)
    const format = font.readUInt16BE(table)
    if (format === 12) {
      const groups = font.readUInt32BE(table + 12)
      for (let group = 0; group < groups; group++) {
        const start = font.readUInt32BE(table + 16 + group * 12)
        const end = font.readUInt32BE(table + 20 + group * 12)
        for (let code = start; code <= end; code++) covered.add(code)
      }
    } else if (format === 4) {
      const segments = font.readUInt16BE(table + 6) / 2
      const ends = table + 14
      const starts = ends + segments * 2 + 2
      const deltas = starts + segments * 2
      const offsets = deltas + segments * 2
      for (let segment = 0; segment < segments; segment++) {
        const start = font.readUInt16BE(starts + segment * 2)
        const end = font.readUInt16BE(ends + segment * 2)
        const delta = font.readInt16BE(deltas + segment * 2)
        const rangeOffset = font.readUInt16BE(offsets + segment * 2)
        for (let code = start; code <= end && code !== 0xffff; code++) {
          const glyph =
            rangeOffset === 0
              ? (code + delta) & 0xffff
              : font.readUInt16BE(offsets + segment * 2 + rangeOffset + (code - start) * 2)
          if (glyph !== 0) covered.add(code)
        }
      }
    }
  }
  return covered
}

describe('Datasheet OG cards', () => {
  it('draws every card from the one shared module and mark', async () => {
    const routes = [
      'src/app/opengraph-image.tsx',
      'src/app/[locale]/og/docs/[...slug]/route.tsx',
      'src/app/[locale]/og/blog/[slug]/image.png/route.tsx',
      'src/app/[locale]/templates/opengraph-image.tsx',
      'src/app/[locale]/templates/[slug]/opengraph-image.tsx',
    ]
    for (const route of routes) {
      const source = await readFile(path.join(repoRoot, route), 'utf8')
      expect(source, route).toContain("from '@/lib/og/datasheet-card'")
      expect(source, route).toContain("from '@/lib/og/cards'")
      expect(source, route).not.toMatch(/MARK_SVG|readFileSync|fontFile\(/)
    }
  })

  it('has a vendored glyph for every character a card can draw', async () => {
    /* Satori fetches a font from Google for any glyph no loaded font has,
       which would make the build depend on the network. Cards draw docs and
       blog frontmatter, template copy, the hero headline and their own labels. */
    const { ogFonts } = await import('../../src/lib/og/datasheet-card')
    const { templateShowcases } = await import('../../src/lib/templates/registry')
    /* src/lib/blog loads the MDX collection, which only the Next build can
       compile, so the series labels are read from its source. */
    const blogLabels = [
      ...(await readFile(path.join(repoRoot, 'src/lib/blog.ts'), 'utf8')).matchAll(
        /label: '([^']+)'/g,
      ),
    ].map((match) => match[1])
    const site = await import('../../src/lib/site')

    const covered = new Set<number>()
    for (const font of ogFonts) for (const code of coveredCodepoints(font.data)) covered.add(code)

    const frontmatter: string[] = []
    for (const directory of ['content/docs', 'content/blog']) {
      const files = (await readdir(path.join(repoRoot, directory), { recursive: true })).filter(
        (file) => file.endsWith('.mdx'),
      )
      for (const file of files) {
        const text = await readFile(path.join(repoRoot, directory, file), 'utf8')
        const head = /^---\n([\s\S]*?)\n---/.exec(text)?.[1] ?? ''
        frontmatter.push(
          ...[...head.matchAll(/^(?:title|description):\s*(.+)$/gm)].map((match) => match[1]),
        )
      }
    }
    const text = [
      ...frontmatter,
      ...templateShowcases.flatMap((template) => [template.title, template.summary]),
      ...blogLabels,
      site.heroHeadline,
      site.siteUrl,
      ...site.componentEntries.map((entry) => entry.command),
      'J1 · YOUR PROJECT · MIT · open source · FIG. 1 · BOM · NC · $ … —',
    ].join(' ')

    const missing = [...new Set([...text])].filter(
      (char) => char.trim() && !covered.has(char.codePointAt(0)!),
    )
    expect(missing).toEqual([])
  })
})
