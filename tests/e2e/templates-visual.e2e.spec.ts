import { expect, test } from '@playwright/test'

import { templatePreviewHref, templateShowcases } from '../../src/lib/templates/registry'
import {
  expectCompletePlatformBaselines,
  skipWithoutPlatformBaseline,
  type VisualBaselines,
} from './support/visual-baselines'

/* Per-template-page visual baselines.
 *
 * Every showcase page is rendered on its raw, chrome-free full-preview route
 * (/templates/<slug>/preview/<page> — the template's own shell + composed
 * recipe, no SiteHeader/SiteFooter) and captured full-page at one desktop
 * (1280) and one mobile (390) width, so a template's scoped theme, shell, and
 * section rhythm can't drift silently. Baselines live in this spec's own
 * snapshot directory (templates-visual.e2e.spec.ts-snapshots/), fully isolated
 * from the per-component baselines; regenerate them only for intended visual
 * changes (bump the template's `revision` in the same change).
 *
 * Determinism (same recipe as components-visual.e2e.spec.ts):
 *   - reducedMotion: 'reduce' settles load-reveal / marquee animations to
 *     their end state (the globals.css guard zeroes durations);
 *   - animations: 'disabled' freezes anything still running at capture time;
 *   - awaiting document.fonts.ready and image decode avoids pre-swap captures.
 *
 * Baselines are committed per platform; see ./support/visual-baselines.ts for
 * why, and for how the skip/coverage guards below behave. */

const baseURL = `http://localhost:${process.env.E2E_PORT ?? '3100'}`

const cases = templateShowcases.flatMap((template) =>
  template.pages.map((page) => ({
    name: `${template.slug}-${page.path === '' ? 'home' : page.path}`,
    path: templatePreviewHref(template.slug, page.path),
  })),
)

const viewports = [
  { height: 800, label: 'desktop', width: 1280 },
  { height: 844, label: 'mobile', width: 390 },
] as const

const baselines: VisualBaselines = {
  label: 'template baselines',
  mintHint:
    'run the visual-baselines workflow, or locally: E2E_PORT=3100 pnpm test:e2e templates-visual --update-snapshots',
  snapshotDir: new URL('./templates-visual.e2e.spec.ts-snapshots/', import.meta.url),
}

const baselineStem = (name: string, viewport: string) => `template-${name}-${viewport}`

test.describe('Template visual snapshots', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } })

  test('the template registry exposes the showcase pages', () => {
    // Guards against the registry silently yielding an empty walk: two
    // launch concepts x five pages each.
    expect(cases.length).toBeGreaterThanOrEqual(10)
  })

  test('every template page keeps current-platform baselines once the platform is minted', () => {
    expectCompletePlatformBaselines(
      baselines,
      cases.flatMap(({ name }) => viewports.map((viewport) => baselineStem(name, viewport.label))),
    )
  })

  for (const { name, path } of cases) {
    for (const viewport of viewports) {
      test(`${name} (${viewport.label}) matches its visual baseline`, async ({ page }) => {
        skipWithoutPlatformBaseline(baselines, baselineStem(name, viewport.label))

        await page.setViewportSize({ height: viewport.height, width: viewport.width })
        await page.goto(`${baseURL}${path}`)
        await expect(page.locator('[data-template-canvas]')).toBeVisible()
        await page.evaluate(() => document.fonts.ready)
        // Template pages may carry real assets (public/templates/<slug>/…) —
        // wait for every image decode so a capture never races a paint.
        await page.evaluate(async () => {
          await Promise.all(
            Array.from(document.images, (image) => image.decode().catch(() => undefined)),
          )
        })

        await expect(page).toHaveScreenshot(`${baselineStem(name, viewport.label)}.png`, {
          animations: 'disabled',
          fullPage: true,
          maxDiffPixelRatio: 0.01,
        })
      })
    }
  }
})
