import type { Field } from 'payload'

/**
 * Shared field core for the Content component family.
 *
 * Every content variant (content-columns, content-image-lead,
 * content-feature-media, content-feature-split, content-showcase,
 * content-quote, content-community, …) spreads these heading fields first and
 * then appends its own variant-specific shape — the media upload, feature
 * list, pull quote, or avatar wall that differs per layout. Editing the shared
 * eyebrow/title/paragraphs shape here updates every installed content block at
 * once, so the family never drifts field-by-field across a repo.
 *
 * The body copy is a repeatable `paragraphs` array of plain textareas (the
 * tailark content sections lead with one or two short marketing paragraphs);
 * editors add or remove paragraphs without a rich-text dependency.
 *
 * Installed once per repo at `src/blocks/shared/contentFields.ts`; re-running
 * `payload-components add content-*` never overwrites a copy you have already edited.
 */
export const contentFields: Field[] = [
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
    name: 'paragraphs',
    type: 'array',
    minRows: 1,
    maxRows: 4,
    admin: {
      initCollapsed: true,
    },
    fields: [
      {
        name: 'text',
        type: 'textarea',
        required: true,
      },
    ],
  },
]
