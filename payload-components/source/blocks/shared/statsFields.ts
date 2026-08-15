import type { Field } from 'payload'

/**
 * Shared field core for the Stats component family.
 *
 * Every stats variant (stats-proof, stats-grid, …) spreads these heading fields
 * first and then appends its own variant-specific shape — the metric array plus
 * a customer quote for the proof layout, or a wider metric grid for the grid
 * layout. Editing the shared eyebrow/title/description here updates every
 * installed stats block at once, so the family never drifts field-by-field
 * across a repo.
 *
 * Metric arrays deliberately stay per-variant: each layout has its own row
 * budget (a two-column proof panel and a four-up grid do not want the same
 * minRows/maxRows), so sharing them would force one layout's constraints onto
 * the other.
 *
 * Installed once per repo at `src/blocks/shared/statsFields.ts`; re-running
 * `payload-components add stats-*` never overwrites a copy you have already edited.
 */
export const statsFields: Field[] = [
  {
    name: 'eyebrow',
    type: 'text',
  },
  {
    name: 'title',
    type: 'text',
    required: true,
  },
  {
    name: 'description',
    type: 'textarea',
    required: true,
  },
]
