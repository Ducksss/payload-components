import { readFileSync } from 'node:fs'

import { expect, test } from '@playwright/test'

import {
  expectCompletePlatformBaselines,
  skipWithoutPlatformBaseline,
  type VisualBaselines,
} from './support/visual-baselines'

/* Per-component visual baselines.
 *
 * Each block's demo twin is rendered alone on the chrome-free
 * /components/preview/[slug] route (no header/footer — see that route's note)
 * and captured full-page. This catches any visual drift the static
 * tests/int/visual-standards guard can't see — spacing, layout, wrapping, and
 * the rendered result of a colour change — across every component at once.
 *
 * Determinism (same recipe as the landing snapshot in frontend.e2e.spec.ts):
 *   - reducedMotion: 'reduce' settles the twins' load-reveal / marquee / orbit
 *     animations to their end state (the globals.css guard zeroes durations;
 *     `both`-filled keyframes leave the final frame). Orbit rings are paused
 *     until hover anyway.
 *   - animations: 'disabled' freezes anything still running at capture time.
 *   - awaiting document.fonts.ready avoids a pre-font-swap capture.
 *
 * Baselines are committed per platform; see ./support/visual-baselines.ts for
 * why, and for how the skip/coverage guards below behave. */

const baseURL = `http://localhost:${process.env.E2E_PORT ?? '3100'}`

/* Slugs are the demo registry's object keys, read as text so this spec never
 * imports the demo React modules. These are exactly the slugs the preview
 * route is statically generated for (registry.ts → generateStaticParams). */
const registrySource = readFileSync(
  new URL('../../src/components/site/demos/registry.ts', import.meta.url),
  'utf8',
)
const slugs = [...registrySource.matchAll(/^\s+'([a-z0-9-]+)':/gm)].map((match) => match[1])

const baselines: VisualBaselines = {
  label: 'component baselines',
  mintHint:
    'run the visual-baselines workflow, or locally: E2E_PORT=3100 pnpm test:e2e components-visual --update-snapshots',
  // Linux is the gate's renderer, so an unminted linux CI run is a real defect.
  requireMinted: process.platform === 'linux' && Boolean(process.env.CI),
  snapshotDir: new URL('./components-visual.e2e.spec.ts-snapshots/', import.meta.url),
}

const baselineStem = (slug: string) => `component-${slug}`

test.describe('Component visual snapshots', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' }, viewport: { height: 800, width: 1280 } })

  test('the demo registry exposes the component slugs', () => {
    // Guards against the registry-parse regex silently yielding nothing.
    expect(slugs.length).toBeGreaterThanOrEqual(30)
  })

  test('every component keeps a current-platform baseline once the platform is minted', () => {
    expectCompletePlatformBaselines(baselines, slugs.map(baselineStem))
  })

  for (const slug of slugs) {
    test(`${slug} matches its visual baseline`, async ({ page }) => {
      skipWithoutPlatformBaseline(baselines, baselineStem(slug))

      await page.goto(`${baseURL}/components/preview/${slug}`)
      await expect(page.locator('main')).toBeVisible()
      await page.evaluate(() => document.fonts.ready)

      await expect(page).toHaveScreenshot(`${baselineStem(slug)}.png`, {
        animations: 'disabled',
        fullPage: true,
        maxDiffPixelRatio: 0.01,
      })
    })
  }
})
