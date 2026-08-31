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

test.describe('Right-to-left rendering', () => {
  /* Two components, two utilities, so a pass cannot come from one lucky element.
     Both assert the LTR side too: a block with no border or no padding at all
     would satisfy a one-sided check. */
  const cases = [
    { border: '2px', padding: '16px', selector: 'blockquote', slug: 'content-quote' },
    { border: '2px', padding: '24px', selector: 'figure', slug: 'testimonials-quote' },
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

  /* Mirroring a layout is where RTL usually breaks: a margin that used to push
     content inward now pushes it off the other edge. The LTR contract already
     forbids horizontal overflow (frontend.e2e.spec.ts); this holds every block
     to the same bar with the direction flipped, across the whole catalog rather
     than the two components asserted above. */
  test('no block overflows horizontally under dir="rtl"', async ({ page }) => {
    expect(slugs.length).toBeGreaterThan(50)

    const overflowing: string[] = []

    for (const slug of slugs) {
      await withDirection(page, slug, 'rtl')

      const overflow = await page.evaluate(() => {
        const { documentElement: root } = document
        return {
          client: root.clientWidth,
          scroll: root.scrollWidth,
        }
      })

      /* 1px of slack absorbs sub-pixel rounding on fractional widths, the same
         tolerance the LTR route walk uses. */
      if (overflow.scroll > overflow.client + 1) {
        overflowing.push(`${slug}: scrollWidth ${overflow.scroll} > clientWidth ${overflow.client}`)
      }
    }

    expect(overflowing, `Horizontal overflow under RTL:\n${overflowing.join('\n')}`).toEqual([])
  })
})
