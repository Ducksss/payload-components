import { existsSync } from 'node:fs'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { demosBySlug } from '../../src/components/site/demos/registry'
import { componentEntries } from '../../src/lib/site'
import {
  getTemplatePage,
  getTemplateShowcase,
  templateDetailHref,
  templatePagePosterSrc,
  templatePosterSrc,
  templatePreviewHref,
  templateShowcases,
  templateStarterBlockSlug,
  templateStarterInstallCommand,
  templatesBySlug,
  uniqueTemplateBlockSlugs,
  validateTemplateShowcases,
} from '../../src/lib/templates/registry'
import {
  TEMPLATE_CONCEPT_DISCLOSURE,
  TEMPLATE_CONCEPT_STATUS_LABEL,
} from '../../src/lib/templates/types'

/* Full-site template showcase contract (website-only "Concept preview" phase).
 *
 * Data-driven over `templateShowcases` — the frozen contract in
 * src/lib/templates/. Guards four things the e2e suites can't see cheaply:
 *
 *   1. the pure-data invariants (validator, slug/theme uniqueness, home page,
 *      recipes referencing real catalog blocks with demo twins);
 *   2. on-disk artifacts the experience depends on (declared assets,
 *      PROVENANCE.md, posters written by the template capture tool) — poster
 *      and provenance checks are EXPECTED to fail until the integration wave
 *      runs capture and lands the asset provenance ledgers;
 *   3. the architecture boundary — template runtime code must stay pure site
 *      code (no Payload target code, manifests, or consumer-only modules);
 *   4. source-level copy rules — concept status/disclosure constants used on
 *      the gallery/detail surfaces, one recipe-derived block action without
 *      waitlist/pricing copy, and theme.css rules scoped beneath their
 *      [data-template-theme='<slug>'] root.
 *
 * Model: tests/int/demo-twins.int.spec.ts / visual-standards.int.spec.ts
 * (read source, extract, assert an empty violations array). */

const repoRoot = process.cwd()

const knownDemoSlugs = new Set(Object.keys(demosBySlug))
const componentEntrySlugs = new Set(componentEntries.map((entry) => entry.slug))

const templateSurfaceRoots = [
  'src/app/[locale]/templates',
  'src/components/site/templates',
  'src/lib/templates',
] as const

const collectFiles = async (dir: string, match: RegExp): Promise<string[]> => {
  const absolute = path.join(repoRoot, dir)
  const relatives = await readdir(absolute, { recursive: true })
  return relatives
    .filter((relative) => match.test(path.basename(relative)))
    .map((relative) => path.join(absolute, relative))
    .sort()
}

const templateSurfaceSources = async (): Promise<{ file: string; source: string }[]> => {
  const groups = await Promise.all(
    templateSurfaceRoots.map((dir) => collectFiles(dir, /\.(?:ts|tsx)$/)),
  )
  return Promise.all(
    groups.flat().map(async (file) => ({
      file: path.relative(repoRoot, file),
      source: await readFile(file, 'utf8'),
    })),
  )
}

/* Rendered copy lives in string literals and JSX text, never in comments — a
 * comment may legitimately say "never a waitlist". Line comments are only
 * stripped when `//` follows start-of-line/whitespace so URLs survive. */
const withoutComments = (source: string): string =>
  source.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|\s)\/\/.*$/gm, '$1')

/* Every static import/export-from/side-effect/dynamic-import specifier. */
const importSpecifiers = (source: string): string[] => {
  const specifiers: string[] = []
  for (const pattern of [
    /(?:import|export)[^'"]*?from\s*['"]([^'"]+)['"]/g,
    /import\s*['"]([^'"]+)['"]/g,
    /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    /require\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  ]) {
    for (const match of source.matchAll(pattern)) specifiers.push(match[1])
  }
  return specifiers
}

/* Consumer-only / Payload-target modules the site-side template runtime must
 * never touch (AGENTS.md "Architecture Boundary" + the templates PRD). */
const forbiddenImports = [
  {
    matches: (s: string) => s.includes('payload-components/source'),
    name: 'payload-components/source',
  },
  {
    matches: (s: string) => s.includes('payload-components/manifests'),
    name: 'payload-components/manifests',
  },
  {
    matches: (s: string) => s === '@/payload-types' || s.startsWith('@/payload-types/'),
    name: '@/payload-types',
  },
  { matches: (s: string) => s === 'payload' || s.startsWith('payload/'), name: 'payload' },
  {
    matches: (s: string) => s === '@/components/Media' || s.startsWith('@/components/Media/'),
    name: '@/components/Media',
  },
  {
    matches: (s: string) => s === '@/components/Link' || s.startsWith('@/components/Link/'),
    name: '@/components/Link',
  },
] as const

/* Returns the selectors of every rule that is NOT nested beneath the
 * [data-template-theme='<slug>'] scope. Conditional at-rule preludes (@media,
 * @supports, …) are transparent — their inner rules must still be scoped —
 * while @keyframes stop selectors (from/to/percentages) are exempt. */
/* Split a selector list on top-level commas only — commas inside functional
 * pseudo-classes like :is(.a, .b) belong to one selector, not two. */
const splitSelectorList = (selector: string): string[] => {
  const parts: string[] = []
  let depth = 0
  let current = ''
  for (const char of selector) {
    if (char === '(') depth += 1
    else if (char === ')') depth = Math.max(0, depth - 1)
    if (char === ',' && depth === 0) {
      parts.push(current)
      current = ''
    } else {
      current += char
    }
  }
  parts.push(current)
  return parts
}

const unscopedThemeSelectors = (css: string, slug: string): string[] => {
  const scopePrefixes = [`[data-template-theme='${slug}']`, `[data-template-theme="${slug}"]`]
  const isScoped = (selector: string) =>
    splitSelectorList(selector).every((part) =>
      scopePrefixes.some((prefix) => part.trim().startsWith(prefix)),
    )

  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '')
  const violations: string[] = []
  const stack: ('at' | 'keyframes' | 'rule' | 'scoped')[] = []
  let buffer = ''

  for (const char of stripped) {
    if (char === '{') {
      const prelude = buffer.trim().replace(/\s+/g, ' ')
      buffer = ''
      if (prelude.startsWith('@')) {
        stack.push(prelude.startsWith('@keyframes') ? 'keyframes' : 'at')
      } else if (stack.includes('keyframes') || stack.includes('scoped')) {
        // Keyframe stops and CSS-nested rules inside a scoped block are fine.
        stack.push('rule')
      } else {
        if (!isScoped(prelude)) violations.push(prelude)
        stack.push(isScoped(prelude) ? 'scoped' : 'rule')
      }
    } else if (char === '}') {
      stack.pop()
      buffer = ''
    } else if (char === ';') {
      buffer = ''
    } else {
      buffer += char
    }
  }

  return violations
}

describe('Template showcase contract', () => {
  it('exposes at least one showcase (parse sanity)', () => {
    expect(templateShowcases.length).toBeGreaterThan(0)
    expect(knownDemoSlugs.size).toBeGreaterThanOrEqual(30)
  })

  it('passes the shared structural validator against the demo-twin registry', () => {
    expect(validateTemplateShowcases(templateShowcases, knownDemoSlugs)).toEqual([])
  })

  it('keeps template slugs and theme ids unique with concept-only status and versioning', () => {
    const slugs = templateShowcases.map((template) => template.slug)
    const themeIds = templateShowcases.map((template) => template.theme.id)
    expect(new Set(slugs).size).toBe(slugs.length)
    expect(new Set(themeIds).size).toBe(themeIds.length)

    for (const template of templateShowcases) {
      expect(template.status, `${template.slug}: status`).toBe('concept')
      expect(template.schemaVersion, `${template.slug}: schemaVersion`).toBe(1)
      expect(
        Number.isInteger(template.revision) && template.revision > 0,
        `${template.slug}: revision must be a positive integer`,
      ).toBe(true)
    }
  })

  for (const template of templateShowcases) {
    describe(`template "${template.slug}"`, () => {
      it('has exactly one home page, unique page paths, and unique section ids', () => {
        expect(
          template.pages.filter((page) => page.path === '').length,
          "exactly one home page (path '')",
        ).toBe(1)

        const paths = template.pages.map((page) => page.path)
        expect(new Set(paths).size, `duplicate page paths in ${paths.join(', ')}`).toBe(
          paths.length,
        )

        for (const page of template.pages) {
          const ids = page.sections.map((section) => section.id)
          expect(
            new Set(ids).size,
            `page "${page.path || '(home)'}": duplicate section ids in ${ids.join(', ')}`,
          ).toBe(ids.length)
        }
      })

      it('resolves every navigation target and keeps every recipe non-empty', () => {
        const paths = new Set(template.pages.map((page) => page.path))
        for (const item of template.navigation) {
          expect(
            paths.has(item.path),
            `navigation "${item.label}" targets undeclared path "${item.path}"`,
          ).toBe(true)
        }
        for (const page of template.pages) {
          expect(
            page.sections.length,
            `page "${page.path || '(home)'}" has an empty recipe`,
          ).toBeGreaterThan(0)
        }
      })

      it('composes only blocks that exist in the catalog AND the demo-twin registry', () => {
        const missing = uniqueTemplateBlockSlugs(template).flatMap((slug) => [
          ...(componentEntrySlugs.has(slug)
            ? []
            : [`${slug} — not in componentEntries (src/lib/component-catalog.ts)`]),
          ...(knownDemoSlugs.has(slug)
            ? []
            : [`${slug} — no demo twin (src/components/site/demos/registry.ts)`]),
        ])
        expect(missing, `Unresolvable recipe blocks:\n${missing.join('\n')}`).toEqual([])
      })

      it('derives its starter action from the first real block in the recipe', () => {
        const expectedSlug = template.pages[0]?.sections[0]?.componentSlug
        const entry = componentEntries.find(({ slug }) => slug === expectedSlug)

        expect(templateStarterBlockSlug(template)).toBe(expectedSlug)
        expect(templateStarterInstallCommand(template)).toBe(entry?.command)
      })

      it('ships every declared asset under public/templates/<slug>/', () => {
        const missing = template.assets
          .map((asset) => asset.path)
          .filter((assetPath) => !existsSync(path.join(repoRoot, `public${assetPath}`)))
        expect(
          missing,
          `Declared assets missing from public/ (each TemplateAsset.path must exist on disk):\n${missing.join('\n')}`,
        ).toEqual([])
      })

      it('carries an asset provenance ledger (public/templates/<slug>/PROVENANCE.md)', () => {
        const ledger = path.join(repoRoot, 'public', 'templates', template.slug, 'PROVENANCE.md')
        expect(
          existsSync(ledger),
          `Missing ${path.relative(repoRoot, ledger)} — the art-direction/integration wave must land the provenance ledger alongside the template's assets`,
        ).toBe(true)
      })

      it('has a generated poster for the gallery card and for every page', () => {
        const expected = [
          templatePosterSrc(template.slug),
          ...template.pages.map((page) => templatePagePosterSrc(template.slug, page.path)),
        ]
        const missing = expected.filter((src) => !existsSync(path.join(repoRoot, `public${src}`)))
        expect(
          missing,
          `Missing template posters — generate them in the integration wave with the template capture tool (tools/templates/capture.ts) at the current revision (${template.revision}):\n${missing.join('\n')}`,
        ).toEqual([])
      })
    })
  }

  it('keeps template runtime code inside the site boundary', async () => {
    const sources = await templateSurfaceSources()
    expect(sources.length).toBeGreaterThan(0)

    const violations: string[] = []
    for (const { file, source } of sources) {
      for (const specifier of importSpecifiers(source)) {
        for (const forbidden of forbiddenImports) {
          if (forbidden.matches(specifier)) {
            violations.push(
              `${file}: imports "${specifier}" (${forbidden.name} is consumer/target-side)`,
            )
          }
        }
      }
    }
    expect(violations, `Boundary violations:\n${violations.join('\n')}`).toEqual([])
  })

  it("scopes every theme.css rule beneath its [data-template-theme='<slug>'] root", async () => {
    const templatesDir = path.join(repoRoot, 'src', 'components', 'site', 'templates')
    const themeFiles = (await readdir(templatesDir, { recursive: true }))
      .filter((relative) => path.basename(relative) === 'theme.css')
      .sort()

    // Every showcase must own a theme file, and every theme file must belong
    // to a known showcase (its directory name is the scope slug).
    const themeSlugs = themeFiles.map((relative) => path.dirname(relative))
    expect(themeSlugs).toEqual(templateShowcases.map((template) => template.slug).sort())

    const violations: string[] = []
    for (const relative of themeFiles) {
      const slug = path.dirname(relative)
      const css = await readFile(path.join(templatesDir, relative), 'utf8')
      for (const selector of unscopedThemeSelectors(css, slug)) {
        violations.push(
          `src/components/site/templates/${relative}: "${selector}" is not scoped beneath [data-template-theme='${slug}'] (no bare :root/.dark/html/body rules)`,
        )
      }
    }
    expect(violations, `Unscoped theme rules:\n${violations.join('\n')}`).toEqual([])
  })

  it('renders localized concept status and disclosure aligned with the shared constants', async () => {
    const messages = JSON.parse(
      await readFile(path.join(repoRoot, 'messages/en.json'), 'utf8'),
    ) as {
      Templates: { disclosure: string; status: string }
    }

    expect(messages.Templates.status).toBe(TEMPLATE_CONCEPT_STATUS_LABEL)
    expect(messages.Templates.disclosure).toBe(TEMPLATE_CONCEPT_DISCLOSURE)

    for (const file of [
      'src/app/[locale]/templates/page.tsx',
      'src/app/[locale]/templates/[slug]/page.tsx',
    ]) {
      const source = await readFile(path.join(repoRoot, file), 'utf8')
      expect(source, `${file} must render the localized concept status`).toContain("t('status')")
      expect(source, `${file} must render the localized concept disclosure`).toContain(
        "t('disclosure')",
      )
    }
  })

  it('keeps waitlist, coming-soon, and download claims off template surfaces', async () => {
    const forbiddenCopy = [
      { pattern: /\bwaitlist\b/i, reason: 'waitlist copy (community-first — no funnels)' },
      {
        pattern: /coming[\s-]soon\b/i,
        reason: '"coming soon" copy (state the concept status instead)',
      },
      {
        pattern: /\bdownloads?\b/i,
        reason: 'download copy (concepts are browsable, not downloadable)',
      },
    ] as const

    const violations: string[] = []
    for (const { file, source } of await templateSurfaceSources()) {
      const rendered = withoutComments(source)
      for (const { pattern, reason } of forbiddenCopy) {
        const match = rendered.match(pattern)
        if (match) violations.push(`${file}: "${match[0]}" — ${reason}`)
      }
    }
    expect(violations, `Forbidden template-surface copy:\n${violations.join('\n')}`).toEqual([])
  })

  it('derives the full route surface from the registry data', () => {
    expect(Object.keys(templatesBySlug).sort()).toEqual(
      templateShowcases.map((template) => template.slug).sort(),
    )

    for (const template of templateShowcases) {
      expect(getTemplateShowcase(template.slug)).toBe(template)
      expect(templateDetailHref(template.slug)).toBe(`/templates/${template.slug}`)
      expect(templatePreviewHref(template.slug)).toBe(`/templates/${template.slug}/preview`)

      for (const page of template.pages) {
        expect(getTemplatePage(template, page.path)).toBe(page)
        expect(templatePreviewHref(template.slug, page.path)).toMatch(
          new RegExp(`^/templates/${template.slug}/preview(?:/[a-z0-9-]+)?$`),
        )
      }
    }

    expect(getTemplateShowcase('not-a-template')).toBeUndefined()
  })

  it('registers a preview shell for every showcase', async () => {
    const source = await readFile(
      path.join(repoRoot, 'src', 'components', 'site', 'templates', 'shells.ts'),
      'utf8',
    )
    for (const template of templateShowcases) {
      expect(source, `shells.ts must map '${template.slug}' to its shell component`).toMatch(
        new RegExp(`'${template.slug}':`),
      )
    }
  })
})
