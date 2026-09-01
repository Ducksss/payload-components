import type { Page } from '@playwright/test'

/* Horizontal-overflow detection that survives `overflow-x: clip`.
 *
 * The obvious measurement — `documentElement.scrollWidth > clientWidth` — cannot
 * fail on this site. globals.css sets `overflow-x: clip` on both `html` and
 * `body`, which clamps `scrollWidth` to `clientWidth`; a `w-[3000px]` element
 * injected into a page still reports zero. Twelve assertions across the suite
 * were written that way and none of them enforced anything (issue #528).
 *
 * Lifting the clip does not rescue it either: the wide content lives inside
 * nested `overflow-hidden` containers (marquee tracks, code blocks), so the root
 * still measures zero with `overflow-x: visible` forced on.
 *
 * A plain walk of every element against the viewport goes wrong the other way.
 * It reports the landing marquee track at ~3700px, the logo-cloud track at
 * ~930px, and a mobile code block at ~310px — all of which are wide *by design*,
 * scrolling or clipped inside their own box, which AGENTS.md explicitly permits.
 *
 * So the rule this implements is the one the contract actually means: an element
 * overflows only if it extends past the viewport AND nothing between it and the
 * root clips or scrolls horizontally. Descent stops at any element whose
 * computed `overflow-x` is not `visible`, because its children are contained by
 * construction.
 *
 * Verified both ways before use: clean on `/`, `/docs`, `/docs/architecture`,
 * `/docs/installation`, `/components`, `/about`, `/templates` and `/blog` at
 * 1280px and 375px, and it catches a 3000px div appended to `<body>`. */

/* Runs in the page. Kept as a single self-contained function body because it is
   serialized into the browser — no imports or outer-scope references. */
const collectOverflowing = (tolerance: number) => {
  const viewportWidth = window.innerWidth
  const offenders: Array<{ label: string; overflow: number }> = []

  const describe = (element: Element) => {
    const classes = String((element as HTMLElement).className ?? '')

    return `${element.tagName.toLowerCase()}${classes ? `.${classes.slice(0, 60)}` : ''}`
  }

  const visit = (element: Element) => {
    const rect = element.getBoundingClientRect()

    /* Zero-area elements have no visual position to overflow from. */
    if (rect.width > 0 && rect.height > 0) {
      const overflow = Math.max(rect.right - viewportWidth, -rect.left)

      if (overflow > tolerance) {
        offenders.push({ label: describe(element), overflow: Math.round(overflow) })
      }
    }

    /* Anything that clips or scrolls horizontally contains its own children, so
       their geometry says nothing about the page. */
    if (getComputedStyle(element).overflowX !== 'visible') {
      return
    }

    for (const child of Array.from(element.children)) {
      visit(child)
    }
  }

  for (const child of Array.from(document.body.children)) {
    visit(child)
  }

  return offenders
}

/* 1px absorbs sub-pixel rounding on fractional widths — the same slack the
   suite's previous assertions used, and enough to ignore the skip link, which
   sits exactly 1px out while screen-reader-only. */
const DEFAULT_TOLERANCE = 1

export const findHorizontalOverflow = async (page: Page, tolerance = DEFAULT_TOLERANCE) =>
  await page.evaluate(collectOverflowing, tolerance)

/* Formats offenders for an assertion message. Empty string when there are none,
   so it reads cleanly as the message of a passing expectation. */
export const formatHorizontalOverflow = (
  offenders: Array<{ label: string; overflow: number }>,
  context: string,
) =>
  offenders.length === 0
    ? ''
    : [
        `Horizontal overflow on ${context}:`,
        ...offenders.map(({ label, overflow }) => `  +${overflow}px  ${label}`),
        '',
        'An element extends past the viewport with no ancestor clipping or',
        'scrolling it. Either constrain it, or give its container overflow-x.',
      ].join('\n')

export const expectNoHorizontalOverflow = async (
  page: Page,
  context: string,
  tolerance = DEFAULT_TOLERANCE,
) => {
  const offenders = await findHorizontalOverflow(page, tolerance)

  return { message: formatHorizontalOverflow(offenders, context), offenders }
}
