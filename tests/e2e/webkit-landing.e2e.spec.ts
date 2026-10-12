import { expect, test } from '@playwright/test'

import { grantConsent } from './support/consent'

/* Cross-engine guard for the type of the demo twins the landing renders.
 *
 * The landing bench shows real twins through DemoFitFrame, which lays each one
 * out at twice its frame's width and shrinks it with CSS `zoom: 0.5`. A block
 * laid out wider than the viewport is exactly what WebKit's text autosizer is
 * built to "rescue": it multiplies the type of the whole cluster without
 * accounting for the zoom. At 0.5 that boost is small (measured ~1.125x on a
 * 390px viewport, cosmetic); the landing's earlier component wall laid twins
 * out at 1280px and was boosted 3.1x, which made every twin unreadable on iOS
 * while Chromium rendered it perfectly. The visual suite is Chromium-only, so
 * a WebKit-only regression is invisible to every baseline we own.
 *
 * `-webkit-text-size-adjust` does NOT opt out of this (verified inert), so the
 * only durable check is the rendered outcome. Bounds rather than a pinned type
 * ramp. Measured on the bench's hero-basic twin at 390px: Chromium renders its
 * leaf text at 12..36px; WebKit lifts everything small to an 18px floor and
 * leaves the 36px headline alone — the accepted, cosmetic boost. A uniform 3x
 * boost, the shape that broke the wall, would put the floor near 36px and the
 * ceiling past 100px, so the bounds sit above the accepted boost and well
 * inside a broken one.
 *
 * Runs in BOTH projects on purpose: the Chromium run is the control that proves
 * the assertion tracks real inflation, not how WebKit reports font sizes. */

const baseURL = `http://localhost:${process.env.E2E_PORT ?? '3100'}`

/* WebKit's accepted floor is 18px; a 3x boost puts it near 36px. */
const SMALLEST_TEXT_CEILING_PX = 24
/* The authored ceiling is 36px in both engines; a 3x boost passes 100px. */
const LARGEST_TEXT_CEILING_PX = 64

test.beforeEach(async ({ context }) => grantConsent(context))

test.describe('Landing twin type', () => {
  test('is not inflated by the rendering engine at mobile width', async ({ page }) => {
    // 390px is the worst case: the boost scales with layoutWidth/viewport.
    await page.setViewportSize({ height: 844, width: 390 })
    await page.goto(baseURL, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('.bench-page [data-active] .bench-twin')
    await page.evaluate(() => document.fonts.ready)

    const measured = await page.evaluate(() => {
      const sizes: number[] = []
      for (const frame of document.querySelectorAll('.bench-page [data-active] .bench-twin')) {
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
    expect(measured.length, 'no leaf text found inside the bench twin').toBeGreaterThan(5)

    const smallest = Math.min(...measured)
    const largest = Math.max(...measured)
    const detail = `smallest=${smallest}px largest=${largest}px across ${measured.length} nodes`

    expect(smallest, `twin type inflated (${detail}) — see this spec's header`).toBeLessThanOrEqual(
      SMALLEST_TEXT_CEILING_PX,
    )
    expect(largest, `twin type inflated (${detail}) — see this spec's header`).toBeLessThanOrEqual(
      LARGEST_TEXT_CEILING_PX,
    )
  })
})
