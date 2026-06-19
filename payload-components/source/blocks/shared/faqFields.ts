import type { Field } from 'payload'

/**
 * Shared field core for the FAQ component family.
 *
 * Every FAQ variant (faq-accordion, faq-split, faq-card, faq-icons,
 * faq-grouped, faq-grid) spreads these section-heading fields first and then
 * appends its own variant-specific shape — the question/answer items, which
 * differ per layout (flat list, icon-tagged, or grouped). Editing the shared
 * eyebrow/title/description here updates every installed FAQ block at once, so
 * the family never drifts field-by-field across a repo.
 *
 * Installed once per repo at `src/blocks/shared/faqFields.ts`; re-running
 * `payload-components add faq-*` never overwrites a copy you have already edited.
 */
export const faqFields: Field[] = [
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
 * Reusable question/answer array for the plain FAQ variants (faq-accordion,
 * faq-split, faq-card, faq-grid). The icon and grouped variants define their
 * own item shape, so they compose `faqFields` but not this field.
 */
export const faqItemsField: Field = {
  name: 'items',
  type: 'array',
  required: true,
  minRows: 1,
  admin: {
    initCollapsed: true,
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
    },
  ],
}
