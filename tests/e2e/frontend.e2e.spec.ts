import { expect, test } from '@playwright/test'

const baseURL = 'http://localhost:3000'

test.describe('Fumadocs-first frontend', () => {
  test('loads the light-first homepage', async ({ page }) => {
    await page.goto(baseURL)

    await expect(page).toHaveTitle(/Payload Kits/)
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Fumadocs-first docs for installable Payload kits.',
      }),
    ).toBeVisible()
    await expect(
      page.locator('code', { hasText: 'npx payload-kit add hero-basic' }).first(),
    ).toBeVisible()

    const background = await page
      .locator('main')
      .evaluate((element) => getComputedStyle(element).backgroundColor)
    expect(background).toBe('rgb(255, 255, 255)')
  })

  test('exposes docs, catalog, and no horizontal overflow', async ({ page }) => {
    const routes = [
      {
        h1: 'Fumadocs-first docs for installable Payload kits.',
        path: '/',
        title: /Payload Kits/,
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
        h1: 'Installable kits documented before they grow.',
        path: '/components',
        title: /Kit Catalog/,
      },
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

  test('exposes the docs-first homepage sections', async ({ page }) => {
    await page.goto(baseURL)

    await expect(page.getByRole('heading', { level: 2, name: 'What changed in v2' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 2, name: 'The catalog' })).toBeVisible()
    await expect(page.getByText('Built in public, documented first.')).toBeVisible()
    await expect(page.getByRole('link', { name: /GitHub/ }).first()).toBeVisible()
  })

  test('exposes a working command copy control', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto(baseURL)

    await page.getByRole('button', { name: 'Copy' }).click()

    await expect(page.getByRole('button', { name: 'Copied' })).toBeVisible()
    await expect
      .poll(() => page.evaluate(() => navigator.clipboard.readText()))
      .toBe('npx payload-kit add hero-basic')
  })
})
