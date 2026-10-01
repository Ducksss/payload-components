import { expect, type BrowserContext, type Page } from '@playwright/test'

/* The site mounts no analytics until a visitor opts in, and shows a consent
 * banner while the choice is undecided. Specs that assert on the analytics
 * scripts, or that capture visual baselines, want the post-opt-in site: granting
 * up-front keeps those assertions meaningful and keeps the banner out of every
 * snapshot. ConsentBanner itself is covered from a clean state in
 * tests/e2e/consent.e2e.spec.ts, and the axe suite deliberately does not grant,
 * so the banner is held to the same a11y bar as the rest of the site. */
export async function grantConsent(context: BrowserContext) {
  await context.addInitScript(() => {
    try {
      window.localStorage.setItem('pc_consent', 'granted')
    } catch {
      // Storage can be unavailable in some contexts; the spec that needs consent
      // will fail loudly on its own assertion rather than here.
    }
  })
}

/* The banner ships in the server HTML, so for an undecided visitor it is visible
 * before hydration, marked data-consent-banner="pending" until React has read
 * consent. Visibility alone therefore no longer proves the page has hydrated.
 * Specs that need the live banner (axe runs, assertions about what an undecided
 * visit mounts) wait for the pending value to go. Otherwise they could pass
 * against the pre-hydration page, where nothing has had a chance to mount. */
export async function expectConsentBannerReady(page: Page) {
  await expect(page.locator('[data-consent-banner=""]')).toBeVisible()
}
