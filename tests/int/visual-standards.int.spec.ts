import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const repoRoot = process.cwd()

/* Visual standards guard.
 *
 * The blocks are the product, and the site ships a single design language:
 * light shadcn monochrome + one emerald accent, with a small set of named
 * radius and letter-spacing tokens. Today every block already honours it — this
 * test keeps it that way by reading the component source and failing on drift:
 *
 *   - colours outside the token set: a raw Tailwind palette colour
 *     (bg-blue-500, text-white, border-zinc-700) or a hardcoded literal
 *     (text-[#0a0a0a], bg-[oklch(60%_.1_20)], ring-[rgb(0_0_0)]);
 *   - arbitrary radius / letter-spacing / spacing / font-size values
 *     (rounded-[2rem], tracking-[-0.06em], p-[13px], text-[15px]) — these have
 *     named tokens (rounded-frame, tracking-display, …) defined in globals.css
 *     or belong on the standard scale.
 *
 * Allowed escapes (never flagged): the keywords transparent / current /
 * inherit; and arbitrary values that reference a CSS var or a non-colour
 * keyword rather than a hardcoded value — bg-[var(--x)], rounded-[inherit], and
 * the connect-dots gradient bg-[radial-gradient(var(--connect-dots)…)]. Pure
 * layout geometry is deliberately out of scope: w-[calc(…)], inset-[…],
 * aspect-[…], grid-cols-[…] are per-component geometry, not design tokens.
 *
 * Detection is value-shaped, so the overloaded prefixes never false-positive:
 * text-sm / text-center / text-balance, border-t / border-dashed, divide-y, and
 * bg-gradient-to-r are neither palette names nor literals and pass untouched.
 *
 * Model: tests/int/demo-twins.int.spec.ts (read source, regex-extract class
 * strings, assert an empty violations array). */

const globalsPath = path.join(repoRoot, 'src/app/globals.css')

/* The distributable source is the product and carries the full standard
 * (colour + structure). The *Demo twins are landing-page scaffolding: they
 * mirror the blocks but may add presentational tweaks (a compact text-[11px], a
 * scale-[0.5] thumbnail), so they are held to the colour palette only — the
 * per-component visual snapshots cover the rest of their pixels. */
const scanTargets = [
  { dir: 'payload-components/source/blocks', match: /\.tsx$/, scope: 'all' },
  { dir: 'payload-components/source/components', match: /\.tsx$/, scope: 'all' },
  { dir: 'src/components/site/demos', match: /Demo\.tsx$/, scope: 'color' },
] as const

const codeRabbitTokenGuards = [
  {
    file: 'src/components/site/ComponentPreviewFrame.tsx',
    forbidden: ['bg-[#ff5f57]', 'bg-[#febc2e]', 'bg-[#28c840]'],
    required: ['bg-preview-close', 'bg-preview-minimize', 'bg-preview-zoom'],
  },
  {
    file: 'src/components/site/ComponentGrid.tsx',
    forbidden: ['tracking-[0.12em]', 'tracking-[0.14em]'],
    required: ['tracking-eyebrow'],
  },
  {
    file: 'payload-components/source/blocks/CallToActionSignup/Component.tsx',
    forbidden: ['rounded-xl'],
    required: ['rounded-frame'],
  },
] as const

/* Tailwind's built-in palette names plus white/black. Using any of these in a
 * colour utility is drift away from the semantic token set. None of our tokens
 * collide with these names, so a token can never be mistaken for a palette. */
const palette = [
  'slate', 'gray', 'zinc', 'neutral', 'stone', 'red', 'orange', 'amber',
  'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo',
  'violet', 'purple', 'fuchsia', 'pink', 'rose', 'white', 'black',
]
const paletteValue = new RegExp(`^(?:${palette.join('|')})(?:-\\d{1,3})?$`)

/* Utility prefixes whose value can be a colour. Several (bg/text/border/…) are
 * overloaded with non-colour utilities; that is handled by only flagging
 * palette names + literals, never bare keywords like -center or -dashed. */
const colorPrefix = [
  'bg', 'text', 'border', 'ring', 'ring-offset', 'from', 'via', 'to', 'fill',
  'stroke', 'divide', 'outline', 'decoration', 'placeholder', 'caret', 'accent',
  'shadow',
]
const colorUtility = new RegExp(`^(?:${colorPrefix.join('|')})-(.+)$`)

/* A bracketed arbitrary value that is a length/number (drift) versus a
 * var()/keyword escape (allowed): a leading digit, decimal, negative number, or
 * calc( marks a hardcoded literal; [inherit] and [var(--x)] do not. */
const arbitraryLiteral = /^\[-?(?:\.?\d|calc\()/
/* A hardcoded colour anywhere inside an arbitrary value. var(…) is intentionally
 * absent, so bg-[var(--x)] and the connect-dots gradient pass. */
const colorLiteral = /#|(?:rgba?|hsla?|oklch|oklab|lab|lch|hwb|color)\(/i

const parseTokens = (css: string, namespace: string): Set<string> => {
  const tokens = new Set<string>()
  for (const match of css.matchAll(new RegExp(`--${namespace}-([\\w-]+)\\s*:`, 'g'))) {
    tokens.add(match[1])
  }
  return tokens
}

const collectFiles = async (dir: string, match: RegExp): Promise<string[]> => {
  const absolute = path.join(repoRoot, dir)
  const relatives = await readdir(absolute, { recursive: true })
  return relatives
    .filter((relative) => match.test(path.basename(relative)))
    .map((relative) => path.join(absolute, relative))
}

/* Every whitespace-separated token inside every string literal (className="…",
 * cn('…') args, and template strings). Over-capturing non-class strings is
 * harmless — import paths and labels match none of the utility shapes below. */
const classTokens = (source: string): string[] => {
  const tokens: string[] = []
  for (const match of source.matchAll(/"([^"]*)"|'([^']*)'|`([^`]*)`/g)) {
    const body = (match[1] ?? match[2] ?? match[3] ?? '').replace(/\$\{[^}]*\}/g, ' ')
    for (const token of body.split(/\s+/)) {
      if (token) tokens.push(token)
    }
  }
  return tokens
}

/* Strip any variant prefixes (hover:, sm:, dark:, group-hover:, …), a leading
 * ! (important), then a trailing opacity modifier (/70 or /[0.5]). */
const coreClass = (token: string): string =>
  token
    .replace(/^.*:/, '')
    .replace(/^!/, '')
    .replace(/\/(?:\d+|\[[^\]]*\])$/, '')

const violationFor = (raw: string, scope: 'all' | 'color'): string | null => {
  const token = coreClass(raw)

  const color = colorUtility.exec(token)
  if (color) {
    const value = color[1]
    if (value.startsWith('[') && value.endsWith(']')) {
      if (colorLiteral.test(value)) return 'hardcoded colour literal — use a token'
    } else if (paletteValue.test(value)) {
      return 'raw Tailwind palette colour — use a semantic token'
    }
  }

  // Twins are enforced for colour only; the structural rules below apply to the
  // distributable product.
  if (scope === 'color') return null

  if (/^rounded(?:-[a-z]+)*-\[.+\]$/.test(token) && arbitraryLiteral.test(token.slice(token.indexOf('[')))) {
    return 'arbitrary radius — use rounded-frame/panel/card/inset/lg/full/…'
  }

  if (/^tracking-\[.+\]$/.test(token) && arbitraryLiteral.test(token.slice(token.indexOf('[')))) {
    return 'arbitrary letter-spacing — use tracking-eyebrow/display/title/heading/…'
  }

  // Spacing scale only (padding / margin / gap / space) — not layout geometry
  // like w-/h-/inset-/aspect-/grid-cols-, which stays arbitrary by design.
  if (
    /^(?:p[xytrbles]?|m[xytrbles]?|gap(?:-[xy])?|space-[xy])-\[.+\]$/.test(token) &&
    arbitraryLiteral.test(token.slice(token.indexOf('[')))
  ) {
    return 'arbitrary spacing — use the spacing scale'
  }

  const fontSize = /^text-(\[.+\])$/.exec(token)
  if (fontSize && arbitraryLiteral.test(fontSize[1]) && !colorLiteral.test(fontSize[1])) {
    return 'arbitrary font-size — use text-xs/sm/base/lg/…'
  }

  return null
}

describe('Component visual standards', () => {
  it('defines the named radius and letter-spacing tokens the blocks rely on', async () => {
    const css = await readFile(globalsPath, 'utf8')
    const colors = parseTokens(css, 'color')
    const radii = parseTokens(css, 'radius')
    const tracking = parseTokens(css, 'tracking')

    // Parsing sanity — the monochrome + emerald token set is present.
    expect(colors.has('foreground')).toBe(true)
    expect(colors.has('brand')).toBe(true)
    expect(colors.has('border')).toBe(true)

    // The structural tokens adopted in the refactor must exist, or the
    // rounded-*/tracking-* utilities the blocks use would silently no-op.
    for (const name of ['inset', 'card', 'panel', 'frame']) {
      expect(radii.has(name), `missing --radius-${name}`).toBe(true)
    }
    for (const name of ['display', 'title', 'snug', 'heading', 'micro', 'eyebrow']) {
      expect(tracking.has(name), `missing --tracking-${name}`).toBe(true)
    }
  })

  it('keeps every block, shared component, and twin on the token vocabulary', async () => {
    const groups = await Promise.all(
      scanTargets.map(async ({ dir, match, scope }) => ({
        files: await collectFiles(dir, match),
        scope,
      })),
    )
    const fileCount = groups.reduce((total, group) => total + group.files.length, 0)
    expect(fileCount).toBeGreaterThan(0)

    let inspected = 0
    const violations: string[] = []

    for (const { files, scope } of groups) {
      for (const file of files) {
        const source = await readFile(file, 'utf8')
        const relative = path.relative(repoRoot, file)
        for (const token of classTokens(source)) {
          inspected += 1
          const reason = violationFor(token, scope)
          if (reason) violations.push(`${relative}: "${token}" — ${reason}`)
        }
      }
    }

    // Guard against the scan silently covering nothing.
    expect(inspected).toBeGreaterThan(0)
    expect(violations, `Visual drift:\n${violations.join('\n')}`).toEqual([])
  })

  it('keeps PR #96 review fixes on named visual tokens', async () => {
    const css = await readFile(globalsPath, 'utf8')
    const violations: string[] = []

    for (const token of ['preview-close', 'preview-minimize', 'preview-zoom']) {
      if (!css.includes(`--color-${token}:`)) violations.push(`missing --color-${token}`)
    }

    for (const { file, forbidden, required } of codeRabbitTokenGuards) {
      const source = await readFile(path.join(repoRoot, file), 'utf8')
      for (const token of forbidden) {
        if (source.includes(token)) violations.push(`${file}: still contains ${token}`)
      }
      for (const token of required) {
        if (!source.includes(token)) violations.push(`${file}: missing ${token}`)
      }
    }

    expect(violations, `PR #96 token drift:\n${violations.join('\n')}`).toEqual([])
  })
})
