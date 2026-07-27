import type { BrowserContext } from '@playwright/test'

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
