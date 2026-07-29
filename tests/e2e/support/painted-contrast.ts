import type { Page } from '@playwright/test'

import sharp from 'sharp'

/* Painted-pixel contrast sampling — the check axe cannot make.
 *
 * axe-core resolves an element's background by walking the DOM for a solid
 * colour. When it finds a gradient (or an image) it gives up and reports the
 * node as `incomplete`, never as a `violation`. The template concepts lean on
 * gradient plates (hero-aurora's aurora field, hero-kinetic's letterbox still,
 * tinted CTA bands), so a green axe run does NOT prove that ink over those
 * plates clears WCAG AA. This module measures those pairings against the pixels
 * the browser actually painted.
 *
 * Method, per page:
 *   1. take the axe `color-contrast` incomplete nodes — precisely the pairings
 *      axe declined to judge — and read each one's authored ink colour, font
 *      metrics, and document-space box;
 *   2. capture the page twice full-page, both times with the authored ink
 *      replaced: once with every glyph painted in a sentinel colour, once with
 *      every glyph transparent (the bare background plate);
 *   3. per pixel, solve the sentinel capture for glyph coverage — how much of
 *      that pixel a glyph covers — which locates the text exactly, without
 *      sampling the empty padding inside a wide text box;
 *   4. read the background from the PLATE capture at those pixels, composite the
 *      authored ink over it at the opacity it is really painted with, and score
 *      that against the worst background found, requiring the WCAG AA ratio for
 *      that text size.
 *
 * Deliberate choices:
 *   - the glyph mask comes from a sentinel colour, not from the page's own ink,
 *     so it is equally strong whatever the authored colour is. Diffing the
 *     rendered page against the plate seems simpler, but it fails exactly where
 *     it matters: washed-out ink barely differs from its background, so the mask
 *     thins out and a real failure reads as "nothing to measure";
 *   - the ink colour comes from `getComputedStyle`, not from any capture, so
 *     antialiasing can never soften the ratio. Chromium returns modern colours
 *     as `oklch(...)` verbatim, so the value is converted by painting it into a
 *     1x1 canvas rather than parsed;
 *   - that colour is then composited at its real opacity — the alpha on `color`
 *     times every ancestor `opacity`. `text-foreground/70` is not the colour the
 *     browser paints, and taking it at face value flatters every translucent run
 *     in the gallery;
 *   - partially covered pixels are kept. Coverage only says WHERE the glyphs
 *     are; the background is read from the plate capture, which is never
 *     blended with ink, so an edge pixel yields just as true a background as a
 *     glyph core;
 *   - `text-shadow` is removed for both captures. A scrim implemented purely as
 *     a shadow therefore does not count in the element's favour — conservative
 *     on purpose;
 *   - gradient-filled ink (`background-clip: text`, i.e. the ink IS the
 *     gradient) cannot be scored this way and is reported as skipped rather
 *     than silently passed;
 *   - anything else painted from `currentColor` — a default border, an SVG
 *     `fill="currentColor"` icon — is repainted along with the glyphs, so it
 *     counts as ink inside the node it sits in. That adds pixels rather than
 *     hiding them: the extra marks are scored against the same plate, which can
 *     only tighten a pairing, never loosen it;
 *   - axe descends into iframes and prefixes those targets with the frame
 *     selector. Cross-frame nodes are counted and skipped — this samples the
 *     top document only.
 *
 * Requires deviceScaleFactor 1 (the `Desktop Chrome` device default) so
 * document coordinates map 1:1 onto captured pixels, and a settled page —
 * run it under `reducedMotion: 'reduce'` like the rest of the template suites.
 */

/* Structurally compatible with axe-core's NodeResult without importing its
   types (axe-core is a transitive dependency of @axe-core/playwright). */
type AxeTargetNode = { target: readonly (string | readonly string[])[] }

export type PaintedContrastPairing = {
  /* Worst painted background found under this node's own glyphs. */
  background: [number, number, number]
  /* Document-space box the pixels were read from, `x,y widthxheight`. */
  box: string
  /* Glyph-covered pixels the score was taken over. */
  glyphPixels: number
  /* The ink as actually painted over `background` — the authored colour
     composited at its own opacity, which is what a reader sees. */
  ink: [number, number, number]
  ratio: number
  required: number
  sample: string
  selector: string
}

export type PaintedContrastReport = {
  /* Pairings whose worst painted background fails WCAG AA. */
  failures: PaintedContrastPairing[]
  /* Pairings this method can score at all — `sampled` plus the ones whose box
     turned out to hold no glyph pixels. Zero is a legitimate outcome (a page
     whose only unjudged nodes are excluded chrome); it is also the signal that
     the pass proved nothing, which is why the callers assert on it. */
  measurable: number
  /* Pairings actually scored against painted pixels. */
  sampled: number
  /* Every scored pairing, so the report can show real headroom rather than one
     number. Reported tightest-first by margin over its own threshold; several
     pairings often sit within a fraction of a percent of each other, and gradient
     plates rasterise with a +/-1/255 wobble, so a single "worst" would name a
     different node run to run for no real reason. */
  scored: PaintedContrastPairing[]
  skippedCrossFrame: number
  skippedGradientInk: number
  /* Nodes whose box held no glyph pixels (text painted by a child element, or
     clipped away) — nothing to measure, so nothing is claimed about them. */
  skippedNoGlyphPixels: number
  /* Which nodes those were, for the same reason unresolvedSelectors exists: this
     skip is the other way an unmeasurable node leaves the run, and a bare count
     gives nobody a way to tell a text-painted-by-a-child node from ink that
     collided with the sentinel channel or fell under the coverage floor. */
  skippedNoGlyphPixelsSelectors: string[]
  /* Nodes that no longer resolve, collapsed to an empty box, or sit inside the
     excluded preview chrome. */
  skippedUnresolved: number
  /* Nodes axe left as `incomplete` on this page, before any skips. */
  total: number
  /* Why each unresolved node was dropped — kept so a skip can never hide a
     selector-handling bug. */
  unresolvedSelectors: string[]
}

type Candidate = {
  gradientInk: boolean
  height: number
  ink: [number, number, number]
  /* Opacity the ink is actually painted at: the alpha of the authored colour
     times every `opacity` from the element up to the root. `text-background/60`
     inside an `opacity-90` wrapper is painted at 0.54, and scoring it as if it
     were opaque would flatter it. */
  inkAlpha: number
  large: boolean
  sample: string
  selector: string
  width: number
  x: number
  y: number
}

/* Ink colour used only to locate glyphs. Any plate leaves at least one channel
   far enough from it to solve for coverage; a plate that matches it on all three
   yields no mask, which is reported as unmeasured rather than passed. */
const SENTINEL_INK: readonly [number, number, number] = [255, 0, 255]
const MIN_CHANNEL_SEPARATION = 40
/* A pixel counts as glyph body when the sentinel covers it to at least this
   share of the ink's own opacity — i.e. geometric coverage is ~1. Judged
   relative to the ink's alpha so translucent runs are measured on their bodies,
   and absolutely as well so a rounding artefact cannot pass for a glyph. */
const MIN_GLYPH_COVERAGE_SHARE = 0.9
const MIN_GLYPH_COVERAGE = 0.05
const MIN_GLYPH_PIXELS = 4

const relativeLuminance = (rgb: readonly [number, number, number]) => {
  const linear = (value: number) => {
    const channel = value / 255
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  }

  return 0.2126 * linear(rgb[0]) + 0.7152 * linear(rgb[1]) + 0.0722 * linear(rgb[2])
}

export const contrastRatio = (
  foreground: readonly [number, number, number],
  background: readonly [number, number, number],
) => {
  const first = relativeLuminance(foreground)
  const second = relativeLuminance(background)
  const lighter = Math.max(first, second)
  const darker = Math.min(first, second)

  return (lighter + 0.05) / (darker + 0.05)
}

/* Collect the ink colour, size class, and document-space box of every node axe
   left unjudged. Runs in the page so `oklch()` colours resolve through canvas. */
async function collectCandidates(
  page: Page,
  selectors: string[],
  excludeSelector: string,
): Promise<{ candidates: Candidate[]; unresolved: string[] }> {
  return page.evaluate(
    ({ exclude, targets }: { exclude: string; targets: string[] }) => {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      const context = canvas.getContext('2d')

      /* Painting through a 1x1 canvas resolves whatever colour syntax Chromium
         reports — `oklch(...)` comes back verbatim from getComputedStyle, so it
         cannot be parsed with a regex. Alpha is kept, not discarded. */
      const toRgba = (value: string): [number, number, number, number] | null => {
        if (!context) return null
        context.clearRect(0, 0, 1, 1)
        context.fillStyle = value
        context.fillRect(0, 0, 1, 1)
        const [red, green, blue, alpha] = context.getImageData(0, 0, 1, 1).data
        // Fully transparent ink means the glyphs are painted by something else
        // (a clipped gradient); there is no authored colour to score.
        return alpha === 0 ? null : [red, green, blue, alpha / 255]
      }

      /* `opacity` composites the whole subtree, so an ancestor's value dims the
         ink just as surely as an alpha channel on `color`. */
      const inheritedOpacity = (element: Element) => {
        let opacity = 1
        let node: Element | null = element

        while (node) {
          const value = Number.parseFloat(getComputedStyle(node).opacity)
          if (Number.isFinite(value)) opacity *= value
          node = node.parentElement
        }

        return opacity
      }

      const candidates = []
      const unresolved: string[] = []

      for (const selector of targets) {
        let element: Element | null = null
        try {
          element = document.querySelector(selector)
        } catch {
          element = null
        }
        if (!element) {
          unresolved.push(`${selector} (no match)`)
          continue
        }
        if (exclude && element.closest(exclude)) {
          unresolved.push(`${selector} (excluded chrome)`)
          continue
        }

        const box = element.getBoundingClientRect()
        if (box.width < 1 || box.height < 1) {
          unresolved.push(`${selector} (${box.width}x${box.height} box)`)
          continue
        }

        const style = getComputedStyle(element)
        const ink = toRgba(style.webkitTextFillColor || style.color)
        const fontSize = Number.parseFloat(style.fontSize) || 0
        const fontWeight = Number.parseFloat(style.fontWeight) || 400

        candidates.push({
          gradientInk: ink === null || style.webkitBackgroundClip === 'text',
          height: box.height,
          ink: (ink ? [ink[0], ink[1], ink[2]] : [0, 0, 0]) as [number, number, number],
          inkAlpha: ink ? ink[3] * inheritedOpacity(element) : 0,
          // WCAG "large scale": 18pt (24px), or 14pt (18.66px) bold.
          large: fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700),
          sample: (element.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 60),
          selector,
          width: box.width,
          x: box.left + window.scrollX,
          y: box.top + window.scrollY,
        })
      }

      return { candidates, unresolved }
    },
    { exclude: excludeSelector, targets: selectors },
  )
}

/* The two captures must differ ONLY in ink, so every deferred image has to be
   loaded before the first one. A full-page capture expands the viewport to the
   document height, which itself triggers loading="lazy" images — left alone,
   those land between the captures, move the layout, and the "glyph" diff
   becomes a shifted page. */
async function settleDeferredImages(page: Page) {
  await page.evaluate(async () => {
    const images = Array.from(document.images)
    for (const image of images) image.loading = 'eager'

    const loaded = Promise.all(
      images.map(
        (image) =>
          new Promise<void>((resolve) => {
            if (image.complete) {
              resolve()
              return
            }
            image.addEventListener('load', () => resolve(), { once: true })
            image.addEventListener('error', () => resolve(), { once: true })
          }),
      ),
    )

    // A never-loading asset must not hang the run; the dimension guard below
    // still catches a page that moves.
    await Promise.race([loaded, new Promise((resolve) => setTimeout(resolve, 5000))])
    await Promise.all(images.map((image) => image.decode().catch(() => undefined)))
  })
}

const INK_PROPERTIES = [
  'color',
  '-webkit-text-fill-color',
  'text-decoration-color',
  'text-shadow',
] as const

/* Repaint every glyph on the page in one colour.
 *
 * Applied as INLINE !important, not as a stylesheet rule: an author rule like
 * `.hero-title { color: white !important }` outranks any `*` selector on
 * specificity no matter how late it is injected, and would leave that node
 * identical in both captures — unmeasurable, and silently so. Inline
 * !important is the top of the author cascade, so nothing in the page can
 * outrank it. The stylesheet rule is still added for ::before/::after content,
 * which has no inline style to set. */
async function repaintInk(page: Page, colour: string) {
  /* Returned so the caller can take it back out: leaving it behind would keep
     the page's pseudo-element content invisible for anything that runs after. */
  const pseudoElements = await page.addStyleTag({
    content: `*::before, *::after {
      -webkit-text-fill-color: ${colour} !important;
      color: ${colour} !important;
      text-decoration-color: ${colour} !important;
      text-shadow: none !important;
    }`,
  })

  await page.evaluate(
    ({ ink, properties }: { ink: string; properties: string[] }) => {
      const scope = window as unknown as {
        __paintedContrastInk?: Map<Element, (string | null)[]>
      }
      scope.__paintedContrastInk ??= new Map()
      const saved = scope.__paintedContrastInk

      for (const element of Array.from(document.querySelectorAll('*'))) {
        const style = (element as Partial<HTMLElement>).style
        if (!style) continue

        if (!saved.has(element)) {
          saved.set(
            element,
            properties.map((property) => style.getPropertyValue(property) || null),
          )
        }

        for (const property of properties) {
          style.setProperty(property, property === 'text-shadow' ? 'none' : ink, 'important')
        }
      }
    },
    { ink: colour, properties: [...INK_PROPERTIES] },
  )

  return pseudoElements
}

async function restoreInk(page: Page) {
  await page.evaluate(
    (properties: string[]) => {
      const scope = window as unknown as {
        __paintedContrastInk?: Map<Element, (string | null)[]>
      }
      const saved = scope.__paintedContrastInk
      if (!saved) return

      for (const [element, values] of saved) {
        const style = (element as Partial<HTMLElement>).style
        if (!style) continue

        properties.forEach((property, index) => {
          const original = values[index]
          if (original) {
            style.setProperty(property, original)
          } else {
            style.removeProperty(property)
          }
        })
      }

      delete scope.__paintedContrastInk
    },
    [...INK_PROPERTIES],
  )
}

type Raster = { data: Buffer; height: number; width: number }

const decode = async (png: Buffer): Promise<Raster> => {
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true })

  return { data, height: info.height, width: info.width }
}

/* How much of one pixel a glyph covers, solved from the sentinel capture:
   sentinelPixel = coverage * SENTINEL_INK + (1 - coverage) * platePixel. Only
   channels where the sentinel and the plate are far enough apart can be solved;
   averaging those that can keeps antialiasing from skewing the result. */
function glyphCoverage(
  sentinel: readonly [number, number, number],
  plate: readonly [number, number, number],
) {
  let solved = 0
  let total = 0

  for (let channel = 0; channel < 3; channel += 1) {
    const span = SENTINEL_INK[channel] - plate[channel]
    if (Math.abs(span) < MIN_CHANNEL_SEPARATION) continue
    solved += 1
    total += (sentinel[channel] - plate[channel]) / span
  }

  return solved === 0 ? null : total / solved
}

/* Worst-case contrast for one candidate: walk its box, keep the pixels a glyph
   covers, and score the authored colour against the worst background the plate
   capture shows under them. */
function scoreCandidate(candidate: Candidate, glyphs: Raster, plate: Raster) {
  const left = Math.max(0, Math.floor(candidate.x))
  const top = Math.max(0, Math.floor(candidate.y))
  const right = Math.min(glyphs.width, Math.ceil(candidate.x + candidate.width))
  const bottom = Math.min(glyphs.height, Math.ceil(candidate.y + candidate.height))

  /* Only the glyph BODY counts, so an antialiased edge — which really is a
     near-background blend — cannot be read as a failing pairing. Body means
     coverage at the ink's own opacity. */
  const floor = Math.max(MIN_GLYPH_COVERAGE, candidate.inkAlpha * MIN_GLYPH_COVERAGE_SHARE)

  /* What the browser puts on screen: translucent ink IS part background. Blended
     per pixel because the plate under a gradient is different at every one. */
  const painted = (background: readonly [number, number, number]) =>
    candidate.ink.map((channel, index) =>
      Math.round(channel * candidate.inkAlpha + background[index] * (1 - candidate.inkAlpha)),
    ) as [number, number, number]

  let covered = 0
  let worst = Number.POSITIVE_INFINITY
  let worstBackground: [number, number, number] = [0, 0, 0]
  let worstInk: [number, number, number] = candidate.ink

  for (let y = top; y < bottom; y += 1) {
    for (let x = left; x < right; x += 1) {
      const index = (y * glyphs.width + x) * 4
      const background: [number, number, number] = [
        plate.data[index],
        plate.data[index + 1],
        plate.data[index + 2],
      ]
      const coverage = glyphCoverage(
        [glyphs.data[index], glyphs.data[index + 1], glyphs.data[index + 2]],
        background,
      )

      if (coverage === null || coverage < floor) continue

      covered += 1
      const ink = painted(background)
      const ratio = contrastRatio(ink, background)
      if (ratio < worst) {
        worst = ratio
        worstBackground = background
        worstInk = ink
      }
    }
  }

  if (covered < MIN_GLYPH_PIXELS) return null

  return {
    background: worstBackground,
    box: `${Math.round(candidate.x)},${Math.round(candidate.y)} ${Math.round(candidate.width)}x${Math.round(candidate.height)}`,
    glyphPixels: covered,
    ink: worstInk,
    ratio: worst,
    required: candidate.large ? 3 : 4.5,
    sample: candidate.sample,
    selector: candidate.selector,
  }
}

export async function measurePaintedTextContrast(
  page: Page,
  incompleteNodes: readonly AxeTargetNode[],
  /* Floating chrome that is not part of the page under test. It is hidden for
     BOTH captures and never scored: the preview-exit pill is `position: fixed`
     and overlays whatever it is above, so left visible its own glyphs land
     inside other nodes' boxes and get read as their ink. tools/templates/
     capture.ts hides the same element for the same reason. */
  { chromeSelector = '[data-template-preview-exit]' }: { chromeSelector?: string } = {},
): Promise<PaintedContrastReport> {
  const selectors: string[] = []
  let skippedCrossFrame = 0

  for (const node of incompleteNodes) {
    const [first] = node.target
    if (node.target.length === 1 && typeof first === 'string') {
      selectors.push(first)
    } else {
      skippedCrossFrame += 1
    }
  }

  const report: PaintedContrastReport = {
    failures: [],
    measurable: 0,
    sampled: 0,
    skippedCrossFrame,
    skippedGradientInk: 0,
    skippedNoGlyphPixels: 0,
    skippedNoGlyphPixelsSelectors: [],
    scored: [],
    skippedUnresolved: 0,
    total: incompleteNodes.length,
    unresolvedSelectors: [],
  }

  if (selectors.length === 0) return report

  await settleDeferredImages(page)

  // Hidden before anything is measured, and for both captures. `fixed` chrome
  // does not participate in layout, so nothing else moves.
  const hiddenChrome = await page.addStyleTag({
    content: `${chromeSelector} { display: none !important; }`,
  })

  let glyphs: Raster
  let plate: Raster
  let measurable: Candidate[]

  try {
    const { candidates, unresolved } = await collectCandidates(page, selectors, chromeSelector)
    report.skippedUnresolved = unresolved.length
    report.unresolvedSelectors = unresolved
    measurable = candidates.filter((candidate) => !candidate.gradientInk)
    report.skippedGradientInk = candidates.length - measurable.length
    report.measurable = measurable.length

    if (measurable.length === 0) return report

    const pseudoElementTags = []
    try {
      pseudoElementTags.push(await repaintInk(page, `rgb(${SENTINEL_INK.join(', ')})`))
      glyphs = await decode(await page.screenshot({ fullPage: true }))

      pseudoElementTags.push(await repaintInk(page, 'transparent'))
      plate = await decode(await page.screenshot({ fullPage: true }))
    } finally {
      await restoreInk(page)
      for (const tag of pseudoElementTags) {
        await tag.evaluate((node) => node.parentNode?.removeChild(node))
      }
    }
  } finally {
    await hiddenChrome.evaluate((node) => node.parentNode?.removeChild(node))
  }

  /* If the document changed size between the captures, the coverage solve is
     comparing two different layouts. Refuse to score rather than invent
     pairings. */
  if (glyphs.width !== plate.width || glyphs.height !== plate.height) {
    throw new Error(
      `painted-contrast: the page moved between captures (${glyphs.width}x${glyphs.height} then ${plate.width}x${plate.height}). Something is still loading or animating — settle it before measuring.`,
    )
  }

  for (const candidate of measurable) {
    const scored = scoreCandidate(candidate, glyphs, plate)
    if (!scored) {
      report.skippedNoGlyphPixels += 1
      report.skippedNoGlyphPixelsSelectors.push(candidate.selector)
      continue
    }

    report.sampled += 1
    report.scored.push(scored)
    if (scored.ratio < scored.required) report.failures.push(scored)
  }

  const margin = (pairing: PaintedContrastPairing) => pairing.ratio / pairing.required
  report.scored.sort(
    (left, right) => margin(left) - margin(right) || left.selector.localeCompare(right.selector),
  )

  return report
}

const describePairing = (pairing: PaintedContrastPairing) =>
  `${pairing.ratio.toFixed(2)}:1 (needs ${pairing.required}:1) — painted ink rgb(${pairing.ink.join(
    ',',
  )}) on painted rgb(${pairing.background.join(',')}) over ${pairing.glyphPixels} glyph px at ${
    pairing.box
  } — ${pairing.selector} "${pairing.sample}"`

const TIGHTEST_REPORTED = 3

export function formatPaintedContrastReport(label: string, report: PaintedContrastReport) {
  const lines = [
    `${label}: ${report.sampled} of ${report.total} axe-incomplete pairing(s) scored against painted pixels (${report.measurable} measurable)`,
    `  skipped: ${report.skippedGradientInk} gradient-filled ink, ${report.skippedNoGlyphPixels} without glyph pixels, ${report.skippedCrossFrame} cross-frame, ${report.skippedUnresolved} unresolved`,
  ]

  if (report.scored.length === 0) {
    lines.push('  tightest: n/a')
  } else {
    for (const pairing of report.scored.slice(0, TIGHTEST_REPORTED)) {
      lines.push(`  tightest: ${describePairing(pairing)}`)
    }
  }

  for (const selector of report.skippedNoGlyphPixelsSelectors) {
    lines.push(`  no glyph pixels: ${selector}`)
  }
  for (const selector of report.unresolvedSelectors) lines.push(`  unresolved: ${selector}`)
  for (const failure of report.failures) lines.push(`  FAILS ${describePairing(failure)}`)

  return lines.join('\n')
}
