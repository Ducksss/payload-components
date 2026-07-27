import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

import { chromium } from '@playwright/test'
import type { Browser, Page } from '@playwright/test'
import sharp, { type OverlayOptions } from 'sharp'

import { resolveArtifact } from './visual-system/artifacts'
import { blogVisualCatalog, getBlogVisualEntry } from './visual-system/catalog'
import {
  coverFontPaths,
  renderCoverHtml,
  type CoverArtifact,
  type CoverArtifacts,
  type CoverFontData,
} from './visual-system/cover-template'
import type { BlogVisualEntry, BlogVisualSeries, ResolvedArtifact } from './visual-system/types'

const repoRoot = path.resolve(import.meta.dirname, '../..')
const defaultBaseUrl = 'http://127.0.0.1:3100'
const coverWidth = 1200
const coverHeight = 630
const maxCoverBytes = 250 * 1024
const routePreviewHeight = 264
const routePreviewWidth = 960

const knownSeries: ReadonlySet<string> = new Set(
  blogVisualCatalog.map((entry) => entry.series),
)

const isBlogVisualSeries = (value: string): value is BlogVisualSeries => knownSeries.has(value)

type RenderEnvironment = Readonly<Record<string, string | undefined>>

export type CoverRenderOptions = {
  baseUrl: string
  entries: readonly BlogVisualEntry[]
  outputRoot: string
}

type PreparedCover = {
  artifacts: {
    primary: ResolvedArtifact
    secondary: ResolvedArtifact
  }
  entry: BlogVisualEntry
}

const argumentValue = (argv: readonly string[], index: number, option: string) => {
  const value = argv[index + 1]

  if (!value || value.startsWith('--')) {
    throw new Error(`${option} requires a value.`)
  }

  return value
}

const localCaptureOrigin = (candidate: string) => {
  let url: URL

  try {
    url = new URL(candidate)
  } catch {
    throw new Error(`BLOG_CAPTURE_BASE_URL must be a valid localhost URL: "${candidate}".`)
  }

  const localHosts = new Set(['127.0.0.1', 'localhost', '[::1]'])
  if (
    url.protocol !== 'http:' ||
    !localHosts.has(url.hostname) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    (url.pathname !== '/' && url.pathname !== '')
  ) {
    throw new Error(
      `BLOG_CAPTURE_BASE_URL must be an HTTP localhost origin without credentials or a path: "${candidate}".`,
    )
  }

  return url.origin
}

export const parseCoverRenderArgs = (
  argv: readonly string[],
  environment: RenderEnvironment = process.env,
): CoverRenderOptions => {
  const requestedSlugs = new Set<string>()
  const requestedSeries = new Set<BlogVisualSeries>()

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]

    if (argument === '--slug') {
      const slug = argumentValue(argv, index, '--slug')
      getBlogVisualEntry(slug)
      requestedSlugs.add(slug)
      index += 1
      continue
    }

    if (argument === '--series') {
      const series = argumentValue(argv, index, '--series')
      if (!isBlogVisualSeries(series)) {
        throw new Error(`Unknown blog visual series "${series}".`)
      }
      requestedSeries.add(series)
      index += 1
      continue
    }

    throw new Error(`Unknown cover-render argument "${argument}".`)
  }

  const entries = blogVisualCatalog.filter(
    (entry) =>
      (requestedSlugs.size === 0 || requestedSlugs.has(entry.slug)) &&
      (requestedSeries.size === 0 || requestedSeries.has(entry.series)),
  )

  if (entries.length === 0) {
    throw new Error('No blog covers matched the requested filters.')
  }

  return {
    baseUrl: localCaptureOrigin(environment.BLOG_CAPTURE_BASE_URL ?? defaultBaseUrl),
    entries,
    outputRoot: path.resolve(environment.BLOG_VISUAL_OUTPUT_ROOT ?? repoRoot),
  }
}

const prepareCovers = async (
  entries: readonly BlogVisualEntry[],
): Promise<readonly PreparedCover[]> =>
  await Promise.all(
    entries.map(async (entry) => {
      const [primary, secondary] = await Promise.all([
        resolveArtifact(entry.primary),
        resolveArtifact(entry.secondary),
      ])

      return { artifacts: { primary, secondary }, entry }
    }),
  )

const loadCoverFonts = async (): Promise<CoverFontData> => ({
  [coverFontPaths.geistBold]: (
    await readFile(path.join(repoRoot, coverFontPaths.geistBold))
  ).toString('base64'),
  [coverFontPaths.geistMono]: (
    await readFile(path.join(repoRoot, coverFontPaths.geistMono))
  ).toString('base64'),
  [coverFontPaths.geistRegular]: (
    await readFile(path.join(repoRoot, coverFontPaths.geistRegular))
  ).toString('base64'),
  [coverFontPaths.instrumentSerif]: (
    await readFile(path.join(repoRoot, coverFontPaths.instrumentSerif))
  ).toString('base64'),
})

export const waitForDocumentAssets = async (page: Page) => {
  await page.evaluate(async () => {
    await document.fonts.ready

    await Promise.all(
      [...document.images]
        .filter((image) => {
          if (image.loading !== 'lazy') return true

          const bounds = image.getBoundingClientRect()
          return (
            bounds.bottom >= 0 &&
            bounds.right >= 0 &&
            bounds.top <= window.innerHeight &&
            bounds.left <= window.innerWidth
          )
        })
        .map(
          (image) =>
            new Promise<void>((resolve, reject) => {
              if (image.complete) {
                if (image.naturalWidth > 0) resolve()
                else reject(new Error(`Image failed to load: ${image.currentSrc || image.src}`))
                return
              }

              image.addEventListener('load', () => resolve(), { once: true })
              image.addEventListener(
                'error',
                () => reject(new Error(`Image failed to load: ${image.currentSrc || image.src}`)),
                { once: true },
              )
            }),
        ),
    )
  })
}

const keepRequestsLocal = async (page: Page, baseUrl: string) => {
  const origin = new URL(baseUrl).origin

  await page.route('**/*', async (route) => {
    const requestUrl = route.request().url()

    if (
      requestUrl.startsWith('data:') ||
      requestUrl.startsWith('blob:') ||
      requestUrl === 'about:blank' ||
      new URL(requestUrl).origin === origin
    ) {
      await route.continue()
      return
    }

    await route.abort('blockedbyclient')
  })
}

export const captureRouteRegion = async (
  page: Page,
  artifact: Extract<ResolvedArtifact, { kind: 'route' }>,
) => {
  if (!artifact.capture) {
    return await page.screenshot({ animations: 'disabled', type: 'png' })
  }

  const { columns, position, selectors } = artifact.capture

  if (
    !Number.isInteger(columns) ||
    columns < 1 ||
    selectors.length < 1 ||
    selectors.some((selector) => selector.trim() === '')
  ) {
    throw new Error(
      `Route capture for ${artifact.route} requires nonempty selectors and at least one column.`,
    )
  }

  const normalizedSelectors = selectors.map((selector) => selector.trim())
  const duplicateSelector = normalizedSelectors.find(
    (selector, index) => normalizedSelectors.indexOf(selector) !== index,
  )
  if (duplicateSelector) {
    throw new Error(
      `Duplicate route capture selector "${duplicateSelector}" on ${artifact.route}.`,
    )
  }

  const effectiveColumns = Math.min(columns, selectors.length)
  const rows = Math.ceil(selectors.length / effectiveColumns)
  const tiles: OverlayOptions[] = []

  for (const [index, selector] of selectors.entries()) {
    const region = page.locator(selector)
    const matches = await region.count()

    if (matches !== 1) {
      throw new Error(
        `Route capture selector "${selector}" matched ${matches} elements on ${artifact.route}; expected exactly one.`,
      )
    }

    await region.scrollIntoViewIfNeeded()
    await waitForDocumentAssets(page)

    const column = index % effectiveColumns
    const row = Math.floor(index / effectiveColumns)
    const left = Math.floor((column * routePreviewWidth) / effectiveColumns)
    const top = Math.floor((row * routePreviewHeight) / rows)
    const width =
      Math.floor(((column + 1) * routePreviewWidth) / effectiveColumns) - left
    const height = Math.floor(((row + 1) * routePreviewHeight) / rows) - top
    const screenshot = await region.screenshot({ animations: 'disabled', type: 'png' })
    const input = await sharp(screenshot)
      .resize({ fit: 'cover', height, position, width })
      .png()
      .toBuffer()

    tiles.push({ input, left, top })
  }

  return await sharp({
    create: {
      background: '#ffffff',
      channels: 4,
      height: routePreviewHeight,
      width: routePreviewWidth,
    },
  })
    .composite(tiles)
    .png()
    .toBuffer()
}

const captureRoutePreview = async (
  browser: Browser,
  baseUrl: string,
  artifact: Extract<ResolvedArtifact, { kind: 'route' }>,
) => {
  const page = await browser.newPage({
    deviceScaleFactor: 1,
    viewport: { height: 600, width: 960 },
  })

  try {
    await keepRequestsLocal(page, baseUrl)
    await page.goto(new URL(artifact.route, baseUrl).href, {
      timeout: 30_000,
      waitUntil: 'networkidle',
    })
    await waitForDocumentAssets(page)
    const png = await captureRouteRegion(page, artifact)
    return `data:image/png;base64,${png.toString('base64')}`
  } finally {
    await page.close()
  }
}

const addRoutePreview = async (
  artifact: ResolvedArtifact,
  browser: Browser,
  baseUrl: string,
  routeCache: Map<string, string>,
): Promise<CoverArtifact> => {
  if (artifact.kind !== 'route') return artifact

  const cacheKey = JSON.stringify({ capture: artifact.capture, route: artifact.route })
  let previewDataUrl = routeCache.get(cacheKey)
  if (!previewDataUrl) {
    previewDataUrl = await captureRoutePreview(browser, baseUrl, artifact)
    routeCache.set(cacheKey, previewDataUrl)
  }

  return { ...artifact, previewDataUrl }
}

type LineRenderedArtifact = Extract<
  CoverArtifact,
  { kind: 'diff' | 'registry-item' | 'source' }
>

const isLineRenderedArtifact = (
  artifact: CoverArtifact,
): artifact is LineRenderedArtifact =>
  artifact.kind === 'diff' ||
  artifact.kind === 'registry-item' ||
  artifact.kind === 'source'

const expectedRenderedLines = (artifact: LineRenderedArtifact) =>
  artifact.kind === 'diff'
    ? [...artifact.before, ...artifact.after]
    : artifact.evidence.split(/\r?\n/).map((line) => line || ' ')

export const assertCodeArtifactCardsFit = async (
  page: Page,
  slug: string,
  artifacts: CoverArtifacts,
) => {
  const violations: string[] = []

  for (const role of ['primary', 'secondary'] as const) {
    const artifact = artifacts[role]
    if (!isLineRenderedArtifact(artifact)) continue

    const region = page.locator(
      `[data-cover-part="${role}"][data-artifact-kind="${artifact.kind}"]`,
    )
    const matches = await region.count()
    const context = `${slug}:${role} [${artifact.kind}]`

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
    const expectedLines = expectedRenderedLines(artifact)

    if (layout.bodyScroll !== '0x0') {
      violations.push(`${context} body scroll ${layout.bodyScroll}`)
    }
    if (layout.sheetScroll !== '0x0') {
      violations.push(`${context} sheet scroll ${layout.sheetScroll}`)
    }
    if (layout.clipped.length > 0) {
      violations.push(`${context} clipped lines ${layout.clipped.join(',')}`)
    }
    if (layout.fontSize < 12) {
      violations.push(`${context} font ${layout.fontSize}px`)
    }
    if (JSON.stringify(layout.renderedLines) !== JSON.stringify(expectedLines)) {
      violations.push(`${context} rendered text differs from evidence`)
    }
  }

  if (violations.length > 0) {
    throw new Error(`Code-artifact preflight failed:\n${violations.join('\n')}`)
  }
}

const renderCoverPng = async (
  browser: Browser,
  entry: BlogVisualEntry,
  artifacts: CoverArtifacts,
  fontData: CoverFontData,
) => {
  const page = await browser.newPage({
    deviceScaleFactor: 1,
    viewport: { height: coverHeight, width: coverWidth },
  })

  try {
    await page.setContent(renderCoverHtml(entry, artifacts, fontData), { waitUntil: 'load' })
    await waitForDocumentAssets(page)
    await assertCodeArtifactCardsFit(page, entry.slug, artifacts)
    return await page.screenshot({ animations: 'disabled', type: 'png' })
  } finally {
    await page.close()
  }
}

const encodeCover = async (slug: string, png: Buffer) => {
  const { data, info } = await sharp(png)
    .webp({ effort: 6, quality: 88, smartSubsample: true })
    .toBuffer({ resolveWithObject: true })

  if (info.width !== coverWidth || info.height !== coverHeight) {
    throw new Error(
      `Rendered cover ${slug} is ${info.width}×${info.height}; expected ${coverWidth}×${coverHeight}.`,
    )
  }
  if (info.size > maxCoverBytes) {
    throw new Error(
      `Rendered cover ${slug} is ${info.size} bytes; limit is ${maxCoverBytes} bytes.`,
    )
  }

  return { data, height: info.height, size: info.size, width: info.width }
}

export const renderCovers = async ({ baseUrl, entries, outputRoot }: CoverRenderOptions) => {
  // Evidence and font bytes are deliberately resolved before Chromium starts.
  const [preparedCovers, fontData] = await Promise.all([
    prepareCovers(entries),
    loadCoverFonts(),
  ])
  const browser = await chromium.launch({ headless: true })
  const routeCache = new Map<string, string>()

  try {
    for (const prepared of preparedCovers) {
      const [primary, secondary] = await Promise.all([
        addRoutePreview(prepared.artifacts.primary, browser, baseUrl, routeCache),
        addRoutePreview(prepared.artifacts.secondary, browser, baseUrl, routeCache),
      ])
      const png = await renderCoverPng(
        browser,
        prepared.entry,
        { primary, secondary },
        fontData,
      )
      const cover = await encodeCover(prepared.entry.slug, png)
      const relativeOutput = path.join('public', 'blog', prepared.entry.slug, 'cover.webp')
      const outputPath = path.join(outputRoot, relativeOutput)

      await mkdir(path.dirname(outputPath), { recursive: true })
      await writeFile(outputPath, cover.data)
      console.log(
        `Rendered cover ${prepared.entry.slug}: ${cover.width}×${cover.height}, ${cover.size} bytes → ${relativeOutput}`,
      )
    }
  } finally {
    await browser.close()
  }
}

const directInvocation =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (directInvocation) {
  void renderCovers(parseCoverRenderArgs(process.argv.slice(2))).catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  })
}
