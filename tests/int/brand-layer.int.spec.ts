import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { heroDatasheet } from '../../src/lib/datasheet'

const repoRoot = process.cwd()
const read = (file: string) => readFile(path.join(repoRoot, file), 'utf8')

/* The Datasheet brand layer (globals.css section 4) is two scopes kept as
 * mirror images: [data-brand='datasheet'] remaps component tokens for the site
 * chrome, and .preview-scope restores them around every demo twin. If a token
 * is remapped without being restored, every twin inside branded chrome drifts
 * from what installs, while the chrome-free preview routes — the only thing
 * the visual baselines see — stay green. These checks are the gate for that. */

const stripComments = (css: string) => css.replace(/\/\*[\s\S]*?\*\//g, '')

/* Top-level declarations of the first rule whose selector list is exactly
 * `selector`; nested blocks (media queries, keyframes) are skipped. */
function ruleDeclarations(css: string, selector: string) {
  const source = stripComments(css)
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const opener = new RegExp(`(?:^|[}\\s;])${escaped}\\s*\\{`, 'm').exec(source)
  if (!opener) throw new Error(`no rule for ${selector}`)

  const declarations = new Map<string, string>()
  let depth = 1
  let body = ''
  for (let cursor = opener.index + opener[0].length; depth > 0; cursor += 1) {
    const char = source[cursor]
    if (char === undefined) break
    if (char === '{' || char === '}') {
      depth += char === '{' ? 1 : -1
      body += ';'
    } else if (depth === 1) {
      body += char
    }
  }
  for (const declaration of body.split(';')) {
    const match = /^([\w-]+)\s*:\s*([\s\S]+)$/.exec(declaration.trim())
    if (match) declarations.set(match[1], match[2].replace(/\s+/g, ' ').trim())
  }
  return declarations
}

/* Custom properties declared directly in every `@theme` block (any flags). */
function themeTokens(css: string) {
  const source = stripComments(css)
  const tokens = new Map<string, string>()
  for (const opener of source.matchAll(/@theme\b[^{;]*\{/g)) {
    let depth = 1
    let body = ''
    for (let cursor = opener.index + opener[0].length; depth > 0; cursor += 1) {
      const char = source[cursor]
      if (char === undefined) break
      if (char === '{' || char === '}') {
        depth += char === '{' ? 1 : -1
        body += ';'
      } else if (depth === 1) {
        body += char
      }
    }
    for (const declaration of body.split(';')) {
      const match = /^(--[\w-]+)\s*:\s*([\s\S]+)$/.exec(declaration.trim())
      if (match) tokens.set(match[1], match[2].replace(/\s+/g, ' ').trim())
    }
  }
  return tokens
}

describe('Datasheet brand layer', () => {
  it('restores every token the brand scope remaps, from its :root snapshot', async () => {
    const globals = await read('src/app/globals.css')
    const brand = ruleDeclarations(globals, "[data-brand='datasheet']")
    const preview = ruleDeclarations(globals, '.preview-scope')
    const root = ruleDeclarations(globals, ':root')
    const theme = themeTokens(globals)

    const remapped = [...brand.keys()].filter((name) => name.startsWith('--'))
    expect(remapped.length).toBeGreaterThan(0)
    /* The scope also sets the inherited font, so the restore must as well. */
    expect(brand.get('font-family')).toBe('var(--font-sans)')
    expect(preview.get('font-family')).toBe('var(--font-sans)')

    const missing = remapped.filter((name) => !preview.has(name))
    expect(missing, 'remapped by [data-brand] but never restored by .preview-scope').toEqual([])

    /* A restore reads the token's :root snapshot (--component-<name>), never a
       literal: custom properties inherit their computed value, so the snapshot
       is exactly what :root resolves — down to the lab() form the build
       compiles oklch() to, which a literal restore misses by a level or two.
       Tailwind's default-font pair is restored the way Tailwind defines it.
       The catalog's preview knobs may sit in front of the snapshot. */
    const tailwindDefaults = new Map([
      ['--default-font-family', 'var(--font-sans)'],
      ['--default-mono-font-family', 'var(--font-mono)'],
    ])
    const problems = [...preview.entries()]
      .filter(([name]) => name.startsWith('--'))
      .flatMap(([name, value]) => {
        if (tailwindDefaults.has(name)) {
          return value === tailwindDefaults.get(name) ? [] : [`${name}: restores ${value}`]
        }
        const snapshot = `--component-${name.slice(2)}`
        const restore = new RegExp(`^(?:var\\(--preview-[\\w-]+, )?var\\(${snapshot}\\)\\)?$`)
        const issues: string[] = []
        if (!restore.test(value)) issues.push(`${name}: restores ${value}, not var(${snapshot})`)
        if (root.get(snapshot) !== `var(${name})`) {
          issues.push(`${snapshot} must snapshot var(${name}) on :root`)
        }
        if (!root.has(name) && !theme.has(name)) issues.push(`${name} has no :root/@theme default`)
        return issues
      })
    expect(problems).toEqual([])
  })

  it('keeps the catalog brand preview on the component emerald until a hue is set', async () => {
    const globals = await read('src/app/globals.css')
    const themed = ruleDeclarations(globals, '.preview-themed')
    const root = ruleDeclarations(globals, ':root')

    /* With --preview-hue unset, every stop must be the :root ramp. */
    const drift = [...themed.entries()].flatMap(([name, value]) => {
      const token = name.replace('--preview-', '--')
      const resolved = value.replace(/var\(--preview-hue, ([^)]+)\)/g, '$1')
      return resolved === root.get(token) ? [] : [`${name}: ${resolved} vs ${root.get(token)}`]
    })
    expect(themed.size).toBe(5)
    expect(drift).toEqual([])
  })

  it('keeps the mark on the blocks emerald, outside the brand remap', async () => {
    const [globals, logomark] = await Promise.all([
      read('src/app/globals.css'),
      read('src/components/site/Logomark.tsx'),
    ])
    const brand = ruleDeclarations(globals, "[data-brand='datasheet']")

    expect(ruleDeclarations(globals, ':root').get('--mark')).toBe('var(--brand)')
    expect(brand.has('--mark')).toBe(false)
    expect(logomark).toContain('bg-mark')
    expect(logomark).not.toMatch(/\bbg-brand\b/)
  })

  it('renders every demo twin outside the templates through a preview scope', async () => {
    /* Template shells set these tokens themselves, so a preview scope inside
       one would undo the template's theme: they are exempt, and must stay so. */
    const files = (await readdir(path.join(repoRoot, 'src'), { recursive: true }))
      .filter((file) => /\.tsx?$/.test(file))
      .map((file) => path.join('src', file))
    const sources = await Promise.all(
      files.map(async (file) => ({ file, source: await read(file) })),
    )
    const scoped = ['preview-scope', 'DemoFitFrame', 'DemoScaleFrame', 'PreviewSurface']
    const iframed = ['ComponentPreviewFrame']

    const unscoped = sources
      .filter(
        ({ file, source }) =>
          source.includes("from '@/components/site/demos/") &&
          !file.startsWith(path.join('src', 'components', 'site', 'demos')) &&
          !file.startsWith(path.join('src', 'components', 'site', 'templates')),
      )
      .filter(({ source }) => ![...scoped, ...iframed].some((marker) => source.includes(marker)))
      .map(({ file }) => file)
    expect(unscoped).toEqual([])

    const scopedTemplates = sources
      .filter(({ file }) => file.startsWith(path.join('src', 'components', 'site', 'templates')))
      .filter(({ source }) => source.includes('preview-scope'))
      .map(({ file }) => file)
    expect(scopedTemplates).toEqual([])
  })
})

describe('Datasheet hero drawing', () => {
  it('draws the real hero-basic fields, in config order', async () => {
    const [config, sharedFields, linkGroup] = await Promise.all([
      read('payload-components/source/blocks/HeroBasic/config.ts'),
      read('payload-components/source/blocks/shared/heroFields.ts'),
      read('payload-components/source/base/fields/linkGroup.ts'),
    ])
    /* The family base spreads first, then the variant's own fields; links come
       from the linkGroup helper, whose field is named in its own source. */
    const linkName = /name:\s*'([^']+)'/.exec(linkGroup)?.[1]
    const declared = [
      ...[...sharedFields.matchAll(/name:\s*'([^']+)'|linkGroup\(/g)].map(
        (match) => match[1] ?? `${linkName}[]`,
      ),
      ...[...config.matchAll(/^ {6}name:\s*'([^']+)',\n\s*type:\s*'(\w+)'/gm)].map(
        ([, name, type]) => (type === 'array' ? `${name}[]` : name),
      ),
    ]

    expect(heroDatasheet.fields).toEqual(declared)
  })

  it('traces out exactly what the manifest installs', async () => {
    const manifest = JSON.parse(await read('payload-components/manifests/hero-basic.json')) as {
      postInstall: string[]
      recovery: { patchedFiles: string[] }
      version: string
    }

    expect(heroDatasheet.version).toBe(manifest.version)
    expect(heroDatasheet.outputs).toEqual([
      'HeroBasic/',
      'Pages/index.ts',
      'RenderBlocks.tsx',
      'payload-types.ts',
      'importMap.js',
    ])
    /* One output pin per patched host file and per post-install task, plus the
       copied source folder — so a manifest change cannot leave a stale pin. */
    expect(heroDatasheet.outputs).toHaveLength(
      1 + manifest.recovery.patchedFiles.length + manifest.postInstall.length,
    )
  })
})
