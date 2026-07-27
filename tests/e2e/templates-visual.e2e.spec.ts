import { existsSync, readdirSync } from 'node:fs'

import { expect, test } from '@playwright/test'

import { grantConsent } from './consent'

import { templatePreviewHref, templateShowcases } from '../../src/lib/templates/registry'

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
 * Cross-platform rendering differs (darwin vs linux/CI), so baselines are
 * committed per platform and each case SKIPS while its current-platform
 * baseline is absent. Mint them in the renderer the gate uses with the
 * `visual-baselines` workflow (or locally with `E2E_PORT=3100 pnpm test:e2e
 * templates-visual --update-snapshots`) and commit the *-<platform>.png files.
 * Once a platform has any baseline, the coverage guard fails loudly on a page
 * shipped without one. */

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

const snapshotDir = new URL('./templates-visual.e2e.spec.ts-snapshots/', import.meta.url)

test.describe('Template visual snapshots', () => {
  test.beforeEach(async ({ context }) => grantConsent(context))
  test.use({ contextOptions: { reducedMotion: 'reduce' } })

  test('the template registry exposes the showcase pages', () => {
    // Guards against the registry silently yielding an empty walk: two
    // launch concepts x five pages each.
    expect(cases.length).toBeGreaterThanOrEqual(10)
  })

  test('every template page keeps current-platform baselines once the platform is minted', () => {
    const { config, project } = test.info()
    const mode = config.updateSnapshots
    const updating = mode !== 'none' && mode !== 'missing'
    // Nothing to enforce while baselines are being (re)generated.
    test.skip(updating, 'updating snapshots')

    const suffix = `-${project.name}-${process.platform}.png`
    const minted = existsSync(snapshotDir)
      ? readdirSync(snapshotDir).filter((file) => file.endsWith(suffix))
      : []
    // A platform with zero baselines hasn't been minted yet (e.g. a fresh CI
    // image before the visual-baselines workflow runs) — stay green there.
    test.skip(
      minted.length === 0,
      `No ${process.platform} template baselines yet — run the visual-baselines workflow`,
    )

    // Once the platform is minted, a missing baseline is a real gap (a page
    // added without its baseline) and must fail rather than silently skip.
    const missing = cases.flatMap(({ name }) =>
      viewports
        .filter(
          (viewport) =>
            !existsSync(new URL(`template-${name}-${viewport.label}${suffix}`, snapshotDir)),
        )
        .map((viewport) => `template-${name}-${viewport.label}`),
    )
    expect(
      missing,
      `Missing ${process.platform} template baselines (run the visual-baselines workflow): ${missing.join(', ')}`,
    ).toEqual([])
  })

  for (const { name, path } of cases) {
    for (const viewport of viewports) {
      test(`${name} (${viewport.label}) matches its visual baseline`, async ({
        page,
      }, testInfo) => {
        const baseline = new URL(
          `template-${name}-${viewport.label}-${testInfo.project.name}-${process.platform}.png`,
          snapshotDir,
        )
        // Skip a missing-baseline case on a normal run (keeps the gate green
        // until that platform's baselines are minted) but never when explicitly
        // updating, or --update-snapshots could never create them. "Updating"
        // is an overwrite mode (all/changed); the default 'missing'/'none'
        // compare modes must skip rather than write-and-fail on a first-seen
        // platform.
        const mode = testInfo.config.updateSnapshots
        const updating = mode !== 'none' && mode !== 'missing'
        test.skip(
          !existsSync(baseline) && !updating,
          `No ${process.platform} baseline for ${name} (${viewport.label}) — run: E2E_PORT=3100 pnpm test:e2e templates-visual --update-snapshots`,
        )

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

        await expect(page).toHaveScreenshot(`template-${name}-${viewport.label}.png`, {
          animations: 'disabled',
          fullPage: true,
          maxDiffPixelRatio: 0.01,
        })
      })
    }
  }
})
