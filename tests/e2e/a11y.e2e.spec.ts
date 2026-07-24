import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

/* Automated WCAG 2.1 A/AA pass on the public-facing surfaces. axe can't prove a
 * page is accessible, but it reliably catches the regressions that matter most
 * for a marketing/docs site — missing landmarks/labels, broken heading order,
 * and (given the monochrome + emerald light theme) colour-contrast failures.
 * We gate on serious/critical only so the suite stays signal, not noise. */

const baseURL = `http://localhost:${process.env.E2E_PORT ?? '3100'}`

const routes = [
  { name: 'landing', path: '/' },
  { name: 'docs index', path: '/docs' },
  { name: 'component catalog', path: '/components' },
  { name: 'blog index', path: '/blog' },
  { name: 'project notes article', path: '/blog/hello' },
  { name: 'foundations article', path: '/blog/what-is-a-payload-cms-block' },
  { name: 'installer internals article', path: '/blog/copying-is-not-installing' },
  { name: 'component design article', path: '/blog/component-variants-without-prop-explosion' },
  { name: 'production guides article', path: '/blog/build-saas-homepage' },
  { name: 'open source article', path: '/blog/demo-twins' },
]

test.describe('Accessibility (axe-core, WCAG 2.1 A/AA)', () => {
  for (const route of routes) {
    test(`${route.name} has no serious or critical violations`, async ({ page }) => {
      await page.goto(`${baseURL}${route.path}`)
      await page.evaluate(() => document.fonts.ready)

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze()

      const blocking = results.violations.filter(
        (violation) => violation.impact === 'critical' || violation.impact === 'serious',
      )

      const report = blocking
        .map(
          (violation) =>
            `${violation.id} (${violation.impact}): ${violation.help} — ${violation.nodes.length} node(s)\n  ${violation.helpUrl}`,
        )
        .join('\n')

      expect(blocking, report).toEqual([])
    })
  }
})
