import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { getComponentManifest } from '@/lib/component-manifest'
import { datasheetFromManifest, type Datasheet, type DatasheetPin } from '@/lib/datasheet'

/* Build-time reader for the per-component datasheets on /docs/components/<slug>.
 * The outputs come from the manifest; the inputs come from source the site
 * never imports, read here as text — the same boundary component-source.ts
 * keeps for the Code tab:
 *
 * - a Payload block: the top-level `fields` of its config, following spreads of
 *   the shared family bases (`...heroFields`), shared single fields
 *   (`faqItemsField`) and field helpers (`linkGroup({ … })`) into their own
 *   source files;
 * - a file-only component: the members of its exported `<Name>Props` type,
 *   minus the wrapper props every component takes (`id`, `className`,
 *   `disableInnerContainer`).
 *
 * The scanner is deliberately small: it understands the shapes the registry
 * ships, and tests/int/datasheet.int.spec.ts checks every component against a
 * real TypeScript parse, so a config it cannot read fails the gate instead of
 * drawing a wrong part. */

const sourceRoot = path.join('payload-components', 'source')
const wrapperProps = new Set(['className', 'disableInnerContainer', 'id'])

type Span = [start: number, end: number]

/* The source with comments blanked and string contents replaced, the same
 * length as the original, so brackets and commas can be found structurally
 * while values are still read from the original text at the same offsets. */
function mask(source: string) {
  const out = source.split('')
  let index = 0
  while (index < source.length) {
    const char = source[index]
    const next = source[index + 1]
    if (char === '/' && next === '/') {
      while (index < source.length && source[index] !== '\n') out[index++] = ' '
    } else if (char === '/' && next === '*') {
      const end = source.indexOf('*/', index + 2)
      const stop = end === -1 ? source.length : end + 2
      for (; index < stop; index++) if (source[index] !== '\n') out[index] = ' '
    } else if (char === "'" || char === '"' || char === '`') {
      index++
      while (index < source.length && source[index] !== char) {
        if (source[index] === '\\') out[index++] = '_'
        out[index++] = '_'
      }
      index++
    } else {
      index++
    }
  }
  return out.join('')
}

const opening: Record<string, string> = { '(': ')', '[': ']', '{': '}' }

function closingIndex(masked: string, open: number) {
  const stack: string[] = []
  for (let index = open; index < masked.length; index++) {
    const char = masked[index]
    if (char === '(' || char === '[' || char === '{') stack.push(opening[char])
    else if (char === ')' || char === ']' || char === '}') {
      if (stack.pop() !== char) break
      if (stack.length === 0) return index
    }
  }
  throw new Error(`unbalanced ${masked[open]} at ${open}`)
}

/* Comma-separated items directly inside the bracket at `open`. */
function topLevelItems(masked: string, open: number): Span[] {
  const close = closingIndex(masked, open)
  const items: Span[] = []
  let start = open + 1
  let depth = 0
  for (let index = open + 1; index <= close; index++) {
    const char = masked[index]
    if (char === '(' || char === '[' || char === '{') depth++
    else if ((char === ')' || char === ']' || char === '}') && index !== close) depth--
    if ((char === ',' && depth === 0) || index === close) {
      let from = start
      let to = index
      while (from < to && /\s/.test(masked[from])) from++
      while (to > from && /\s/.test(masked[to - 1])) to--
      if (to > from) items.push([from, to])
      start = index + 1
    }
  }
  return items
}

/* `key: value` members of the object literal at `open`, keyed by name, with
 * the value's span. Spreads and shorthand members are skipped. */
function objectMembers(masked: string, open: number) {
  const members = new Map<string, Span>()
  for (const [start, end] of topLevelItems(masked, open)) {
    const match = /^([A-Za-z_$][\w$]*)\s*\??\s*:/.exec(masked.slice(start, end))
    if (match) members.set(match[1], [start + match[0].length, end])
  }
  return members
}

const literal = (source: string, [start, end]: Span) =>
  /^\s*['"`]([^'"`]*)['"`]\s*$/.exec(source.slice(start, end))?.[1]

class SourceFile {
  readonly masked: string

  constructor(
    readonly file: string,
    readonly source: string,
  ) {
    this.masked = mask(source)
  }

  /* Where an imported name comes from, as an import specifier. */
  importOf(name: string) {
    for (const match of this.source.matchAll(
      /import\s+(?:type\s+)?\{([^}]*)\}\s+from\s+'([^']+)'/g,
    )) {
      const names = match[1].split(',').map((part) =>
        part
          .trim()
          .split(/\s+as\s+/)
          .at(-1),
      )
      if (names.includes(name)) return match[2]
    }
    return undefined
  }

  /* The initializer of `const <name>` (or the first `[`/`{`/`(` after it). */
  declarationValue(name: string) {
    const match = new RegExp(`\\bconst\\s+${name}\\b[^=]*=\\s*`).exec(this.masked)
    if (!match) return undefined
    return match.index + match[0].length
  }
}

async function load(file: string, cwd: string) {
  return new SourceFile(file, await readFile(path.join(cwd, file), 'utf8'))
}

/* `@/blocks/shared/heroFields` -> payload-components/source/blocks/shared/heroFields.ts,
 * `@/fields/linkGroup` -> payload-components/source/base/fields/linkGroup.ts (the
 * starter base), and relative specifiers next to the importing file. */
async function resolveSpecifier(specifier: string, from: string, cwd: string) {
  const bases = specifier.startsWith('@/')
    ? [path.join(sourceRoot, specifier.slice(2)), path.join(sourceRoot, 'base', specifier.slice(2))]
    : specifier.startsWith('.')
      ? [path.join(path.dirname(from), specifier)]
      : []
  for (const base of bases) {
    for (const candidate of [`${base}.ts`, `${base}.tsx`, path.join(base, 'index.ts')]) {
      try {
        await readFile(path.join(cwd, candidate))
        return candidate
      } catch {
        /* try the next candidate */
      }
    }
  }
  throw new Error(`cannot resolve ${specifier} from ${from}`)
}

async function definitionOf(name: string, from: SourceFile, cwd: string) {
  if (from.declarationValue(name) !== undefined) return from
  const specifier = from.importOf(name)
  if (!specifier) throw new Error(`${name} is neither declared nor imported in ${from.file}`)
  const file = await load(await resolveSpecifier(specifier, from.file, cwd), cwd)
  if (file.declarationValue(name) === undefined)
    throw new Error(`${name} not found in ${file.file}`)
  return file
}

function pinFromObject(file: SourceFile, open: number, shared?: string): DatasheetPin {
  const members = objectMembers(file.masked, open)
  const nameSpan = members.get('name')
  const typeSpan = members.get('type')
  const name = nameSpan && literal(file.source, nameSpan)
  const type = typeSpan && literal(file.source, typeSpan)
  if (!name || !type) throw new Error(`unnamed field in ${file.file}`)
  const requiredSpan = members.get('required')
  return {
    label: type === 'array' ? `${name}[]` : name,
    name,
    required: requiredSpan ? file.source.slice(...requiredSpan).trim() === 'true' : false,
    ...(shared ? { shared } : {}),
    type,
  }
}

/* The first object literal in a helper's body that names a field: the field
 * the helper returns (`linkGroup` builds `{ name: 'links', type: 'array' }`). */
function helperField(file: SourceFile, start: number, shared?: string) {
  for (let index = start; index < file.masked.length; index++) {
    if (file.masked[index] !== '{') continue
    const members = objectMembers(file.masked, index)
    if (members.has('name') && members.has('type')) return pinFromObject(file, index, shared)
  }
  throw new Error(`no field object in ${file.file}`)
}

async function fieldsAt(
  file: SourceFile,
  open: number,
  cwd: string,
  shared?: string,
): Promise<DatasheetPin[]> {
  const pins: DatasheetPin[] = []
  for (const [start, end] of topLevelItems(file.masked, open)) {
    const text = file.masked.slice(start, end)
    if (text.startsWith('{')) {
      pins.push(pinFromObject(file, start, shared))
      continue
    }

    const spread = /^\.\.\.\s*([A-Za-z_$][\w$]*)$/.exec(text)
    const call = /^([A-Za-z_$][\w$]*)\s*\(/.exec(text)
    const reference = /^([A-Za-z_$][\w$]*)$/.exec(text)
    const name = spread?.[1] ?? call?.[1] ?? reference?.[1]
    if (!name) throw new Error(`unreadable field entry in ${file.file}: ${text.slice(0, 40)}`)

    const definition = await definitionOf(name, file, cwd)
    const value = definition.declarationValue(name) as number
    /* A shared family module is named by its file (`heroFields`); a starter
       helper such as linkGroup inherits whichever list it was called from. */
    const sharedName =
      definition !== file && definition.file.includes(`${path.sep}shared${path.sep}`)
        ? path.basename(definition.file, '.ts')
        : shared

    if (call) {
      const pin = helperField(definition, value, sharedName)
      /* `linkGroup({ overrides: { name: 'ctas' } })` renames the field. */
      const argument = file.masked.indexOf('(', start)
      const options = file.masked.indexOf('{', argument)
      if (options !== -1 && options < end) {
        const overridesSpan = objectMembers(file.masked, options).get('overrides')
        const overridesOpen = overridesSpan ? file.masked.indexOf('{', overridesSpan[0]) : -1
        const renamed =
          overridesOpen !== -1 && overridesOpen < overridesSpan![1]
            ? objectMembers(file.masked, overridesOpen).get('name')
            : undefined
        const rename = renamed && literal(file.source, renamed)
        if (rename)
          Object.assign(pin, { label: pin.type === 'array' ? `${rename}[]` : rename, name: rename })
      }
      pins.push(pin)
      continue
    }

    const bracket = definition.masked.slice(value).search(/[[{]/)
    const valueOpen = value + bracket
    if (definition.masked[valueOpen] === '[') {
      pins.push(...(await fieldsAt(definition, valueOpen, cwd, sharedName)))
    } else {
      pins.push(pinFromObject(definition, valueOpen, sharedName))
    }
  }
  return pins
}

/* The block config's top-level `fields: [`: the first one in the Block object,
 * before any nested array or group field declares its own. */
async function blockFields(configFile: string, cwd: string) {
  const file = await load(configFile, cwd)
  const block = /:\s*Block\s*=\s*\{/.exec(file.masked)
  if (!block) throw new Error(`no Block in ${configFile}`)
  const blockOpen = block.index + block[0].length - 1
  const fieldsSpan = objectMembers(file.masked, blockOpen).get('fields')
  if (!fieldsSpan) throw new Error(`no fields in ${configFile}`)
  const open = file.masked.indexOf('[', fieldsSpan[0])
  return fieldsAt(file, open, cwd)
}

/* Members of `export type <Name>Props = { … }`, as props. */
async function componentProps(componentFile: string, cwd: string) {
  const file = await load(componentFile, cwd)
  const declaration = /export\s+type\s+\w+Props\s*=\s*\{/.exec(file.masked)
  if (!declaration) throw new Error(`no Props type in ${componentFile}`)
  const open = declaration.index + declaration[0].length - 1
  const close = closingIndex(file.masked, open)
  const pins: DatasheetPin[] = []
  for (const line of file.masked.slice(open + 1, close).split('\n')) {
    const match = /^\s*([A-Za-z_$][\w$]*)(\??)\s*:\s*(.+?)\s*$/.exec(line)
    if (!match || wrapperProps.has(match[1])) continue
    const [, name, optional, type] = match
    const isArray = /\[\]|^readonly\s|Array</.test(type)
    pins.push({
      label: isArray ? `${name}[]` : name,
      name,
      required: optional !== '?',
      type: /ReactNode/.test(type) ? 'slot' : isArray ? 'array' : type.split('|')[0].trim(),
    })
  }
  return pins
}

export async function getComponentInputs(
  manifest: { files: string[]; installMode?: string },
  cwd = process.cwd(),
) {
  if (manifest.installMode === 'file-only') {
    const componentFile = manifest.files.find((file) => file.endsWith('.tsx'))
    if (!componentFile) throw new Error('file-only component without a .tsx file')
    return componentProps(path.join(sourceRoot, componentFile.replace(/^src\//, '')), cwd)
  }
  const configFile = manifest.files.find((file) => file.endsWith('/config.ts'))
  if (!configFile) throw new Error('block without a config.ts')
  return blockFields(path.join(sourceRoot, configFile.replace(/^src\//, '')), cwd)
}

export async function getComponentDatasheet(slug: string): Promise<Datasheet | null> {
  const manifest = await getComponentManifest(slug)
  if (!manifest) return null
  return datasheetFromManifest(manifest, await getComponentInputs(manifest))
}
