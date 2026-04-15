import { expect, test } from '@playwright/test'

test.describe('Frontend', () => {
  test('can load homepage', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(/Payload Kits/)
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Payload Kits installs production-ready blocks with one command.',
      }),
    ).toBeVisible()
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
    await page.getByRole('button', { name: 'Join the waitlist' }).click()

    await expect(
      page.getByText("You're on the list. We'll email you when early access opens."),
    ).toBeVisible()
    expect(requestBody).toEqual({
      email: 'hello@payloadkits.dev',
      honey: '',
    })
  })
})
