import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

import { chromium } from '@playwright/test'
import { describe, expect, it } from 'vitest'

import { parseCoverRenderArgs, waitForDocumentAssets } from '../../tools/blog/render-covers'
import { blogVisualCatalog } from '../../tools/blog/visual-system/catalog'
import { resolveArtifact, validateBlogVisualCatalog } from '../../tools/blog/visual-system/artifacts'
import { renderCoverHtml } from '../../tools/blog/visual-system/cover-template'
import type { Artifact, ResolvedArtifact } from '../../tools/blog/visual-system/types'

const repoRoot = path.resolve(import.meta.dirname, '../..')
const blogRoot = path.join(repoRoot, 'content', 'blog')
const registryPath = path.join(repoRoot, 'payload-components', 'registry.json')

const approvedPalette = new Set([
  '#18181b',
  '#52525b',
  '#d4d4d8',
  '#e4e4e7',
  '#f7f5ef',
  '#ffffff',
  '#059669',
  '#047857',
])

const fontPaths = [
  'src/app/_fonts/Geist-Regular.ttf',
  'src/app/_fonts/Geist-Bold.ttf',
  'src/app/_fonts/GeistMono-Regular.ttf',
  'src/app/_fonts/InstrumentSerif-Italic.ttf',
] as const

const fabricatedPresentationMarkers = [
  {
    category: 'invented contributor identity',
    pattern:
      /\b(?:mock|fictional|invented) contributors?\b|\b(?:contributor|maintainer|author)\s*(?:name)?\s*[:=]\s*(?!Ducksss\b)["']?[A-Z][\p{L}'-]+(?:\s+[A-Z][\p{L}'-]+)+["']?/iu,
  },
  {
    category: 'avatar presentation',
    pattern: /\bavatar(?:url|_url|-url|src|source)?\s*[:=]\s*["'][^"']+["']/iu,
  },
  { category: 'invented issue number', pattern: /\b(?:issue|pull request)\s*#\d+\b/iu },
  {
    category: 'fabricated activity count',
    pattern: /\b\d[\d,]*\+?\s+(?:stars?|likes?|reactions?|forks?|commits?|contributors?)\b/iu,
  },
  {
    category: 'invented testimonial attribution',
    pattern: /\btestimonial\s+(?:by|from)\s+["']?[A-Z]|\b(?:customer|user)\s+testimonial\s*[:=]/iu,
  },
  {
    category: 'fabricated terminal outcome',
    pattern:
      /\b(?:fake|mock|invented|simulated)\s+(?:terminal|command|install)\s+(?:outcome|output|result|success)\b|\b(?:terminal|command|install)\s+(?:outcome|result)\s*[:=]\s*(?:success|passed|complete)\b/iu,
  },
  {
    category: 'fabricated GitHub UI',
    pattern:
      /\bgithub\s+(?:activity|avatar|issue|merge|profile|pull request|reaction|stars?)\s+(?:badge|button|card|panel|timeline|ui)\b|\bmerged by\b/iu,
  },
  {
    category: 'fabricated project behavior',
    pattern:
      /\b(?:fake|mock|invented|simulated)\s+(?:project\s+)?(?:behavior|behaviour|outcome|result)\b|\bproject\s+(?:behavior|behaviour|outcome|result)\s*[:=]/iu,
  },
] as const

function scalar(frontmatter: string, name: string) {
  return frontmatter.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1]?.trim().replace(/^['"]|['"]$/g, '')
}

function figureSources(source: string) {
  return [...source.matchAll(/<BlogFigure\s+([\s\S]*?)\/>/g)].map((match) => {
    const figureSource = match[1].match(/\bsrc="([^"]+)"/)?.[1]
    expect(figureSource).toBeTruthy()
    return String(figureSource)
  })
}

async function getMdxVisualContract() {
  const filenames = (await readdir(blogRoot)).filter((filename) => filename.endsWith('.mdx'))

  return Promise.all(
    filenames.map(async (filename) => {
      const source = await readFile(path.join(blogRoot, filename), 'utf8')
      const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''

      return {
        figures: figureSources(source),
        order: Number(scalar(frontmatter, 'publicationOrder')),
        slug: filename.replace(/\.mdx$/, ''),
      }
    }),
  )
}

function isKnownLocalRoute(route: string) {
  return /^(?:\/blog(?:\/[a-z0-9-]+)?|\/components(?:\?[^#\s]+|\/preview\/[a-z0-9-]+)?|\/docs\/components\/[a-z0-9-]+)$/.test(
    route,
  )
}

function expectResolvedArtifactBinding(artifact: Artifact, resolved: ResolvedArtifact, context: string) {
  expect(resolved.kind, context).toBe(artifact.kind)
  expect(resolved.label, context).toBe(artifact.label)

  switch (artifact.kind) {
    case 'source':
    case 'diff':
      expect(resolved.provenance, context).toContain(artifact.path)
      expect(resolved.evidence, context).toContain(artifact.anchor)
      break
    case 'registry-item':
      expect(resolved.provenance, context).toContain(artifact.name)
      expect(resolved.evidence, context).toContain(artifact.name)
      break
    case 'route':
      expect(resolved.provenance, context).toContain(artifact.route)
      expect(resolved.evidence, context).toContain(artifact.route)
      break
    case 'command':
      expect(resolved.evidence, context).toContain(artifact.command)
      for (const item of artifact.registryItems ?? []) {
        expect(resolved.evidence, `${context}: registry item ${item}`).toContain(item)
      }
      expect(resolved.provenance, context).toContain(
        artifact.registryItems?.length ? 'payload-components/registry.json' : 'tools/blog/visual-system/catalog.ts',
      )
      break
    case 'sequence':
      for (const item of artifact.items) {
        expect(resolved.evidence, `${context}: sequence item ${item}`).toContain(item)
      }
      expect(resolved.provenance, context).toContain('tools/blog/visual-system/catalog.ts')
      break
  }
}

function expectNoFabricatedPresentation(value: string, context: string) {
  for (const marker of fabricatedPresentationMarkers) {
    expect(value, `${context}: ${marker.category}`).not.toMatch(marker.pattern)
  }
}

async function getCoverFontData() {
  return {
    [fontPaths[0]]: (await readFile(path.join(repoRoot, fontPaths[0]))).toString('base64'),
    [fontPaths[1]]: (await readFile(path.join(repoRoot, fontPaths[1]))).toString('base64'),
    [fontPaths[2]]: (await readFile(path.join(repoRoot, fontPaths[2]))).toString('base64'),
    [fontPaths[3]]: (await readFile(path.join(repoRoot, fontPaths[3]))).toString('base64'),
  }
}

async function renderCatalogCover(slug: string) {
  const entry = blogVisualCatalog.find((candidate) => candidate.slug === slug)
  expect(entry, slug).toBeDefined()

  if (!entry) throw new Error(`Missing visual catalog entry for ${slug}.`)

  const artifacts = {
    primary: await resolveArtifact(entry.primary),
    secondary: await resolveArtifact(entry.secondary),
  }

  return {
    artifacts,
    entry,
    html: renderCoverHtml(entry, artifacts, await getCoverFontData()),
  }
}

function coverPartCount(html: string, part: string) {
  return html.match(new RegExp(`data-cover-part="${part}"`, 'g'))?.length ?? 0
}

describe('Community Field Journal visual catalog', () => {
  it('covers every post and figure exactly once with the approved teaching modes', async () => {
    const mdxEntries = await getMdxVisualContract()
    const mdxEntriesBySlug = new Map(mdxEntries.map((entry) => [entry.slug, entry]))
    const slugs = blogVisualCatalog.map((entry) => entry.slug)
    const orders = blogVisualCatalog.map((entry) => entry.order)

    expect(blogVisualCatalog).toHaveLength(32)
    expect(new Set(slugs).size).toBe(32)
    expect(new Set(orders).size).toBe(32)
    expect([...orders].sort((left, right) => left - right)).toEqual(
      Array.from({ length: 32 }, (_, index) => index + 1),
    )
    expect(
      blogVisualCatalog
        .map(({ order, slug }) => ({ order, slug }))
        .sort((left, right) => left.order - right.order),
    ).toEqual(
      mdxEntries
        .map(({ order, slug }) => ({ order, slug }))
        .sort((left, right) => left.order - right.order),
    )

    for (const entry of blogVisualCatalog) {
      expect(entry.thesis.trim(), entry.slug).not.toBe('')
      expect(entry.prompt.trim(), entry.slug).not.toBe('')
      expect(entry.primary.kind, entry.slug).not.toBe(entry.secondary.kind)
      expect(entry.figures.length, entry.slug).toBeGreaterThanOrEqual(1)
      expect(
        entry.figures.map((figure) => figure.path),
        `${entry.slug}: figure paths`,
      ).toEqual(mdxEntriesBySlug.get(entry.slug)?.figures)
    }

    const figures = blogVisualCatalog.flatMap((entry) => entry.figures)
    const catalogFigurePaths = figures.map((figure) => figure.path)
    const mdxFigurePaths = mdxEntries.flatMap((entry) => entry.figures)
    const modeCounts = figures.reduce<Record<string, number>>((counts, figure) => {
      counts[figure.mode] = (counts[figure.mode] ?? 0) + 1
      return counts
    }, {})

    expect(catalogFigurePaths).toHaveLength(35)
    expect([...catalogFigurePaths].sort()).toEqual([...mdxFigurePaths].sort())
    expect(modeCounts).toEqual({ inspect: 7, join: 3, see: 8, trace: 17 })
  })

  it('resolves every artifact from repository-backed evidence without fabricated social proof', async () => {
    await expect(validateBlogVisualCatalog()).resolves.toBeUndefined()

    const registry = JSON.parse(await readFile(registryPath, 'utf8')) as {
      items: Array<{ name: string }>
    }
    const registryItems = new Set(registry.items.map((item) => item.name))

    for (const entry of blogVisualCatalog) {
      for (const artifact of [entry.primary, entry.secondary]) {
        if (artifact.kind === 'source' || artifact.kind === 'diff') {
          expect(artifact.anchor.trim(), `${entry.slug}: ${artifact.path} anchor`).not.toBe('')
          const source = await readFile(path.join(repoRoot, artifact.path), 'utf8')
          expect(source, `${entry.slug}: ${artifact.path}`).toContain(artifact.anchor)
        }

        if (artifact.kind === 'registry-item') {
          expect(registryItems.has(artifact.name), `${entry.slug}: ${artifact.name}`).toBe(true)
        }

        if (artifact.kind === 'command') {
          for (const item of artifact.registryItems ?? []) {
            expect(registryItems.has(item), `${entry.slug}: ${artifact.command} -> ${item}`).toBe(true)
          }
        }

        if (artifact.kind === 'route') {
          expect(isKnownLocalRoute(artifact.route), `${entry.slug}: ${artifact.route}`).toBe(true)
        }

        const resolved = await resolveArtifact(artifact)
        const context = `${entry.slug}: ${artifact.kind} ${artifact.label}`
        expectResolvedArtifactBinding(artifact, resolved, context)
        expectNoFabricatedPresentation(resolved.evidence, `${context} evidence`)
        expectNoFabricatedPresentation(resolved.provenance, `${context} provenance`)
      }
    }
  })

  it('renders the complete field-journal hierarchy exactly once', async () => {
    for (const slug of ['hello', 'anatomy-of-an-install']) {
      const { artifacts, entry, html } = await renderCatalogCover(slug)

      for (const part of [
        'masthead',
        'issue',
        'thesis',
        'primary',
        'secondary',
        'prompt',
        'folio',
        'provenance',
      ]) {
        expect(coverPartCount(html, part), `${slug}: ${part}`).toBe(1)
      }

      expect(html, `${slug}: thesis`).toContain(entry.thesis)
      expect(html, `${slug}: prompt`).toContain(entry.prompt)
      expect(html, `${slug}: primary label`).toContain(artifacts.primary.label)
      expect(html, `${slug}: secondary label`).toContain(artifacts.secondary.label)

      const primaryRegion = html.match(/<section[^>]+data-cover-part="primary"[^>]*>/)?.[0]
      const secondaryRegion = html.match(/<section[^>]+data-cover-part="secondary"[^>]*>/)?.[0]
      expect(primaryRegion, `${slug}: primary artifact kind`).toContain(
        `data-artifact-kind="${entry.primary.kind}"`,
      )
      expect(secondaryRegion, `${slug}: secondary artifact kind`).toContain(
        `data-artifact-kind="${entry.secondary.kind}"`,
      )
      expect(entry.primary.kind, slug).not.toBe(entry.secondary.kind)
    }
  })

  it('embeds all four vendored fonts as self-contained data URLs', async () => {
    const fontData = await getCoverFontData()
    const { html } = await renderCatalogCover('hello')
    const styles = html.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? ''

    expect(styles.match(/@font-face\s*{/g)).toHaveLength(4)

    for (const fontPath of fontPaths) {
      expect(styles, fontPath).toContain(`/* ${fontPath} */`)
      expect(styles, fontPath).toContain(`data:font/ttf;base64,${fontData[fontPath]}`)
    }

    expect(styles).not.toMatch(/@import|https?:\/\/|fonts\.(?:googleapis|gstatic)\.com/i)
  })

  it('uses only the approved palette and safe self-contained markup', async () => {
    for (const slug of ['hello', 'anatomy-of-an-install']) {
      const { html } = await renderCatalogCover(slug)
      const styles = html.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? ''
      const colors = styles.match(/#[\da-f]{6}\b/gi) ?? []

      expect(colors.length, `${slug}: palette usage`).toBeGreaterThan(0)
      for (const color of colors) {
        expect(approvedPalette.has(color.toLowerCase()), `${slug}: ${color}`).toBe(true)
      }

      expect(styles, `${slug}: alternate color syntax`).not.toMatch(/\b(?:rgb|hsl)a?\(/i)
      expect(html, `${slug}: external URL`).not.toMatch(/https?:\/\/|(?:src|href)="\/\//i)
      expect(html, `${slug}: remote font`).not.toMatch(/@import|fonts\.(?:googleapis|gstatic)\.com/i)

      for (const image of html.match(/<img\b[^>]*>/gi) ?? []) {
        expect(image, `${slug}: image alt`).toMatch(/\balt="[^"]+"/i)
      }

      expect(html, `${slug}: fabricated social proof`).not.toMatch(
        /\b(?:\d[\d,]*\+?\s+(?:stars?|likes?|reactions?|forks?|contributors?)|merged by|avatar(?:url|_url|-url)?\s*[:=]|testimonial\s+(?:by|from)|(?:issue|pull request)\s*#\d+)\b/i,
      )
    }
  })

  it('varies the twelve-column composition without weakening evidence hierarchy', async () => {
    const hello = await renderCatalogCover('hello')
    const anatomy = await renderCatalogCover('anatomy-of-an-install')

    expect(hello.html).toContain('data-cover-layout="layout-1"')
    expect(anatomy.html).toContain('data-cover-layout="layout-2"')
    expect(hello.html).not.toBe(anatomy.html)

    for (const { entry, html } of [hello, anatomy]) {
      const styles = html.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? ''
      expect(styles, `${entry.slug}: canvas dimensions`).toMatch(/width:\s*1200px[\s\S]*height:\s*630px/)
      expect(styles, `${entry.slug}: outer margin`).toContain('inset: 48px')
      expect(styles, `${entry.slug}: editorial grid`).toMatch(
        /grid-template-columns:\s*repeat\(12,\s*minmax\(0,\s*1fr\)\)/,
      )

      const primaryStack = Number(
        styles.match(/\.artifact--primary\s*{[^}]*z-index:\s*(\d+)/)?.[1],
      )
      const secondaryStack = Number(
        styles.match(/\.artifact--secondary\s*{[^}]*z-index:\s*(\d+)/)?.[1],
      )
      expect(primaryStack, `${entry.slug}: primary evidence stack`).toBeGreaterThan(
        secondaryStack,
      )

      const overlap = Number(html.match(/data-overlap-percent="(\d+)"/)?.[1])
      expect(overlap, `${entry.slug}: unobscured secondary evidence`).toBe(0)
      expect(overlap, `${entry.slug}: secondary overlap`).toBeLessThanOrEqual(12)
    }
  })

  it('keeps command evidence fully inside its artifact card', async () => {
    const browser = await chromium.launch({ headless: true })

    try {
      const page = await browser.newPage({ viewport: { height: 630, width: 1200 } })

      for (const slug of [
        'build-first-payload-v3-landing-page',
        'shared-fields-across-component-families',
      ]) {
        const { html } = await renderCatalogCover(slug)
        await page.setContent(html)
        await page.evaluate(async () => await document.fonts.ready)

        const bounds = await page
          .locator('[data-artifact-kind="command"] .command-sheet')
          .evaluate((element) => ({
            clientHeight: element.clientHeight,
            clientWidth: element.clientWidth,
            scrollHeight: element.scrollHeight,
            scrollWidth: element.scrollWidth,
          }))

        expect(bounds.scrollHeight, `${slug}: command height`).toBeLessThanOrEqual(
          bounds.clientHeight,
        )
        expect(bounds.scrollWidth, `${slug}: command width`).toBeLessThanOrEqual(
          bounds.clientWidth,
        )
      }
    } finally {
      await browser.close()
    }
  })

  it('keeps corroborating sequences concise enough to scan', () => {
    for (const entry of blogVisualCatalog) {
      for (const artifact of [entry.primary, entry.secondary]) {
        if (artifact.kind === 'sequence') {
          expect(artifact.items.length, `${entry.slug}: ${artifact.label}`).toBeLessThanOrEqual(5)
        }
      }
    }

    const doctor = blogVisualCatalog.find((entry) => entry.slug === 'payload-components-doctor')
    const provenance = blogVisualCatalog.find((entry) => entry.slug === 'open-source-provenance')
    expect(doctor?.secondary).toMatchObject({
      items: [
        'project + scripts',
        'state + peer deps',
        'package deps + files',
        'registry deps + fragments',
      ],
      kind: 'sequence',
    })
    expect(provenance?.secondary).toMatchObject({
      items: ['source rev', 'license', 'changes + notice', 'publish'],
      kind: 'sequence',
    })
  })

  it('keeps the community roadmap source excerpt fully inside its artifact card', async () => {
    const { html } = await renderCatalogCover('community-driven-roadmap')
    const browser = await chromium.launch({ headless: true })

    try {
      const page = await browser.newPage({ viewport: { height: 630, width: 1200 } })
      await page.setContent(html)
      await page.evaluate(async () => await document.fonts.ready)

      const bounds = await page.locator('.artifact--primary .code-sheet').evaluate((element) => ({
        clientHeight: element.clientHeight,
        clientWidth: element.clientWidth,
        scrollHeight: element.scrollHeight,
        scrollWidth: element.scrollWidth,
      }))

      expect(bounds.scrollHeight).toBeLessThanOrEqual(bounds.clientHeight)
      expect(bounds.scrollWidth).toBeLessThanOrEqual(bounds.clientWidth)
    } finally {
      await browser.close()
    }
  })

  it('selects deterministic cover batches and a local capture origin', () => {
    const all = parseCoverRenderArgs([], {})
    expect(all.entries.map((entry) => entry.slug)).toEqual(
      blogVisualCatalog.map((entry) => entry.slug),
    )
    expect(all.baseUrl).toBe('http://127.0.0.1:3100')

    const projectNotes = parseCoverRenderArgs(
      ['--slug', 'anatomy-of-an-install', '--slug', 'hello', '--slug', 'hello'],
      { BLOG_CAPTURE_BASE_URL: 'http://localhost:4100/' },
    )
    expect(projectNotes.entries.map((entry) => entry.slug)).toEqual([
      'hello',
      'anatomy-of-an-install',
    ])
    expect(projectNotes.baseUrl).toBe('http://localhost:4100')

    const foundations = parseCoverRenderArgs(['--series', 'foundations'], {})
    expect(foundations.entries).toHaveLength(6)
    expect(new Set(foundations.entries.map((entry) => entry.series))).toEqual(
      new Set(['foundations']),
    )
  })

  it('rejects ambiguous arguments and non-local capture origins', () => {
    expect(() => parseCoverRenderArgs(['--slug'], {})).toThrow(/requires a value/i)
    expect(() => parseCoverRenderArgs(['--slug', 'not-a-post'], {})).toThrow(
      /unknown blog visual entry/i,
    )
    expect(() => parseCoverRenderArgs(['--series', 'not-a-series'], {})).toThrow(
      /unknown blog visual series/i,
    )
    expect(() => parseCoverRenderArgs(['--wat'], {})).toThrow(/unknown cover-render argument/i)
    expect(() =>
      parseCoverRenderArgs([], { BLOG_CAPTURE_BASE_URL: 'https://example.com' }),
    ).toThrow(/localhost/i)
  })

  it('does not wait for offscreen lazy images before capturing a route', async () => {
    const browser = await chromium.launch({ headless: true })

    try {
      const page = await browser.newPage({ viewport: { height: 600, width: 960 } })
      await page.setContent(`
        <main style="height: 10000px">Route content in the capture viewport.</main>
        <img
          alt="Offscreen lazy cover"
          height="630"
          loading="lazy"
          src="http://127.0.0.1:65534/never-loads.webp"
          width="1200"
        />
      `)

      const imageState = await page.locator('img').evaluate((image) => ({
        complete: (image as HTMLImageElement).complete,
        top: image.getBoundingClientRect().top,
        viewportHeight: window.innerHeight,
      }))
      expect(imageState.complete).toBe(false)
      expect(imageState.top).toBeGreaterThan(imageState.viewportHeight)

      await expect(
        Promise.race([
          waitForDocumentAssets(page),
          new Promise((_, reject) => {
            setTimeout(
              () => reject(new Error('Offscreen lazy image blocked route capture.')),
              500,
            )
          }),
        ]),
      ).resolves.toBeUndefined()
    } finally {
      await browser.close()
    }
  })
})
