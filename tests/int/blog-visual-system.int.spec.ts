import {
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { chromium } from '@playwright/test'
import sharp from 'sharp'
import { describe, expect, it } from 'vitest'

import { captures, renderCaptureHtml } from '../../tools/blog/capture-figures'
import { parseCoverRenderArgs, waitForDocumentAssets } from '../../tools/blog/render-covers'
import { blogVisualCatalog } from '../../tools/blog/visual-system/catalog'
import { resolveArtifact, validateBlogVisualCatalog } from '../../tools/blog/visual-system/artifacts'
import { renderCoverHtml } from '../../tools/blog/visual-system/cover-template'
import type { Artifact, ResolvedArtifact } from '../../tools/blog/visual-system/types'

const repoRoot = path.resolve(import.meta.dirname, '../..')
const blogRoot = path.join(repoRoot, 'content', 'blog')
const registryPath = path.join(repoRoot, 'payload-components', 'registry.json')
const captureToolPath = path.join(repoRoot, 'tools', 'blog', 'capture-figures.ts')

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

const makeDocsCodeFixtureLines = () =>
  Array.from({ length: 14 }, (_, index) => {
    const suffix = index === 7 ? ` ${'long-source-token-'.repeat(40)}` : ''
    const text = `line ${index + 1}${suffix}`
    return {
      html: `<span style="color:#ffffff">${text}</span>`,
      sourceLine: index + 1,
      text,
    }
  })

describe('Field Journal real UI capture contract', () => {
  it('publishes an import-safe capture catalog and HTML renderer', async () => {
    const source = await readFile(captureToolPath, 'utf8')

    expect(source).toContain('export const captures')
    expect(source).toMatch(/export (?:const|function) renderCaptureHtml/)
    expect(source).toMatch(/if \(isMain\(\)\)/)
  })

  it('pins the exact eight committed outputs and truthful evidence matrix', () => {
    expect(
      captures.map((capture) => ({
        layout: Reflect.get(capture, 'layout'),
        mode: Reflect.get(capture, 'mode'),
        outputPath: Reflect.get(capture, 'outputPath'),
        panels: Reflect.get(capture, 'panels')?.map(
          (panel: Record<string, unknown>) => ({
            anchor: panel.anchor,
            fixture: panel.fixtureNotice,
            kind: panel.kind,
            label: panel.label,
            registryItem: panel.registryItem,
            route: panel.route,
            sourcePath: panel.sourcePath,
          }),
        ),
        slug: Reflect.get(capture, 'slug'),
      })),
    ).toEqual([
      {
        layout: 'quad',
        mode: 'see',
        outputPath:
          'public/blog/build-first-payload-v3-landing-page/figure-01-page-composition.webp',
        panels: [
          {
            anchor: undefined,
            fixture: 'REPOSITORY DEMO FIXTURE · STRUCTURE ONLY',
            kind: 'preview',
            label: 'Hero Basic · structure',
            registryItem: 'hero-basic',
            route: '/components/preview/hero-basic',
            sourcePath: undefined,
          },
          {
            anchor: undefined,
            fixture: 'REPOSITORY DEMO FIXTURE · STRUCTURE ONLY',
            kind: 'preview',
            label: 'Feature Bento · structure',
            registryItem: 'feature-bento',
            route: '/components/preview/feature-bento',
            sourcePath: undefined,
          },
          {
            anchor: "name: 'testimonials'",
            fixture: undefined,
            kind: 'docs-code',
            label: 'Testimonials Grid · config contract',
            registryItem: 'testimonials-grid',
            route: '/docs/components/testimonials-grid',
            sourcePath: undefined,
          },
          {
            anchor: undefined,
            fixture: 'REPOSITORY DEMO FIXTURE · STRUCTURE ONLY',
            kind: 'preview',
            label: 'Call To Action Centered · structure',
            registryItem: 'call-to-action-centered',
            route: '/components/preview/call-to-action-centered',
            sourcePath: undefined,
          },
        ],
        slug: 'build-first-payload-v3-landing-page',
      },
      {
        layout: 'quad',
        mode: 'see',
        outputPath:
          'public/blog/choosing-payload-hero/figure-01-hero-preview.webp',
        panels: [
          {
            anchor: undefined,
            fixture: 'REPOSITORY DEMO FIXTURE · STRUCTURE ONLY',
            kind: 'preview',
            label: 'Hero Basic · desktop structure',
            registryItem: 'hero-basic',
            route: '/components/preview/hero-basic',
            sourcePath: undefined,
          },
          {
            anchor: undefined,
            fixture: 'REPOSITORY DEMO FIXTURE · STRUCTURE ONLY',
            kind: 'preview',
            label: 'Hero Basic · mobile structure',
            registryItem: 'hero-basic',
            route: '/components/preview/hero-basic',
            sourcePath: undefined,
          },
          {
            anchor: undefined,
            fixture: 'REPOSITORY DEMO FIXTURE · STRUCTURE ONLY',
            kind: 'catalog-card',
            label: 'Catalog · shipped hero-basic item',
            registryItem: 'hero-basic',
            route: '/components?q=hero-basic',
            sourcePath: undefined,
          },
          {
            anchor: 'export const HeroBasic',
            fixture: undefined,
            kind: 'docs-code',
            label: 'Documentation · Payload config',
            registryItem: 'hero-basic',
            route: '/docs/components/hero-basic',
            sourcePath: undefined,
          },
        ],
        slug: 'choosing-payload-hero',
      },
      {
        layout: 'quad',
        mode: 'see',
        outputPath:
          'public/blog/editor-friendly-feature-sections/figure-01-feature-comparison.webp',
        panels: [
          ['feature-bento', 'Feature Bento · uneven emphasis'],
          ['feature-split', 'Feature Split · paired reading'],
          ['feature-steps', 'Feature Steps · ordered sequence'],
          ['feature-grid-basic', 'Feature Grid Basic · peer cards'],
        ].map(([registryItem, label]) => ({
          anchor: undefined,
          fixture: 'REPOSITORY DEMO FIXTURE · STRUCTURE ONLY',
          kind: 'preview',
          label,
          registryItem,
          route: `/components/preview/${registryItem}`,
          sourcePath: undefined,
        })),
        slug: 'editor-friendly-feature-sections',
      },
      {
        layout: 'quad',
        mode: 'see',
        outputPath:
          'public/blog/modeling-pricing-pages/figure-01-pricing-montage.webp',
        panels: [
          ['pricing-cards', 'Pricing Cards · two-to-four plan contract', 'minRows: 2'],
          [
            'pricing-cards-muted',
            'Pricing Cards Muted · two-to-four plan contract',
            'minRows: 2',
          ],
          ['pricing-split', 'Pricing Split · exact two-plan contract', 'maxRows: 2'],
          ['pricing-enterprise', 'Pricing Enterprise · logo field contract', "name: 'logos'"],
        ].map(([registryItem, label, anchor]) => ({
          anchor,
          fixture: undefined,
          kind: 'docs-code',
          label,
          registryItem,
          route: `/docs/components/${registryItem}`,
          sourcePath: undefined,
        })),
        slug: 'modeling-pricing-pages',
      },
      {
        layout: 'quad',
        mode: 'see',
        outputPath:
          'public/blog/social-proof-sections/figure-01-social-proof-montage.webp',
        panels: [
          ['logo-cloud-grid', 'Logo Cloud Grid · editable logo records', '...logoCloudFields'],
          [
            'testimonials-grid',
            'Testimonials Grid · attributed quote array',
            "name: 'testimonials'",
          ],
          ['testimonials-rating', 'Testimonials Rating · bounded rating field', "name: 'rating'"],
          [
            'testimonials-quote',
            'Testimonials Quote · featured quote contract',
            '...testimonialItemFields',
          ],
        ].map(([registryItem, label, anchor]) => ({
          anchor,
          fixture: undefined,
          kind: 'docs-code',
          label,
          registryItem,
          route: `/docs/components/${registryItem}`,
          sourcePath: undefined,
        })),
        slug: 'social-proof-sections',
      },
      {
        layout: 'quad',
        mode: 'see',
        outputPath:
          'public/blog/build-saas-homepage/figure-02-component-montage.webp',
        panels: [
          ['hero-basic', 'Promise · Hero Basic content model'],
          ['logo-cloud-grid', 'Proof slot · Logo Cloud Grid content model'],
          ['feature-bento', 'Explanation · Feature Bento content model'],
          ['pricing-cards', 'Commitment · Pricing Cards content model'],
        ].map(([registryItem, label]) => ({
          anchor: undefined,
          fixture: undefined,
          kind: 'docs-section',
          label,
          registryItem,
          route: `/docs/components/${registryItem}`,
          sourcePath: undefined,
        })),
        slug: 'build-saas-homepage',
      },
      {
        layout: 'duo',
        mode: 'see',
        outputPath:
          'public/blog/build-payload-blog-frontend/figure-02-post-component-montage.webp',
        panels: [
          {
            anchor: undefined,
            fixture: undefined,
            kind: 'route-viewport',
            label: 'Blog index · /blog',
            registryItem: undefined,
            route: '/blog',
            sourcePath: undefined,
          },
          {
            anchor: undefined,
            fixture: undefined,
            kind: 'route-viewport',
            label: 'Article · Payload block primer',
            registryItem: undefined,
            route: '/blog/what-is-a-payload-cms-block',
            sourcePath: undefined,
          },
        ],
        slug: 'build-payload-blog-frontend',
      },
      {
        layout: 'triptych',
        mode: 'see',
        outputPath: 'public/blog/demo-twins/figure-02-source-preview.webp',
        panels: [
          {
            anchor: undefined,
            fixture: 'REPOSITORY DEMO FIXTURE · STRUCTURE ONLY',
            kind: 'preview',
            label: 'Hero Basic · site-only demo twin',
            registryItem: 'hero-basic',
            route: '/components/preview/hero-basic',
            sourcePath: undefined,
          },
          {
            anchor: 'overflow-hidden',
            fixture: undefined,
            kind: 'docs-code',
            label: 'Documentation · shipped Component.tsx',
            registryItem: 'hero-basic',
            route: '/docs/components/hero-basic',
            sourcePath: undefined,
          },
          {
            anchor: 'const missing = literals.flatMap',
            fixture: undefined,
            kind: 'source',
            label: 'Integration test · class-token mirror',
            registryItem: undefined,
            route: undefined,
            sourcePath: 'tests/int/demo-twins.int.spec.ts',
          },
        ],
        slug: 'demo-twins',
      },
    ])
  })

  it('binds every route and source panel to local repository evidence', async () => {
    const registry = JSON.parse(await readFile(registryPath, 'utf8')) as {
      items: { name: string }[]
    }
    const registryItems = new Set(registry.items.map((item) => item.name))

    for (const capture of captures) {
      const panels = Reflect.get(capture, 'panels') as unknown as readonly Record<
        string,
        unknown
      >[]

      for (const panel of panels) {
        const context = `${Reflect.get(capture, 'slug')}: ${String(panel.label)}`
        if (typeof panel.route === 'string') {
          expect(panel.route, context).toMatch(/^\/(?:blog|components|docs\/components)(?:[/?]|$)/)
          expect(panel.route, context).not.toMatch(/^(?:https?:)?\/\//)
        }
        if (typeof panel.registryItem === 'string') {
          expect(registryItems.has(panel.registryItem), context).toBe(true)
        }
        if (typeof panel.sourcePath === 'string') {
          const source = await readFile(path.join(repoRoot, panel.sourcePath), 'utf8')
          expect(source, context).toContain(panel.anchor)
        }
      }
    }

    for (const slug of [
      'modeling-pricing-pages',
      'social-proof-sections',
      'build-saas-homepage',
    ]) {
      const capture = captures.find((candidate) => Reflect.get(candidate, 'slug') === slug)
      expect(capture, slug).toBeDefined()
      if (!capture) continue
      expect(
        Reflect.get(capture, 'panels').some(
          (panel: Record<string, unknown>) =>
            panel.kind === 'preview' || String(panel.route).includes('/preview/'),
        ),
        slug,
      ).toBe(false)
    }
  })

  it('marks only panels that contain repository demo pixels as structure-only fixtures', () => {
    const fixtureNotice = 'REPOSITORY DEMO FIXTURE · STRUCTURE ONLY'
    const panels = captures.flatMap(
      (capture) =>
        Reflect.get(capture, 'panels') as unknown as readonly Record<
          string,
          unknown
        >[],
    )
    const fixturePanels = panels.filter((panel) => panel.fixtureNotice)

    expect(fixturePanels).toHaveLength(11)
    expect(new Set(fixturePanels.map((panel) => panel.fixtureNotice))).toEqual(
      new Set([fixtureNotice]),
    )
    expect(
      fixturePanels.every(
        (panel) => panel.kind === 'preview' || panel.kind === 'catalog-card',
      ),
    ).toBe(true)
    expect(
      panels
        .filter((panel) => panel.kind === 'preview' || panel.kind === 'catalog-card')
        .every((panel) => panel.fixtureNotice === fixtureNotice),
    ).toBe(true)
  })

  it('renders a 1600 by 900 SEE frame with labels, folio, provenance, and escaped copy', () => {
    const capture = {
      ...captures[0],
      title: '<script>not allowed</script>',
      panels: [
        {
          ...Reflect.get(captures[0], 'panels')[0],
          label: 'Hero & <proof>',
        },
      ],
    }
    const html = Reflect.apply(renderCaptureHtml, undefined, [
      capture,
      [
        {
          dataUrl: 'data:image/png;base64,iVBORw0KGgo=',
          height: 600,
          width: 1000,
        },
      ],
    ]) as string

    expect(html).toContain('data-mode="see"')
    expect(html).toContain('data-canvas-width="1600"')
    expect(html).toContain('data-canvas-height="900"')
    expect(html).toMatch(/\.masthead\s*\{[^}]*height:\s*96px/s)
    expect(html).toContain('data-journal-part="folio"')
    expect(html).toContain('data-journal-part="provenance"')
    expect(html).toContain('data-callout="01"')
    expect(html).toContain('REPOSITORY DEMO FIXTURE · STRUCTURE ONLY')
    expect(html).toContain('Hero &amp; &lt;proof&gt;')
    expect(html).toContain('&lt;script&gt;not allowed&lt;/script&gt;')
    expect(html).not.toContain('<script>not allowed</script>')
    expect(html).not.toMatch(/<iframe\b|https?:\/\/|browser-chrome/i)

    const notice = html.indexOf('<aside data-fixture-notice')
    const image = html.indexOf('<img')
    const windowStart = html.lastIndexOf('<div class="artifact-window"', image)
    const windowEnd = html.indexOf('</div>', image)
    expect(notice).toBeGreaterThan(windowEnd)
    expect(windowStart).toBeLessThan(image)
  })

  it('allows only the configured loopback origin plus non-network document URLs', async () => {
    const captureModule = await import('../../tools/blog/capture-figures')
    const isAllowedCaptureRequest = Reflect.get(
      captureModule,
      'isAllowedCaptureRequest',
    )

    expect(isAllowedCaptureRequest).toBeTypeOf('function')
    if (typeof isAllowedCaptureRequest !== 'function') return

    const base = 'http://127.0.0.1:3100'
    for (const allowed of [
      'http://127.0.0.1:3100/blog',
      'data:image/png;base64,aA==',
      'blob:http://127.0.0.1:3100/abc',
      'about:blank',
    ]) {
      expect(isAllowedCaptureRequest(allowed, base), allowed).toBe(true)
    }
    for (const blocked of [
      'http://localhost:3100/blog',
      'http://192.168.1.10:3100/blog',
      'https://example.com/track',
      'https://vitals.vercel-insights.com/v1/vitals',
    ]) {
      expect(isAllowedCaptureRequest(blocked, base), blocked).toBe(false)
    }
  })

  it('waits for a unique client-rendered capture target before counting it', async () => {
    const captureModule = await import('../../tools/blog/capture-figures')
    const waitForExactCaptureTarget = Reflect.get(
      captureModule,
      'waitForExactCaptureTarget',
    )

    expect(waitForExactCaptureTarget).toBeTypeOf('function')
    if (typeof waitForExactCaptureTarget !== 'function') return

    const browser = await chromium.launch({ headless: true })
    try {
      const page = await browser.newPage()
      await page.setContent(`
        <main id="catalog"></main>
        <script>
          window.setTimeout(() => {
            const card = document.createElement('article')
            card.id = 'hero-basic'
            card.textContent = 'Hero Basic'
            document.querySelector('#catalog').append(card)
          }, 20)
        </script>
      `)

      const target = await waitForExactCaptureTarget(
        page,
        '#hero-basic',
        'client-rendered catalog card',
      )
      expect(await target.textContent()).toBe('Hero Basic')
    } finally {
      await browser.close()
    }
  })

  it('selects the one visible Shiki block when force-mounted files share an anchor', async () => {
    const captureModule = await import('../../tools/blog/capture-figures')
    const findUniqueVisibleCodeBlock = Reflect.get(
      captureModule,
      'findUniqueVisibleCodeBlock',
    )

    expect(findUniqueVisibleCodeBlock).toBeTypeOf('function')
    if (typeof findUniqueVisibleCodeBlock !== 'function') return

    const browser = await chromium.launch({ headless: true })
    try {
      const page = await browser.newPage()
      await page.setContent(`
        <section id="code-panel">
          <pre hidden><code>export const HeroBasic = hidden</code></pre>
          <pre><code>export const HeroBasic = visible</code></pre>
        </section>
      `)
      const block = await findUniqueVisibleCodeBlock(
        page.locator('#code-panel'),
        'export const HeroBasic',
        'Hero config',
      )
      expect(await block.textContent()).toContain('visible')
    } finally {
      await browser.close()
    }
  })

  it('clips code evidence inside the real code block instead of capturing page filler', async () => {
    const captureModule = await import('../../tools/blog/capture-figures')
    const clipCaptureAroundTarget = Reflect.get(
      captureModule,
      'clipCaptureAroundTarget',
    )

    expect(clipCaptureAroundTarget).toBeTypeOf('function')
    if (typeof clipCaptureAroundTarget !== 'function') return

    const browser = await chromium.launch({ headless: true })
    try {
      const page = await browser.newPage({ viewport: { height: 400, width: 600 } })
      await page.setContent(`
        <main style="background:#e4e4e7; min-height:1400px; padding-top:800px">
          <div id="code" style="background:white; height:500px; margin:0 40px">
            <div id="first-line" style="background:#18181b; height:80px"></div>
            <code id="anchor" style="background:#18181b; color:white; display:block; height:100px; padding:40px">minRows: 2</code>
            <div id="last-line" style="background:#18181b; height:80px"></div>
          </div>
          <h2 style="color:#059669">Installation outside the code pane</h2>
        </main>
      `)
      const png = await clipCaptureAroundTarget(
        page,
        page.locator('#anchor'),
        {
          boundary: page.locator('#code'),
          contentEnd: page.locator('#last-line'),
          contentStart: page.locator('#first-line'),
          height: 240,
          horizontalPadding: 20,
          verticalPadding: 50,
        },
      )
      const metadata = await sharp(png).metadata()
      expect(metadata.height).toBe(240)

      const raw = await sharp(png).removeAlpha().raw().toBuffer({
        resolveWithObject: true,
      })
      const bottomCenter =
        ((raw.info.height - 2) * raw.info.width + Math.floor(raw.info.width / 2)) *
        raw.info.channels
      expect([...raw.data.subarray(bottomCenter, bottomCenter + 3)]).toEqual([
        24, 24, 27,
      ])
    } finally {
      await browser.close()
    }
  })

  it('selects a contiguous docs-code line window with explicit long-line treatment', async () => {
    const captureModule = await import('../../tools/blog/capture-figures')
    const renderDocsCodeExcerptHtml = Reflect.get(
      captureModule,
      'renderDocsCodeExcerptHtml',
    )
    const selectDocsCodeLineWindow = Reflect.get(
      captureModule,
      'selectDocsCodeLineWindow',
    )

    expect(renderDocsCodeExcerptHtml).toBeTypeOf('function')
    expect(selectDocsCodeLineWindow).toBeTypeOf('function')
    if (
      typeof renderDocsCodeExcerptHtml !== 'function' ||
      typeof selectDocsCodeLineWindow !== 'function'
    ) {
      return
    }

    const codeLines = makeDocsCodeFixtureLines()
    const selected = selectDocsCodeLineWindow(codeLines, 7)
    expect(selected).toHaveLength(10)
    expect(selected[0].sourceLine).toBe(4)
    expect(selected.at(-1)?.sourceLine).toBe(13)
    expect(
      selectDocsCodeLineWindow(codeLines, 0).map(
        (line: { sourceLine: number }) => line.sourceLine,
      ),
    ).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    expect(
      selectDocsCodeLineWindow(codeLines, 13).map(
        (line: { sourceLine: number }) => line.sourceLine,
      ),
    ).toEqual([5, 6, 7, 8, 9, 10, 11, 12, 13, 14])

    const html = renderDocsCodeExcerptHtml(codeLines, 7, 'dGVzdA==')
    expect(html.match(/data-code-row/g)).toHaveLength(10)
    expect(html).toContain('data-source-line="4"')
    expect(html).toContain('data-source-line="13"')
    expect(html).toMatch(/height:\s*30px/)
    expect(html).toMatch(/text-overflow:\s*ellipsis/)
    expect(html).toMatch(/white-space:\s*pre/)
  })

  it('renders docs-code evidence as complete whole rows on an edge-safe dark canvas', async () => {
    const captureModule = await import('../../tools/blog/capture-figures')
    const renderDocsCodeExcerptHtml = Reflect.get(
      captureModule,
      'renderDocsCodeExcerptHtml',
    )
    const selectDocsCodeLineWindow = Reflect.get(
      captureModule,
      'selectDocsCodeLineWindow',
    )
    const validateDocsCodeCanvas = Reflect.get(
      captureModule,
      'validateDocsCodeCanvas',
    )

    expect(renderDocsCodeExcerptHtml).toBeTypeOf('function')
    expect(selectDocsCodeLineWindow).toBeTypeOf('function')
    expect(validateDocsCodeCanvas).toBeTypeOf('function')
    if (
      typeof renderDocsCodeExcerptHtml !== 'function' ||
      typeof selectDocsCodeLineWindow !== 'function' ||
      typeof validateDocsCodeCanvas !== 'function'
    ) {
      return
    }

    const codeLines = makeDocsCodeFixtureLines()
    const selected = selectDocsCodeLineWindow(codeLines, 7)
    expect(selected).toHaveLength(10)
    expect(selected[0].sourceLine).toBe(4)
    expect(selected.at(-1)?.sourceLine).toBe(13)

    const html = renderDocsCodeExcerptHtml(codeLines, 7, 'dGVzdA==')
    const browser = await chromium.launch({ headless: true })
    try {
      const page = await browser.newPage({
        viewport: { height: 360, width: 1080 },
      })
      await page.setContent(html)

      const geometry = await page.locator('[data-code-canvas]').evaluate((canvas) => {
        const canvasRect = canvas.getBoundingClientRect()
        const rows = [
          ...canvas.querySelectorAll<HTMLElement>('[data-code-row]'),
        ]
        return {
          bottomInset:
            canvasRect.bottom - (rows.at(-1)?.getBoundingClientRect().bottom ?? 0),
          canvas: {
            height: canvasRect.height,
            width: canvasRect.width,
          },
          firstSourceLine: rows[0]?.dataset.sourceLine,
          lastSourceLine: rows.at(-1)?.dataset.sourceLine,
          rowHeights: rows.map((row) => row.getBoundingClientRect().height),
          topInset: (rows[0]?.getBoundingClientRect().top ?? 0) - canvasRect.top,
        }
      })
      expect(geometry).toEqual({
        bottomInset: 30,
        canvas: { height: 360, width: 1080 },
        firstSourceLine: '4',
        lastSourceLine: '13',
        rowHeights: Array(10).fill(30),
        topInset: 30,
      })

      const longLine = page.locator('[data-source-line="8"] [data-code-source]')
      expect(
        await longLine.evaluate((line) => {
          const style = getComputedStyle(line)
          return {
            clientWidth: line.clientWidth,
            overflow: style.overflow,
            scrollWidth: line.scrollWidth,
            textOverflow: style.textOverflow,
            whiteSpace: style.whiteSpace,
          }
        }),
      ).toMatchObject({
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'pre',
      })
      expect(
        await longLine.evaluate((line) => line.scrollWidth > line.clientWidth),
      ).toBe(true)

      const png = await page.screenshot({ animations: 'disabled', type: 'png' })
      await expect(validateDocsCodeCanvas(png)).resolves.toBeUndefined()

      const raw = await sharp(png).ensureAlpha().raw().toBuffer({
        resolveWithObject: true,
      })
      const edgePixels: number[][] = []
      const pushPixel = (x: number, y: number) => {
        const offset = (y * raw.info.width + x) * raw.info.channels
        edgePixels.push([
          ...raw.data.subarray(offset, offset + raw.info.channels),
        ])
      }
      for (let x = 0; x < raw.info.width; x += 1) {
        pushPixel(x, 0)
        pushPixel(x, raw.info.height - 1)
      }
      for (let y = 1; y < raw.info.height - 1; y += 1) {
        pushPixel(0, y)
        pushPixel(raw.info.width - 1, y)
      }
      expect(new Set(edgePixels.map((pixel) => pixel.join(',')))).toEqual(
        new Set(['24,24,27,255']),
      )

      const whiteEdge = await sharp({
        create: {
          background: '#18181b',
          channels: 4,
          height: 360,
          width: 1080,
        },
      })
        .composite([
          {
            input: {
              create: {
                background: '#ffffff',
                channels: 4,
                height: 1,
                width: 1080,
              },
            },
            left: 0,
            top: 0,
          },
        ])
        .png()
        .toBuffer()
      await expect(validateDocsCodeCanvas(whiteEdge)).rejects.toThrow(
        /white|edge|gutter/i,
      )

      const transparentEdge = await sharp({
        create: {
          background: { alpha: 0, b: 27, g: 24, r: 24 },
          channels: 4,
          height: 360,
          width: 1080,
        },
      })
        .png()
        .toBuffer()
      await expect(validateDocsCodeCanvas(transparentEdge)).rejects.toThrow(
        /transparent|edge/i,
      )
    } finally {
      await browser.close()
    }
  })

  it('extracts visible Shiki lines and renders their whole-row window as one flow', async () => {
    const captureModule = await import('../../tools/blog/capture-figures')
    const captureVisibleDocsCodeEvidence = Reflect.get(
      captureModule,
      'captureVisibleDocsCodeEvidence',
    )
    const validateDocsCodeCanvas = Reflect.get(
      captureModule,
      'validateDocsCodeCanvas',
    )

    expect(captureVisibleDocsCodeEvidence).toBeTypeOf('function')
    expect(validateDocsCodeCanvas).toBeTypeOf('function')
    if (
      typeof captureVisibleDocsCodeEvidence !== 'function' ||
      typeof validateDocsCodeCanvas !== 'function'
    ) {
      return
    }

    const browser = await chromium.launch({ headless: true })
    try {
      const page = await browser.newPage()
      const monoFontBase64 = (
        await readFile(
          path.join(
            repoRoot,
            'src/app/_fonts/GeistMono-Regular.ttf',
          ),
        )
      ).toString('base64')
      const rows = makeDocsCodeFixtureLines()
        .map((line) => `<span class="line">${line.html}</span>`)
        .join('')
      await page.setContent(`
        <main>
          <pre id="visible-code"><code>${rows}</code></pre>
        </main>
      `)

      const result = await captureVisibleDocsCodeEvidence(
        browser,
        page.locator('#visible-code'),
        'line 8 long-source-token',
        'synthetic visible Shiki integration',
        monoFontBase64,
      )
      expect(result.anchorIndex).toBe(7)
      expect(result.lines).toHaveLength(14)
      expect(
        result.selectedLines.map(
          (line: { sourceLine: number }) => line.sourceLine,
        ),
      ).toEqual([4, 5, 6, 7, 8, 9, 10, 11, 12, 13])
      await expect(
        validateDocsCodeCanvas(result.png),
      ).resolves.toBeUndefined()
      await expect(sharp(result.png).metadata()).resolves.toMatchObject({
        format: 'png',
        height: 360,
        width: 1080,
      })

      await page
        .locator('#visible-code code')
        .evaluate((code) => {
          const duplicate = document.createElement('span')
          duplicate.className = 'line'
          duplicate.textContent = 'line 8 long-source-token duplicate'
          code.append(duplicate)
        })
      await expect(
        captureVisibleDocsCodeEvidence(
          browser,
          page.locator('#visible-code'),
          'line 8 long-source-token',
          'duplicate Shiki anchor integration',
          monoFontBase64,
        ),
      ).rejects.toThrow(/matched 2 visible lines/i)
    } finally {
      await browser.close()
    }
  })

  it('rejects escaped source and output paths before reading or writing', async () => {
    const captureModule = await import('../../tools/blog/capture-figures')
    const resolveCaptureOutputPath = Reflect.get(
      captureModule,
      'resolveCaptureOutputPath',
    )
    const resolveCaptureSourcePath = Reflect.get(
      captureModule,
      'resolveCaptureSourcePath',
    )
    const readCaptureSourceExcerpt = Reflect.get(
      captureModule,
      'readCaptureSourceExcerpt',
    )
    const writeValidatedCaptureBatch = Reflect.get(
      captureModule,
      'writeValidatedCaptureBatch',
    )

    expect(resolveCaptureOutputPath).toBeTypeOf('function')
    expect(resolveCaptureSourcePath).toBeTypeOf('function')
    expect(readCaptureSourceExcerpt).toBeTypeOf('function')
    expect(writeValidatedCaptureBatch).toBeTypeOf('function')
    if (
      typeof resolveCaptureOutputPath !== 'function' ||
      typeof resolveCaptureSourcePath !== 'function' ||
      typeof readCaptureSourceExcerpt !== 'function' ||
      typeof writeValidatedCaptureBatch !== 'function'
    ) {
      return
    }

    await expect(
      resolveCaptureSourcePath('tests/int/demo-twins.int.spec.ts'),
    ).resolves.toBe(
      await realpath(path.join(repoRoot, 'tests/int/demo-twins.int.spec.ts')),
    )

    for (const escaped of ['../outside.ts', '/etc/passwd']) {
      await expect(resolveCaptureSourcePath(escaped), escaped).rejects.toThrow(
        /relative|outside|escape/i,
      )
    }

    const sourcePanel = {
      ...Reflect.get(captures[captures.length - 1], 'panels').at(-1),
      sourcePath: '../outside.ts',
    } as Parameters<typeof captureModule.readCaptureSourceExcerpt>[0]
    await expect(readCaptureSourceExcerpt(sourcePanel)).rejects.toThrow(
      /relative|outside|escape/i,
    )

    const validWebp = await sharp({
      create: {
        background: '#18181b',
        channels: 4,
        height: 900,
        width: 1600,
      },
    })
      .webp()
      .toBuffer()
    const writes: string[] = []
    const outputRoot = await mkdtemp(
      path.join(os.tmpdir(), 'blog-capture-lexical-'),
    )
    try {
      await expect(
        resolveCaptureOutputPath(
          outputRoot,
          'public/blog/example/figure.webp',
        ),
      ).resolves.toBe(
        path.join(
          await realpath(outputRoot),
          'public/blog/example/figure.webp',
        ),
      )
      for (const escaped of ['../outside.webp', '/tmp/outside.webp']) {
        await expect(
          resolveCaptureOutputPath(outputRoot, escaped),
          escaped,
        ).rejects.toThrow(/relative|outside|escape/i)
      }

      await expect(
        writeValidatedCaptureBatch(
          [
            {
              buffer: validWebp,
              capture: {
                ...captures[0],
                outputPath: '../outside.webp',
              },
            },
          ],
          {
            outputRoot,
            writeOutput: async (outputPath: string) => {
              writes.push(outputPath)
            },
          },
        ),
      ).rejects.toThrow(/relative|outside|escape/i)
      expect(writes).toEqual([])
    } finally {
      await rm(outputRoot, { force: true, recursive: true })
    }
  })

  it('preflights every canonical output destination before the first write', async () => {
    const captureModule = await import('../../tools/blog/capture-figures')
    const writeValidatedCaptureBatch = Reflect.get(
      captureModule,
      'writeValidatedCaptureBatch',
    )

    expect(writeValidatedCaptureBatch).toBeTypeOf('function')
    if (typeof writeValidatedCaptureBatch !== 'function') return

    const outputRoot = await mkdtemp(
      path.join(os.tmpdir(), 'blog-capture-batch-'),
    )
    try {
      const validWebp = await sharp({
        create: {
          background: '#18181b',
          channels: 4,
          height: 900,
          width: 1600,
        },
      })
        .webp()
        .toBuffer()
      const writes: string[] = []

      await expect(
        writeValidatedCaptureBatch(
          [
            {
              buffer: validWebp,
              capture: captures[0],
            },
            {
              buffer: validWebp,
              capture: {
                ...captures[1],
                outputPath: '../escaped-second.webp',
              },
            },
          ],
          {
            outputRoot,
            writeOutput: async (outputPath: string) => {
              writes.push(outputPath)
            },
          },
        ),
      ).rejects.toThrow(/relative|outside|escape/i)
      expect(writes).toEqual([])
    } finally {
      await rm(outputRoot, { force: true, recursive: true })
    }
  })

  it('rejects source and output symlinks that escape canonical roots', async () => {
    const captureModule = await import('../../tools/blog/capture-figures')
    const readCaptureSourceExcerpt = Reflect.get(
      captureModule,
      'readCaptureSourceExcerpt',
    )
    const resolveCaptureOutputPath = Reflect.get(
      captureModule,
      'resolveCaptureOutputPath',
    )
    const resolveCaptureSourcePath = Reflect.get(
      captureModule,
      'resolveCaptureSourcePath',
    )

    expect(readCaptureSourceExcerpt).toBeTypeOf('function')
    expect(resolveCaptureOutputPath).toBeTypeOf('function')
    expect(resolveCaptureSourcePath).toBeTypeOf('function')
    if (
      typeof readCaptureSourceExcerpt !== 'function' ||
      typeof resolveCaptureOutputPath !== 'function' ||
      typeof resolveCaptureSourcePath !== 'function'
    ) {
      return
    }

    const fixtureRoot = await mkdtemp(
      path.join(os.tmpdir(), 'blog-capture-paths-'),
    )
    const sourceRoot = path.join(fixtureRoot, 'source-root')
    const outputRoot = path.join(fixtureRoot, 'output-root')
    const outsideRoot = path.join(fixtureRoot, 'outside-root')
    await Promise.all([
      mkdir(sourceRoot, { recursive: true }),
      mkdir(outputRoot, { recursive: true }),
      mkdir(outsideRoot, { recursive: true }),
    ])

    try {
      const insideSource = path.join(sourceRoot, 'inside.ts')
      const outsideSource = path.join(outsideRoot, 'outside.ts')
      const outsideOutput = path.join(outsideRoot, 'outside.webp')
      await Promise.all([
        writeFile(
          insideSource,
          'const missing = literals.flatMap((literal) => literal)\\n',
        ),
        writeFile(
          outsideSource,
          'const missing = literals.flatMap((literal) => literal)\\n',
        ),
        writeFile(outsideOutput, 'outside'),
      ])
      await Promise.all([
        symlink(outsideSource, path.join(sourceRoot, 'escaped-source.ts')),
        symlink(outsideOutput, path.join(outputRoot, 'escaped-target.webp')),
        symlink(outsideRoot, path.join(outputRoot, 'escaped-parent')),
      ])

      const sourcePanel = {
        ...Reflect.get(captures[captures.length - 1], 'panels').at(-1),
        sourcePath: 'inside.ts',
      } as Parameters<typeof captureModule.readCaptureSourceExcerpt>[0]
      await expect(
        readCaptureSourceExcerpt(sourcePanel, sourceRoot),
      ).resolves.toMatchObject({
        firstLine: 1,
      })

      const canonicalSourceRoot = await realpath(sourceRoot)
      await expect(
        resolveCaptureSourcePath('inside.ts', sourceRoot),
      ).resolves.toBe(path.join(canonicalSourceRoot, 'inside.ts'))

      await expect(
        resolveCaptureSourcePath('escaped-source.ts', sourceRoot),
      ).rejects.toThrow(/canonical|outside|escape|symlink/i)
      await expect(
        readCaptureSourceExcerpt(
          {
            ...sourcePanel,
            sourcePath: 'escaped-source.ts',
          },
          sourceRoot,
        ),
      ).rejects.toThrow(/canonical|outside|escape|symlink/i)

      await expect(
        resolveCaptureOutputPath(outputRoot, 'escaped-target.webp'),
      ).rejects.toThrow(/canonical|outside|escape|symlink/i)
      await expect(
        resolveCaptureOutputPath(
          outputRoot,
          'escaped-parent/deep/figure.webp',
        ),
      ).rejects.toThrow(/canonical|outside|escape|symlink/i)

      const canonicalOutputRoot = await realpath(outputRoot)
      await expect(
        resolveCaptureOutputPath(
          outputRoot,
          'new/deep/figure.webp',
        ),
      ).resolves.toBe(
        path.join(canonicalOutputRoot, 'new/deep/figure.webp'),
      )
    } finally {
      await rm(fixtureRoot, { force: true, recursive: true })
    }
  })

  it('fails capture when a visible image cannot decode', async () => {
    const captureModule = await import('../../tools/blog/capture-figures')
    const waitForTargetAssets = Reflect.get(captureModule, 'waitForTargetAssets')

    expect(waitForTargetAssets).toBeTypeOf('function')
    if (typeof waitForTargetAssets !== 'function') return

    const browser = await chromium.launch({ headless: true })
    try {
      const page = await browser.newPage()
      await page.setContent(`
        <main id="capture-target">
          <img
            alt="Broken visible evidence"
            height="40"
            src="data:image/png;base64,not-a-valid-png"
            width="40"
          />
        </main>
      `)
      await expect(
        waitForTargetAssets(page, '#capture-target'),
      ).rejects.toThrow(/broken visible evidence|decode|image/i)
    } finally {
      await browser.close()
    }
  })

  it('embeds vendored Geist Mono in repository source evidence', async () => {
    const captureModule = await import('../../tools/blog/capture-figures')
    const renderSourceExcerptHtml = Reflect.get(
      captureModule,
      'renderSourceExcerptHtml',
    )

    expect(renderSourceExcerptHtml).toBeTypeOf('function')
    if (typeof renderSourceExcerptHtml !== 'function') return

    const sourcePanel = Reflect.get(
      captures[captures.length - 1],
      'panels',
    ).at(-1) as Parameters<
      typeof captureModule.renderSourceExcerptHtml
    >[0]
    const html = renderSourceExcerptHtml(
      sourcePanel,
      {
        firstLine: 78,
        lines: ['const missing = literals.flatMap((literal) => {'],
      },
      'dGVzdA==',
    )
    expect(html).toContain("@font-face")
    expect(html).toContain("font-family: 'Capture Mono'")
    expect(html).toContain('data:font/ttf;base64,dGVzdA==')
    expect(html).not.toMatch(/SFMono|Menlo|Monaco/)
  })

  it('encodes deterministic 1600 by 900 WebP and preflights the batch before writes', async () => {
    const captureModule = await import('../../tools/blog/capture-figures')
    const encodeCaptureWebp = Reflect.get(captureModule, 'encodeCaptureWebp')
    const webpEncodingOptions = Reflect.get(
      captureModule,
      'webpEncodingOptions',
    )
    const writeValidatedCaptureBatch = Reflect.get(
      captureModule,
      'writeValidatedCaptureBatch',
    )

    expect(encodeCaptureWebp).toBeTypeOf('function')
    expect(webpEncodingOptions).toEqual({ effort: 6, quality: 86 })
    expect(Object.isFrozen(webpEncodingOptions)).toBe(true)
    expect(writeValidatedCaptureBatch).toBeTypeOf('function')
    if (
      typeof encodeCaptureWebp !== 'function' ||
      typeof writeValidatedCaptureBatch !== 'function'
    ) {
      return
    }

    const png = await sharp({
      create: {
        background: '#f7f5ef',
        channels: 4,
        height: 900,
        width: 1600,
      },
    })
      .png()
      .toBuffer()
    const [first, second] = await Promise.all([
      encodeCaptureWebp(png),
      encodeCaptureWebp(png),
    ])
    const metadata = await sharp(first).metadata()

    expect(first.equals(second)).toBe(true)
    expect({
      format: metadata.format,
      height: metadata.height,
      width: metadata.width,
    }).toEqual({ format: 'webp', height: 900, width: 1600 })
    expect(first.byteLength).toBeLessThanOrEqual(358_400)

    const writes: string[] = []
    await expect(
      writeValidatedCaptureBatch(
        [
          { buffer: first, capture: captures[0] },
          { buffer: Buffer.from('not an image'), capture: captures[1] },
        ],
        {
          outputRoot: repoRoot,
          writeOutput: async (outputPath: string) => {
            writes.push(outputPath)
          },
        },
      ),
    ).rejects.toThrow(/capture batch.*before writing/i)
    expect(writes).toEqual([])
  })

  it('keeps the eight figure descriptions exact and removes stale montage claims', async () => {
    const expected = {
      'build-first-payload-v3-landing-page': {
        alt: 'A Field Journal montage of three repository demo fixtures—Hero Basic, Feature Bento, and Call To Action Centered—beside the real Testimonials Grid config shown in component documentation',
        caption:
          'The three previews are labeled structure-only fixtures, not one live page or product claim; the documentation panel shows the source-backed testimonial contract used in a real composition.',
      },
      'build-payload-blog-frontend': {
        alt: 'The real blog index route beside the What Is a Payload CMS Block article route, captured from the local production site',
        caption:
          'The same committed editorial library appears as an image-led index and a full article page; these are actual site surfaces, not a catalog of unshipped post components.',
      },
      'build-saas-homepage': {
        alt: 'Four source-backed component contract panels for Hero Basic, Logo Cloud Grid, Feature Bento, and Pricing Cards, labeled by their homepage jobs',
        caption:
          'This is a contract inventory for promise, proof slot, explanation, and commitment—not a fictional assembled product page or a complete eight-section template.',
      },
      'choosing-payload-hero': {
        alt: 'Hero Basic’s repository demo fixture at desktop and mobile widths, its catalog card, and the source-backed config shown in the Hero Basic documentation',
        caption:
          'Fixture labels separate responsive layout evidence from real project claims; the catalog identifies the shipped item, and the Code tab exposes the Payload field contract behind it.',
      },
      'demo-twins': {
        alt: 'A structure-only Hero Basic demo fixture beside the Hero Basic documentation Code tab and the real class-token mirror assertion from the demo-twin integration test',
        caption:
          'The preview is explicitly labeled as fixture content; the source and test panels show how the docs site mirrors shipped class tokens without importing the Payload runtime.',
      },
      'editor-friendly-feature-sections': {
        alt: 'Four structure-only repository demo fixtures comparing Feature Bento, Feature Split, Feature Steps, and Feature Grid Basic at the same capture width',
        caption:
          'These labeled fixtures compare reading rhythm only: uneven emphasis, two-column split, ordered steps, and peer cards. Replace the fixture copy with uneven real content before choosing.',
      },
      'modeling-pricing-pages': {
        alt: 'Source-backed documentation and config panels comparing Pricing Cards, Pricing Cards Muted, Pricing Split, and Pricing Enterprise without displaying fictional prices',
        caption:
          'The contracts reveal the structural differences: cards and muted cards allow two to four plans, split requires two, and enterprise adds a single-plan layout with optional logos.',
      },
      'social-proof-sections': {
        alt: 'Source-backed documentation and config panels for Logo Cloud Grid, Testimonials Grid, Testimonials Rating, and Testimonials Quote without displaying fictional endorsements',
        caption:
          'The contracts separate editable logo records, a grid of attributed quotes, bounded one-to-five ratings, and a single featured quote; credibility still comes from verified content.',
      },
    } as const

    for (const [slug, copy] of Object.entries(expected)) {
      const capture = captures.find((candidate) => Reflect.get(candidate, 'slug') === slug)
      expect(capture, slug).toBeDefined()
      if (!capture) continue
      const figurePath = `/${Reflect.get(capture, 'outputPath').replace(/^public\//, '')}`
      const actual = await getInlineFigureCopy(slug, figurePath)
      expect(actual.alt, `${slug}: alt`).toBe(copy.alt)
      expect(actual.caption, `${slug}: caption`).toBe(copy.caption)
      expect(`${actual.alt}\n${actual.caption}`, slug).not.toMatch(
        /coherent page|five structures|spotlight|eight families|catalog montage/i,
      )
    }
  })
})

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

async function getCoverAlt(slug: string) {
  const source = await readFile(path.join(blogRoot, `${slug}.mdx`), 'utf8')
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
  return frontmatter
    .match(/^\s*alt:\s*(.+)$/m)?.[1]
    ?.trim()
    .replace(/^['"]|['"]$/g, '')
}

async function getInlineFigureCopy(slug: string, figurePath: string) {
  const source = await readFile(path.join(blogRoot, `${slug}.mdx`), 'utf8')
  const figure = [...source.matchAll(/<BlogFigure\s+([\s\S]*?)\/>/g)]
    .map((match) => match[1])
    .find((attributes) => attributes.includes(`src="${figurePath}"`))

  expect(figure, `${slug}: ${figurePath}`).toBeDefined()

  return {
    alt: figure?.match(/\balt="([^"]+)"/)?.[1] ?? '',
    caption: figure?.match(/\bcaption="([^"]+)"/)?.[1] ?? '',
    source,
  }
}

function coverPartCount(html: string, part: string) {
  return html.match(new RegExp(`data-cover-part="${part}"`, 'g'))?.length ?? 0
}

async function getDiagramVisuals() {
  const diagrams = blogVisualCatalog.flatMap((entry) =>
    entry.figures
      .filter((figure) => figure.path.endsWith('.svg'))
      .map((figure) => ({
        entry,
        figure,
        outputPath: path.join(repoRoot, 'public', figure.path.replace(/^\//, '')),
      })),
  )

  return Promise.all(
    diagrams.map(async (diagram) => ({
      ...diagram,
      source: await readFile(diagram.outputPath, 'utf8'),
    })),
  )
}

describe('Field Journal deterministic diagram assets', () => {
  it('covers the exact catalog SVG set with one accessible journal document each', async () => {
    const diagrams = await getDiagramVisuals()

    expect(diagrams).toHaveLength(27)
    expect(new Set(diagrams.map(({ figure }) => figure.path)).size).toBe(27)

    for (const { entry, figure, source } of diagrams) {
      const context = `${entry.slug}: ${figure.path}`
      const root = source.match(/^<svg\b[^>]*>/)?.[0] ?? ''

      expect(root, `${context}: root`).toContain('viewBox="0 0 1200 675"')
      expect(root, `${context}: mode`).toContain(`data-mode="${figure.mode}"`)
      expect(root, `${context}: accessible name`).toMatch(
        /\baria-labelledby="diagram-title diagram-description"/,
      )
      expect(source, `${context}: title`).toMatch(
        /<title id="diagram-title">[^<]+<\/title>/,
      )
      expect(source, `${context}: description`).toMatch(
        /<desc id="diagram-description">[^<]+<\/desc>/,
      )

      for (const part of [
        'grid',
        'masthead',
        'mode',
        'folio',
        'provenance',
        'prompt',
      ]) {
        expect(
          source.match(new RegExp(`data-journal-part="${part}"`, 'g')) ?? [],
          `${context}: ${part}`,
        ).toHaveLength(1)
      }

      const seriesLabel = {
        'component-design': 'COMPONENT DESIGN',
        foundations: 'FOUNDATIONS',
        'installer-internals': 'INSTALLER INTERNALS',
        'open-source': 'OPEN SOURCE',
        'production-guides': 'PRODUCTION GUIDES',
        'project-notes': 'PROJECT NOTES',
      }[entry.series]
      expect(source, `${context}: catalog series`).toContain(
        `data-series="${entry.series}"`,
      )
      expect(source, `${context}: catalog issue`).toContain(
        `data-issue="${String(entry.order).padStart(2, '0')}"`,
      )
      expect(source, `${context}: masthead text`).toContain(
        `${seriesLabel} · ISSUE ${String(entry.order).padStart(2, '0')}`,
      )
      expect(source, `${context}: mode marker`).toContain(
        `>${figure.mode.toUpperCase()}</text>`,
      )
      expect(source, `${context}: exact catalog prompt`).toContain(
        entry.prompt
          .replaceAll('&', '&amp;')
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;')
          .replaceAll('"', '&quot;')
          .replaceAll("'", '&apos;'),
      )
    }
  })

  it('keeps every diagram self-contained, legible, and inside the approved journal palette', async () => {
    for (const { entry, source } of await getDiagramVisuals()) {
      expect(source, `${entry.slug}: active content`).not.toMatch(
        /<script\b|<foreignObject\b|<image\b|@import\b|@font-face\b/i,
      )
      expect(source, `${entry.slug}: external URL`).not.toMatch(
        /(?:href|src)=["'](?:https?:)?\/\/|url\(["']?https?:\/\//i,
      )
      expect(source, `${entry.slug}: alternate color syntax`).not.toMatch(
        /\b(?:rgb|hsl|lab|lch|hwb|color)a?\(/i,
      )

      for (const color of source.match(/#[\da-f]{3,8}\b/gi) ?? []) {
        expect(
          approvedPalette.has(
            color.length === 4
              ? `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`.toLowerCase()
              : color.toLowerCase(),
          ),
          `${entry.slug}: ${color}`,
        ).toBe(true)
      }

      const fontSizes = [
        ...[...source.matchAll(/\bfont-size=["']([\d.]+)(?:px)?["']/gi)].map(
          (match) => Number(match[1]),
        ),
        ...[...source.matchAll(/font-size\s*:\s*([\d.]+)px/gi)].map((match) =>
          Number(match[1]),
        ),
        ...[...source.matchAll(/(?:^|[;{])\s*font\s*:[^;{}]*?\b([\d.]+)px/gi)].map(
          (match) => Number(match[1]),
        ),
      ]
      expect(fontSizes.length, `${entry.slug}: declared text sizes`).toBeGreaterThan(0)
      expect(Math.min(...fontSizes), `${entry.slug}: minimum text size`).toBeGreaterThanOrEqual(
        13,
      )
      expect(source, `${entry.slug}: text scaling`).not.toMatch(
        /<text\b[^>]*\btransform=["'][^"']*\bscale\(\s*(?:0(?:\.\d+)?|\.\d+)/i,
      )
    }
  })
})

describe('Field Journal diagram renderer', () => {
  it('defines the exact catalog paths once with unique node identities', async () => {
    const { diagramDefinitions } = await import(
      '../../tools/blog/visual-system/diagram-data'
    )
    const catalogPaths = blogVisualCatalog
      .flatMap((entry) => entry.figures)
      .filter((figure) => figure.path.endsWith('.svg'))
      .map((figure) => figure.path)

    expect(diagramDefinitions.map((definition) => definition.path)).toEqual(catalogPaths)
    expect(new Set(diagramDefinitions.map((definition) => definition.path)).size).toBe(27)

    for (const definition of diagramDefinitions) {
      const nodeIds = definition.rows.flat().map((node) => node.id)
      expect(new Set(nodeIds).size, definition.path).toBe(nodeIds.length)
    }
  })

  it('hydrates issue, series, mode, invitation, and evidence from repository-backed catalog artifacts', async () => {
    const { diagramDefinitions, hydrateDiagramDefinitions } = await import(
      '../../tools/blog/visual-system/diagram-data'
    )
    const hydrated = await hydrateDiagramDefinitions()

    expect(hydrated).toHaveLength(27)

    for (const diagram of hydrated) {
      const entry = blogVisualCatalog.find((candidate) => candidate.slug === diagram.slug)
      const figure = entry?.figures.find((candidate) => candidate.path === diagram.path)
      const definition = diagramDefinitions.find(
        (candidate) => candidate.path === diagram.path,
      )

      expect(entry, diagram.path).toBeDefined()
      expect(definition, diagram.path).toBeDefined()
      expect(diagram.order, diagram.path).toBe(entry?.order)
      expect(diagram.series, diagram.path).toBe(entry?.series)
      expect(diagram.mode, diagram.path).toBe(figure?.mode)
      expect(diagram.prompt, diagram.path).toBe(entry?.prompt)
      expect(diagram.provenance.trim(), diagram.path).not.toBe('')
      expect(diagram.provenance, diagram.path).not.toContain('generate-figures.ts')

      const evidenceRole = definition?.evidenceRole ?? 'primary'
      const artifact = entry?.[evidenceRole]
      expect(artifact, diagram.path).toBeDefined()

      if (artifact) {
        if ('path' in artifact) {
          expect(artifact.path, diagram.path).not.toContain('generate-figures.ts')
        }
        const resolved = await resolveArtifact(artifact)
        expect(diagram.provenance, diagram.path).toBe(resolved.provenance)
        if (definition?.evidenceLines) {
          expect(diagram.evidenceExcerpt, diagram.path).toBe(
            resolved.evidence
              .split(/\r?\n/)
              .slice(0, definition.evidenceLines)
              .join('\n'),
          )
        }
      }
    }
  })

  it('pins the diagram lessons to current installer, component, and community truth', async () => {
    const { diagramDefinitions } = await import(
      '../../tools/blog/visual-system/diagram-data'
    )
    const text = (suffix: string) => {
      const definition = diagramDefinitions.find((candidate) =>
        candidate.path.endsWith(suffix),
      )
      expect(definition, suffix).toBeDefined()
      return JSON.stringify(definition)
    }

    expect(text('hello/figure-01-origin-story.svg')).toContain(
      'src/blocks/shared/heroFields.ts',
    )

    const install = text('anatomy-of-an-install/figure-01-five-stage-pipeline.svg')
    for (const stage of [
      'registry-build',
      'registry-add',
      'dependency-install',
      'fragment-apply',
      'post-install',
    ]) {
      expect(install).toContain(stage)
    }
    expect(install).toContain('Plan + preflight')
    expect(install).toContain('State records attempt, failure, or success')
    expect(install).toContain('installed after all required stages')
    expect(install).not.toContain('State outcome after every stage')

    const lifecycleDefinition = diagramDefinitions.find((candidate) =>
      candidate.path.endsWith(
        'what-is-a-payload-cms-block/figure-01-block-lifecycle.svg',
      ),
    )
    expect(JSON.stringify(lifecycleDefinition)).toContain('Compile-time guard')
    expect(
      lifecycleDefinition?.rows.map((row) => row.map((node) => node.id)),
    ).toEqual([
      ['config'],
      ['editor', 'types'],
      ['stored', 'renderer', 'component', 'react'],
    ])
    expect(lifecycleDefinition?.edges?.map(({ from, to }) => [from, to])).toEqual([
      ['config', 'editor'],
      ['config', 'types'],
      ['editor', 'stored'],
      ['types', 'renderer'],
      ['stored', 'renderer'],
      ['renderer', 'component'],
      ['component', 'react'],
    ])
    expect(
      text('production-ready-payload-block-config/figure-01-config-anatomy.svg'),
    ).toContain('Reviewable block contract')

    const renderers = text('how-renderblocks-works/figure-01-renderer-dispatch.svg')
    for (const exportedRenderer of [
      'HeroBasicBlock',
      'FeatureBentoBlock',
      'ContentQuoteBlock',
    ]) {
      expect(renderers).toContain(exportedRenderer)
    }

    const state = text('manifest-wiring-contract/figure-01-manifest-layers.svg')
    for (const field of [
      'manifestVersion',
      'registryItemName',
      'targetId',
      'status',
      'installedAt',
      'lastAttemptAt',
      'lastError',
      'patchedFiles',
    ]) {
      expect(state).toContain(field)
    }

    expect(text('text-anchors-vs-ast/figure-01-scoped-diff.svg')).toContain(
      'heroBasic: HeroBasicBlock',
    )
    const convergenceDefinition = diagramDefinitions.find((candidate) =>
      candidate.path.endsWith(
        'idempotent-code-installer/figure-01-convergence-state.svg',
      ),
    )
    expect(
      convergenceDefinition?.rows.map((row) => row.map((node) => node.id)),
    ).toEqual([
      ['preflight'],
      ['attempt'],
      ['failure', 'installed', 'unchanged'],
    ])
    expect(
      convergenceDefinition?.edges?.map(({ from, to }) => [from, to]),
    ).toEqual([
      ['preflight', 'attempt'],
      ['attempt', 'failure'],
      ['attempt', 'installed'],
      ['installed', 'unchanged'],
    ])
    expect(
      convergenceDefinition?.rows
        .flat()
        .find((node) => node.id === 'failure')?.body,
    ).toContain('next add rechecks preflight')
    expect(text('payload-components-doctor/figure-01-doctor-report.svg')).not.toContain(
      'Summary:',
    )

    const variants = text(
      'component-variants-without-prop-explosion/figure-01-family-vs-matrix.svg',
    )
    for (const variant of [
      'feature-grid-basic',
      'feature-split',
      'feature-bento',
      'feature-steps',
    ]) {
      expect(variants).toContain(variant)
    }
    expect(variants).not.toMatch(/hero-(?:video|dramatic)/)
    expect(variants).toContain('Heading + CTA beside list')
    expect(variants).not.toContain('Alternating rows')

    expect(
      text('build-payload-blog-frontend/figure-01-editorial-architecture.svg'),
    ).not.toMatch(/pagination|docs search/i)
    expect(text('accessible-faq-blocks/figure-01-faq-anatomy.svg')).toContain(
      'Region only when useful',
    )
    const faqDefinition = diagramDefinitions.find((candidate) =>
      candidate.path.endsWith('accessible-faq-blocks/figure-01-faq-anatomy.svg'),
    )
    expect(faqDefinition?.rows.map((row) => row.map((node) => node.id))).toEqual([
      ['block', 'accordion', 'item'],
      ['trigger', 'panel'],
      ['verify'],
    ])

    const trust = text('safe-links-forms-embeds/figure-01-trust-boundary.svg')
    expect(trust).toContain('Shipped guard')
    expect(trust).toContain('Application policy')

    const motion = text('motion-without-performance-cost/figure-01-motion-timeline.svg')
    expect(motion).toContain('x: 0 → -contentSize / 2')
    expect(motion).toContain('effect returns; row stays static')

    expect(text('demo-twins/figure-01-architecture-mirror.svg')).toContain(
      'one-way token presence',
    )
    expect(
      text('visual-regression-component-registry/figure-01-regression-pipeline.svg'),
    ).toContain('Zero baselines: bootstrap skip')

    const contribution = text(
      'contribute-payload-component/figure-01-contribution-workflow.svg',
    )
    for (const surface of [
      'Source',
      'Manifest',
      'Registry',
      'Demo twin',
      'Catalog + ledgers',
      'Docs',
      'Tests',
    ]) {
      expect(contribution).toContain(surface)
    }

    const reproducible = text(
      'reproducible-shadcn-registry/figure-01-deterministic-build.svg',
    )
    expect(reproducible).toContain('One temporary build')
    expect(reproducible).toContain('Exact embedded content')
    expect(reproducible).not.toContain('Clean checkout B')

    const feedback = text('community-driven-roadmap/figure-01-feedback-loop.svg')
    expect(feedback).toContain('Public issue or private advisory')
    expect(feedback).toContain('Available to future installs')
    expect(feedback).not.toContain('reaches everyone')
  })

  it('keeps inline descriptions and adjacent state prose aligned with corrected diagrams', async () => {
    const expectedCopy = {
      'anatomy-of-an-install': {
        alt: ['preflight', 'dependency-install', 'post-install'],
        caption: ['failed stage', 'installed state'],
      },
      'build-payload-blog-frontend': {
        alt: ['validated MDX', 'related posts', 'RSS'],
        caption: ['one validated source'],
      },
      'community-driven-roadmap': {
        alt: ['public issue or private advisory', 'future installs'],
        caption: ['routed evidence', 'available release'],
      },
      'component-variants-without-prop-explosion': {
        alt: ['feature-grid-basic', 'feature-split', 'feature-bento', 'feature-steps'],
        caption: ['four shipped'],
      },
      'contribute-payload-component': {
        alt: ['seven', 'catalog and ledgers'],
        caption: ['seven surfaces'],
      },
      'copying-is-not-installing': {
        alt: ['shared fields', 'registry dependencies', 'manifest dependencies'],
        caption: ['Payload integration'],
      },
      'demo-twins': {
        alt: ['one-way', 'class token'],
        caption: ['token-presence guard'],
      },
      'hello': {
        alt: ['heroFields', 'registration', 'generated'],
        caption: ['shared field source', 'wiring'],
      },
      'idempotent-code-installer': {
        alt: ['preflight', 'partial', 'early return'],
        caption: ['rechecks', 'last failed stage'],
      },
      'manifest-wiring-contract': {
        alt: ['CLI contract', 'install state'],
        caption: ['records outcomes'],
      },
      'motion-without-performance-cost': {
        alt: ['x-axis', 'static'],
        caption: ['returns before animation'],
      },
      'payload-components-doctor': {
        alt: ['exact healthy fixture', 'Payload fragments'],
        caption: ['no invented summary'],
      },
      'reproducible-shadcn-registry': {
        alt: ['one temporary', 'embedded content'],
        caption: ['three comparisons'],
      },
      'safe-links-forms-embeds': {
        alt: ['shipped', 'application-owned'],
        caption: ['safeUrls.ts', 'local policy'],
      },
      'shared-fields-across-component-families': {
        alt: ['featureFields', 'four'],
        caption: ['four Feature configs'],
      },
      'text-anchors-vs-ast': {
        alt: ['heroBasic: HeroBasicBlock', 'deduplicated'],
        caption: ['named import', 'direct map entry'],
      },
      'visual-regression-component-registry': {
        alt: ['zero-baseline', 'minted-platform'],
        caption: ['bootstrap exception'],
      },
      'what-is-a-payload-cms-block': {
        alt: ['runtime', 'compile-time'],
        caption: ['do not flow through generated types at runtime'],
      },
    } as const

    for (const [slug, expected] of Object.entries(expectedCopy)) {
      const entry = blogVisualCatalog.find((candidate) => candidate.slug === slug)
      const figure = entry?.figures.find((candidate) => candidate.path.endsWith('.svg'))
      expect(figure, slug).toBeDefined()
      if (!figure) continue

      const copy = await getInlineFigureCopy(slug, figure.path)
      for (const term of expected.alt) {
        expect(copy.alt, `${slug}: alt -> ${term}`).toContain(term)
      }
      for (const term of expected.caption) {
        expect(copy.caption, `${slug}: caption -> ${term}`).toContain(term)
      }
    }

    for (const slug of [
      'copying-is-not-installing',
      'idempotent-code-installer',
      'manifest-wiring-contract',
      'payload-components-doctor',
      'text-anchors-vs-ast',
    ]) {
      const source = await readFile(path.join(blogRoot, `${slug}.mdx`), 'utf8')
      expect(source, slug).not.toMatch(
        /\blast completed stage\b|\bcompleted stages\b|\bcurrent stage\b|\bresume point\b/i,
      )
    }

    const idempotentSource = await readFile(
      path.join(blogRoot, 'idempotent-code-installer.mdx'),
      'utf8',
    )
    expect(idempotentSource).not.toContain(
      'Conflicting fragment refuses to overwrite consumer code',
    )
    expect(idempotentSource).toContain(
      'Exact fragment rerun does not duplicate the named import or direct map entry',
    )
    expect(idempotentSource).toContain(
      'Missing anchor fails without a broad rewrite',
    )

    const anchorSource = await readFile(
      path.join(blogRoot, 'text-anchors-vs-ast.mdx'),
      'utf8',
    )
    const normalizedAnchorSource = anchorSource.replace(/\s+/g, ' ')
    expect(anchorSource).not.toContain(
      'Before applying fragments, the installer resolves target files and validates the expected anchors',
    )
    expect(anchorSource).not.toContain(
      'discover obvious incompatibility before writing the first host file',
    )
    expect(normalizedAnchorSource).toContain(
      'Fragment files are read and patched sequentially',
    )
    expect(normalizedAnchorSource).toContain(
      'a later missing anchor can fail after an earlier host file changed',
    )
    expect(normalizedAnchorSource).toContain(
      'recoverable, not globally prevalidated or atomic',
    )

    const anatomySource = await readFile(
      path.join(blogRoot, 'anatomy-of-an-install.mdx'),
      'utf8',
    )
    const normalizedAnatomySource = anatomySource.replace(/\s+/g, ' ')
    expect(anatomySource).not.toContain(
      'a stage whose result is already valid can be skipped',
    )
    expect(normalizedAnatomySource).toContain(
      'File, dependency, and fragment stages are conditional on observed missing work',
    )
    expect(normalizedAnatomySource).toContain(
      'can return early before a staged attempt',
    )
    expect(normalizedAnatomySource).toContain(
      'declared post-install scripts run before installed state is recorded',
    )

    const trustSource = (
      await readFile(path.join(blogRoot, 'safe-links-forms-embeds.mdx'), 'utf8')
    ).replace(/\s+/g, ' ')
    expect(trustSource).not.toContain(
      'A form selects a known server workflow, not a free-form action',
    )
    expect(trustSource).not.toContain(
      'An embed stores a provider and identifier',
    )
    expect(trustSource).not.toContain('a known form identifier')
    expect(trustSource).not.toContain('Model embeds as provider plus identifier')
    expect(trustSource).toContain(
      'The CTA stores a constrained same-origin action path',
    )
    expect(trustSource).toContain(
      'EmbedBasic stores an approved HTTPS URL',
    )
    expect(trustSource).toContain('neither accepts pasted HTML')

    const reproducibilitySource = (
      await readFile(
        path.join(blogRoot, 'reproducible-shadcn-registry.mdx'),
        'utf8',
      )
    ).replace(/\s+/g, ' ')
    expect(reproducibilitySource).not.toContain(
      '`pnpm test:registry` creates one temporary build',
    )
    expect(reproducibilitySource).toContain(
      '`pnpm registry:check` creates one temporary build',
    )
    expect(reproducibilitySource).toContain(
      '`pnpm test:registry` runs `registry:check` and `registry:validate`',
    )

    const contributionSource = await readFile(
      path.join(blogRoot, 'contribute-payload-component.mdx'),
      'utf8',
    )
    expect(contributionSource).not.toContain('`hero-video`')
    expect(contributionSource).toContain('`feature-steps`')
    expect(contributionSource).toContain('`pricing-cards`')

    for (const slug of [
      'how-renderblocks-works',
      'type-safe-block-rendering',
      'what-is-a-payload-cms-block',
    ]) {
      const source = await readFile(path.join(blogRoot, `${slug}.mdx`), 'utf8')
      expect(source, slug).not.toMatch(
        /\b(?:HeroBasic|FeatureBento|ContentQuote)Component\b/,
      )
    }
  })

  it('rejects duplicate nodes, unknown endpoints, duplicate edges, and traversal paths', async () => {
    const { diagramDefinitions } = await import(
      '../../tools/blog/visual-system/diagram-data'
    )
    const { validateDiagramDefinitions } = await import(
      '../../tools/blog/visual-system/diagram-template'
    )
    const base = diagramDefinitions[0]

    expect(() =>
      validateDiagramDefinitions([
        {
          ...base,
          rows: [[base.rows[0][0], { ...base.rows[0][0] }]],
        },
      ]),
    ).toThrow(/duplicate node id/i)
    expect(() =>
      validateDiagramDefinitions([
        {
          ...base,
          edges: [{ from: base.rows[0][0].id, to: 'missing-node' }],
        },
      ]),
    ).toThrow(/unknown edge endpoint/i)
    expect(() =>
      validateDiagramDefinitions([
        {
          ...base,
          edges: [
            { from: base.rows[0][0].id, to: base.rows[0][1].id },
            { from: base.rows[0][0].id, to: base.rows[0][1].id },
          ],
        },
      ]),
    ).toThrow(/duplicate edge/i)
    expect(() =>
      validateDiagramDefinitions([
        {
          ...base,
          path: '/blog/hello/../escaped.svg',
        },
      ]),
    ).toThrow(/canonical blog path|traversal/i)
  })

  it('escapes XML and renders deterministic, metadata-complete diagrams', async () => {
    const { hydrateDiagramDefinitions } = await import(
      '../../tools/blog/visual-system/diagram-data'
    )
    const { escapeXml, renderDiagramSvg } = await import(
      '../../tools/blog/visual-system/diagram-template'
    )
    const diagrams = await hydrateDiagramDefinitions()
    const first = diagrams[0]

    expect(escapeXml(`<node id="x">& 'quoted'</node>`)).toBe(
      '&lt;node id=&quot;x&quot;&gt;&amp; &apos;quoted&apos;&lt;/node&gt;',
    )
    expect(renderDiagramSvg(first)).toBe(renderDiagramSvg(first))

    for (const diagram of diagrams) {
      const svg = renderDiagramSvg(diagram)
      const root = svg.match(/^<svg\b[^>]*>/)?.[0] ?? ''
      const nodeIds = [...svg.matchAll(/data-node-id="([^"]+)"/g)].map(
        (match) => match[1],
      )
      const flatNodes = diagram.rows.flat()
      const effectiveEdges =
        diagram.edges ??
        flatNodes.slice(0, -1).map((node, index) => ({
          from: node.id,
          to: flatNodes[index + 1].id,
        }))
      const renderedEdges = [...svg.matchAll(
        /data-edge-from="([^"]+)"\s+data-edge-to="([^"]+)"/g,
      )].map((match) => ({ from: match[1], to: match[2] }))
      const headlineBaselines = [
        ...svg.matchAll(/<text class="headline"[^>]*\by="([\d.]+)"/g),
      ].map((match) => Number(match[1]))
      const cardTops = [
        ...svg.matchAll(/<rect class="node-card"[^>]*\by="([\d.]+)"/g),
      ].map((match) => Number(match[1]))
      const modeBox = svg.match(
        /<rect class="mode-box" x="([\d.]+)" y="[\d.]+" width="([\d.]+)"/,
      )
      const folio = svg.match(
        /<text class="folio-label" x="([\d.]+)"[^>]*>([^<]+)<\/text>/,
      )

      expect(root, diagram.path).toContain('viewBox="0 0 1200 675"')
      expect(root, diagram.path).toContain(`data-mode="${diagram.mode}"`)
      expect(root, diagram.path).toContain(
        'aria-labelledby="diagram-title diagram-description"',
      )
      expect(new Set(nodeIds).size, diagram.path).toBe(nodeIds.length)
      expect(headlineBaselines.length, `${diagram.path}: headline lines`).toBeGreaterThan(0)
      expect(cardTops.length, `${diagram.path}: node cards`).toBeGreaterThan(0)
      expect(
        Math.min(...cardTops),
        `${diagram.path}: headline/card clearance`,
      ).toBeGreaterThan(Math.max(...headlineBaselines) + 8)
      expect(modeBox, `${diagram.path}: mode stamp`).toBeTruthy()
      expect(folio, `${diagram.path}: folio`).toBeTruthy()
      if (modeBox && folio) {
        const modeRight = Number(modeBox[1]) + Number(modeBox[2])
        const conservativeFolioLeft = Number(folio[1]) - [...folio[2]].length * 8
        expect(
          modeRight + 16,
          `${diagram.path}: mode/folio clearance`,
        ).toBeLessThanOrEqual(conservativeFolioLeft)
      }
      expect(renderedEdges, `${diagram.path}: effective edge order`).toEqual(
        effectiveEdges.map(({ from, to }) => ({ from, to })),
      )

      for (const nodeMatch of svg.matchAll(
        /<g class="node [^"]+" data-node-id="([^"]+)"[\s\S]*?<\/g>/g,
      )) {
        const nodeSource = nodeMatch[0]
        const card = nodeSource.match(
          /<rect class="node-card"[^>]*\by="([\d.]+)"[^>]*\bheight="([\d.]+)"/,
        )
        const textBaselines = [
          ...nodeSource.matchAll(/<text\b[^>]*\by="([\d.]+)"/g),
        ].map((match) => Number(match[1]))

        expect(card, `${diagram.path}: ${nodeMatch[1]} card`).toBeTruthy()
        expect(
          textBaselines.length,
          `${diagram.path}: ${nodeMatch[1]} text`,
        ).toBeGreaterThan(0)
        if (!card) continue

        const safeTextBottom = Math.max(...textBaselines) + 5
        const cardBottom = Number(card[1]) + Number(card[2])
        expect(
          safeTextBottom,
          `${diagram.path}: ${nodeMatch[1]} text/card clearance`,
        ).toBeLessThanOrEqual(cardBottom - 8)
      }

      for (const edge of svg.matchAll(
        /data-edge-from="([^"]+)"\s+data-edge-to="([^"]+)"/g,
      )) {
        expect(nodeIds, `${diagram.path}: edge from`).toContain(edge[1])
        expect(nodeIds, `${diagram.path}: edge to`).toContain(edge[2])
      }

      const decodedBodyLines = [...svg.matchAll(
        /<text[^>]+data-role="body-line"[^>]*>([^<]*)<\/text>/g,
      )].map((match) =>
        match[1]
          .replaceAll('&amp;', '&')
          .replaceAll('&lt;', '<')
          .replaceAll('&gt;', '>')
          .replaceAll('&quot;', '"')
          .replaceAll('&apos;', "'"),
      )
      expect(decodedBodyLines.length, diagram.path).toBeGreaterThan(0)
      expect(
        Math.max(...decodedBodyLines.map((line) => [...line].length)),
        diagram.path,
      ).toBeLessThanOrEqual(68)
      expect(Buffer.byteLength(svg), diagram.path).toBeLessThanOrEqual(153_600)
      expect(svg, `${diagram.path}: trailing whitespace`).not.toMatch(/[ \t]+$/m)
    }
  })

  it('renders every edge label in full without silently dropping wrapped lines', async () => {
    const { hydrateDiagramDefinitions } = await import(
      '../../tools/blog/visual-system/diagram-data'
    )
    const { escapeXml, renderDiagramSvg, wrapDiagramText } = await import(
      '../../tools/blog/visual-system/diagram-template'
    )

    const diagrams = await hydrateDiagramDefinitions()
    const synthetic = {
      ...diagrams[0],
      evidenceExcerpt: undefined,
      path: '/blog/hello/figure-99-edge-label-regression.svg',
      rows: [
        [{ id: 'source', title: 'Source', body: 'Observed repository state' }],
        [{ id: 'target', title: 'Target', body: 'Converged repository state' }],
      ],
      edges: [
        {
          from: 'source',
          label: 'attempt · failure · success',
          to: 'target',
        },
      ],
      title: 'Multiline edge-label regression',
    } as const

    for (const diagram of [...diagrams, synthetic]) {
      const svg = renderDiagramSvg(diagram)

      for (const edge of diagram.edges ?? []) {
        if (!edge.label) continue

        const encodedLabel = escapeXml(edge.label)
        const group = svg.match(
          new RegExp(
            `<g class="edge" data-edge-label="${encodedLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}">([\\s\\S]*?)<\\/g>`,
          ),
        )?.[1]
        expect(group, `${diagram.path}: ${edge.label}`).toBeDefined()

        const renderedLines = [
          ...(group ?? '').matchAll(/<text class="edge-label"[^>]*>([^<]*)<\/text>/g),
        ].map((match) => match[1])
        expect(renderedLines, `${diagram.path}: ${edge.label}`).toEqual(
          wrapDiagramText(edge.label, 25).map(escapeXml),
        )
      }
    }
  })

  it('anchors cross-row edges vertically and keeps every label paper out of cards', async () => {
    const { hydrateDiagramDefinitions } = await import(
      '../../tools/blog/visual-system/diagram-data'
    )
    const { renderDiagramSvg } = await import(
      '../../tools/blog/visual-system/diagram-template'
    )
    const intersects = (
      left: { height: number; width: number; x: number; y: number },
      right: { height: number; width: number; x: number; y: number },
    ) =>
      left.x < right.x + right.width &&
      left.x + left.width > right.x &&
      left.y < right.y + right.height &&
      left.y + left.height > right.y

    for (const diagram of await hydrateDiagramDefinitions()) {
      const svg = renderDiagramSvg(diagram)
      const positions = new Map(
        [...svg.matchAll(
          /<g class="node [^"]+" data-node-id="([^"]+)"[\s\S]*?<rect class="node-card" x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g,
        )].map((match) => [
          match[1],
          {
            height: Number(match[5]),
            width: Number(match[4]),
            x: Number(match[2]),
            y: Number(match[3]),
          },
        ]),
      )
      const rowByNode = new Map(
        diagram.rows.flatMap((row, rowIndex) =>
          row.map((node) => [node.id, rowIndex] as const),
        ),
      )

      for (const match of svg.matchAll(
        /<path class="edge-path" data-edge-from="([^"]+)" data-edge-to="([^"]+)" data-edge-axis="([^"]+)" d="M (-?[\d.]+) (-?[\d.]+) C (-?[\d.]+) (-?[\d.]+), (-?[\d.]+) (-?[\d.]+), (-?[\d.]+) (-?[\d.]+)"[^>]*\/>/g,
      )) {
        const [
          ,
          fromId,
          toId,
          axis,
          startX,
          startY,
          control1X,
          control1Y,
          control2X,
          control2Y,
          endX,
          endY,
        ] = match
        const from = positions.get(fromId)
        const to = positions.get(toId)
        expect(from, `${diagram.path}: ${fromId}`).toBeDefined()
        expect(to, `${diagram.path}: ${toId}`).toBeDefined()
        if (!from || !to) continue

        const crossRow = rowByNode.get(fromId) !== rowByNode.get(toId)
        expect(axis, `${diagram.path}: ${fromId} → ${toId}`).toBe(
          crossRow ? 'vertical' : 'horizontal',
        )

        if (crossRow) {
          expect(
            Number(control1X),
            `${diagram.path}: ${fromId} vertical start tangent`,
          ).toBeCloseTo(Number(startX))
          expect(
            Number(control2X),
            `${diagram.path}: ${toId} vertical end tangent`,
          ).toBeCloseTo(Number(endX))
          expect(Number(startX), `${diagram.path}: ${fromId} start center`).toBeCloseTo(
            from.x + from.width / 2,
          )
          expect(Number(endX), `${diagram.path}: ${toId} end center`).toBeCloseTo(
            to.x + to.width / 2,
          )
          if (to.y > from.y) {
            expect(Number(startY), `${diagram.path}: ${fromId} bottom exit`).toBeCloseTo(
              from.y + from.height + 2,
            )
            expect(Number(endY), `${diagram.path}: ${toId} top entry`).toBeCloseTo(
              to.y - 7,
            )
          } else {
            expect(Number(startY), `${diagram.path}: ${fromId} top exit`).toBeCloseTo(
              from.y - 2,
            )
            expect(Number(endY), `${diagram.path}: ${toId} bottom entry`).toBeCloseTo(
              to.y + to.height + 7,
            )
          }
        } else {
          expect(
            Number(control1Y),
            `${diagram.path}: ${fromId} horizontal start tangent`,
          ).toBeCloseTo(Number(startY))
          expect(
            Number(control2Y),
            `${diagram.path}: ${toId} horizontal end tangent`,
          ).toBeCloseTo(Number(endY))
          expect(Number(startY), `${diagram.path}: ${fromId} side exit`).toBeCloseTo(
            from.y + from.height / 2,
          )
          expect(Number(endY), `${diagram.path}: ${toId} side entry`).toBeCloseTo(
            to.y + to.height / 2,
          )
        }
      }

      const cards = [...positions.values()]
      const labels = [...svg.matchAll(
        /<rect class="edge-label-paper" x="([\d.]+)" y="([\d.]+)" width="([\d.]+)" height="([\d.]+)"/g,
      )].map((match) => ({
        height: Number(match[4]),
        width: Number(match[3]),
        x: Number(match[1]),
        y: Number(match[2]),
      }))

      for (const [labelIndex, label] of labels.entries()) {
        for (const card of cards) {
          expect(
            intersects(label, card),
            `${diagram.path}: edge label ${labelIndex + 1} intersects a node card`,
          ).toBe(false)
        }
        for (const other of labels.slice(labelIndex + 1)) {
          expect(
            intersects(label, other),
            `${diagram.path}: edge labels overlap`,
          ).toBe(false)
        }
      }

      for (const match of svg.matchAll(
        /<g class="edge" data-edge-label="[^"]+">[\s\S]*?<path class="edge-path"[^>]*data-edge-axis="([^"]+)" d="M (-?[\d.]+) (-?[\d.]+) C (-?[\d.]+) (-?[\d.]+), (-?[\d.]+) (-?[\d.]+), (-?[\d.]+) (-?[\d.]+)"[^>]*\/>[\s\S]*?<rect class="edge-label-paper" x="(-?[\d.]+)" y="(-?[\d.]+)" width="([\d.]+)" height="([\d.]+)"/g,
      )) {
        const [
          ,
          axis,
          startX,
          startY,
          control1X,
          control1Y,
          control2X,
          control2Y,
          endX,
          endY,
          paperX,
          paperY,
          paperWidth,
          paperHeight,
        ] = match
        const pathXs = [startX, control1X, control2X, endX].map(Number)
        const pathYs = [startY, control1Y, control2Y, endY].map(Number)
        const paper = {
          bottom: Number(paperY) + Number(paperHeight),
          left: Number(paperX),
          right: Number(paperX) + Number(paperWidth),
          top: Number(paperY),
        }

        if (axis === 'vertical') {
          expect(
            paper.left >= Math.max(...pathXs) + 8 ||
              paper.right <= Math.min(...pathXs) - 8,
            `${diagram.path}: vertical label clears its arrow spine`,
          ).toBe(true)
        } else {
          expect(
            paper.bottom <= Math.min(...pathYs) - 8 ||
              paper.top >= Math.max(...pathYs) + 8,
            `${diagram.path}: horizontal label clears its arrow path`,
          ).toBe(true)
        }
      }
    }
  })

  it('marks every visibly shortened evidence excerpt with an ellipsis', async () => {
    const { hydrateDiagramDefinitions } = await import(
      '../../tools/blog/visual-system/diagram-data'
    )
    const { renderDiagramSvg, wrapDiagramText } = await import(
      '../../tools/blog/visual-system/diagram-template'
    )

    for (const diagram of await hydrateDiagramDefinitions()) {
      if (!diagram.evidenceExcerpt) continue

      const excerpt = diagram.evidenceExcerpt
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .join(' · ')
      const wrapped = wrapDiagramText(excerpt, 68)
      if (wrapped.length <= 2) continue

      const svg = renderDiagramSvg(diagram)
      expect(svg, diagram.path).toContain('data-evidence-truncated="true"')
      const evidenceLines = [
        ...svg.matchAll(/<text class="evidence-line"[^>]*>([^<]*)<\/text>/g),
      ].map((match) => match[1])
      expect(evidenceLines.at(-1), diagram.path).toMatch(/…$/)
    }
  })

  it('renders every output before the first write and reports exact deterministic stdout', async () => {
    const { diagramDefinitions } = await import(
      '../../tools/blog/visual-system/diagram-data'
    )
    const { generateFigures } = await import('../../tools/blog/generate-figures')
    const outputRoot = await mkdtemp(path.join(os.tmpdir(), 'field-journal-diagrams-'))

    try {
      const writes: string[] = []
      const invalidDefinitions = [
        ...diagramDefinitions.slice(0, -1),
        {
          ...diagramDefinitions.at(-1)!,
          edges: [{ from: 'missing-from', to: 'missing-to' }],
        },
      ]

      await expect(
        generateFigures({
          definitions: invalidDefinitions,
          logger: () => undefined,
          outputRoot,
          writeOutput: async (outputPath) => {
            writes.push(outputPath)
          },
        }),
      ).rejects.toThrow(/unknown edge endpoint/i)
      expect(writes).toEqual([])

      const logs: string[] = []
      const first = await generateFigures({
        logger: (line) => logs.push(line),
        outputRoot,
      })
      const second = await generateFigures({
        logger: () => undefined,
        outputRoot,
      })

      expect(first.map(({ path: figurePath, svg }) => [figurePath, svg])).toEqual(
        second.map(({ path: figurePath, svg }) => [figurePath, svg]),
      )
      expect(logs).toHaveLength(28)
      expect(logs.slice(0, -1)).toEqual(
        first.map(
          ({ bytes, path: figurePath }) =>
            `Generated ${figurePath} (${bytes} bytes).`,
        ),
      )
      expect(logs.at(-1)).toBe(
        'Generated 27 deterministic Field Journal blog figures.',
      )
    } finally {
      await rm(outputRoot, { force: true, recursive: true })
    }
  })
})

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

  it('preserves source-anchor-backed diff evidence for diagram hydration', async () => {
    const entry = blogVisualCatalog.find(
      (candidate) => candidate.slug === 'text-anchors-vs-ast',
    )
    expect(entry).toBeDefined()
    if (!entry) return

    const artifact = entry.secondary
    expect(artifact.kind).toBe('diff')
    if (artifact.kind !== 'diff') return

    const resolved = await resolveArtifact(artifact)

    expect(resolved.provenance).toBe(artifact.path)
    expect(resolved.evidence).toMatch(/^Source anchor:\n[^\n]+/)
    expect(resolved.evidence).toContain(
      `\n\nBefore:\n${artifact.before.join('\n')}\n\nAfter:\n${artifact.after.join('\n')}`,
    )
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

  it('uses structural source evidence instead of fictional testimonial claims', async () => {
    const socialProof = blogVisualCatalog.find(
      (entry) => entry.slug === 'social-proof-sections',
    )

    expect(socialProof?.primary).toMatchObject({
      anchor: "name: 'testimonials'",
      kind: 'source',
      label: 'Testimonials array contract',
      path: 'payload-components/source/blocks/TestimonialsGrid/config.ts',
      take: 10,
    })
    expect(socialProof?.secondary).toMatchObject({
      kind: 'sequence',
      label: 'Registry structure choices',
      items: [
        'logo-cloud-grid',
        'testimonials-grid',
        'testimonials-rating',
        'testimonials-quote',
      ],
    })

    const { html } = await renderCatalogCover('social-proof-sections')
    expect(html).not.toMatch(
      /\b(?:Acme|What our customers say|Loved by teams|Henry Lee|Isabella Garcia|Liam Brown)\b/i,
    )
  })

  it('keeps explicitly fictional hero demo claims out of every published cover', async () => {
    const landing = blogVisualCatalog.find(
      (entry) => entry.slug === 'build-first-payload-v3-landing-page',
    )
    const choosingHero = blogVisualCatalog.find(
      (entry) => entry.slug === 'choosing-payload-hero',
    )
    const demoTwins = blogVisualCatalog.find((entry) => entry.slug === 'demo-twins')

    expect(landing?.primary).toMatchObject({
      kind: 'registry-item',
      label: 'Hero Basic registry files',
      name: 'hero-basic',
    })
    expect(choosingHero?.primary).toMatchObject({
      anchor: "name: 'description'",
      kind: 'source',
      label: 'Hero description and CTA constraints',
      path: 'payload-components/source/blocks/shared/heroFields.ts',
      take: 11,
    })
    expect(choosingHero?.secondary).toMatchObject({
      items: ['message', 'media', 'action', 'editor limits'],
      kind: 'sequence',
      label: 'Article hero-selection checklist',
    })
    expect(demoTwins?.secondary).toMatchObject({
      items: ['aria-hidden roots', 'no links', 'no buttons', 'no headings'],
      kind: 'sequence',
      label: 'Presentational twin guard',
    })

    expect(await getCoverAlt('build-first-payload-v3-landing-page')).toBe(
      'Hero Basic registry files beside a fail-fast shell loop that installs the hero, logo cloud, feature, FAQ, and call-to-action blocks.',
    )
    expect(await getCoverAlt('choosing-payload-hero')).toBe(
      "Hero description and CTA field constraints beside the article's message, media, action, and editor-workflow checklist.",
    )
    expect(await getCoverAlt('demo-twins')).toBe(
      'Class-name fidelity assertion beside the aria-hidden, no-links, no-buttons, and no-headings guard for presentational demo twins.',
    )

    for (const entry of blogVisualCatalog) {
      const { html } = await renderCatalogCover(entry.slug)
      expect(html, entry.slug).not.toMatch(
        /Acme Cloud|Ship customer dashboards in days, not quarters|Acme gives product teams/i,
      )
    }
  })

  it('names all seven contribution surfaces shown by the source excerpt', async () => {
    const contribution = blogVisualCatalog.find(
      (entry) => entry.slug === 'contribute-payload-component',
    )

    expect(contribution?.thesis).toBe('A component ships as one connected bundle.')
    expect(contribution?.secondary).toMatchObject({
      items: [
        'source',
        'manifest',
        'registry',
        'demo twin',
        'catalog + ledgers',
        'docs',
        'tests',
      ],
      kind: 'sequence',
      label: 'Seven contribution surfaces',
    })
    expect(await getCoverAlt('contribute-payload-component')).toBe(
      'Add-a-component workflow beside seven required surfaces: source, manifest, registry, demo twin, catalog and ledgers, docs, and installer tests.',
    )
  })

  it('frames the registry comparison check within the broader build pipeline', async () => {
    const reproducibility = blogVisualCatalog.find(
      (entry) => entry.slug === 'reproducible-shadcn-registry',
    )

    expect(reproducibility?.primary).toMatchObject({
      anchor: 'assertEqual(publicRegistry, sourceRegistry',
      kind: 'source',
      label: 'Generated registry comparison check',
      take: 3,
    })
    expect(reproducibility?.secondary).toMatchObject({
      items: ['checkout', 'build', 'validate', 'compare'],
      kind: 'sequence',
      label: 'Broader registry pipeline',
    })
    expect(await getCoverAlt('reproducible-shadcn-registry')).toBe(
      'Generated registry comparison check shown within the broader checkout, build, validation, and comparison pipeline.',
    )
  })

  it('labels answer-panel and reduced-motion checks as guidance around the accordion primitive', async () => {
    const faq = blogVisualCatalog.find(
      (entry) => entry.slug === 'accessible-faq-blocks',
    )

    expect(faq?.secondary).toMatchObject({
      items: ['button', 'expanded state', 'answer panel', 'keyboard', 'reduced motion'],
      kind: 'sequence',
      label: 'Article accessibility checklist',
    })
    expect(await getCoverAlt('accessible-faq-blocks')).toBe(
      "FAQ Accordion component source beside the article's accessibility checklist for buttons, expanded state, answer panels, keyboard handling, and reduced motion.",
    )
  })

  it('keeps diagram-backed catalog sequences aligned with repository truth', () => {
    const expected = {
      'build-payload-blog-frontend': [
        'validated MDX entry',
        '/blog + article',
        'related posts',
        'RSS + OG + sitemap',
      ],
      'what-is-a-payload-cms-block': [
        'config → editor → stored data',
        'config → generated type → compile check',
        'stored data → renderer → React',
      ],
    } as const

    for (const [slug, items] of Object.entries(expected)) {
      const entry = blogVisualCatalog.find((candidate) => candidate.slug === slug)
      expect(entry?.secondary, slug).toMatchObject({
        items,
        kind: 'sequence',
      })
    }
  })

  it('uses the same homepage-stage vocabulary in cover text and alt copy', async () => {
    const homepage = blogVisualCatalog.find(
      (entry) => entry.slug === 'build-saas-homepage',
    )

    expect(homepage?.secondary).toMatchObject({
      items: ['Promise', 'proof', 'explanation', 'trust', 'action'],
      kind: 'sequence',
      label: 'Homepage blueprint',
    })
    expect(homepage?.prompt).toBe(
      "Map the smallest sequence that makes the page's argument clear.",
    )
    expect(await getCoverAlt('build-saas-homepage')).toBe(
      'Hero Basic, Logo Cloud Grid, Feature Bento, and Pricing Cards catalog results beside a homepage sequence from promise through proof, explanation, trust, and action.',
    )
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

  it('makes every multi-component install loop fail fast', () => {
    const landing = blogVisualCatalog.find(
      (entry) => entry.slug === 'build-first-payload-v3-landing-page',
    )
    const sharedFields = blogVisualCatalog.find(
      (entry) => entry.slug === 'shared-fields-across-component-families',
    )

    expect(landing?.secondary).toMatchObject({
      command:
        'for b in hero-basic logo-cloud-grid feature-bento faq-accordion call-to-action-centered; do npx payload-components add "$b" || exit 1; done',
      kind: 'command',
    })
    expect(sharedFields?.secondary).toMatchObject({
      command:
        'for b in feature-grid-basic feature-split feature-bento feature-steps; do npx payload-components add "$b" || exit 1; done',
      kind: 'command',
    })
  })

  it('keeps corroborating sequences concise enough to scan', () => {
    for (const entry of blogVisualCatalog) {
      for (const artifact of [entry.primary, entry.secondary]) {
        if (artifact.kind === 'sequence') {
          const maximumItems = entry.slug === 'contribute-payload-component' ? 7 : 5
          expect(artifact.items.length, `${entry.slug}: ${artifact.label}`).toBeLessThanOrEqual(
            maximumItems,
          )
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

  it('keeps every sequence cell readable without fracturing words', async () => {
    const browser = await chromium.launch({ headless: true })
    const violations: string[] = []

    try {
      const page = await browser.newPage({ viewport: { height: 630, width: 1200 } })

      for (const entry of blogVisualCatalog) {
        const { artifacts, html } = await renderCatalogCover(entry.slug)
        await page.setContent(html)
        await page.evaluate(async () => await document.fonts.ready)

        for (const role of ['primary', 'secondary'] as const) {
          const artifact = artifacts[role]
          if (artifact.kind !== 'sequence') continue

          const region = page.locator(
            `[data-cover-part="${role}"][data-artifact-kind="sequence"]`,
          )
          const matches = await region.count()

          if (matches !== 1) {
            violations.push(`${entry.slug}:${role} matched ${matches} sequence cards`)
            continue
          }

          const layout = await region.evaluate((element) => {
            const flow = element.querySelector<HTMLElement>('.sequence-flow')
            const cells = [...element.querySelectorAll<HTMLElement>('.sequence-item')]

            if (!flow) {
              return {
                cellOverflow: ['missing'],
                clippedCells: ['missing'],
                fontSize: 0,
                fracturedAtoms: ['missing'],
                renderedItems: [] as string[],
                scroll: 'missing',
              }
            }

            const flowRect = flow.getBoundingClientRect()
            const tolerance = 0.5
            const clippedCells: Array<number | 'missing'> = []
            const cellOverflow: Array<number | 'missing'> = []
            const fracturedAtoms: string[] = []
            const fontSizes: number[] = []
            const renderedItems: string[] = []

            cells.forEach((cell, cellIndex) => {
              const cellRect = cell.getBoundingClientRect()
              const strong = cell.querySelector<HTMLElement>('strong')
              const textNode = strong?.firstChild

              if (
                cellRect.left < flowRect.left - tolerance ||
                cellRect.right > flowRect.right + tolerance ||
                cellRect.top < flowRect.top - tolerance ||
                cellRect.bottom > flowRect.bottom + tolerance
              ) {
                clippedCells.push(cellIndex + 1)
              }
              if (
                cell.scrollWidth > cell.clientWidth ||
                cell.scrollHeight > cell.clientHeight
              ) {
                cellOverflow.push(cellIndex + 1)
              }
              if (!strong || !textNode || textNode.nodeType !== Node.TEXT_NODE) {
                fracturedAtoms.push(`${cellIndex + 1}:missing`)
                return
              }

              renderedItems.push(strong.textContent ?? '')
              fontSizes.push(Number.parseFloat(getComputedStyle(strong).fontSize))

              for (const atom of (strong.textContent ?? '').matchAll(/[\p{L}\p{N}]+/gu)) {
                const tops = new Set<number>()
                let offset = atom.index

                for (const character of atom[0]) {
                  const range = document.createRange()
                  const nextOffset = offset + character.length
                  range.setStart(textNode, offset)
                  range.setEnd(textNode, nextOffset)
                  const rect = range.getBoundingClientRect()
                  tops.add(Math.round(rect.top * 10) / 10)
                  offset = nextOffset
                }

                if (tops.size > 1) {
                  fracturedAtoms.push(`${cellIndex + 1}:${atom[0]}`)
                }
              }
            })

            return {
              cellOverflow,
              clippedCells,
              fontSize: fontSizes.length > 0 ? Math.min(...fontSizes) : 0,
              fracturedAtoms,
              renderedItems,
              scroll: `${flow.scrollWidth - flow.clientWidth}x${
                flow.scrollHeight - flow.clientHeight
              }`,
            }
          })
          const context = `${entry.slug}:${role}`

          if (layout.scroll !== '0x0') {
            violations.push(`${context} flow scroll ${layout.scroll}`)
          }
          if (layout.clippedCells.length > 0) {
            violations.push(
              `${context} clipped cells ${layout.clippedCells.join(',')}`,
            )
          }
          if (layout.cellOverflow.length > 0) {
            violations.push(
              `${context} overflowing cells ${layout.cellOverflow.join(',')}`,
            )
          }
          if (layout.fontSize < 12) {
            violations.push(`${context} font ${layout.fontSize}px`)
          }
          if (layout.fracturedAtoms.length > 0) {
            violations.push(
              `${context} fractured atoms ${layout.fracturedAtoms.join(',')}`,
            )
          }
          if (JSON.stringify(layout.renderedItems) !== JSON.stringify(artifact.items)) {
            violations.push(`${context} rendered text differs from sequence items`)
          }
        }
      }
    } finally {
      await browser.close()
    }

    expect(violations).toEqual([])
  })

  it('targets article-specific catalog evidence instead of the generic route intro', () => {
    const variants = blogVisualCatalog.find(
      (entry) => entry.slug === 'component-variants-without-prop-explosion',
    )
    const homepage = blogVisualCatalog.find((entry) => entry.slug === 'build-saas-homepage')

    expect(variants?.primary).toMatchObject({
      capture: {
        columns: 2,
        position: 'bottom',
        selectors: [
          '#feature-bento',
          '#feature-split',
          '#feature-steps',
          '#feature-grid-basic',
        ],
      },
      kind: 'route',
      label: 'Feature family catalog results',
      route: '/components?category=features',
    })
    expect(homepage?.primary).toMatchObject({
      capture: {
        columns: 2,
        position: 'bottom',
        selectors: ['#hero-basic', '#logo-cloud-grid', '#feature-bento', '#pricing-cards'],
      },
      kind: 'route',
      label: 'Homepage component inventory',
      route: '/components',
    })
  })

  it('composes explicitly selected route artifacts in selector order', async () => {
    const renderModule = await import('../../tools/blog/render-covers')
    const captureRouteRegion = Reflect.get(renderModule, 'captureRouteRegion')

    expect(captureRouteRegion).toBeTypeOf('function')
    if (typeof captureRouteRegion !== 'function') return

    const browser = await chromium.launch({ headless: true })

    try {
      const page = await browser.newPage({ viewport: { height: 600, width: 960 } })
      await page.setContent(`
        <div style="height: 900px; background: rgb(24, 24, 27)">Generic route intro</div>
        <article
          id="feature-bento"
          style="height: 240px; width: 480px; background: rgb(220, 38, 38)"
        >
          Feature Bento catalog result
        </article>
        <article
          id="pricing-cards"
          style="height: 240px; width: 480px; background: rgb(5, 150, 105)"
        >
          Pricing Cards catalog result
        </article>
        <article
          id="hero-basic"
          style="height: 240px; width: 480px; background: rgb(37, 99, 235)"
        >
          Hero Basic catalog result
        </article>
        <article
          id="logo-cloud-grid"
          style="height: 240px; width: 480px; background: rgb(234, 179, 8)"
        >
          Logo Cloud Grid catalog result
        </article>
      `)

      const png = (await captureRouteRegion(page, {
        capture: {
          columns: 2,
          position: 'bottom',
          selectors: [
            '#feature-bento',
            '#pricing-cards',
            '#hero-basic',
            '#logo-cloud-grid',
          ],
        },
        evidence: 'Local route fixture',
        kind: 'route',
        label: 'Feature Bento catalog result',
        provenance: '/components?q=feature',
        route: '/components?q=feature',
      })) as Buffer
      const [{ height, width }, pixels] = await Promise.all([
        sharp(png).metadata(),
        sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
      ])
      const pixelAt = (x: number, y: number) => {
        const offset = (y * pixels.info.width + x) * pixels.info.channels
        return [...pixels.data.subarray(offset, offset + 3)]
      }

      expect({ height, width }).toEqual({ height: 264, width: 960 })
      expect(pixelAt(240, 66)).toEqual([220, 38, 38])
      expect(pixelAt(720, 66)).toEqual([5, 150, 105])
      expect(pixelAt(240, 198)).toEqual([37, 99, 235])
      expect(pixelAt(720, 198)).toEqual([234, 179, 8])
    } finally {
      await browser.close()
    }
  })

  it('rejects duplicate route capture selectors', async () => {
    const renderModule = await import('../../tools/blog/render-covers')
    const captureRouteRegion = Reflect.get(renderModule, 'captureRouteRegion')

    expect(captureRouteRegion).toBeTypeOf('function')
    if (typeof captureRouteRegion !== 'function') return

    const browser = await chromium.launch({ headless: true })

    try {
      const page = await browser.newPage({ viewport: { height: 600, width: 960 } })
      await page.setContent('<article id="hero-basic">Hero Basic</article>')

      await expect(
        captureRouteRegion(page, {
          capture: {
            columns: 2,
            position: 'bottom',
            selectors: ['#hero-basic', '#hero-basic'],
          },
          evidence: 'Local route fixture',
          kind: 'route',
          label: 'Duplicate fixture',
          provenance: '/components',
          route: '/components',
        }),
      ).rejects.toThrow(/duplicate route capture selector.*#hero-basic/i)
    } finally {
      await browser.close()
    }
  })

  it('rejects missing route targets and invalid route-capture columns', async () => {
    const renderModule = await import('../../tools/blog/render-covers')
    const captureRouteRegion = Reflect.get(renderModule, 'captureRouteRegion')

    expect(captureRouteRegion).toBeTypeOf('function')
    if (typeof captureRouteRegion !== 'function') return

    const browser = await chromium.launch({ headless: true })

    try {
      const page = await browser.newPage({ viewport: { height: 600, width: 960 } })
      await page.setContent('<article id="hero-basic">Hero Basic</article>')
      const artifact = {
        evidence: 'Local route fixture',
        kind: 'route' as const,
        label: 'Validation fixture',
        provenance: '/components',
        route: '/components',
      }

      await expect(
        captureRouteRegion(page, {
          ...artifact,
          capture: {
            columns: 1,
            position: 'bottom',
            selectors: ['#missing-card'],
          },
        }),
      ).rejects.toThrow(/matched 0 elements.*expected exactly one/i)
      await expect(
        captureRouteRegion(page, {
          ...artifact,
          capture: {
            columns: 0,
            position: 'bottom',
            selectors: ['#hero-basic'],
          },
        }),
      ).rejects.toThrow(/at least one column/i)
    } finally {
      await browser.close()
    }
  })

  it('rejects unreadable source cards before production screenshots', async () => {
    const renderModule = await import('../../tools/blog/render-covers')
    const assertCodeArtifactCardsFit = Reflect.get(
      renderModule,
      'assertCodeArtifactCardsFit',
    )

    expect(assertCodeArtifactCardsFit).toBeTypeOf('function')
    if (typeof assertCodeArtifactCardsFit !== 'function') return

    const browser = await chromium.launch({ headless: true })

    try {
      const page = await browser.newPage({ viewport: { height: 630, width: 1200 } })
      await page.setContent(`
        <section data-cover-part="primary" data-artifact-kind="source">
          <div class="artifact-body" style="height: 20px; overflow: hidden">
            <div class="code-sheet">
              <span class="code-line"><code style="font-size: 8px">first</code></span>
              <span class="code-line"><code style="font-size: 8px">second</code></span>
            </div>
          </div>
        </section>
      `)

      await expect(
        assertCodeArtifactCardsFit(page, 'source-preflight-fixture', {
          primary: {
            anchor: 'first',
            evidence: 'first\nsecond',
            kind: 'source',
            label: 'Unreadable source',
            path: 'fixture.ts',
            provenance: 'fixture.ts:1-2',
            take: 2,
          },
          secondary: {
            evidence: 'done',
            items: ['done'],
            kind: 'sequence',
            label: 'Fixture sequence',
            provenance: 'tools/blog/visual-system/catalog.ts',
          },
        }),
      ).rejects.toThrow(/source-preflight-fixture:primary.*font 8px/s)
    } finally {
      await browser.close()
    }
  })

  it('rejects clipped diff cards before production screenshots', async () => {
    const renderModule = await import('../../tools/blog/render-covers')
    const assertCodeArtifactCardsFit = Reflect.get(
      renderModule,
      'assertCodeArtifactCardsFit',
    )

    expect(assertCodeArtifactCardsFit).toBeTypeOf('function')
    if (typeof assertCodeArtifactCardsFit !== 'function') return

    const browser = await chromium.launch({ headless: true })

    try {
      const page = await browser.newPage({ viewport: { height: 630, width: 1200 } })
      await page.setContent(`
        <section data-cover-part="secondary" data-artifact-kind="diff">
          <div class="artifact-body" style="height: 20px; overflow: hidden">
            <div class="code-sheet" style="height: 48px; width: 200px">
              <span class="code-line" style="display: block; height: 24px">
                <code style="font-size: 12px; line-height: 24px">before</code>
              </span>
              <span class="code-line" style="display: block; height: 24px">
                <code style="font-size: 12px; line-height: 24px">after</code>
              </span>
            </div>
          </div>
        </section>
      `)

      await expect(
        assertCodeArtifactCardsFit(page, 'diff-preflight-fixture', {
          primary: {
            evidence: 'done',
            items: ['done'],
            kind: 'sequence',
            label: 'Fixture sequence',
            provenance: 'tools/blog/visual-system/catalog.ts',
          },
          secondary: {
            after: ['after'],
            anchor: 'after',
            before: ['before'],
            evidence: 'before\nafter',
            kind: 'diff',
            label: 'Clipped diff',
            path: 'fixture.ts',
            provenance: 'fixture.ts',
          },
        }),
      ).rejects.toThrow(
        /diff-preflight-fixture:secondary \[diff\] body scroll 0x28.*diff-preflight-fixture:secondary \[diff\] clipped lines 1,2/s,
      )
    } finally {
      await browser.close()
    }
  })

  it('fits the complete text-anchor Before and After mapping inside its diff card', async () => {
    const { artifacts, html } = await renderCatalogCover('text-anchors-vs-ast')
    const artifact = artifacts.secondary

    expect(artifact.kind).toBe('diff')
    if (artifact.kind !== 'diff') return

    const browser = await chromium.launch({ headless: true })

    try {
      const page = await browser.newPage({ viewport: { height: 630, width: 1200 } })
      await page.setContent(html)
      await page.evaluate(async () => await document.fonts.ready)

      const region = page.locator(
        '[data-cover-part="secondary"][data-artifact-kind="diff"]',
      )
      expect(await region.count()).toBe(1)

      const layout = await region.evaluate((element) => {
        const body = element.querySelector<HTMLElement>('.artifact-body')
        const sheet = element.querySelector<HTMLElement>('.code-sheet, .diff-sheet')
        const lines = [
          ...element.querySelectorAll<HTMLElement>('.code-line, .diff-line'),
        ]

        if (!body || !sheet) {
          return {
            bodyScroll: 'missing',
            clipped: ['missing'] as Array<number | 'missing'>,
            fontSize: 0,
            renderedLines: [] as string[],
            sheetScroll: 'missing',
          }
        }

        const bodyRect = body.getBoundingClientRect()
        const sheetRect = sheet.getBoundingClientRect()
        const tolerance = 0.5
        const clipped = lines.flatMap((line, index) => {
          const rect = line.getBoundingClientRect()
          const insideBody =
            rect.left >= bodyRect.left - tolerance &&
            rect.right <= bodyRect.right + tolerance &&
            rect.top >= bodyRect.top - tolerance &&
            rect.bottom <= bodyRect.bottom + tolerance
          const insideSheet =
            rect.left >= sheetRect.left - tolerance &&
            rect.right <= sheetRect.right + tolerance &&
            rect.top >= sheetRect.top - tolerance &&
            rect.bottom <= sheetRect.bottom + tolerance

          return insideBody && insideSheet ? [] : [index + 1]
        })
        const fontSizes = lines.map((line) => {
          const code = line.querySelector('code')
          return code ? Number.parseFloat(getComputedStyle(code).fontSize) : 0
        })

        return {
          bodyScroll: `${body.scrollWidth - body.clientWidth}x${
            body.scrollHeight - body.clientHeight
          }`,
          clipped,
          fontSize: fontSizes.length > 0 ? Math.min(...fontSizes) : 0,
          renderedLines: lines.map((line) => line.querySelector('code')?.textContent ?? ''),
          sheetScroll: `${sheet.scrollWidth - sheet.clientWidth}x${
            sheet.scrollHeight - sheet.clientHeight
          }`,
        }
      })

      expect(layout.bodyScroll).toBe('0x0')
      expect(layout.sheetScroll).toBe('0x0')
      expect(layout.clipped).toEqual([])
      expect(layout.fontSize).toBeGreaterThanOrEqual(12)
      expect(layout.renderedLines).toEqual([...artifact.before, ...artifact.after])
      expect(await region.locator('.diff-panel--before').count()).toBe(1)
      expect(await region.locator('.diff-panel--after').count()).toBe(1)
    } finally {
      await browser.close()
    }
  })

  it('keeps every code-artifact line readable and fully inside its card', async () => {
    const browser = await chromium.launch({ headless: true })
    const violations: string[] = []

    try {
      const page = await browser.newPage({ viewport: { height: 630, width: 1200 } })

      for (const entry of blogVisualCatalog) {
        const { artifacts, html } = await renderCatalogCover(entry.slug)
        await page.setContent(html)
        await page.evaluate(async () => await document.fonts.ready)

        for (const role of ['primary', 'secondary'] as const) {
          const artifact = artifacts[role]
          if (
            artifact.kind !== 'source' &&
            artifact.kind !== 'registry-item' &&
            artifact.kind !== 'diff'
          ) {
            continue
          }

          const region = page.locator(
            `[data-cover-part="${role}"][data-artifact-kind="${artifact.kind}"]`,
          )
          const matches = await region.count()
          const context = `${entry.slug}:${role} [${artifact.kind}]`

          if (matches !== 1) {
            violations.push(`${context} matched ${matches} code-artifact cards`)
            continue
          }

          const layout = await region.evaluate((element) => {
            const body = element.querySelector<HTMLElement>('.artifact-body')
            const sheet = element.querySelector<HTMLElement>('.code-sheet, .diff-sheet')
            const lines = [
              ...element.querySelectorAll<HTMLElement>('.code-line, .diff-line'),
            ]

            if (!body || !sheet) {
              return {
                bodyScroll: 'missing',
                clipped: ['missing'],
                fontSize: 0,
                renderedLines: [] as string[],
                sheetScroll: 'missing',
              }
            }

            const bodyRect = body.getBoundingClientRect()
            const sheetRect = sheet.getBoundingClientRect()
            const tolerance = 0.5
            const clipped = lines.flatMap((line, index) => {
              const rect = line.getBoundingClientRect()
              const insideBody =
                rect.left >= bodyRect.left - tolerance &&
                rect.right <= bodyRect.right + tolerance &&
                rect.top >= bodyRect.top - tolerance &&
                rect.bottom <= bodyRect.bottom + tolerance
              const insideSheet =
                rect.left >= sheetRect.left - tolerance &&
                rect.right <= sheetRect.right + tolerance &&
                rect.top >= sheetRect.top - tolerance &&
                rect.bottom <= sheetRect.bottom + tolerance

              return insideBody && insideSheet ? [] : [index + 1]
            })
            const fontSizes = lines.map((line) => {
              const code = line.querySelector('code')
              return code ? Number.parseFloat(getComputedStyle(code).fontSize) : 0
            })

            return {
              bodyScroll: `${body.scrollWidth - body.clientWidth}x${
                body.scrollHeight - body.clientHeight
              }`,
              clipped,
              fontSize: Math.min(...fontSizes),
              renderedLines: lines.map(
                (line) => line.querySelector('code')?.textContent ?? '',
              ),
              sheetScroll: `${sheet.scrollWidth - sheet.clientWidth}x${
                sheet.scrollHeight - sheet.clientHeight
              }`,
            }
          })
          const expectedLines =
            artifact.kind === 'diff'
              ? [...artifact.before, ...artifact.after]
              : artifact.evidence.split(/\r?\n/).map((line) => line || ' ')

          if (layout.bodyScroll !== '0x0') {
            violations.push(`${context} body scroll ${layout.bodyScroll}`)
          }
          if (layout.sheetScroll !== '0x0') {
            violations.push(`${context} sheet scroll ${layout.sheetScroll}`)
          }
          if (layout.clipped.length > 0) {
            violations.push(
              `${context} clipped lines ${layout.clipped.join(',')}`,
            )
          }
          if (layout.fontSize < 12) {
            violations.push(`${context} font ${layout.fontSize}px`)
          }
          if (JSON.stringify(layout.renderedLines) !== JSON.stringify(expectedLines)) {
            violations.push(`${context} rendered text differs from evidence`)
          }
        }
      }
    } finally {
      await browser.close()
    }

    expect(violations).toEqual([])
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
