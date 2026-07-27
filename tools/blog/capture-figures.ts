import {
  lstat,
  mkdir,
  readFile,
  realpath,
  writeFile,
} from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { chromium, type Browser, type Locator, type Page } from '@playwright/test'
import sharp from 'sharp'

import { journalThemeCss } from './visual-system/theme'

const repoRoot = path.resolve(import.meta.dirname, '../..')
const defaultBaseURL = 'http://127.0.0.1:3100'
const fixtureNotice = 'REPOSITORY DEMO FIXTURE · STRUCTURE ONLY'
const previewSelector = 'main > div > [aria-hidden="true"]'
const canvas = { height: 900, width: 1600 } as const
const maxCaptureBytes = 358_400
const docsCodeCanvas = Object.freeze({
  height: 360,
  horizontalPadding: 28,
  maxRows: 10,
  rowHeight: 30,
  verticalPadding: 30,
  width: 1080,
})

export const webpEncodingOptions = Object.freeze({
  effort: 6,
  quality: 86,
})

type CaptureSeries =
  | 'component-design'
  | 'foundations'
  | 'open-source'
  | 'production-guides'
  | 'project-notes'
type CaptureLayout = 'duo' | 'quad' | 'triptych'
type CaptureViewport = 'desktop' | 'mobile'

type PanelBase = {
  label: string
  provenance: string
}

type PreviewPanel = PanelBase & {
  fixtureNotice: typeof fixtureNotice
  kind: 'preview'
  registryItem: string
  route: string
  selector: typeof previewSelector
  viewport: CaptureViewport
}

type CatalogCardPanel = PanelBase & {
  fixtureNotice: typeof fixtureNotice
  kind: 'catalog-card'
  registryItem: string
  route: string
  selector: string
}

type DocsCodePanel = PanelBase & {
  anchor: string
  file: 'Component.tsx' | 'config.ts'
  kind: 'docs-code'
  registryItem: string
  route: string
}

type DocsSectionPanel = PanelBase & {
  heading: 'Content model'
  kind: 'docs-section'
  registryItem: string
  route: string
}

type RouteViewportPanel = PanelBase & {
  kind: 'route-viewport'
  route: string
}

type SourcePanel = PanelBase & {
  anchor: string
  kind: 'source'
  sourcePath: string
  take: number
}

export type CapturePanel =
  | CatalogCardPanel
  | DocsCodePanel
  | DocsSectionPanel
  | PreviewPanel
  | RouteViewportPanel
  | SourcePanel

export type FigureCapture = {
  deck: string
  figure: number
  issue: number
  layout: CaptureLayout
  mode: 'see'
  outputPath: string
  panels: readonly CapturePanel[]
  series: CaptureSeries
  slug: string
  title: string
}

export type CapturedPanel = {
  dataUrl: string
  height: number
  width: number
}

export type EncodedCapture = {
  buffer: Buffer
  capture: FigureCapture
}

export type DocsCodeLine = {
  html: string
  sourceLine: number
  text: string
}

export type CaptureBatchOptions = {
  baseURL?: string
  logger?: (message: string) => void
  outputRoot?: string
  slugs?: readonly string[]
  writeOutput?: (outputPath: string, buffer: Buffer) => Promise<void>
}

const resolveLexicallyContainedPath = (
  root: string,
  candidate: string,
  context: string,
) => {
  if (path.isAbsolute(candidate)) {
    throw new Error(`${context} must be a relative path, received ${candidate}.`)
  }

  const resolvedRoot = path.resolve(root)
  const resolved = path.resolve(resolvedRoot, candidate)
  const relative = path.relative(resolvedRoot, resolved)
  if (
    relative.length === 0 ||
    relative === '..' ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative)
  ) {
    throw new Error(`${context} escapes its allowed root: ${candidate}.`)
  }
  return resolved
}

const isCanonicallyContained = (root: string, candidate: string) => {
  const relative = path.relative(root, candidate)
  return (
    relative.length > 0 &&
    relative !== '..' &&
    !relative.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relative)
  )
}

const canonicalizePotentialPath = async (
  absolutePath: string,
  context: string,
) => {
  let cursor = path.resolve(absolutePath)
  const missingSegments: string[] = []

  while (true) {
    try {
      await lstat(cursor)
      let canonicalAncestor: string
      try {
        canonicalAncestor = await realpath(cursor)
      } catch (error) {
        throw new Error(
          `${context} has an existing path segment that cannot be canonicalized: ${cursor}.`,
          { cause: error },
        )
      }
      return path.join(canonicalAncestor, ...missingSegments)
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        error.code === 'ENOENT'
      ) {
        const parent = path.dirname(cursor)
        if (parent === cursor) {
          throw new Error(
            `${context} has no existing ancestor: ${absolutePath}.`,
            { cause: error },
          )
        }
        missingSegments.unshift(path.basename(cursor))
        cursor = parent
        continue
      }
      throw error
    }
  }
}

export const resolveCaptureSourcePath = async (
  sourcePath: string,
  sourceRoot = repoRoot,
) => {
  const lexicalRoot = path.resolve(sourceRoot)
  const lexicalSource = resolveLexicallyContainedPath(
    lexicalRoot,
    sourcePath,
    'Capture source path',
  )
  let canonicalRoot: string
  let canonicalSource: string
  try {
    ;[canonicalRoot, canonicalSource] = await Promise.all([
      realpath(lexicalRoot),
      realpath(lexicalSource),
    ])
  } catch (error) {
    throw new Error(
      `Capture source path could not be canonicalized: ${sourcePath}.`,
      { cause: error },
    )
  }
  if (!isCanonicallyContained(canonicalRoot, canonicalSource)) {
    throw new Error(
      `Capture source path escapes its canonical root: ${sourcePath}.`,
    )
  }
  return canonicalSource
}

export const resolveCaptureOutputPath = async (
  outputRoot: string,
  outputPath: string,
) => {
  const lexicalRoot = path.resolve(outputRoot)
  const lexicalOutput = resolveLexicallyContainedPath(
    lexicalRoot,
    outputPath,
    'Capture output path',
  )
  const [canonicalRoot, canonicalOutput] = await Promise.all([
    canonicalizePotentialPath(lexicalRoot, 'Capture output root'),
    canonicalizePotentialPath(lexicalOutput, 'Capture output path'),
  ])
  if (!isCanonicallyContained(canonicalRoot, canonicalOutput)) {
    throw new Error(
      `Capture output path escapes its canonical root: ${outputPath}.`,
    )
  }
  return canonicalOutput
}

const preview = (
  label: string,
  registryItem: string,
  viewport: CaptureViewport = 'desktop',
): PreviewPanel => ({
  fixtureNotice,
  kind: 'preview',
  label,
  provenance: `/components/preview/${registryItem}`,
  registryItem,
  route: `/components/preview/${registryItem}`,
  selector: previewSelector,
  viewport,
})

const docsCode = (
  label: string,
  registryItem: string,
  anchor: string,
  file: DocsCodePanel['file'] = 'config.ts',
): DocsCodePanel => ({
  anchor,
  file,
  kind: 'docs-code',
  label,
  provenance: `/docs/components/${registryItem} · Code · ${file}`,
  registryItem,
  route: `/docs/components/${registryItem}`,
})

const docsSection = (label: string, registryItem: string): DocsSectionPanel => ({
  heading: 'Content model',
  kind: 'docs-section',
  label,
  provenance: `/docs/components/${registryItem} · Content model`,
  registryItem,
  route: `/docs/components/${registryItem}`,
})

export const captures = [
  {
    deck: 'Three structural fixtures, then the real testimonial field contract.',
    figure: 1,
    issue: 4,
    layout: 'quad',
    mode: 'see',
    outputPath:
      'public/blog/build-first-payload-v3-landing-page/figure-01-page-composition.webp',
    panels: [
      preview('Hero Basic · structure', 'hero-basic'),
      preview('Feature Bento · structure', 'feature-bento'),
      docsCode(
        'Testimonials Grid · config contract',
        'testimonials-grid',
        "name: 'testimonials'",
      ),
      preview(
        'Call To Action Centered · structure',
        'call-to-action-centered',
      ),
    ],
    series: 'foundations',
    slug: 'build-first-payload-v3-landing-page',
    title: 'Compose the argument from inspectable parts',
  },
  {
    deck: 'Responsive structure, shipped catalog context, and the field contract behind it.',
    figure: 1,
    issue: 17,
    layout: 'quad',
    mode: 'see',
    outputPath: 'public/blog/choosing-payload-hero/figure-01-hero-preview.webp',
    panels: [
      preview('Hero Basic · desktop structure', 'hero-basic'),
      preview('Hero Basic · mobile structure', 'hero-basic', 'mobile'),
      {
        fixtureNotice,
        kind: 'catalog-card',
        label: 'Catalog · shipped hero-basic item',
        provenance: '/components?q=hero-basic · #hero-basic',
        registryItem: 'hero-basic',
        route: '/components?q=hero-basic',
        selector: '#hero-basic',
      },
      docsCode(
        'Documentation · Payload config',
        'hero-basic',
        'export const HeroBasic',
      ),
    ],
    series: 'component-design',
    slug: 'choosing-payload-hero',
    title: 'Choose the smallest hero that carries the decision',
  },
  {
    deck: 'One capture width. Four different editorial rhythms.',
    figure: 1,
    issue: 18,
    layout: 'quad',
    mode: 'see',
    outputPath:
      'public/blog/editor-friendly-feature-sections/figure-01-feature-comparison.webp',
    panels: [
      preview('Feature Bento · uneven emphasis', 'feature-bento'),
      preview('Feature Split · paired reading', 'feature-split'),
      preview('Feature Steps · ordered sequence', 'feature-steps'),
      preview('Feature Grid Basic · peer cards', 'feature-grid-basic'),
    ],
    series: 'component-design',
    slug: 'editor-friendly-feature-sections',
    title: 'Compare structure before styling',
  },
  {
    deck: 'Real config evidence, with fictional prices kept out of the frame.',
    figure: 1,
    issue: 19,
    layout: 'quad',
    mode: 'see',
    outputPath:
      'public/blog/modeling-pricing-pages/figure-01-pricing-montage.webp',
    panels: [
      docsCode(
        'Pricing Cards · two-to-four plan contract',
        'pricing-cards',
        'minRows: 2',
      ),
      docsCode(
        'Pricing Cards Muted · two-to-four plan contract',
        'pricing-cards-muted',
        'minRows: 2',
      ),
      docsCode(
        'Pricing Split · exact two-plan contract',
        'pricing-split',
        'maxRows: 2',
      ),
      docsCode(
        'Pricing Enterprise · logo field contract',
        'pricing-enterprise',
        "name: 'logos'",
      ),
    ],
    series: 'component-design',
    slug: 'modeling-pricing-pages',
    title: 'Inspect pricing as a content model',
  },
  {
    deck: 'Field contracts without invented people, logos, ratings, or outcomes.',
    figure: 1,
    issue: 20,
    layout: 'quad',
    mode: 'see',
    outputPath:
      'public/blog/social-proof-sections/figure-01-social-proof-montage.webp',
    panels: [
      docsCode(
        'Logo Cloud Grid · editable logo records',
        'logo-cloud-grid',
        '...logoCloudFields',
      ),
      docsCode(
        'Testimonials Grid · attributed quote array',
        'testimonials-grid',
        "name: 'testimonials'",
      ),
      docsCode(
        'Testimonials Rating · bounded rating field',
        'testimonials-rating',
        "name: 'rating'",
      ),
      docsCode(
        'Testimonials Quote · featured quote contract',
        'testimonials-quote',
        '...testimonialItemFields',
      ),
    ],
    series: 'component-design',
    slug: 'social-proof-sections',
    title: 'Credibility begins with the contract',
  },
  {
    deck: 'Four source-backed jobs—not a fictional assembled product page.',
    figure: 2,
    issue: 21,
    layout: 'quad',
    mode: 'see',
    outputPath:
      'public/blog/build-saas-homepage/figure-02-component-montage.webp',
    panels: [
      docsSection('Promise · Hero Basic content model', 'hero-basic'),
      docsSection(
        'Proof slot · Logo Cloud Grid content model',
        'logo-cloud-grid',
      ),
      docsSection(
        'Explanation · Feature Bento content model',
        'feature-bento',
      ),
      docsSection(
        'Commitment · Pricing Cards content model',
        'pricing-cards',
      ),
    ],
    series: 'production-guides',
    slug: 'build-saas-homepage',
    title: 'A homepage argument starts with component contracts',
  },
  {
    deck: 'The committed editorial library as index and article projections.',
    figure: 2,
    issue: 22,
    layout: 'duo',
    mode: 'see',
    outputPath:
      'public/blog/build-payload-blog-frontend/figure-02-post-component-montage.webp',
    panels: [
      {
        kind: 'route-viewport',
        label: 'Blog index · /blog',
        provenance: '/blog · local production route',
        route: '/blog',
      },
      {
        kind: 'route-viewport',
        label: 'Article · Payload block primer',
        provenance:
          '/blog/what-is-a-payload-cms-block · local production route',
        route: '/blog/what-is-a-payload-cms-block',
      },
    ],
    series: 'production-guides',
    slug: 'build-payload-blog-frontend',
    title: 'One post contract, two real surfaces',
  },
  {
    deck: 'The real gallery, then three live concepts with distinct visual and content systems.',
    figure: 1,
    issue: 33,
    layout: 'quad',
    mode: 'see',
    outputPath:
      'public/blog/templates-are-here/figure-01-template-gallery.webp',
    panels: [
      {
        kind: 'route-viewport',
        label: 'Templates · all six concepts',
        provenance: '/templates · local production route',
        route: '/templates',
      },
      {
        kind: 'route-viewport',
        label: 'SaaS Launch · live home page',
        provenance: '/templates/saas-launch/preview · local production route',
        route: '/templates/saas-launch/preview',
      },
      {
        kind: 'route-viewport',
        label: 'Event Conference · live home page',
        provenance: '/templates/event-conference/preview · local production route',
        route: '/templates/event-conference/preview',
      },
      {
        kind: 'route-viewport',
        label: 'Portfolio Solo · live home page',
        provenance: '/templates/portfolio-solo/preview · local production route',
        route: '/templates/portfolio-solo/preview',
      },
    ],
    series: 'project-notes',
    slug: 'templates-are-here',
    title: 'Six concepts make the same registry feel different',
  },
  {
    deck: 'A site-only fixture, shipped source, and the test that keeps their tokens aligned.',
    figure: 2,
    issue: 27,
    layout: 'triptych',
    mode: 'see',
    outputPath: 'public/blog/demo-twins/figure-02-source-preview.webp',
    panels: [
      preview('Hero Basic · site-only demo twin', 'hero-basic'),
      docsCode(
        'Documentation · shipped Component.tsx',
        'hero-basic',
        'overflow-hidden',
        'Component.tsx',
      ),
      {
        anchor: 'const missing = literals.flatMap',
        kind: 'source',
        label: 'Integration test · class-token mirror',
        provenance: 'tests/int/demo-twins.int.spec.ts:78-85',
        sourcePath: 'tests/int/demo-twins.int.spec.ts',
        take: 8,
      },
    ],
    series: 'open-source',
    slug: 'demo-twins',
    title: 'The mirror is a testable repository contract',
  },
] as const satisfies readonly FigureCapture[]

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const seriesLabel = (series: CaptureSeries) =>
  series.replaceAll('-', ' ').toUpperCase()

const dataUrlPattern = /^data:image\/png;base64,[A-Za-z0-9+/]+=*$/

const panelMarkup = (
  panel: CapturePanel,
  image: CapturedPanel,
  index: number,
) => {
  if (!dataUrlPattern.test(image.dataUrl)) {
    throw new Error(`${panel.label} must use an inline PNG data URL.`)
  }

  const callout = String(index + 1).padStart(2, '0')
  const fixture = 'fixtureNotice' in panel
    ? `<aside data-fixture-notice>${escapeHtml(panel.fixtureNotice)}</aside>`
    : ''
  const mobile = panel.kind === 'preview' && panel.viewport === 'mobile'
    ? ' plate--mobile'
    : ''

  return `<section class="plate plate--${panel.kind}${mobile}" data-panel-kind="${panel.kind}">
    <header class="plate-label" data-callout="${callout}">
      <span>${callout}</span>
      <strong>${escapeHtml(panel.label)}</strong>
      <b>${escapeHtml(panel.kind.replaceAll('-', ' '))}</b>
    </header>
    <div class="artifact-window">
      <img
        alt=""
        aria-hidden="true"
        height="${image.height}"
        src="${image.dataUrl}"
        width="${image.width}"
      />
    </div>
    ${fixture}
    <footer>${escapeHtml(panel.provenance)}</footer>
  </section>`
}

type CaptureFontData = {
  bold: string
  mono: string
  regular: string
}

const fontFaceCss = (fonts?: CaptureFontData) => {
  if (!fonts) return ''
  for (const [label, value] of Object.entries(fonts)) {
    if (!/^[A-Za-z0-9+/]+=*$/.test(value)) {
      throw new Error(`Capture font ${label} is not valid base64.`)
    }
  }

  return `
    @font-face {
      font-family: 'Capture Sans';
      font-style: normal;
      font-weight: 400;
      src: url(data:font/ttf;base64,${fonts.regular}) format('truetype');
    }
    @font-face {
      font-family: 'Capture Sans';
      font-style: normal;
      font-weight: 700;
      src: url(data:font/ttf;base64,${fonts.bold}) format('truetype');
    }
    @font-face {
      font-family: 'Capture Mono';
      font-style: normal;
      font-weight: 400 700;
      src: url(data:font/ttf;base64,${fonts.mono}) format('truetype');
    }
  `
}

export function renderCaptureHtml(
  capture: FigureCapture,
  panelImages: readonly CapturedPanel[],
  fonts?: CaptureFontData,
) {
  if (panelImages.length !== capture.panels.length) {
    throw new Error(
      `${capture.slug} expected ${capture.panels.length} captured panels, received ${panelImages.length}.`,
    )
  }

  return `<!doctype html>
<html data-canvas-height="${canvas.height}" data-canvas-width="${canvas.width}">
  <head>
    <meta charset="utf-8" />
    <style>
      ${fontFaceCss(fonts)}
      ${journalThemeCss}

      html,
      body {
        height: ${canvas.height}px;
        margin: 0;
        overflow: hidden;
        width: ${canvas.width}px;
      }

      body {
        background: var(--journal-paper);
        color: var(--journal-graphite);
        display: grid;
        font-family: 'Capture Sans', ui-sans-serif, system-ui, sans-serif;
        gap: 14px;
        grid-template-rows: 96px minmax(0, 1fr) 42px;
        padding: 22px 34px;
        position: relative;
      }

      .masthead {
        align-items: center;
        border-bottom: 1px solid var(--journal-graphite);
        display: grid;
        gap: 24px;
        grid-template-columns: 205px minmax(0, 1fr) 185px;
        height: 96px;
        position: relative;
        z-index: 2;
      }

      .publication {
        border-left: 6px solid var(--journal-emerald);
        display: grid;
        gap: 5px;
        padding-left: 15px;
      }

      .publication strong,
      .publication span,
      .mode,
      .plate-label span,
      .plate-label b,
      .plate footer,
      [data-fixture-notice],
      .provenance {
        font-family: 'Capture Mono', ui-monospace, monospace;
        text-transform: uppercase;
      }

      .publication strong {
        font-size: 14px;
        letter-spacing: 0.1em;
      }

      .publication span {
        color: var(--journal-ink-muted);
        font-size: 10px;
        letter-spacing: 0.08em;
      }

      .heading {
        min-width: 0;
      }

      h1 {
        font-size: 32px;
        letter-spacing: -0.035em;
        line-height: 1.02;
        margin: 0 0 7px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .heading p {
        color: var(--journal-ink-muted);
        font-size: 14px;
        line-height: 1.35;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mode {
        align-items: center;
        border: 2px solid var(--journal-emerald-dark);
        color: var(--journal-emerald-dark);
        display: flex;
        font-size: 13px;
        font-weight: 700;
        justify-content: center;
        justify-self: end;
        letter-spacing: 0.15em;
        min-height: 44px;
        transform: rotate(-1.5deg);
        width: 154px;
      }

      .plates {
        display: grid;
        gap: 14px;
        min-height: 0;
        position: relative;
        z-index: 2;
      }

      .layout-quad {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-template-rows: repeat(2, minmax(0, 1fr));
      }

      .layout-duo {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-template-rows: minmax(0, 1fr);
      }

      .layout-triptych {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-template-rows: minmax(0, 0.92fr) minmax(0, 1.08fr);
      }

      .layout-triptych .plate:nth-child(3) {
        grid-column: 1 / -1;
      }

      .plate {
        background: var(--journal-white);
        border: 1px solid var(--journal-graphite);
        box-shadow: 4px 4px 0 var(--journal-zinc);
        display: grid;
        grid-template-rows: 41px minmax(0, 1fr) auto 24px;
        min-height: 0;
        overflow: hidden;
        position: relative;
      }

      .plate-label {
        align-items: center;
        border-bottom: 1px solid var(--journal-zinc);
        display: grid;
        gap: 10px;
        grid-template-columns: 32px minmax(0, 1fr) auto;
        padding: 0 12px;
      }

      .plate-label span {
        align-items: center;
        background: var(--journal-emerald);
        color: var(--journal-white);
        display: flex;
        font-size: 11px;
        height: 23px;
        justify-content: center;
        letter-spacing: 0.08em;
        width: 28px;
      }

      .plate-label strong {
        font-size: 14px;
        letter-spacing: -0.01em;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .plate-label b {
        color: var(--journal-ink-muted);
        font-size: 9px;
        letter-spacing: 0.08em;
      }

      .artifact-window {
        background: var(--journal-zinc-soft);
        min-height: 0;
        overflow: hidden;
        position: relative;
      }

      .artifact-window img {
        display: block;
        height: 100%;
        object-fit: cover;
        object-position: top center;
        width: 100%;
      }

      .plate--docs-code .artifact-window {
        background: var(--journal-graphite);
      }

      .plate--docs-code .artifact-window img {
        object-fit: contain;
        object-position: center;
      }

      .plate--docs-section .artifact-window img,
      .plate--mobile .artifact-window img,
      .plate--source .artifact-window img {
        object-fit: contain;
      }

      .artifact-window img[data-precomposed="true"] {
        object-fit: fill;
        object-position: center;
      }

      [data-fixture-notice] {
        background: var(--journal-graphite);
        color: var(--journal-white);
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.08em;
        line-height: 20px;
        min-height: 20px;
        padding: 0 10px;
      }

      .plate footer {
        align-items: center;
        border-top: 1px solid var(--journal-zinc-soft);
        color: var(--journal-ink-muted);
        display: flex;
        font-size: 9px;
        letter-spacing: 0.04em;
        min-width: 0;
        overflow: hidden;
        padding: 0 10px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .provenance {
        align-items: center;
        border-top: 1px solid var(--journal-graphite);
        color: var(--journal-ink-muted);
        display: grid;
        font-size: 10px;
        gap: 20px;
        grid-template-columns: 1fr auto;
        letter-spacing: 0.07em;
        min-width: 0;
        position: relative;
        z-index: 2;
      }

      .provenance span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .provenance strong {
        color: var(--journal-emerald-dark);
      }

      .field-grid {
        background-image:
          linear-gradient(var(--journal-zinc-soft) 1px, transparent 1px),
          linear-gradient(90deg, var(--journal-zinc-soft) 1px, transparent 1px);
        background-size: 24px 24px;
        inset: 0;
        opacity: 0.34;
        pointer-events: none;
        position: absolute;
      }
    </style>
  </head>
  <body data-mode="${capture.mode}" data-series="${capture.series}">
    <div class="field-grid" aria-hidden="true"></div>
    <i class="crop-mark crop-mark--tl" aria-hidden="true"></i>
    <i class="crop-mark crop-mark--tr" aria-hidden="true"></i>
    <i class="crop-mark crop-mark--br" aria-hidden="true"></i>
    <i class="crop-mark crop-mark--bl" aria-hidden="true"></i>
    <i class="registration-mark" style="right: 18px; top: 50%" aria-hidden="true"></i>

    <header class="masthead">
      <div class="publication">
        <strong>Payload Components</strong>
        <span>${escapeHtml(seriesLabel(capture.series))} · ISSUE ${String(capture.issue).padStart(2, '0')}</span>
      </div>
      <div class="heading">
        <h1>${escapeHtml(capture.title)}</h1>
        <p>${escapeHtml(capture.deck)}</p>
      </div>
      <div class="mode">SEE / FIELD NOTE</div>
    </header>

    <main class="plates layout-${capture.layout}">
      ${capture.panels
        .map((panel, index) => panelMarkup(panel, panelImages[index], index))
        .join('')}
    </main>

    <footer class="provenance" data-journal-part="provenance">
      <span>SOURCE / LOCAL PRODUCTION ROUTES + COMMITTED REPOSITORY FILES</span>
      <strong data-journal-part="folio">ISSUE ${String(capture.issue).padStart(2, '0')} / ${Math.max(32, capture.issue)} · FIGURE ${String(capture.figure).padStart(2, '0')} · ${escapeHtml(capture.outputPath.replace(/^public\//, '/'))}</strong>
    </footer>
  </body>
</html>`
}

export function isAllowedCaptureRequest(requestURL: string, baseURL: string) {
  if (
    requestURL === 'about:blank' ||
    requestURL.startsWith('data:') ||
    requestURL.startsWith('blob:')
  ) {
    return true
  }

  try {
    return new URL(requestURL).origin === new URL(baseURL).origin
  } catch {
    return false
  }
}

const normalizeBaseURL = (value: string) => {
  const url = new URL(value)
  if (
    url.protocol !== 'http:' ||
    !['127.0.0.1', '::1', 'localhost'].includes(url.hostname)
  ) {
    throw new Error(`Blog captures require a localhost HTTP origin, received ${value}.`)
  }
  url.pathname = '/'
  url.search = ''
  url.hash = ''
  return url.toString().replace(/\/$/, '')
}

export const waitForTargetAssets = async (page: Page, selector?: string) => {
  await page.evaluate(
    async (targetSelector) => {
      await document.fonts.ready
      const root = targetSelector
        ? document.querySelector(targetSelector)
        : document.documentElement
      if (!root) throw new Error(`Capture target ${targetSelector} disappeared.`)

      const images = [...root.querySelectorAll('img')].filter((image) => {
        const rect = image.getBoundingClientRect()
        const style = getComputedStyle(image)
        return (
          rect.width > 0 &&
          rect.height > 0 &&
          rect.bottom >= 0 &&
          rect.right >= 0 &&
          rect.top <= window.innerHeight &&
          rect.left <= window.innerWidth &&
          style.display !== 'none' &&
          style.visibility !== 'hidden'
        )
      })
      await Promise.all(
        images.map(async (image) => {
          const description =
            image.alt.trim() ||
            image.currentSrc ||
            image.getAttribute('src') ||
            'unnamed visible image'

          if (!image.complete) {
            await new Promise<void>((resolve, reject) => {
              image.addEventListener('load', () => resolve(), { once: true })
              image.addEventListener(
                'error',
                () =>
                  reject(
                    new Error(`Visible image failed to load: ${description}`),
                  ),
                { once: true },
              )
            })
          }

          if (image.naturalWidth === 0 || image.naturalHeight === 0) {
            throw new Error(
              `Visible image has no decoded pixels: ${description}`,
            )
          }

          try {
            await image.decode()
          } catch (error) {
            throw new Error(
              `Visible image failed to decode: ${description}`,
              { cause: error },
            )
          }
        }),
      )
    },
    selector,
  )
}

const prepareRoutePage = async (
  browser: Browser,
  baseURL: string,
  route: string,
  viewport: { height: number; width: number },
  deviceScaleFactor = 1,
) => {
  const page = await browser.newPage({
    deviceScaleFactor,
    reducedMotion: 'reduce',
    viewport,
  })
  await page.route('**/*', async (intercepted) => {
    if (isAllowedCaptureRequest(intercepted.request().url(), baseURL)) {
      await intercepted.continue()
      return
    }
    await intercepted.abort('blockedbyclient')
  })
  await page.goto(new URL(route, baseURL).toString(), {
    waitUntil: 'domcontentloaded',
  })
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-delay: 0s !important;
        animation-duration: 0s !important;
        caret-color: transparent !important;
        scroll-behavior: auto !important;
        transition-delay: 0s !important;
        transition-duration: 0s !important;
      }
    `,
  })
  await waitForTargetAssets(page)
  return page
}

export const waitForExactCaptureTarget = async (
  page: Page,
  selector: string,
  context: string,
) => {
  const locator = page.locator(selector)
  return waitForUniqueLocator(locator, `${context} selector ${selector}`)
}

const waitForUniqueLocator = async (locator: Locator, context: string) => {
  await locator.first().waitFor({ state: 'attached', timeout: 15_000 }).catch(() => undefined)
  const count = await locator.count()
  if (count !== 1) {
    throw new Error(`${context} matched ${count} elements; expected exactly one.`)
  }
  await locator.waitFor({ state: 'visible' })
  return locator
}

const capturePreview = async (
  browser: Browser,
  baseURL: string,
  panel: PreviewPanel,
) => {
  const viewport = panel.viewport === 'mobile'
    ? { height: 760, width: 390 }
    : { height: 680, width: 1100 }
  const page = await prepareRoutePage(browser, baseURL, panel.route, viewport)

  try {
    const target = await waitForExactCaptureTarget(page, panel.selector, panel.label)
    await target.scrollIntoViewIfNeeded()
    await waitForTargetAssets(page, panel.selector)
    return await target.screenshot({ animations: 'disabled', type: 'png' })
  } finally {
    await page.close()
  }
}

const captureCatalogCard = async (
  browser: Browser,
  baseURL: string,
  panel: CatalogCardPanel,
) => {
  const page = await prepareRoutePage(browser, baseURL, panel.route, {
    height: 820,
    width: 1180,
  }, getCaptureDeviceScaleFactor(panel))

  try {
    const target = await waitForExactCaptureTarget(page, panel.selector, panel.label)
    await target.scrollIntoViewIfNeeded()
    await waitForTargetAssets(page, panel.selector)
    return await target.screenshot({ animations: 'disabled', type: 'png' })
  } finally {
    await page.close()
  }
}

export const clipCaptureAroundTarget = async (
  page: Page,
  target: ReturnType<Page['locator']>,
  {
    boundary,
    contentEnd,
    contentStart,
    height,
    horizontalPadding = 10,
    verticalPadding = 58,
  }: {
    boundary?: Locator
    contentEnd?: Locator
    contentStart?: Locator
    height: number
    horizontalPadding?: number
    verticalPadding?: number
  },
) => {
  await target.scrollIntoViewIfNeeded()
  const box = await target.boundingBox()
  const boundaryBox = boundary ? await boundary.boundingBox() : null
  const contentStartBox = contentStart ? await contentStart.boundingBox() : null
  const contentEndBox = contentEnd ? await contentEnd.boundingBox() : null
  const viewport = page.viewportSize()
  if (!box || !viewport) throw new Error('Capture target has no measurable bounds.')
  if (boundary && !boundaryBox) {
    throw new Error('Capture boundary has no measurable bounds.')
  }
  if ((contentStart && !contentStartBox) || (contentEnd && !contentEndBox)) {
    throw new Error('Capture content bounds have no measurable bounds.')
  }

  if (boundary && boundaryBox) {
    const boundaryPng = await boundary.screenshot({
      animations: 'disabled',
      type: 'png',
    })
    const metadata = await sharp(boundaryPng).metadata()
    if (!metadata.width || !metadata.height) {
      throw new Error('Capture boundary screenshot has no measurable dimensions.')
    }

    let contentTop = Math.max(
      0,
      (contentStartBox?.y ?? boundaryBox.y) - boundaryBox.y,
    )
    let contentBottom = Math.min(
      boundaryBox.height,
      (contentEndBox
        ? contentEndBox.y + contentEndBox.height
        : boundaryBox.y + boundaryBox.height) - boundaryBox.y,
    )
    const raw = await sharp(boundaryPng)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
    const darkRows: number[] = []
    for (let row = 0; row < raw.info.height; row += 1) {
      let dark = 0
      let sampled = 0
      for (let column = 0; column < raw.info.width; column += 4) {
        const offset = (row * raw.info.width + column) * raw.info.channels
        const red = raw.data[offset]
        const green = raw.data[offset + 1]
        const blue = raw.data[offset + 2]
        if (red < 70 && green < 70 && blue < 80) dark += 1
        sampled += 1
      }
      if (sampled > 0 && dark / sampled >= 0.35) darkRows.push(row)
    }
    if (darkRows.length > 0) {
      const scaleY = metadata.height / boundaryBox.height
      const darkTop = darkRows[0] / scaleY
      const darkBottom = (darkRows.at(-1)! + 1) / scaleY
      contentTop = Math.max(contentTop, darkTop)
      contentBottom = Math.min(contentBottom, darkBottom)
    }
    const contentHeight = Math.max(1, contentBottom - contentTop)
    const cssHeight = Math.min(height, contentHeight)
    const cssWidth = Math.min(
      boundaryBox.width,
      Math.max(1, box.width + horizontalPadding * 2),
    )
    const relativeTop = box.y - boundaryBox.y - verticalPadding
    const relativeLeft = box.x - boundaryBox.x - horizontalPadding
    const cssTop = Math.min(
      Math.max(contentTop, relativeTop),
      Math.max(contentTop, contentBottom - cssHeight),
    )
    const cssLeft = Math.min(
      Math.max(0, relativeLeft),
      Math.max(0, boundaryBox.width - cssWidth),
    )
    const scaleX = metadata.width / boundaryBox.width
    const scaleY = metadata.height / boundaryBox.height
    const extract = {
      height: Math.max(
        1,
        Math.min(metadata.height, Math.round(cssHeight * scaleY)),
      ),
      left: Math.max(0, Math.round(cssLeft * scaleX)),
      top: Math.max(0, Math.round(cssTop * scaleY)),
      width: Math.max(
        1,
        Math.min(metadata.width, Math.round(cssWidth * scaleX)),
      ),
    }
    extract.width = Math.min(extract.width, metadata.width - extract.left)
    extract.height = Math.min(extract.height, metadata.height - extract.top)

    return sharp(boundaryPng).extract(extract).png().toBuffer()
  }

  const x = Math.max(0, box.x - horizontalPadding)
  const y = Math.max(0, box.y - verticalPadding)
  const width = Math.min(viewport.width - x, Math.max(1, box.width + horizontalPadding * 2))
  const clippedHeight = Math.min(viewport.height - y, height)

  if (width <= 0 || clippedHeight <= 0) {
    throw new Error('Capture target resolved outside the visible viewport.')
  }

  return page.screenshot({
    animations: 'disabled',
    clip: { height: clippedHeight, width, x, y },
    type: 'png',
  })
}

export function selectDocsCodeLineWindow(
  lines: readonly DocsCodeLine[],
  anchorIndex: number,
  maxRows = docsCodeCanvas.maxRows,
) {
  if (!Number.isInteger(anchorIndex) || anchorIndex < 0 || anchorIndex >= lines.length) {
    throw new Error(
      `Docs-code anchor index ${anchorIndex} is outside ${lines.length} source lines.`,
    )
  }
  if (!Number.isInteger(maxRows) || maxRows < 1) {
    throw new Error(`Docs-code maxRows must be a positive integer, received ${maxRows}.`)
  }

  const rowCount = Math.min(maxRows, lines.length)
  let start = Math.max(
    0,
    anchorIndex - Math.floor((rowCount - 1) / 2),
  )
  const end = Math.min(lines.length, start + rowCount)
  start = Math.max(0, end - rowCount)
  return lines.slice(start, end)
}

const assertCaptureFontBase64 = (value: string, label: string) => {
  if (!/^[A-Za-z0-9+/]+=*$/.test(value)) {
    throw new Error(`${label} is not valid base64.`)
  }
}

export function renderDocsCodeExcerptHtml(
  lines: readonly DocsCodeLine[],
  anchorIndex: number,
  monoFontBase64: string,
) {
  assertCaptureFontBase64(monoFontBase64, 'Docs-code capture font')
  const selected = selectDocsCodeLineWindow(lines, anchorIndex)
  const continuesAfterExcerpt = selected.at(-1) !== lines.at(-1)
  const rows = selected
    .map(
      (line, index) => `<span
        class="code-row"
        data-code-row
        data-source-line="${line.sourceLine}"
      >
        <i aria-hidden="true">${String(line.sourceLine).padStart(3, '0')}</i>
        <span
          data-code-source
          data-excerpt-continues="${continuesAfterExcerpt && index === selected.length - 1}"
        >${line.html || '&nbsp;'}</span>
      </span>`,
    )
    .join('')

  return `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          @font-face {
            font-family: 'Capture Mono';
            font-style: normal;
            font-weight: 400 700;
            src: url(data:font/ttf;base64,${monoFontBase64}) format('truetype');
          }

          * { box-sizing: border-box; }
          html,
          body {
            background: #18181b;
            height: ${docsCodeCanvas.height}px;
            margin: 0;
            overflow: hidden;
            width: ${docsCodeCanvas.width}px;
          }

          [data-code-canvas] {
            background: #18181b;
            color: #ffffff;
            display: block;
            font-family: 'Capture Mono';
            font-size: 15px;
            font-variant-ligatures: none;
            height: ${docsCodeCanvas.height}px;
            overflow: hidden;
            padding: ${docsCodeCanvas.verticalPadding}px ${docsCodeCanvas.horizontalPadding}px;
            width: ${docsCodeCanvas.width}px;
          }

          .code-row {
            display: grid;
            grid-template-columns: 48px minmax(0, 1fr);
            height: ${docsCodeCanvas.rowHeight}px;
            line-height: ${docsCodeCanvas.rowHeight}px;
            min-height: ${docsCodeCanvas.rowHeight}px;
            overflow: hidden;
          }

          .code-row i {
            color: #52525b;
            font-style: normal;
            user-select: none;
          }

          [data-code-source] {
            display: block;
            min-width: 0;
            overflow: hidden;
            position: relative;
            text-overflow: ellipsis;
            white-space: pre;
          }

          [data-code-source] [data-overflow-marker] {
            background-image: linear-gradient(90deg, transparent, #18181b 38%);
            color: #059669;
            display: block;
            font-size: 18px;
            font-style: normal;
            font-weight: 700;
            height: ${docsCodeCanvas.rowHeight}px;
            padding-left: 20px;
            pointer-events: none;
            position: absolute;
            right: 0;
            text-align: right;
            top: 0;
            width: 44px;
          }
        </style>
      </head>
      <body>
        <main data-code-canvas>${rows}</main>
      </body>
    </html>`
}

export const markOverflowingCodeRows = async (page: Page) => {
  await page.locator('[data-code-source]').evaluateAll((elements) => {
    for (const element of elements) {
      const source = element as HTMLElement
      source.querySelector('[data-overflow-marker]')?.remove()
      const overflowing = source.scrollWidth > source.clientWidth
      const overflowReason = overflowing
        ? 'horizontal-overflow'
        : source.dataset.excerptContinues === 'true'
          ? 'continued-source'
          : null
      source.dataset.overflowing = String(overflowing)
      if (!overflowReason) continue

      const marker = document.createElement('i')
      marker.dataset.overflowMarker = 'true'
      marker.dataset.overflowReason = overflowReason
      marker.setAttribute('aria-hidden', 'true')
      marker.textContent = '…'
      source.append(marker)
    }
  })
}

export async function validateDocsCodeCanvas(png: Buffer) {
  const metadata = await sharp(png).metadata()
  if (
    metadata.width !== docsCodeCanvas.width ||
    metadata.height !== docsCodeCanvas.height
  ) {
    throw new Error(
      `Docs-code canvas dimensions must be ${docsCodeCanvas.width}x${docsCodeCanvas.height}, received ${metadata.width ?? 'unknown'}x${metadata.height ?? 'unknown'}.`,
    )
  }

  const raw = await sharp(png).ensureAlpha().raw().toBuffer({
    resolveWithObject: true,
  })
  const edgeOffsets: number[] = []
  for (let x = 0; x < raw.info.width; x += 1) {
    edgeOffsets.push(x * raw.info.channels)
    edgeOffsets.push(
      ((raw.info.height - 1) * raw.info.width + x) * raw.info.channels,
    )
  }
  for (let y = 1; y < raw.info.height - 1; y += 1) {
    edgeOffsets.push(y * raw.info.width * raw.info.channels)
    edgeOffsets.push(
      (y * raw.info.width + raw.info.width - 1) * raw.info.channels,
    )
  }

  for (const offset of edgeOffsets) {
    const [red, green, blue, alpha] = raw.data.subarray(offset, offset + 4)
    if (alpha < 250) {
      throw new Error('Docs-code canvas has a transparent edge pixel.')
    }
    if (red > 70 || green > 70 || blue > 80) {
      throw new Error('Docs-code canvas has a light/white edge gutter.')
    }
  }
}

const renderDocsCodeExcerptPng = async (
  browser: Browser,
  lines: readonly DocsCodeLine[],
  anchorIndex: number,
  monoFontBase64: string,
) => {
  const page = await browser.newPage({
    deviceScaleFactor: 1,
    viewport: {
      height: docsCodeCanvas.height,
      width: docsCodeCanvas.width,
    },
  })

  try {
    await page.setContent(
      renderDocsCodeExcerptHtml(lines, anchorIndex, monoFontBase64),
    )
    await page.evaluate(async () => await document.fonts.ready)
    await markOverflowingCodeRows(page)
    const geometry = await page
      .locator('[data-code-canvas]')
      .evaluate((element) => {
        const canvasRect = element.getBoundingClientRect()
        const rows = [
          ...element.querySelectorAll<HTMLElement>('[data-code-row]'),
        ]
        return {
          bottom:
            rows.at(-1)?.getBoundingClientRect().bottom ?? canvasRect.top,
          canvasBottom: canvasRect.bottom,
          canvasTop: canvasRect.top,
          count: rows.length,
          heights: rows.map((row) => row.getBoundingClientRect().height),
          top: rows[0]?.getBoundingClientRect().top ?? canvasRect.bottom,
        }
      })
    if (
      geometry.count < 1 ||
      geometry.top !==
        geometry.canvasTop + docsCodeCanvas.verticalPadding ||
      geometry.bottom >
        geometry.canvasBottom - docsCodeCanvas.verticalPadding ||
      geometry.heights.some((height) => height !== docsCodeCanvas.rowHeight)
    ) {
      throw new Error(
        `Docs-code rows failed whole-line geometry preflight: ${JSON.stringify(geometry)}.`,
      )
    }

    const png = await page.screenshot({
      animations: 'disabled',
      type: 'png',
    })
    await validateDocsCodeCanvas(png)
    return png
  } finally {
    await page.close()
  }
}

export const captureVisibleDocsCodeEvidence = async (
  browser: Browser,
  codeBlock: Locator,
  anchor: string,
  context: string,
  monoFontBase64: string,
) => {
  await codeBlock.waitFor({ state: 'visible' })
  const lines = await codeBlock.locator('.line').evaluateAll((elements) =>
    elements.map((element, index) => ({
      html: element.innerHTML,
      sourceLine: index + 1,
      text: element.textContent ?? '',
    })),
  )
  const anchorMatches = lines.flatMap((line, index) =>
    line.text.includes(anchor) ? [index] : [],
  )
  if (anchorMatches.length !== 1) {
    throw new Error(
      `${context} anchor ${anchor} matched ${anchorMatches.length} visible lines; expected exactly one.`,
    )
  }

  const anchorIndex = anchorMatches[0]
  const selectedLines = selectDocsCodeLineWindow(lines, anchorIndex)
  const png = await renderDocsCodeExcerptPng(
    browser,
    lines,
    anchorIndex,
    monoFontBase64,
  )
  return {
    anchorIndex,
    lines,
    png,
    selectedLines,
  }
}

const captureDocsCode = async (
  browser: Browser,
  baseURL: string,
  panel: DocsCodePanel,
  monoFontBase64: string,
) => {
  const page = await prepareRoutePage(browser, baseURL, panel.route, {
    height: 820,
    width: 1280,
  })

  try {
    const codeTab = page.getByRole('tab', { exact: true, name: 'Code' }).first()
    await codeTab.click()

    const activePanel = page
      .locator('[role="tabpanel"]:visible')
      .filter({ has: page.getByRole('button', { name: 'Copy code' }) })
    const panelCount = await activePanel.count()
    if (panelCount !== 1) {
      throw new Error(
        `${panel.label} active Code panel matched ${panelCount} elements; expected exactly one.`,
      )
    }

    const fileButton = activePanel
      .getByRole('button', { exact: true, name: panel.file })
      .filter({ visible: true })
    const fileCount = await fileButton.count()
    if (fileCount !== 1) {
      throw new Error(
        `${panel.label} file button ${panel.file} matched ${fileCount} visible elements; expected exactly one.`,
      )
    }
    await fileButton.click()

    const codeBlock = await findUniqueVisibleCodeBlock(
      activePanel,
      panel.anchor,
      panel.label,
    )

    await waitForTargetAssets(page)
    const evidence = await captureVisibleDocsCodeEvidence(
      browser,
      codeBlock,
      panel.anchor,
      panel.label,
      monoFontBase64,
    )
    return evidence.png
  } finally {
    await page.close()
  }
}

export async function findUniqueVisibleCodeBlock(
  root: Locator,
  anchor: string,
  context: string,
) {
  const codeBlock = root.locator('pre:visible').filter({ hasText: anchor })
  const count = await codeBlock.count()
  if (count !== 1) {
    throw new Error(
      `${context} anchor ${anchor} matched ${count} visible code blocks; expected exactly one.`,
    )
  }
  return codeBlock
}

const captureDocsSection = async (
  browser: Browser,
  baseURL: string,
  panel: DocsSectionPanel,
) => {
  const page = await prepareRoutePage(browser, baseURL, panel.route, {
    height: 820,
    width: 1280,
  })

  try {
    const heading = page.locator('h2#content-model')
    await waitForUniqueLocator(
      heading,
      `${panel.label} heading ${panel.heading}`,
    )
    await waitForTargetAssets(page)
    return await clipCaptureAroundTarget(page, heading, {
      height: 410,
      horizontalPadding: 22,
      verticalPadding: 28,
    })
  } finally {
    await page.close()
  }
}

const captureRouteViewport = async (
  browser: Browser,
  baseURL: string,
  panel: RouteViewportPanel,
) => {
  const page = await prepareRoutePage(browser, baseURL, panel.route, {
    height: 720,
    width: 900,
  })

  try {
    await page.evaluate(() => window.scrollTo(0, 0))
    await waitForTargetAssets(page)
    return await page.screenshot({
      animations: 'disabled',
      fullPage: false,
      type: 'png',
    })
  } finally {
    await page.close()
  }
}

export const readCaptureSourceExcerpt = async (
  panel: SourcePanel,
  sourceRoot = repoRoot,
) => {
  const absolutePath = await resolveCaptureSourcePath(
    panel.sourcePath,
    sourceRoot,
  )
  const source = await readFile(absolutePath, 'utf8')
  const lines = source.split(/\r?\n/)
  const anchorIndex = lines.findIndex((line) => line.includes(panel.anchor))
  if (anchorIndex < 0) {
    throw new Error(`${panel.sourcePath} is missing source anchor ${panel.anchor}.`)
  }

  return {
    firstLine: anchorIndex + 1,
    lines: lines.slice(anchorIndex, anchorIndex + panel.take),
  }
}

export function renderSourceExcerptHtml(
  panel: SourcePanel,
  excerpt: Awaited<ReturnType<typeof readCaptureSourceExcerpt>>,
  monoFontBase64: string,
) {
  assertCaptureFontBase64(monoFontBase64, 'Source capture font')
  const rows = excerpt.lines
    .map(
      (line, index) => `<span class="line">
          <i>${String(excerpt.firstLine + index).padStart(3, '0')}</i>
          <code>${escapeHtml(line || ' ')}</code>
        </span>`,
    )
    .join('')

  return `<!doctype html>
      <html>
        <head>
          <style>
            @font-face {
              font-family: 'Capture Mono';
              font-style: normal;
              font-weight: 400 700;
              src: url(data:font/ttf;base64,${monoFontBase64}) format('truetype');
            }
            * { box-sizing: border-box; }
            html, body { height: 330px; margin: 0; overflow: hidden; width: 1180px; }
            body { background: #18181b; color: #ffffff; font-family: 'Capture Mono'; padding: 22px; }
            header { align-items: center; border-bottom: 1px solid #52525b; color: #d4d4d8; display: flex; font-size: 13px; height: 38px; justify-content: space-between; letter-spacing: 0.04em; }
            header b { color: #059669; }
            main { display: grid; padding-top: 15px; }
            .line { display: grid; font-size: 15px; grid-template-columns: 48px minmax(0, 1fr); line-height: 27px; white-space: pre; }
            .line i { color: #52525b; font-style: normal; user-select: none; }
            code { color: #ffffff; }
          </style>
        </head>
        <body>
          <header><span>${escapeHtml(panel.sourcePath)}</span><b>COMMITTED TEST EVIDENCE</b></header>
          <main>${rows}</main>
        </body>
      </html>`
}

const captureSource = async (
  browser: Browser,
  panel: SourcePanel,
  monoFontBase64: string,
) => {
  const excerpt = await readCaptureSourceExcerpt(panel)
  const page = await browser.newPage({
    deviceScaleFactor: 1,
    viewport: { height: 330, width: 1180 },
  })

  try {
    await page.setContent(
      renderSourceExcerptHtml(panel, excerpt, monoFontBase64),
    )
    await page.evaluate(async () => await document.fonts.ready)
    return await page.screenshot({ animations: 'disabled', type: 'png' })
  } finally {
    await page.close()
  }
}

const capturePanel = async (
  browser: Browser,
  baseURL: string,
  panel: CapturePanel,
  fonts: CaptureFontData,
) => {
  switch (panel.kind) {
    case 'preview':
      return capturePreview(browser, baseURL, panel)
    case 'catalog-card':
      return captureCatalogCard(browser, baseURL, panel)
    case 'docs-code':
      return captureDocsCode(browser, baseURL, panel, fonts.mono)
    case 'docs-section':
      return captureDocsSection(browser, baseURL, panel)
    case 'route-viewport':
      return captureRouteViewport(browser, baseURL, panel)
    case 'source':
      return captureSource(browser, panel, fonts.mono)
  }
}

const getCaptureFonts = async (): Promise<CaptureFontData> => {
  const [bold, mono, regular] = await Promise.all([
    readFile(path.join(repoRoot, 'src/app/_fonts/Geist-Bold.ttf')),
    readFile(path.join(repoRoot, 'src/app/_fonts/GeistMono-Regular.ttf')),
    readFile(path.join(repoRoot, 'src/app/_fonts/Geist-Regular.ttf')),
  ])
  return {
    bold: bold.toString('base64'),
    mono: mono.toString('base64'),
    regular: regular.toString('base64'),
  }
}

type ArtifactWindowSize = {
  height: number
  width: number
}

const panelUsesContainFit = (panel: CapturePanel) =>
  panel.kind === 'docs-code' ||
  panel.kind === 'docs-section' ||
  panel.kind === 'source' ||
  (panel.kind === 'preview' && panel.viewport === 'mobile')

export const getCaptureDeviceScaleFactor = (panel: CapturePanel) =>
  panel.kind === 'catalog-card' ? 2 : 1

export const precomposePanelImage = async (
  panel: CapturePanel,
  source: Buffer,
  target: ArtifactWindowSize,
) => {
  if (
    !Number.isInteger(target.width) ||
    !Number.isInteger(target.height) ||
    target.width < 1 ||
    target.height < 1
  ) {
    throw new Error(
      `Artifact window must have positive integer dimensions, received ${target.width}x${target.height}.`,
    )
  }

  return sharp(source)
    .resize({
      background: { alpha: 0, b: 0, g: 0, r: 0 },
      fit: panelUsesContainFit(panel) ? 'contain' : 'cover',
      height: target.height,
      kernel: sharp.kernel.lanczos3,
      position: panel.kind === 'docs-code' ? 'centre' : 'north',
      width: target.width,
    })
    .png()
    .toBuffer()
}

const renderFinalPng = async (
  browser: Browser,
  capture: FigureCapture,
  panelImages: readonly CapturedPanel[],
  fonts: CaptureFontData,
) => {
  const page = await browser.newPage({
    deviceScaleFactor: 1,
    viewport: canvas,
  })

  try {
    await page.setContent(renderCaptureHtml(capture, panelImages, fonts))
    await page.evaluate(async () => await document.fonts.ready)
    await waitForTargetAssets(page)

    const artifactWindows = await page
      .locator('.artifact-window')
      .evaluateAll((elements) =>
        elements.map((element) => {
          const rect = element.getBoundingClientRect()
          return { height: rect.height, width: rect.width }
        }),
      )
    if (artifactWindows.length !== panelImages.length) {
      throw new Error(
        `${capture.slug} expected ${panelImages.length} artifact windows, received ${artifactWindows.length}.`,
      )
    }

    for (const [index, image] of panelImages.entries()) {
      const measuredTarget = artifactWindows[index]
      const target = {
        height: Math.round(measuredTarget.height),
        width: Math.round(measuredTarget.width),
      }
      const source = Buffer.from(
        image.dataUrl.replace(/^data:image\/png;base64,/, ''),
        'base64',
      )
      const precomposed = await precomposePanelImage(
        capture.panels[index],
        source,
        target,
      )
      await page
        .locator('.artifact-window img')
        .nth(index)
        .evaluate(
          async (element, value) => {
            const image = element as HTMLImageElement
            image.dataset.precomposed = 'true'
            image.style.height = `${value.height}px`
            image.style.width = `${value.width}px`
            image.src = value.src
            await image.decode()
          },
          {
            height: target.height,
            src: `data:image/png;base64,${precomposed.toString('base64')}`,
            width: target.width,
          },
        )
    }
    await waitForTargetAssets(page)
    return await page.screenshot({ animations: 'disabled', type: 'png' })
  } finally {
    await page.close()
  }
}

export async function encodeCaptureWebp(png: Buffer) {
  return sharp(png).webp(webpEncodingOptions).toBuffer()
}

const validateEncodedCapture = async ({ buffer, capture }: EncodedCapture) => {
  const metadata = await sharp(buffer).metadata()
  const problems: string[] = []

  if (metadata.format !== 'webp') problems.push(`format ${metadata.format ?? 'unknown'}`)
  if (metadata.width !== canvas.width || metadata.height !== canvas.height) {
    problems.push(
      `dimensions ${metadata.width ?? 'unknown'}x${metadata.height ?? 'unknown'}`,
    )
  }
  if (buffer.byteLength > maxCaptureBytes) {
    problems.push(`size ${buffer.byteLength} bytes exceeds ${maxCaptureBytes}`)
  }
  if (problems.length > 0) {
    throw new Error(`${capture.slug}: ${problems.join(', ')}`)
  }
}

export async function writeValidatedCaptureBatch(
  encoded: readonly EncodedCapture[],
  {
    outputRoot = repoRoot,
    writeOutput = writeFile,
  }: Pick<CaptureBatchOptions, 'outputRoot' | 'writeOutput'> = {},
) {
  let plan: {
    buffer: Buffer
    outputPath: string
  }[]
  try {
    await Promise.all(encoded.map(validateEncodedCapture))
    plan = await Promise.all(
      encoded.map(async (item) => ({
        buffer: item.buffer,
        outputPath: await resolveCaptureOutputPath(
          outputRoot,
          item.capture.outputPath,
        ),
      })),
    )
    const destinations = new Set(plan.map((item) => item.outputPath))
    if (destinations.size !== plan.length) {
      throw new Error('Capture output paths resolve to duplicate destinations.')
    }
  } catch (error) {
    throw new Error(
      `Capture batch failed preflight before writing: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
  }

  for (const item of plan) {
    if (writeOutput === writeFile) {
      await mkdir(path.dirname(item.outputPath), { recursive: true })
    }
    await writeOutput(item.outputPath, item.buffer)
  }
}

export async function captureBlogFigures({
  baseURL = process.env.BLOG_CAPTURE_BASE_URL ?? defaultBaseURL,
  logger = console.log,
  outputRoot = repoRoot,
  slugs,
  writeOutput,
}: CaptureBatchOptions = {}) {
  const normalizedBaseURL = normalizeBaseURL(baseURL)
  const requestedSlugs = slugs === undefined ? undefined : new Set(slugs)
  const selectedCaptures =
    requestedSlugs === undefined
      ? captures
      : captures.filter((capture) => requestedSlugs.has(capture.slug))

  if (requestedSlugs && selectedCaptures.length !== requestedSlugs.size) {
    const knownSlugs = new Set<string>(captures.map((capture) => capture.slug))
    const unknown = [...requestedSlugs].filter((slug) => !knownSlugs.has(slug))
    throw new Error(`Unknown blog figure capture slug${unknown.length === 1 ? '' : 's'}: ${unknown.join(', ')}`)
  }

  const browser = await chromium.launch({ headless: true })
  const encoded: EncodedCapture[] = []

  try {
    const fonts = await getCaptureFonts()
    for (const capture of selectedCaptures) {
      const panelImages: CapturedPanel[] = []

      for (const panel of capture.panels) {
        const png = await capturePanel(
          browser,
          normalizedBaseURL,
          panel,
          fonts,
        )
        const metadata = await sharp(png).metadata()
        if (!metadata.width || !metadata.height) {
          throw new Error(`${capture.slug}: ${panel.label} has no measurable image dimensions.`)
        }
        panelImages.push({
          dataUrl: `data:image/png;base64,${png.toString('base64')}`,
          height: metadata.height,
          width: metadata.width,
        })
      }

      const png = await renderFinalPng(browser, capture, panelImages, fonts)
      encoded.push({
        buffer: await encodeCaptureWebp(png),
        capture,
      })
    }
  } finally {
    await browser.close()
  }

  await writeValidatedCaptureBatch(encoded, {
    outputRoot,
    writeOutput,
  })

  for (const item of encoded) {
    const routeCount = item.capture.panels.filter((panel) => 'route' in panel).length
    logger(
      `Captured ${item.capture.outputPath} · ${item.capture.panels.length} panels / ${routeCount} local routes · ${item.buffer.byteLength} bytes`,
    )
  }

  return encoded
}

export const parseCaptureArgs = (argv: readonly string[]) => {
  const slugs: string[] = []

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    if (argument !== '--slug') {
      throw new Error(`Unknown capture argument "${argument}".`)
    }

    const slug = argv[index + 1]
    if (!slug || slug.startsWith('--')) {
      throw new Error('--slug requires a value.')
    }
    slugs.push(slug)
    index += 1
  }

  return slugs.length > 0 ? { slugs } : {}
}

const isMain = () =>
  Boolean(process.argv[1]) &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMain()) {
  await captureBlogFigures(parseCaptureArgs(process.argv.slice(2)))
}
