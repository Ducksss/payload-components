import { expect, test } from '@playwright/test'

import { grantConsent } from './consent'
import {
  expectCompletePlatformBaselines,
  skipWithoutPlatformBaseline,
  type VisualBaselines,
} from './support/visual-baselines'

/* Blog index + article visual baselines, captured at one desktop and one mobile
 * width under reduced motion. See ./support/visual-baselines.ts for why
 * baselines are committed per platform and how the skip/coverage guards below
 * behave. */

const baseURL = `http://localhost:${process.env.E2E_PORT ?? '3100'}`

const baselines: VisualBaselines = {
  label: 'blog baselines',
  mintHint:
    'run the visual-baselines workflow, or locally: E2E_PORT=3100 pnpm test:e2e blog-visual --update-snapshots',
  // Linux is the gate's renderer, so an unminted linux CI run is a real defect.
  requireMinted: process.platform === 'linux' && Boolean(process.env.CI),
  snapshotDir: new URL('./blog-visual.e2e.spec.ts-snapshots/', import.meta.url),
}

const cases = [
  { height: 900, name: 'blog-index-desktop', path: '/blog', width: 1440 },
  { height: 844, name: 'blog-index-mobile', path: '/blog', width: 390 },
  {
    height: 900,
    name: 'blog-article-desktop',
    path: '/blog/what-is-a-payload-cms-block',
    width: 1440,
  },
  {
    height: 844,
    name: 'blog-article-mobile',
    path: '/blog/what-is-a-payload-cms-block',
    width: 390,
  },
] as const

test.describe('Blog visual snapshots', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } })
  test.beforeEach(async ({ context }) => grantConsent(context))

  test('the current platform has complete blog baselines once minted', () => {
    expectCompletePlatformBaselines(
      baselines,
      cases.map((entry) => entry.name),
    )
  })

  for (const entry of cases) {
    test(`${entry.name} matches its visual baseline`, async ({ page }) => {
      skipWithoutPlatformBaseline(baselines, entry.name)

      await page.setViewportSize({ height: entry.height, width: entry.width })
      await page.goto(`${baseURL}${entry.path}`)
      await page.evaluate(async () => {
        await document.fonts.ready
        const visibleImages = [...document.images].filter((image) => {
          const bounds = image.getBoundingClientRect()
          return bounds.bottom > 0 && bounds.top < window.innerHeight
        })
        await Promise.all(
          visibleImages.map((image) =>
            image.complete
              ? Promise.resolve()
              : new Promise<void>((resolve) => {
                  image.addEventListener('error', () => resolve(), { once: true })
                  image.addEventListener('load', () => resolve(), { once: true })
                }),
          ),
        )
      })

      await expect(page).toHaveScreenshot(`${entry.name}.png`, {
        animations: 'disabled',
        fullPage: false,
        maxDiffPixelRatio: 0.01,
      })
    })
  }
})
