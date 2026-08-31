import { readFileSync } from 'node:fs'

import { expect, test } from '@playwright/test'

/* Right-to-left rendering.
 *
 * The locale catalog marks Arabic, Hebrew, Persian, and Urdu `rtl: true`, and
 * `payload-components localize` writes that into the consumer's config. That
 * flag only mirrors the admin; the front end mirrors because the blocks express
 * reading-order geometry with CSS logical properties, which follow `dir`.
 *
 * tests/int/visual-standards.int.spec.ts guards the class vocabulary statically.
 * This spec proves the browser actually resolves it — that a block rendered
 * under dir="rtl" really does move its accent border and text alignment to the
 * other side, rather than the refactor merely looking correct in source. */

const baseURL = `http://localhost:${process.env.E2E_PORT ?? '3100'}`

const computed = async (
  page: import('@playwright/test').Page,
  selector: string,
  properties: string[],
) =>
  await page
    .locator(selector)
    .first()
    .evaluate((node, props) => {
      const style = getComputedStyle(node as Element)
      return Object.fromEntries(props.map((name) => [name, style.getPropertyValue(name)]))
    }, properties)

const withDirection = async (page: import('@playwright/test').Page, slug: string, dir: string) => {
  await page.goto(`${baseURL}/components/preview/${slug}`)
  await page.evaluate((value) => document.documentElement.setAttribute('dir', value), dir)
}

/* Every preview slug, read as text so this spec never imports the demo React
   modules — same approach as components-visual.e2e.spec.ts. */
const registrySource = readFileSync(
  new URL('../../src/components/site/demos/registry.ts', import.meta.url),
  'utf8',
)
const slugs = [...registrySource.matchAll(/^\s+'([a-z0-9-]+)':/gm)].map((match) => match[1])

const broken = (into: string[], message: string) => into.push(message)

test.describe('Right-to-left rendering', () => {
  /* Marquee and load-reveal twins animate, so two page loads land on different
     frames and a geometry comparison between them would measure animation rather
     than direction. reducedMotion settles them to their end state, the same
     recipe components-visual.e2e.spec.ts uses for the same reason. Without it
     hero-kinetic and integration-marquee report dozens of false positives. */
  test.use({ contextOptions: { reducedMotion: 'reduce' } })

  /* Two components, two utilities, so a pass cannot come from one lucky element.
     Both assert the LTR side too: a block with no border or no padding at all
     would satisfy a one-sided check. */
  const cases = [
    { border: '2px', padding: '16px', selector: 'blockquote', slug: 'content-quote' },
    { border: '2px', padding: '24px', selector: 'figure', slug: 'testimonials-quote' },
    { border: '2px', padding: '20px', selector: 'figure', slug: 'integration-testimonial' },
  ]

  for (const { border, padding, selector, slug } of cases) {
    test(`${slug} mirrors its inline-start edge under dir="rtl"`, async ({ page }) => {
      const properties = [
        'border-left-width',
        'border-right-width',
        'padding-left',
        'padding-right',
      ]

      await withDirection(page, slug, 'ltr')
      const ltr = await computed(page, selector, properties)

      await withDirection(page, slug, 'rtl')
      const rtl = await computed(page, selector, properties)

      expect(ltr).toEqual({
        'border-left-width': border,
        'border-right-width': '0px',
        'padding-left': padding,
        'padding-right': '0px',
      })
      expect(rtl).toEqual({
        'border-left-width': '0px',
        'border-right-width': border,
        'padding-left': '0px',
        'padding-right': padding,
      })
    })
  }

  /* A catalog-wide sweep was attempted three ways and abandoned; the reasons are
     worth recording so nobody rebuilds one of them.
     
     1. `documentElement.scrollWidth > clientWidth`, the way the LTR route walk
        measures overflow, can never be true here — globals.css sets
        `overflow-x: clip` on html and body, which clamps scrollWidth. A
        `w-[3000px]` element injected into a twin still passed.
     2. "Did everything that fitted in LTR still fit in RTL" misses the bug class
        this conversion prevents: a physical `ml-*` on an auto-width block shrinks
        the box instead of overflowing it, so the spacing lands on the wrong side
        while everything still fits.
     3. Comparing mirror symmetry does catch that (an injected `ml-[240px]` was
        detected) but flags five blocks whose decorative layers are deliberately
        left physical. Excluding decoration by `aria-hidden` empties the
        comparison completely, because every demo twin is `aria-hidden` wholesale
        by the twin contract.
     
     So coverage is added by scaling the assertion above — explicit, per
     component, and demonstrably able to fail — rather than by a generic walk that
     cannot. */
})
