import type { ComponentManifest } from '../../tools/payload-components/types'

/**
 * Pure derivations behind the component doc reference sections. Everything
 * here reads only the manifest (never target source), so the "What it
 * installs" composition tree and the "Usage" admin-form mock can't drift from
 * what the CLI ships. Two shapes come out of `sampleContent`:
 *
 *   - a composition tree (`Pages → layout[] → <Block>` then its fields, or
 *     `Your template → <Component />` then its props for file-only parts)
 *   - a flat list of admin form fields, typed well enough to mock the Payload
 *     block form (text, textarea, checkbox, number, array rows, link chips).
 *
 * Both are unit-tested in tests/int/component-sections.int.spec.ts against
 * every manifest in payload-components/manifests.
 */

export type CompositionManifest = Pick<
  ComponentManifest,
  'files' | 'installMode' | 'name' | 'payloadFragments' | 'sampleContent'
>

export type CompositionNode = {
  children?: CompositionNode[]
  name: string
  /* Muted annotation after the name — "link" for a collapsed link object. */
  note?: string
}

export type Composition = {
  /* The Payload block name or the React component name. */
  componentName: string
  fileOnly: boolean
  root: CompositionNode
}

/* Keys Payload adds to block data that an editor never types. */
const HIDDEN_KEYS = new Set(['blockType', 'blockName', 'id'])

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

/* A `{ link: {...} }` row or a `link` object collapses to one leaf: the link
 * group's inner fields (type, url, label, appearance, newTab) are the starter's
 * shared link field, not something this block defines. */
const isLinkKey = (key: string) => key === 'link' || key === 'links'
const isLinkRow = (value: unknown) =>
  isRecord(value) && Object.keys(value).length === 1 && isRecord(value.link)

/* Union of keys across every element, in order of first appearance, so an
 * optional key present only on the second row still shows. */
const unionKeys = (rows: Record<string, unknown>[]) => {
  const keys: string[] = []
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!keys.includes(key)) keys.push(key)
    }
  }
  return keys
}

/* First value for a key across the rows, so a `null` on row one doesn't hide
 * a nested shape row two carries. */
const representative = (rows: Record<string, unknown>[], key: string) =>
  rows.map((row) => row[key]).find((value) => value !== null && value !== undefined)

function nodeFor(key: string, value: unknown): CompositionNode {
  if (Array.isArray(value)) {
    const objectRows = value.filter(isRecord)
    if (!objectRows.length) return { name: `${key}[]` }
    if (isLinkKey(key) || objectRows.every(isLinkRow)) return { name: `${key}[]`, note: 'link' }
    return {
      name: `${key}[]`,
      children: unionKeys(objectRows).map((childKey) =>
        nodeFor(childKey, representative(objectRows, childKey)),
      ),
    }
  }
  if (isRecord(value)) {
    if (isLinkKey(key) || isLinkRow(value)) return { name: key, note: 'link' }
    const keys = Object.keys(value)
    if (!keys.length) return { name: key }
    return { name: key, children: keys.map((childKey) => nodeFor(childKey, value[childKey])) }
  }
  return { name: key }
}

export const isFileOnly = (manifest: Pick<ComponentManifest, 'installMode' | 'payloadFragments'>) =>
  manifest.installMode === 'file-only' || manifest.payloadFragments.length === 0

const pascalCase = (slug: string) =>
  slug
    .split(/[^a-z0-9]+/i)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

/* The block's registered name for page blocks; for file-only parts, the
 * directory that holds Component.tsx (src/components/PostHero/Component.tsx →
 * PostHero), falling back to the slug in PascalCase. */
export function componentNameOf(
  manifest: Pick<ComponentManifest, 'files' | 'name' | 'payloadFragments'>,
) {
  const layout = manifest.payloadFragments.find((fragment) => fragment.kind === 'pagesLayout')
  if (layout && 'blockName' in layout) return layout.blockName

  const component = manifest.files.find((file) => file.endsWith('/Component.tsx'))
  const directory = component?.split('/').at(-2)
  return directory || pascalCase(manifest.name)
}

export function fieldNodes(sampleContent: Record<string, unknown>): CompositionNode[] {
  return Object.entries(sampleContent)
    .filter(([key]) => !HIDDEN_KEYS.has(key))
    .map(([key, value]) => nodeFor(key, value))
}

export function deriveComposition(manifest: CompositionManifest): Composition {
  const componentName = componentNameOf(manifest)
  const fields = fieldNodes(manifest.sampleContent)
  const fileOnly = isFileOnly(manifest)

  const root: CompositionNode = fileOnly
    ? { name: 'Your template', children: [{ name: `<${componentName} />`, children: fields }] }
    : {
        name: 'Pages',
        children: [{ name: 'layout[]', children: [{ name: componentName, children: fields }] }],
      }

  return { componentName, fileOnly, root }
}

export type CompositionLine = {
  /* The box-drawing prefix ("│   ├── "), kept apart so the UI can mute it. */
  guide: string
  name: string
  note?: string
}

/* Flatten a tree into monospace lines with box-drawing guides:
 *
 *   Pages
 *   └── layout[]
 *       └── FaqAccordion
 *           ├── eyebrow
 *           └── items[]
 *               ├── question
 *               └── answer
 */
export function compositionLines(root: CompositionNode): CompositionLine[] {
  const lines: CompositionLine[] = [{ guide: '', name: root.name, note: root.note }]

  const walk = (children: CompositionNode[], prefix: string) => {
    children.forEach((child, index) => {
      const last = index === children.length - 1
      lines.push({
        guide: `${prefix}${last ? '└── ' : '├── '}`,
        name: child.name,
        note: child.note,
      })
      if (child.children?.length) walk(child.children, `${prefix}${last ? '    ' : '│   '}`)
    })
  }

  walk(root.children ?? [], '')
  return lines
}

export const renderComposition = (root: CompositionNode) =>
  compositionLines(root)
    .map((line) => `${line.guide}${line.name}${line.note ? `  ${line.note}` : ''}`)
    .join('\n')

/* ------------------------------------------------------------------ */
/* Admin form mock                                                     */
/* ------------------------------------------------------------------ */

/* "publishedAt" → "Published At", matching how Payload labels a field that
 * declares no label. */
export const humanizeKey = (key: string) =>
  key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

export type AdminLink = { appearance?: string; label: string }

export type AdminArrayRow = {
  /* Nested arrays summarised as "5 features", "1 link". */
  counts: string[]
  link?: AdminLink
  primary: string
  secondary?: string
}

export type AdminField = { key: string; label: string } & (
  | { kind: 'checkbox'; checked: boolean }
  | { kind: 'empty' }
  | { kind: 'group'; fields: { label: string; value: string }[] }
  | { kind: 'link'; link: AdminLink }
  | { kind: 'links'; links: AdminLink[] }
  | { kind: 'list'; items: string[] }
  | { kind: 'number'; value: number }
  | { kind: 'rows'; rows: AdminArrayRow[] }
  | { kind: 'text'; value: string }
  | { kind: 'textarea'; value: string }
)

/* Keys whose strings read as paragraphs, and the length past which any
 * string does. Payload renders these as textareas or rich text. */
const PARAGRAPH_KEYS = /^(answer|bio|body|description|excerpt|message|quote|summary|text)$/i
const PARAGRAPH_LENGTH = 72

/* The string a row is known by in the admin's collapsed array view, then what
 * best qualifies it. Order is preference, first hit wins. */
const PRIMARY_KEYS = [
  'question',
  'title',
  'name',
  'label',
  'feature',
  'quote',
  'text',
  'term',
  'groupLabel',
  'value',
  'heading',
]
const SECONDARY_KEYS = [
  'price',
  'role',
  'period',
  'answer',
  'description',
  'excerpt',
  'url',
  'href',
  'type',
  'value',
  'icon',
]

const stringValue = (value: unknown) =>
  typeof value === 'string' && value.trim() ? value.trim() : undefined

const pickString = (row: Record<string, unknown>, preferred: string[], skip: string[]) => {
  for (const key of preferred) {
    if (skip.includes(key)) continue
    const found = stringValue(row[key])
    if (found) return { key, value: found }
  }
  for (const [key, value] of Object.entries(row)) {
    if (skip.includes(key)) continue
    const found = stringValue(value)
    if (found) return { key, value: found }
  }
  return undefined
}

const toLink = (value: unknown): AdminLink | undefined => {
  const link = isRecord(value) && isRecord(value.link) ? value.link : isRecord(value) ? value : null
  if (!link) return undefined
  const label = stringValue(link.label) ?? stringValue(link.url) ?? 'Link'
  const appearance = stringValue(link.appearance)
  return appearance ? { appearance, label } : { label }
}

/* A single array row. Nested arrays are counted, not expanded: the admin
 * collapses them too, and the composition tree already shows their shape. */
function rowFor(row: Record<string, unknown>, index: number): AdminArrayRow {
  if (isLinkRow(row)) {
    const link = toLink(row)
    return { counts: [], link, primary: link?.label ?? `Row ${index + 1}` }
  }

  const primary = pickString(row, PRIMARY_KEYS, [])
  const secondary = primary ? pickString(row, SECONDARY_KEYS, [primary.key]) : undefined
  const counts = Object.entries(row)
    .filter(([, value]) => Array.isArray(value) && value.length)
    .map(([key, value]) => {
      const length = (value as unknown[]).length
      const noun = humanizeKey(key).toLowerCase()
      return `${length} ${length === 1 ? noun.replace(/s$/, '') : noun}`
    })

  return {
    counts,
    primary: primary?.value ?? `Row ${index + 1}`,
    ...(secondary ? { secondary: secondary.value } : {}),
  }
}

function fieldFor(key: string, value: unknown): AdminField {
  const base = { key, label: humanizeKey(key) }

  if (value === null || value === undefined) return { ...base, kind: 'empty' }
  if (typeof value === 'boolean') return { ...base, kind: 'checkbox', checked: value }
  if (typeof value === 'number') return { ...base, kind: 'number', value }
  if (typeof value === 'string') {
    const paragraph = PARAGRAPH_KEYS.test(key) || value.length > PARAGRAPH_LENGTH
    return { ...base, kind: paragraph ? 'textarea' : 'text', value }
  }
  if (Array.isArray(value)) {
    const objectRows = value.filter(isRecord)
    if (!objectRows.length) {
      return { ...base, kind: 'list', items: value.map(String).filter(Boolean) }
    }
    if (isLinkKey(key) || objectRows.every(isLinkRow)) {
      return {
        ...base,
        kind: 'links',
        links: objectRows.map(toLink).filter((link): link is AdminLink => Boolean(link)),
      }
    }
    return { ...base, kind: 'rows', rows: objectRows.map(rowFor) }
  }
  if (isRecord(value)) {
    if (isLinkKey(key) || isLinkRow(value)) {
      const link = toLink(value)
      return link ? { ...base, kind: 'link', link } : { ...base, kind: 'empty' }
    }
    const fields = Object.entries(value).map(([childKey, childValue]) => ({
      label: humanizeKey(childKey),
      value:
        childValue === null || childValue === undefined
          ? ''
          : typeof childValue === 'object'
            ? Array.isArray(childValue)
              ? `${childValue.length} ${childValue.length === 1 ? 'item' : 'items'}`
              : humanizeKey(childKey)
            : String(childValue),
    }))
    return fields.length ? { ...base, kind: 'group', fields } : { ...base, kind: 'empty' }
  }

  return { ...base, kind: 'text', value: String(value) }
}

/* The block form as an editor fills it, field by field in manifest order. */
export function deriveAdminForm(sampleContent: Record<string, unknown>): AdminField[] {
  return Object.entries(sampleContent)
    .filter(([key]) => !HIDDEN_KEYS.has(key))
    .map(([key, value]) => fieldFor(key, value))
}
