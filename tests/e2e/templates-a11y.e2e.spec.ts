import AxeBuilder from '@axe-core/playwright'
import { expect, type Frame, type Page, test } from '@playwright/test'

import {
  templateDetailHref,
  templatePreviewHref,
  templateShowcases,
} from '../../src/lib/templates/registry'
import { formatPaintedContrastReport, measurePaintedTextContrast } from './support/painted-contrast'

/* Accessibility sweep across EVERY template concept — its /templates/<slug>
 * detail page and its chrome-free /templates/<slug>/preview shell — at one
 * desktop (1280) and one mobile (390) width, plus the gallery itself.
 *
 * Each concept ships its own scoped theme, palette, and hand-tuned contrast, so
 * a sweep pinned to one concept (which is what this started as, inside
 * templates.e2e.spec.ts) leaves every other concept's bespoke theming
 * unguarded. Data-driven from src/lib/templates/registry, so a new concept is
 * covered the moment it is registered.
 *
 * Isolated in its own Playwright batch (tools/run-e2e.ts) the way
 * templates-visual is: ~40 axe runs plus the pixel pass below is its own unit
 * of work, and a fresh Next server per batch keeps Turbopack from holding every
 * compiled route set in one heap.
 *
 * Two hazards this suite has to handle, or it reports noise:
 *
 * 1. UN-SETTLED REVEALS. Straight after goto, in-view sections driven by the
 *    shared TemplateSectionReveal choreography (and the per-concept reveals
 *    layered on top) are mid-fade, and axe reads ink at ~13% opacity as a
 *    *serious* colour-contrast violation. Every suite here runs under
 *    reducedMotion: 'reduce', where the CSS nets — template-motion.css,
 *    template-surface-motion.css, and each concept's own
 *    @media (prefers-reduced-motion: reduce) block — pin the final frame before
 *    hydration, so nothing is ever sampled mid-transition. expectSettledReveals
 *    then proves that per page rather than trusting it: a future concept that
 *    adds a reveal attribute without a matching net fails loudly, naming the
 *    element, instead of quietly re-introducing flake.
 *
 * 2. GRADIENT PLATES. axe cannot resolve a gradient (or image) background, so
 *    it reports text over one as `incomplete` — never as a `violation`. Several
 *    concepts put ink on exactly that (hero-aurora's aurora field,
 *    hero-kinetic's letterbox still, tinted CTA bands), which is 13-72 unjudged
 *    nodes per page: a green axe run alone proves nothing about them. The
 *    preview sweeps therefore hand axe's own incomplete list to
 *    measurePaintedTextContrast, which scores each pairing against the pixels
 *    the browser actually painted (see ./support/painted-contrast.ts). What
 *    that pass cannot score — gradient-FILLED ink, cross-frame nodes, and the
 *    position: fixed preview-exit pill, whose place in a full-page capture does
 *    not match its document box — it reports as skipped instead of passing
 *    silently.
 *
 * Scope: the home preview of each concept, where every shell's chrome and its
 * hero plate live. The other four pages per concept are held by
 * templates-visual.e2e.spec.ts baselines, so theming drift there is still
 * caught — just visually rather than by axe. */

const baseURL = `http://localhost:${process.env.E2E_PORT ?? '3100'}`

const viewports = [
  { height: 900, label: 'desktop', width: 1280 },
  { height: 844, label: 'mobile', width: 390 },
] as const

/* Consent is deliberately NOT granted: like a11y.e2e.spec.ts, this sweep keeps
   the undecided consent banner inside axe's scope so sitewide chrome is held to
   the same bar on these routes. Nothing here clicks, so the fixed banner cannot
   intercept anything.

   The banner has to be WAITED for, though. It is client-rendered and lands
   100-200ms after document.fonts.ready, so analysing at fonts.ready samples the
   page before it exists — and that is exactly what happened: the same suite saw
   it on a warm detail route and missed it on the gallery, making its coverage a
   coin toss. The preview routes never mount it (AnalyticsShell returns null
   there, which templates.e2e.spec.ts pins), so it is only awaited where it is
   genuinely expected. */
const CONSENT_BANNER = '[data-consent-banner]'

/* Every element the reveal choreography animates: the shared section wrapper,
   the detail-page content reveals ([data-template-motion]), and each concept's
   own reveal attribute ([data-relay-reveal], [data-ledgerline-reveal], …). The
   attribute is matched by shape so a new concept's reveal is covered without
   touching this file. */
async function findUnsettledReveals(frame: Frame) {
  return frame.evaluate(() => {
    const unsettled: string[] = []

    for (const element of Array.from(document.querySelectorAll('*'))) {
      const attributes = element.getAttributeNames()
      const animated =
        element.hasAttribute('data-template-section') ||
        attributes.some((name) => /^data-[a-z0-9-]*(?:reveal|motion)$/.test(name))
      if (!animated) continue

      const style = getComputedStyle(element)
      /* Three spellings of "no transform", because Chromium reports whichever
         one the declaration produced. A settled reveal written as translate3d or
         carrying a translateZ(0) compositor hint serialises as matrix3d, so
         matching only the 2D identity would report it unsettled and fail the
         gate for a reveal that is in fact exactly where it belongs. */
      const settledTransform =
        style.transform === 'none' ||
        style.transform === 'matrix(1, 0, 0, 1, 0, 0)' ||
        style.transform === 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)'
      if (style.opacity === '1' && settledTransform) continue

      const identity = attributes
        .filter((name) => name.startsWith('data-') && /reveal|motion|section/.test(name))
        .map((name) => `${name}="${element.getAttribute(name)}"`)
        .join(' ')
      unsettled.push(
        `<${element.tagName.toLowerCase()} ${identity}> opacity=${style.opacity} transform=${style.transform}`,
      )
    }

    return unsettled
  })
}

/* Reduced motion should pin every reveal to its final frame before axe looks.
   Asserted across frames because the detail page mounts the preview in an
   iframe — and axe descends into it. A sub-frame that detaches mid-check is not
   a finding; a failure in the main frame is, so only the sub-frames are
   forgiven. */
async function expectSettledReveals(page: Page, label: string) {
  const unsettled: string[] = []

  for (const frame of page.frames()) {
    unsettled.push(
      ...(frame === page.mainFrame()
        ? await findUnsettledReveals(frame)
        : await findUnsettledReveals(frame).catch(() => [])),
    )
  }

  expect(
    unsettled,
    `${label}: ${unsettled.length} reveal element(s) were still mid-transition under reducedMotion — a reveal attribute is missing its @media (prefers-reduced-motion: reduce) net, so axe would sample fading ink as a contrast violation:\n  ${unsettled.join('\n  ')}`,
  ).toEqual([])
}

async function settle(page: Page, { consentBanner = false } = {}) {
  // Before fonts.ready: the banner mounting later would shift nothing, but axe
  // must not run until it is actually in the tree.
  if (consentBanner) await expect(page.locator(CONSENT_BANNER)).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  /* Template pages carry real assets — decode the loaded ones so neither axe
     nor the painted-contrast capture races a paint. Only `complete` images:
     goto already waited for `load`, and decode() on an off-screen
     loading="lazy" image (the detail page's page-poster grid) never settles. */
  await page.evaluate(async () => {
    await Promise.all(
      Array.from(document.images)
        .filter((image) => image.complete)
        .map((image) => image.decode().catch(() => undefined)),
    )
  })
}

async function analyze(page: Page) {
  return new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
}

function expectNoBlockingViolations(results: Awaited<ReturnType<typeof analyze>>, label: string) {
  const blocking = results.violations.filter(
    (violation) => violation.impact === 'critical' || violation.impact === 'serious',
  )

  const report = blocking
    .map(
      (violation) =>
        `${violation.id} (${violation.impact}): ${violation.help} — ${violation.nodes.length} node(s)\n  ${violation.helpUrl}\n  ${violation.nodes
          .slice(0, 5)
          .map((node) => node.target.join(' >>> '))
          .join('\n  ')}`,
    )
    .join('\n')

  expect(blocking, `${label}\n${report}`).toEqual([])
}

test.describe('Templates accessibility (axe-core, WCAG 2.1 A/AA)', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } })

  test('sweeps every registered concept at both widths', () => {
    /* Guards against the registry silently yielding an empty walk: a batch of
       zero generated tests would otherwise report green. */
    expect(templateShowcases.length).toBeGreaterThan(0)
    expect(viewports.map((viewport) => viewport.width)).toEqual([1280, 390])
  })

  for (const viewport of viewports) {
    test(`templates gallery (${viewport.label}) has no serious or critical violations`, async ({
      page,
    }) => {
      await page.setViewportSize({ height: viewport.height, width: viewport.width })
      await page.goto(`${baseURL}/templates`)
      await settle(page, { consentBanner: true })

      await expectSettledReveals(page, `gallery (${viewport.label})`)
      expectNoBlockingViolations(await analyze(page), `gallery (${viewport.label})`)
    })

    for (const template of templateShowcases) {
      test(`${template.slug} detail (${viewport.label}) has no serious or critical violations`, async ({
        page,
      }) => {
        const label = `${template.slug} detail (${viewport.label})`

        await page.setViewportSize({ height: viewport.height, width: viewport.width })
        await page.goto(`${baseURL}${templateDetailHref(template.slug)}`)
        await expect(page.getByRole('heading', { level: 1, name: template.title })).toBeVisible()
        await settle(page, { consentBanner: true })

        await expectSettledReveals(page, label)
        expectNoBlockingViolations(await analyze(page), label)
      })

      test(`${template.slug} full preview (${viewport.label}) passes axe and painted-pixel contrast`, async ({
        page,
      }) => {
        const label = `${template.slug} preview (${viewport.label})`

        await page.setViewportSize({ height: viewport.height, width: viewport.width })
        await page.goto(`${baseURL}${templatePreviewHref(template.slug)}`)
        await expect(page.locator('[data-template-canvas]')).toBeVisible()
        await settle(page)

        await expectSettledReveals(page, label)

        const results = await analyze(page)
        expectNoBlockingViolations(results, label)

        /* Everything axe declined to judge, measured against painted pixels —
           this is the only check that covers the concepts' gradient plates. */
        const incomplete = results.incomplete.find((entry) => entry.id === 'color-contrast')
        const painted = await measurePaintedTextContrast(page, incomplete?.nodes ?? [])
        const report = formatPaintedContrastReport(label, painted)

        expect(painted.failures, report).toEqual([])

        /* A pass that silently scores nothing is worthless. `measurable` counts
           the pairings this method can score at all, so if any were in reach and
           none produced glyph pixels, the capture and the boxes have stopped
           lining up — fail rather than report a vacuous green. */
        if (painted.measurable > 0) {
          expect(painted.sampled, `${report}\n  (no glyph pixels were found)`).toBeGreaterThan(0)
        }
        /* Logged, not implied: the run states how many pairings it actually
           scored and what it could not, so "green" is never mistaken for
           "everything was checked". */
        console.log(report)
      })
    }
  }
})
