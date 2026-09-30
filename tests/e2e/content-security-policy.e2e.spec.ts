import { expect, type BrowserContext, type Page, test } from '@playwright/test'

/* The Content-Security-Policy is enforced, and nothing reports on it. The site is
 * backend-free, so there is no report-to collector, and a production violation
 * would only ever reach one visitor's console. This spec is the feedback loop
 * instead; see the comment above contentSecurityPolicy in next.config.mjs.
 * tests/int/fumadocs-site.int.spec.ts pins the directives exactly, and this file
 * proves a real browser accepts them.
 *
 * It walks one route per surface with analytics consent declined, then accepted.
 * Each choice is made on the real banner, as a visitor makes it. The spec fails
 * on any securitypolicyviolation from any frame. The preview frames are checked
 * positively as well: a frame refused by frame-ancestors or frame-src renders
 * the browser's error page, which has no <main>.
 *
 * Third parties are fulfilled locally. The browser applies the policy before a
 * request reaches the route handler, so a stubbed gtag.js still has to clear
 * script-src, while the suite stays offline and sends Google nothing. */

const baseURL = `http://localhost:${process.env.E2E_PORT ?? '3100'}`
const isProductionE2E = process.env.PLAYWRIGHT_SERVER_MODE === 'production'

/* One route per surface. The two preview frames are the reason frame-src and
 * frame-ancestors are 'self' rather than 'none'. */
const surfaces = [
  { path: '/' },
  { path: '/docs' },
  { path: '/docs/components/hero-basic', frame: '/components/preview/hero-basic' },
  { path: '/components' },
  { path: '/templates/saas-launch', frame: '/templates/saas-launch/preview' },
  { path: '/blog/safe-links-forms-embeds' },
  { path: '/about/case-study' },
]

type Violation = {
  blockedURI: string
  directive: string
  documentURI: string
  sample: string
}

async function watchPolicy(context: BrowserContext) {
  const violations: Violation[] = []

  await context.exposeBinding('__reportCspViolation', (_source, violation: Violation) => {
    violations.push(violation)
  })
  await context.addInitScript(() => {
    // Capturing on window sees violations raised on elements and on the document.
    window.addEventListener(
      'securitypolicyviolation',
      (event) => {
        const report = (window as unknown as { __reportCspViolation: (value: unknown) => unknown })
          .__reportCspViolation

        void report({
          blockedURI: event.blockedURI,
          directive: event.effectiveDirective,
          documentURI: event.documentURI,
          sample: event.sample,
        })
      },
      true,
    )
  })
  await context.route(
    (url) => url.origin !== baseURL,
    (route) =>
      route.request().resourceType() === 'script'
        ? route.fulfill({ body: '', contentType: 'text/javascript' })
        : route.fulfill({ status: 204 }),
  )

  return violations
}

/* Scrolls the page end to end so lazy images and frames load under the policy
   too, then lets the network go quiet. */
async function settle(page: Page) {
  await page.evaluate(async () => {
    for (let top = 0; top < document.documentElement.scrollHeight; top += window.innerHeight) {
      window.scrollTo(0, top)
      await new Promise((resolve) => requestAnimationFrame(resolve))
    }
  })
  await page.waitForLoadState('networkidle')
}

function parseContentSecurityPolicy(policy: string) {
  return Object.fromEntries(
    policy
      .split(';')
      .map((directive) => directive.trim().split(/\s+/))
      .filter(([name]) => name)
      .map(([name, ...sources]) => [name, sources]),
  )
}

test.describe('Content-Security-Policy', () => {
  test('serves one enforced policy on every document, preview frames included', async ({
    request,
  }) => {
    const policies = new Set<string | undefined>()

    for (const path of [
      '/',
      '/docs',
      '/components/preview/hero-basic',
      '/templates/saas-launch/preview',
      '/blog/safe-links-forms-embeds',
    ]) {
      const response = await request.get(`${baseURL}${path}`, { headers: { accept: 'text/html' } })
      const headers = response.headers()

      expect(response.ok(), path).toBe(true)
      expect(headers['content-security-policy-report-only'], path).toBeUndefined()
      expect(headers['x-frame-options'], path).toBe('SAMEORIGIN')
      policies.add(headers['content-security-policy'])
    }

    expect(policies.size).toBe(1)
    const [policy] = [...policies]
    expect(policy).toBeDefined()
    expect(parseContentSecurityPolicy(policy ?? '')).toMatchObject({
      'script-src': [
        "'self'",
        "'unsafe-inline'",
        ...(isProductionE2E ? [] : ["'unsafe-eval'", 'https://va.vercel-scripts.com']),
        'https://www.googletagmanager.com',
      ],
      'script-src-attr': ["'none'"],
      'frame-src': ["'self'"],
      'frame-ancestors': ["'self'"],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
    })
  })

  for (const choice of ['Decline', 'Accept'] as const) {
    test(`no surface breaks the policy after ${choice === 'Accept' ? 'accepting' : 'declining'} analytics`, async ({
      context,
      page,
    }) => {
      test.slow(!isProductionE2E, 'the dev server compiles each surface on its first visit')
      const violations = await watchPolicy(context)

      await page.goto(baseURL)
      await page.getByRole('button', { name: choice }).click()
      await expect(page.locator('[data-consent-banner]')).toHaveCount(0)

      for (const { frame, path } of surfaces) {
        await page.goto(`${baseURL}${path}`)
        // Accepting must actually mount GA4 here, or the gated origins go untested.
        if (choice === 'Accept') await expect(page.locator('script#google-tag')).toBeAttached()
        await settle(page)

        if (frame) {
          const preview = page.frameLocator(`iframe[src="${frame}"]`)
          await expect(preview.locator('main'), `${path} → ${frame}`).toBeAttached()
        }

        expect(violations, `${path}\n${JSON.stringify(violations, null, 2)}`).toEqual([])
      }
    })
  }
})
