import { existsSync, readFileSync } from 'node:fs'

import { expect, test } from '@playwright/test'

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
 * Cross-platform rendering differs (darwin vs linux/CI), so baselines are
 * committed per platform and a small maxDiffPixelRatio absorbs sub-pixel noise.
 * A platform's baseline must be generated in that platform's own renderer — the
 * amd64 CI image won't match an arm64 dev box — so each case SKIPS when its
 * current-platform baseline is absent rather than failing the gate. Mint the
 * missing ones (e.g. on the linux gate) and commit the resulting
 * *-<platform>.png files with:
 *   E2E_PORT=3100 pnpm test:e2e components-visual --update-snapshots */

const baseURL = `http://localhost:${process.env.E2E_PORT ?? '3100'}`

/* Slugs are the demo registry's object keys, read as text so this spec never
 * imports the demo React modules. These are exactly the slugs the preview
 * route is statically generated for (registry.ts → generateStaticParams). */
const registrySource = readFileSync(
  new URL('../../src/components/site/demos/registry.ts', import.meta.url),
  'utf8',
)
const slugs = [...registrySource.matchAll(/^\s+'([a-z0-9-]+)':/gm)].map((match) => match[1])

const snapshotDir = new URL('./components-visual.e2e.spec.ts-snapshots/', import.meta.url)

test.describe('Component visual snapshots', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' }, viewport: { height: 800, width: 1280 } })

  test('the demo registry exposes the component slugs', () => {
    // Guards against the registry-parse regex silently yielding nothing.
    expect(slugs.length).toBeGreaterThanOrEqual(30)
  })

  for (const slug of slugs) {
    test(`${slug} matches its visual baseline`, async ({ page }, testInfo) => {
      const baseline = new URL(
        `component-${slug}-${testInfo.project.name}-${process.platform}.png`,
        snapshotDir,
      )
      // Skip a missing-baseline case on a normal run (keeps the gate green
      // until that platform's baselines are minted) but never when explicitly
      // updating, or --update-snapshots could never create them. "Updating" is
      // an overwrite mode (all/changed); the default 'missing'/'none' compare
      // modes must skip rather than write-and-fail on a first-seen platform.
      const mode = testInfo.config.updateSnapshots
      const updating = mode !== 'none' && mode !== 'missing'
      test.skip(
        !existsSync(baseline) && !updating,
        `No ${process.platform} baseline for ${slug} — run: E2E_PORT=3100 pnpm test:e2e components-visual --update-snapshots`,
      )

      await page.goto(`${baseURL}/components/preview/${slug}`)
      await expect(page.locator('main')).toBeVisible()
      await page.evaluate(() => document.fonts.ready)

      await expect(page).toHaveScreenshot(`component-${slug}.png`, {
        animations: 'disabled',
        fullPage: true,
        maxDiffPixelRatio: 0.01,
      })
    })
  }
})
