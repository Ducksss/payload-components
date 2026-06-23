import type { Field } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

/**
 * Shared field core for the Pricing component family.
 *
 * Every pricing variant (pricing-cards, pricing-cards-muted, pricing-cards-cta,
 * pricing-split, pricing-enterprise) spreads `pricingFields` for the section
 * heading and reuses `planFields` for the editable plan array. Editing the
 * shared shape here updates every installed pricing block at once, so the
 * family never drifts field-by-field across a repo.
 *
 * Each plan carries its own price, period, blurb, a `featured` flag (which
 * drives the emerald "Popular" highlight), a list of included features, and a
 * single CTA link group — so editors manage the whole pricing table from the
 * admin instead of shipping hardcoded copy.
 *
 * The layout structure is adapted from tailark/blocks (MIT) pricing blocks,
 * retokenized onto this repo's monochrome + emerald design system.
 *
 * Installed once per repo at `src/blocks/shared/pricingFields.ts`; re-running
 * `payload-components add pricing-*` never overwrites a copy you have already edited.
 */
export const pricingFields: Field[] = [
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
  },
]

/**
 * Subfields for one plan, reused as the `fields` of every variant's `plans`
 * array. `period` is optional (a one-off enterprise price may omit "/ mo"),
 * `featured` marks the highlighted column, and `link` is a single CTA group.
 */
export const planFields: Field[] = [
  {
    name: 'name',
    type: 'text',
    required: true,
  },
  {
    name: 'price',
    type: 'text',
    required: true,
  },
  {
    name: 'period',
    type: 'text',
  },
  {
    name: 'description',
    type: 'text',
  },
  {
    name: 'featured',
    type: 'checkbox',
    defaultValue: false,
  },
  {
    name: 'features',
    type: 'array',
    required: true,
    minRows: 1,
    maxRows: 12,
    admin: {
      initCollapsed: true,
    },
    fields: [
      {
        name: 'feature',
        type: 'text',
        required: true,
      },
    ],
  },
  linkGroup({
    overrides: {
      admin: {
        initCollapsed: true,
      },
      maxRows: 1,
    },
  }),
]
