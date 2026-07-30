import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

/* The consent gate, exercised from a clean profile. Every other spec grants
 * consent up-front (tests/e2e/consent.ts), so this file is the only place the
 * undecided state is covered — keep it that way, and keep it strict.
 *
 * The gate is deliberately two-tier, and these specs pin the split: Vercel
 * Analytics and Speed Insights are cookieless and mount for everyone, while GA4
 * (own cookies) and PostHog (pc_distinct_id) wait for an explicit opt-in. */

const baseURL = `http://localhost:${process.env.E2E_PORT ?? '3100'}`
const googleTagId = 'G-EMGRZ0H9R9'
// Only the consent-gated providers. Vercel is intentionally excluded — see above.
const gatedScripts = 'script[src*="googletagmanager"], script[src*="posthog"]'
const vercelScripts = 'script[src*="vercel"], script[src*="insights"]'

const banner = '[data-consent-banner]'

test.describe('Analytics consent gate', () => {
  test('withholds the cookie-setting providers until the visitor opts in', async ({ page }) => {
    await page.goto(baseURL)
    await expect(page.locator(banner)).toBeVisible()

    // Undecided means denied for anything that writes to the device.
    await expect(page.locator(gatedScripts)).toHaveCount(0)
    await expect(page.locator('script#google-tag')).toHaveCount(0)
    expect(await page.evaluate(() => window.localStorage.getItem('pc_distinct_id'))).toBeNull()
  })

  test('still measures Web Vitals before a choice is made', async ({ page }) => {
    // Cookieless providers carry no consent requirement, and gating them would
    // blind Core Web Vitals on most traffic for no privacy gain.
    await page.goto(baseURL)
    await expect(page.locator(banner)).toBeVisible()

    await expect(page.locator(vercelScripts).first()).toBeAttached()
    // ...while still storing nothing on the device.
    expect(await page.evaluate(() => window.localStorage.getItem('pc_distinct_id'))).toBeNull()
    expect(await page.evaluate(() => window.localStorage.getItem('pc_consent'))).toBeNull()
  })

  test('accepting mounts the Google tag and persists the choice', async ({ page }) => {
    await page.goto(baseURL)
    await page.getByRole('button', { name: 'Accept' }).click()

    await expect(page.locator(banner)).toHaveCount(0)
    await expect(
      page.locator(`script[src="https://www.googletagmanager.com/gtag/js?id=${googleTagId}"]`),
    ).toHaveCount(1)
    expect(await page.evaluate(() => window.localStorage.getItem('pc_consent'))).toBe('granted')

    // The choice survives a reload and the banner does not come back.
    await page.reload()
    await expect(page.locator(banner)).toHaveCount(0)
    await expect(page.locator('script#google-tag')).toHaveCount(1)
  })

  test('declining keeps the cookie-setting providers off, permanently', async ({ page }) => {
    await page.goto(baseURL)
    await page.getByRole('button', { name: 'Decline' }).click()

    await expect(page.locator(banner)).toHaveCount(0)
    expect(await page.evaluate(() => window.localStorage.getItem('pc_consent'))).toBe('denied')

    await page.reload()
    await expect(page.locator(banner)).toHaveCount(0)
    await expect(page.locator(gatedScripts)).toHaveCount(0)
    // Declining must not leave an identifier behind either.
    expect(await page.evaluate(() => window.localStorage.getItem('pc_distinct_id'))).toBeNull()
  })

  test('a browser privacy signal denies without ever prompting', async ({ browser }) => {
    // Global Privacy Control is binding under the CCPA, so it is a decision in
    // its own right — the visitor should not be asked to make it again.
    const context = await browser.newContext()
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'globalPrivacyControl', { get: () => true })
    })
    const page = await context.newPage()

    await page.goto(baseURL)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()

    await expect(page.locator(banner)).toHaveCount(0)
    await expect(page.locator(gatedScripts)).toHaveCount(0)

    await context.close()
  })

  test('a privacy signal erases an identifier left by an earlier opt-in', async ({ browser }) => {
    // Opting in first, then turning GPC on, is the case that leaves a stale
    // pc_distinct_id behind: unused while denied, but enough to re-link the
    // visitor to their old identity if they ever opt back in.
    const context = await browser.newContext()
    const page = await context.newPage()

    await page.goto(baseURL)
    await page.getByRole('button', { name: 'Accept' }).click()
    await page.evaluate(() => window.localStorage.setItem('pc_distinct_id', 'pc_stale-id'))

    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'globalPrivacyControl', { get: () => true })
    })
    await page.reload()

    await expect(page.locator(gatedScripts)).toHaveCount(0)
    expect(await page.evaluate(() => window.localStorage.getItem('pc_distinct_id'))).toBeNull()

    await context.close()
  })

  test('withdrawing in one tab tears analytics down in the other', async ({ browser }) => {
    // Two tabs share localStorage, so the storage event is the only signal the
    // second tab gets — and unmounting React there would leave gtag running.
    const context = await browser.newContext()
    const [first, second] = [await context.newPage(), await context.newPage()]

    await first.goto(baseURL)
    await first.getByRole('button', { name: 'Accept' }).click()
    await second.goto(baseURL)
    await expect(second.locator('script#google-tag')).toHaveCount(1)

    await first.goto(`${baseURL}/privacy`)
    await first.getByRole('button', { name: 'Turn analytics off' }).click()

    // The second tab must reload itself and come back with nothing mounted.
    await expect(second.locator('script#google-tag')).toHaveCount(0)
    await expect(second.locator(gatedScripts)).toHaveCount(0)

    await context.close()
  })

  test('withdrawing deletes the GA cookies the opt-in created', async ({ page }) => {
    /* Seeded by hand rather than by letting GA set them: this pins our deletion
     * logic without depending on a live googletagmanager fetch, which would make
     * the spec network-flaky. The names match what GA4 writes. */
    await page.goto(`${baseURL}/privacy`)
    await page.evaluate(() => {
      window.localStorage.setItem('pc_consent', 'granted')
      window.localStorage.setItem('pc_distinct_id', 'pc_seeded-id')
      document.cookie = '_ga=GA1.1.1234567890.1234567890; path=/'
      document.cookie = '_ga_EMGRZ0H9R9=GS1.1.1234567890; path=/'
      document.cookie = 'unrelated_cookie=keep-me; path=/'
    })
    await page.reload()
    expect(await page.evaluate(() => document.cookie)).toContain('_ga=')

    await page.getByRole('button', { name: 'Turn analytics off' }).click()
    await expect(page.getByText('Google Analytics and PostHog are currently off.')).toBeVisible()

    const cookiesAfter = await page.evaluate(() => document.cookie)
    expect(cookiesAfter).not.toContain('_ga=')
    expect(cookiesAfter).not.toContain('_ga_EMGRZ0H9R9')
    expect(await page.evaluate(() => window.localStorage.getItem('pc_distinct_id'))).toBeNull()
    // Only the analytics cookies go — anything else on the domain is untouched.
    expect(cookiesAfter).toContain('unrelated_cookie=keep-me')
  })

  test('the banner itself has no serious or critical a11y violations', async ({ page }) => {
    await page.goto(baseURL)
    await expect(page.locator(banner)).toBeVisible()
    await page.evaluate(() => document.fonts.ready)

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .include(banner)
      .analyze()

    const blocking = results.violations.filter(
      (violation) => violation.impact === 'critical' || violation.impact === 'serious',
    )

    expect(
      blocking,
      blocking
        .map((violation) => `${violation.id} (${violation.impact}): ${violation.help}`)
        .join('\n'),
    ).toEqual([])
  })

  test('/privacy can withdraw consent after it was granted', async ({ page }) => {
    // Seeded through the page rather than an init script: withdrawing forces a
    // reload (see setConsent), and an init script would re-grant on the way back.
    await page.goto(`${baseURL}/privacy`)
    await page.evaluate(() => window.localStorage.setItem('pc_consent', 'granted'))
    await page.reload()
    await expect(page.getByText('Google Analytics and PostHog are currently on.')).toBeVisible()

    await page.getByRole('button', { name: 'Turn analytics off' }).click()

    await expect(page.getByText('Google Analytics and PostHog are currently off.')).toBeVisible()
    expect(await page.evaluate(() => window.localStorage.getItem('pc_consent'))).toBe('denied')
    await expect(page.locator(gatedScripts)).toHaveCount(0)
  })
})
