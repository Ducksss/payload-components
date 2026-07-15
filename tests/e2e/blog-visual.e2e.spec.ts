import { existsSync, readdirSync } from 'node:fs'

import { expect, test } from '@playwright/test'

const baseURL = `http://localhost:${process.env.E2E_PORT ?? '3100'}`
const snapshotDir = new URL('./blog-visual.e2e.spec.ts-snapshots/', import.meta.url)
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

  test('the current platform has complete blog baselines once minted', () => {
    const { config, project } = test.info()
    const updating = config.updateSnapshots !== 'none' && config.updateSnapshots !== 'missing'
    test.skip(updating, 'updating snapshots')

    const suffix = `-${project.name}-${process.platform}.png`
    const minted = existsSync(snapshotDir)
      ? readdirSync(snapshotDir).filter((file) => file.endsWith(suffix))
      : []
    test.skip(minted.length === 0, `No ${process.platform} blog baselines have been minted yet`)

    const missing = cases
      .map((entry) => `${entry.name}${suffix}`)
      .filter((filename) => !existsSync(new URL(filename, snapshotDir)))
    expect(missing, `Missing ${process.platform} blog baselines: ${missing.join(', ')}`).toEqual([])
  })

  for (const entry of cases) {
    test(`${entry.name} matches its visual baseline`, async ({ page }, testInfo) => {
      const baseline = new URL(
        `${entry.name}-${testInfo.project.name}-${process.platform}.png`,
        snapshotDir,
      )
      const updating =
        testInfo.config.updateSnapshots !== 'none' && testInfo.config.updateSnapshots !== 'missing'
      test.skip(
        !existsSync(baseline) && !updating,
        `No ${process.platform} baseline for ${entry.name}`,
      )

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
