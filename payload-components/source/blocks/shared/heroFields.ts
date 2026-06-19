import type { Field } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

/**
 * Shared field core for the Hero component family.
 *
 * Every hero variant spreads these fields first and then appends its own
 * variant-specific ones. Editing the
 * shared headline/eyebrow/description/CTA shape here updates every installed
 * hero block at once, so the family never drifts field-by-field across a repo.
 *
 * Installed once per repo at `src/blocks/shared/heroFields.ts`; re-running
 * `payload-components add hero-*` never overwrites a copy you have already edited.
 */
export const heroFields: Field[] = [
  {
    name: 'eyebrow',
    type: 'text',
    admin: {
      placeholder: 'Optional kicker shown above the headline',
    },
  },
  {
    name: 'title',
    type: 'text',
    required: true,
    admin: {
      placeholder: 'Headline — the main outcome you deliver',
    },
  },
  {
    name: 'description',
    type: 'textarea',
    required: true,
    admin: {
      placeholder: 'A sentence or two expanding on the headline',
    },
  },
  linkGroup({
    overrides: {
      admin: {
        initCollapsed: true,
      },
      maxRows: 2,
      minRows: 1,
    },
  }),
]
