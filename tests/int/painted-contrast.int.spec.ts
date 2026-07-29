import { describe, expect, it } from 'vitest'

import {
  contrastRatio,
  formatPaintedContrastReport,
  type PaintedContrastReport,
} from '../e2e/support/painted-contrast'

/* The contrast maths behind the templates-a11y painted-pixel pass. The pass
 * itself needs a browser, but the WCAG ratio and the report it fails with are
 * pure — and they are what decides whether a concept's gradient plate ships, so
 * they get checked here rather than only through a Playwright run. */

const black = [0, 0, 0] as const
const white = [255, 255, 255] as const

const emptyReport = (): PaintedContrastReport => ({
  failures: [],
  measurable: 0,
  sampled: 0,
  skippedCrossFrame: 0,
  skippedGradientInk: 0,
  scored: [],
  skippedNoGlyphPixels: 0,
  skippedNoGlyphPixelsSelectors: [],
  skippedUnresolved: 0,
  total: 0,
  unresolvedSelectors: [],
})

describe('painted contrast ratio', () => {
  it('scores the WCAG extremes', () => {
    expect(contrastRatio(black, white)).toBeCloseTo(21, 5)
    expect(contrastRatio(white, white)).toBeCloseTo(1, 5)
    expect(contrastRatio(black, black)).toBeCloseTo(1, 5)
  })

  it('does not depend on which colour is called the foreground', () => {
    const ink = [208, 230, 215] as const
    const plate = [43, 70, 58] as const

    expect(contrastRatio(ink, plate)).toBeCloseTo(contrastRatio(plate, ink), 10)
  })

  it('lands either side of both AA thresholds at the published boundary greys', () => {
    /* The greys where AA flips, on white: #767676 passes 4.5:1 and #777777
       fails it; #949494 passes 3:1 and #959595 fails it. Pinning both sides
       catches a luminance formula that is merely close. */
    expect(contrastRatio([118, 118, 118], white)).toBeCloseTo(4.54, 1)
    expect(contrastRatio([118, 118, 118], white)).toBeGreaterThanOrEqual(4.5)
    expect(contrastRatio([119, 119, 119], white)).toBeLessThan(4.5)

    expect(contrastRatio([148, 148, 148], white)).toBeCloseTo(3.03, 1)
    expect(contrastRatio([148, 148, 148], white)).toBeGreaterThanOrEqual(3)
    expect(contrastRatio([149, 149, 149], white)).toBeLessThan(3)
  })

  it('applies the sRGB gamma curve rather than a linear average', () => {
    // Mid grey is perceptually near white, not halfway: a linear ramp would
    // report ~2.1:1 against white instead of ~3.9:1.
    expect(contrastRatio([128, 128, 128], white)).toBeCloseTo(3.95, 1)
  })
})

describe('painted contrast report', () => {
  it('states what was scored, what was skipped, and what failed', () => {
    const failure = {
      background: [244, 244, 244] as [number, number, number],
      box: '25,779 239x30',
      glyphPixels: 605,
      ink: [244, 244, 237] as [number, number, number],
      ratio: 1.0009,
      required: 4.5,
      sample: 'Working the Corrow since 2009',
      selector: '.badge',
    }

    const report = formatPaintedContrastReport('nonprofit-cause preview (mobile)', {
      ...emptyReport(),
      failures: [failure],
      measurable: 9,
      sampled: 9,
      scored: [failure],
      skippedGradientInk: 1,
      skippedNoGlyphPixels: 1,
      skippedNoGlyphPixelsSelectors: ['.stat-value (no glyph pixels)'],
      skippedUnresolved: 2,
      total: 12,
      unresolvedSelectors: ['.pill (excluded chrome)', '.ghost (no match)'],
    })

    expect(report).toContain('9 of 12 axe-incomplete pairing(s)')
    expect(report).toContain('1 gradient-filled ink')
    expect(report).toContain('2 unresolved')
    expect(report).toContain('.pill (excluded chrome)')
    /* Both unmeasurable categories name their nodes. A skip that only bumps a
       counter reads in the log exactly like a node that was measured and passed,
       which is the one thing this report exists to prevent. */
    expect(report).toContain('no glyph pixels: .stat-value (no glyph pixels)')
    expect(report).toContain('FAILS 1.00:1 (needs 4.5:1)')
    // Triage needs the measured pixels, not just the verdict.
    expect(report).toContain('painted ink rgb(244,244,237) on painted rgb(244,244,244)')
    expect(report).toContain('605 glyph px at 25,779 239x30')
  })

  it('lists the tightest pairings by margin over their own threshold', () => {
    /* Ranking by raw ratio would bury the real risk: 3.10:1 on large text has
       more headroom than 4.60:1 on body text. Three are listed because gradient
       plates rasterise with a +/-1/255 wobble, so naming only the single worst
       would point at a different node from run to run. */
    const pairing = (selector: string, ratio: number, required: number) => ({
      background: [0, 0, 0] as [number, number, number],
      box: '0,0 10x10',
      glyphPixels: 100,
      ink: [255, 255, 255] as [number, number, number],
      ratio,
      required,
      sample: selector,
      selector,
    })

    const report = formatPaintedContrastReport('event-conference preview (desktop)', {
      ...emptyReport(),
      measurable: 4,
      sampled: 4,
      // Deliberately not in ranked order, and the raw-ratio order differs.
      scored: [
        pairing('.body-comfortable', 9, 4.5),
        pairing('.large-tight', 3.1, 3),
        pairing('.body-tight', 4.6, 4.5),
        pairing('.large-comfortable', 7, 3),
      ].sort((left, right) => left.ratio / left.required - right.ratio / right.required),
      total: 4,
    })

    const listed = report
      .split('\n')
      .filter((line) => line.includes('tightest:'))
      .map((line) => line.replace(/.*— \./, '.').split(' ')[0])

    expect(listed).toEqual(['.body-tight', '.large-tight', '.body-comfortable'])
  })

  it('says plainly when nothing was measurable', () => {
    const report = formatPaintedContrastReport('agency-studio preview (mobile)', {
      ...emptyReport(),
      skippedUnresolved: 2,
      total: 2,
      unresolvedSelectors: [
        '.pill > span (excluded chrome)',
        '.pill > span:nth-child(2) (excluded chrome)',
      ],
    })

    expect(report).toContain('0 of 2 axe-incomplete pairing(s)')
    expect(report).toContain('(0 measurable)')
    expect(report).toContain('tightest: n/a')
  })
})
