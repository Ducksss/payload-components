import { expect, test } from '@playwright/test'

import {
  catalogTitle,
  heroHeadline,
  componentEntries,
  landingSections,
  primaryInstallCommand,
  terminalDemoLines,
} from '../../src/lib/site'

const baseURL = `http://localhost:${process.env.E2E_PORT ?? '3000'}`
const googleTagId = 'G-EMGRZ0H9R9'

test.describe('Light shadcn frontend', () => {
  test('installs the Google tag once', async ({ page }) => {
    await page.goto(baseURL)

    await expect(
      page.locator(`script[src="https://www.googletagmanager.com/gtag/js?id=${googleTagId}"]`),
    ).toHaveCount(1)
    await expect(page.locator('script#google-tag')).toHaveCount(1)
    const inlineGoogleTag = await page
      .locator('script#google-tag')
      .evaluate((script) => script.textContent ?? '')
    expect(inlineGoogleTag).toContain(`gtag('config', '${googleTagId}')`)
  })

  test('renders the light token-driven homepage', async ({ page }) => {
    await page.goto(baseURL)

    await expect(page).toHaveTitle(/Payload Components/)
    await expect(page.getByRole('heading', { level: 1, name: heroHeadline })).toBeVisible()
    await expect(page.locator('code', { hasText: primaryInstallCommand }).first()).toBeVisible()

    // Forced single light theme: the dark class must never appear.
    await expect(page.locator('html')).not.toHaveClass(/dark/)

    // The body background must resolve from the --background token rather
    // than any hardcoded color, so the assertion derives its expectation
    // from the same token in-page.
    const { actual, expected } = await page.evaluate(() => {
      const probe = document.createElement('div')
      probe.style.backgroundColor = 'var(--background)'
      document.body.appendChild(probe)
      const resolved = getComputedStyle(probe).backgroundColor
      probe.remove()

      return {
        actual: getComputedStyle(document.body).backgroundColor,
        expected: resolved,
      }
    })

    expect(expected).not.toBe('rgba(0, 0, 0, 0)')
    expect(actual).toBe(expected)

    // "Light themed first": the resolved background must actually be light.
    // A canvas normalizes any CSS color syntax (oklch included) to sRGB bytes.
    const meanChannel = await page.evaluate(() => {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      const ctx = canvas.getContext('2d')
      if (!ctx) return -1
      ctx.fillStyle = getComputedStyle(document.body).backgroundColor
      ctx.fillRect(0, 0, 1, 1)
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
      return (r + g + b) / 3
    })
    expect(meanChannel).toBeGreaterThan(220)
  })

  test('exposes docs, catalog, component pages, and no horizontal overflow', async ({ page }) => {
    const routes = [
      {
        h1: heroHeadline,
        path: '/',
        title: /Payload Components/,
      },
      {
        h1: 'Start Here',
        path: '/docs',
        title: /Start Here/,
      },
      {
        h1: 'Architecture',
        path: '/docs/architecture',
        title: /Architecture/,
      },
      {
        h1: catalogTitle,
        path: '/components',
        title: /Payload CMS Block Catalog/,
      },
      {
        h1: 'Why Payload Components exists',
        path: '/about',
        title: /About/,
      },
      ...componentEntries.map((component) => ({
        h1: component.title,
        path: component.href,
        title: new RegExp(component.title),
      })),
    ]

    for (const route of routes) {
      await page.goto(`${baseURL}${route.path}`)
      await expect(page).toHaveTitle(route.title)
      await expect(page.getByRole('heading', { level: 1, name: route.h1 })).toBeVisible()

      const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      )
      expect(hasHorizontalOverflow).toBe(false)
    }
  })

  test('drives the responsive component preview frame', async ({ page }) => {
    await page.goto(`${baseURL}/docs/components/hero-basic`)

    const frame = page.locator('iframe[title="Hero Basic preview"]')
    await expect(frame).toBeVisible()

    // Viewport presets are a toggle group; Mobile constrains the frame width.
    const mobile = page.getByRole('button', { name: 'Mobile' })
    await expect(mobile).toHaveAttribute('aria-pressed', 'false')
    await mobile.click()
    await expect(mobile).toHaveAttribute('aria-pressed', 'true')
    await expect.poll(async () => (await frame.boundingBox())?.width ?? 0).toBeLessThanOrEqual(400)
  })

  test('serves the standalone preview route without site chrome or overflow', async ({ page }) => {
    await page.goto(`${baseURL}/components/preview/hero-basic`)

    await expect(page.locator('main')).toBeVisible()
    // The bare iframe target inherits only the root layout — no header/footer.
    await expect(page.getByRole('contentinfo')).toHaveCount(0)

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    )
    expect(hasHorizontalOverflow).toBe(false)
  })

  test('redirects old kit docs URLs to component docs', async ({ page }) => {
    await page.goto(`${baseURL}/docs/kits/hero-basic`)
    expect(page.url()).toBe(`${baseURL}/docs/components/hero-basic`)
    await expect(page.getByRole('heading', { level: 1, name: 'Hero Basic' })).toBeVisible()

    await page.goto(`${baseURL}/docs/what-is-a-payload-kit`)
    expect(page.url()).toBe(`${baseURL}/docs/what-is-a-payload-component`)
  })

  test('filters the catalog from URL search params', async ({ page }) => {
    await page.goto(`${baseURL}/components?q=bento`)

    await expect(page.locator('#feature-bento')).toBeVisible()
    await expect(page.locator('#hero-basic')).toBeHidden()
    await expect(page.getByLabel('Search components')).toHaveValue('bento')

    await page.goto(`${baseURL}/components?category=features`)

    await expect(page.locator('#feature-grid-basic')).toBeVisible()
    await expect(page.locator('#feature-steps')).toBeVisible()
    await expect(page.locator('#hero-basic')).toBeHidden()
  })

  test('exposes every landing section, the footer, and each component', async ({ page }) => {
    await page.goto(baseURL)

    for (const section of Object.values(landingSections)) {
      await expect(page.getByRole('heading', { level: 2, name: section.heading })).toBeVisible()
    }

    for (const component of componentEntries) {
      await expect(page.locator('code', { hasText: component.command }).first()).toBeVisible()
    }

    await expect(page.getByRole('contentinfo')).toBeVisible()
    await expect(page.getByRole('link', { name: /GitHub/ }).first()).toBeVisible()
  })

  test('exposes the Fumadocs docs shell navigation', async ({ page }) => {
    await page.goto(`${baseURL}/docs`)

    const sidebar = page.locator('#nd-sidebar')

    await expect(sidebar.getByRole('link', { name: 'Architecture' })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Installation' })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Registry Contract' })).toBeVisible()
    // Components are grouped install-mode → family in the sidebar (see src/lib/component-page-tree).
    await expect(sidebar.getByRole('button', { name: 'Page blocks' })).toBeVisible()
    await expect(sidebar.getByRole('button', { name: 'Feature' })).toBeVisible()
    await expect(sidebar.getByRole('button', { name: /Search/ })).toBeVisible()
  })

  test('exposes a working command copy control', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto(baseURL)

    await page.getByRole('button', { name: 'Copy' }).first().click()

    await expect(page.getByRole('button', { name: 'Copied' })).toBeVisible()
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe(primaryInstallCommand)
  })
})

test.describe('Reduced motion', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } })

  test('terminal replay renders its final transcript without animation', async ({ page }) => {
    await page.goto(baseURL)

    const lastLine = terminalDemoLines[terminalDemoLines.length - 1]
    await expect(page.getByText(lastLine.text).first()).toBeVisible()

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    )
    expect(hasHorizontalOverflow).toBe(false)
  })

  test('opens the Fumadocs search dialog from the docs shell', async ({ page }) => {
    await page.goto(`${baseURL}/docs`)

    await page.getByRole('button', { name: /Search/ }).first().click()

    await expect(page.getByRole('dialog')).toBeVisible()
  })
})
