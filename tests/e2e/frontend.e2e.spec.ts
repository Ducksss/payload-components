import { expect, test } from '@playwright/test'

test.describe('Frontend', () => {
  test('can load homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(/Payload Kits/)
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Install Payload kits with shadcn.',
      }),
    ).toBeVisible()
  })

  test('exposes crawlable SEO metadata and semantic public pages', async ({ page }) => {
    const routes = [
      {
        canonical: 'http://localhost:3000',
        h1: 'Install Payload kits with shadcn.',
        path: '/',
        title: /Payload Kits/,
      },
      {
        canonical: 'http://localhost:3000/components',
        h1: 'Browse the real kits that ship in the current registry.',
        path: '/components',
        title: /Payload Kits Components Gallery/,
      },
      {
        canonical: 'http://localhost:3000/docs',
        h1: 'Payload Kits documentation',
        path: '/docs',
        title: /Payload Kits documentation/,
      },
      {
        canonical: 'http://localhost:3000/docs/kits/hero-basic',
        h1: 'Hero Basic',
        path: '/docs/kits/hero-basic',
        title: /Hero Basic/,
      },
      {
        canonical: 'http://localhost:3000/resources',
        h1: 'Payload-native guides for teams evaluating installable kits.',
        path: '/resources',
        title: /Payload Kits Resources/,
      },
      {
        canonical: 'http://localhost:3000/resources/payload-cms-blocks',
        h1: 'Payload CMS blocks that survive real client repos',
        path: '/resources/payload-cms-blocks',
        title: /Payload CMS blocks/,
      },
    ]

    for (const route of routes) {
      await page.goto(`http://localhost:3000${route.path}`)

      await expect(page).toHaveTitle(route.title)
      await expect(page.getByRole('heading', { level: 1, name: route.h1 })).toBeVisible()
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', route.canonical)
      await expect(page.locator('meta[property="og:title"]')).not.toHaveAttribute(
        'content',
        /Payload Website Template/,
      )
      await expect(page.locator('img:not([alt])')).toHaveCount(0)

      const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      )
      expect(hasHorizontalOverflow).toBe(false)
    }

    await page.goto('http://localhost:3000/search?q=payload')
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
  })

  test('exposes selected waitlist intent state', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page.getByRole('button', { name: /Launch updates/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await page.getByRole('button', { name: /Design partner/ }).click()
    await expect(page.getByRole('button', { name: /Design partner/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })

  test('can submit the homepage waitlist form', async ({ page }) => {
    let requestBody:
      | {
          email?: string
          honey?: string
        }
      | undefined

    await page.route('**/api/waitlist', async (route) => {
      requestBody = JSON.parse(route.request().postData() || '{}') as typeof requestBody

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      })
    })

    await page.goto('http://localhost:3000')
    await page.getByLabel('Email address').fill('hello@payloadkits.dev')
    await page.getByRole('button', { name: 'Join the waitlist', exact: true }).click()

    await expect(
      page.getByText("You're on the list. We'll email you when early access opens."),
    ).toBeVisible()
    expect(requestBody).toMatchObject({
      currentPath: '/',
      email: 'hello@payloadkits.dev',
      honey: '',
      intent: 'waitlist',
      source: 'homepage-final-cta',
    })
  })
})
