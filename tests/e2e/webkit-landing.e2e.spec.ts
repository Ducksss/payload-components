import { expect, test } from '@playwright/test'

import { grantConsent } from './consent'

/* Cross-engine guard for the component wall's type.
 *
 * The wall lays each demo twin out at 1280px and shrinks it to fit a 231px card.
 * That is the whole trick — it buys a real desktop type ramp at thumbnail size.
 * It is also exactly the shape WebKit's text autosizer is built to "rescue": a
 * block laid out far wider than the viewport. WebKit compares the 1280px layout
 * against a 390px viewport and multiplies the type of the whole cluster, without
 * accounting for the scale. The boxes stay card-sized, the text does not, and
 * every twin collapses into overlapping lines.
 *
 * That shipped. The wall was unreadable on iOS while Chromium rendered it
 * perfectly, and nothing caught it: the visual suite is Chromium-only, so a
 * WebKit-only rendering bug is invisible to every baseline we own. Measured on
 * the real page it was 16px -> 49.87px, a 3.117x boost tracking 1280/390.
 *
 * The fix was `transform: scale` instead of `zoom` (a transform is a paint-time
 * operation the autosizer never engages with). `-webkit-text-size-adjust` does
 * NOT opt out of this — `none` and `100%` were both verified inert, at the root
 * and on the element — so there is no declaration to assert the presence of.
 * The only durable check is the rendered outcome, which is what this does.
 *
 * Bounds rather than a pinned type ramp: authored leaf text inside a wall twin
 * spans 12px..48px (measured across all 320 leaf nodes, identical in both
 * engines once fixed). The autosizer multiplies a cluster uniformly, so the
 * boost that shipped took the floor to ~37px and the ceiling to ~150px. The
 * bounds below sit well outside the authored range and well inside the boosted
 * one, so the twins' type can be redesigned freely and this still fails loudly
 * on any re-inflation.
 *
 * Runs in BOTH projects on purpose. WebKit is the engine that regressed; the
 * Chromium run is the control that proves the assertion tracks real inflation
 * rather than something WebKit-specific about how it reports font sizes. */

const baseURL = `http://localhost:${process.env.E2E_PORT ?? '3100'}`

/* Authored floor is 12px; the shipped boost put the floor at ~37px. */
const SMALLEST_TEXT_CEILING_PX = 16
/* Authored ceiling is 48px; the shipped boost put the ceiling at ~150px. */
const LARGEST_TEXT_CEILING_PX = 64

test.beforeEach(async ({ context }) => grantConsent(context))

test.describe('Component wall type', () => {
  test('is not inflated by the rendering engine at mobile width', async ({ page }) => {
    // 390px is the worst case: the boost scales with layoutWidth/viewport, so the
    // narrowest supported viewport against a fixed 1280px layout is the peak.
    await page.setViewportSize({ height: 844, width: 390 })
    await page.goto(baseURL, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('.wall-card-frame')
    await page.evaluate(() => document.fonts.ready)

    const measured = await page.evaluate(() => {
      const sizes: number[] = []
      for (const frame of document.querySelectorAll('.wall-card-frame')) {
        for (const element of frame.querySelectorAll('*')) {
          // Leaf text only: a wrapper inherits its child's box and would double-count.
          if (element.children.length > 0) continue
          if (!element.textContent?.trim()) continue
          sizes.push(Number.parseFloat(getComputedStyle(element).fontSize))
        }
      }
      return sizes
    })

    // Guards the selectors above: an empty set would make every bound below pass.
    expect(measured.length, 'no leaf text found inside .wall-card-frame').toBeGreaterThan(50)

    const smallest = Math.min(...measured)
    const largest = Math.max(...measured)
    const detail = `smallest=${smallest}px largest=${largest}px across ${measured.length} nodes`

    expect(smallest, `wall type inflated (${detail}) — see this spec's header`).toBeLessThanOrEqual(
      SMALLEST_TEXT_CEILING_PX,
    )
    expect(largest, `wall type inflated (${detail}) — see this spec's header`).toBeLessThanOrEqual(
      LARGEST_TEXT_CEILING_PX,
    )
  })
})
