import type { Field } from 'payload'

/**
 * Shared field core for the Testimonials component family.
 *
 * Every testimonials variant spreads `testimonialFields` first for the shared
 * section heading (eyebrow + title + intro), then appends its own
 * variant-specific shape — a grid of cards, a star rating, a bento, or a dense
 * wall. Editing the shared heading here updates every installed testimonials
 * block at once, so the family never drifts field-by-field across a repo.
 *
 * `testimonialItemFields` is the one-quote shape (quote, author, optional role,
 * optional avatar upload) reused everywhere a testimonial appears — as the array
 * items in the grid/rating/bento/wall variants, and as the single subject of the
 * quote/spotlight variants — so a testimonial looks the same wherever it shows.
 * Each avatar is an editable Media upload, so editors manage social proof from
 * the admin instead of shipping hardcoded image URLs.
 *
 * Installed once per repo at `src/blocks/shared/testimonialFields.ts`; re-running
 * `payload-components add testimonials-*` never overwrites a copy you have
 * already edited.
 */
export const testimonialFields: Field[] = [
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

export const testimonialItemFields: Field[] = [
  {
    name: 'quote',
    type: 'textarea',
    required: true,
  },
  {
    name: 'author',
    type: 'text',
    required: true,
  },
  {
    name: 'role',
    type: 'text',
  },
  {
    name: 'avatar',
    type: 'upload',
    relationTo: 'media',
  },
]
