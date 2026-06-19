import type { Field } from 'payload'

/**
 * Shared field core for the Comparator component family.
 *
 * Every comparator variant (comparator-table, comparator-grid, comparator-stack)
 * spreads this optional section header first and then appends its own plan/feature
 * shape — the feature matrix for the table and grid layouts, or the per-plan
 * checklists for the stacked layout. Editing the shared title/description here
 * updates every installed comparator block at once, so the family never drifts
 * field-by-field across a repo.
 *
 * Installed once per repo at `src/blocks/shared/comparatorFields.ts`; re-running
 * `payload-components add comparator-*` never overwrites a copy you have already edited.
 */
export const comparatorFields: Field[] = [
  {
    name: 'title',
    type: 'text',
  },
  {
    name: 'description',
    type: 'textarea',
  },
]
