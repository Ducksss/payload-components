import type { Field } from 'payload'

/**
 * Shared field core for the Stats component family.
 *
 * Every stats variant (stats-proof, stats-grid, stats-card, stats-inline, …)
 * spreads `statsFields` first for the shared eyebrow/title heading, then appends
 * its own variant-specific shape — the narrative-plus-quote proof panel, the bare
 * number band, the divided card row, or the bordered sentence rows. Editing the
 * shared heading here updates every installed stats block at once, so the family
 * never drifts field-by-field across a repo.
 *
 * `statsMetricFields` is the one-figure shape (display value plus its label)
 * reused by every variant, so a metric reads the same wherever it appears. The
 * value stays a free-text string rather than a number: real stat bands mix
 * `99.9%`, `+1,200`, `22M`, and `24/7`, and formatting them belongs to the editor
 * rather than to a locale-sensitive number formatter at render time.
 *
 * Installed once per repo at `src/blocks/shared/statsFields.ts`; re-running
 * `payload-components add stats-*` never overwrites a copy you have already edited.
 */
export const statsFields: Field[] = [
  {
    name: 'eyebrow',
    type: 'text',
    custom: { payloadComponents: { localization: 'localized' } },
  },
  {
    name: 'title',
    type: 'text',
    custom: { payloadComponents: { localization: 'localized' } },
    required: true,
  },
]

export const statsMetricFields: Field[] = [
  {
    name: 'value',
    type: 'text',
    custom: { payloadComponents: { localization: 'global' } },
    required: true,
  },
  {
    name: 'label',
    type: 'text',
    custom: { payloadComponents: { localization: 'localized' } },
    required: true,
  },
]
