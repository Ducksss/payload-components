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

/* Every Google domain the Content-Security-Policy in next.config.mjs admits for
 * GA4, across script-src, img-src, and connect-src, subdomains included.
 * playwright.config.ts also makes Chromium resolve these to nothing. */
export const googleTagDomains = [
  'googletagmanager.com',
  'google-analytics.com',
  'analytics.google.com',
]

/* Fulfils every Google origin locally: gtag.js becomes an empty script and any
 * collect request gets a 204. The browser applies the CSP before a request
 * reaches the route, so a stub is held to the same policy as the real tag, but
 * nothing leaves the machine. */
export async function stubGoogleOrigins(context: BrowserContext) {
  await context.route(
    ({ hostname }) =>
      googleTagDomains.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`)),
    (route) =>
      route.request().resourceType() === 'script'
        ? route.fulfill({ body: '', contentType: 'text/javascript' })
        : route.fulfill({ status: 204 }),
  )
}

/* GA4 mounts on the production hosts only, so on localhost granting consent
 * mounts nothing from Google. Specs that assert on the tag opt back in here.
 * The site's test hook is set only after every Google origin is stubbed, so the
 * tag mounts and runs its inline snippet but never reaches the production
 * property. Don't set __allowGoogleTagOnTestHost anywhere else. */
export async function mountGoogleTagOffline(context: BrowserContext) {
  await stubGoogleOrigins(context)
  await context.addInitScript(() => {
    window.__allowGoogleTagOnTestHost = true
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
