import type { Field } from 'payload'

import { validateFooterHref } from '@/blocks/shared/footerUrls'

/**
 * Shared field core for the Footer component family.
 *
 * Every footer variant (footer-columns, footer-simple, footer-centered, …)
 * spreads `footerFields` first for the shared brand and copyright line, then
 * appends its own variant-specific shape — the grouped link columns, the flat
 * inline nav, or the centred stack with social links. Editing the shared brand
 * shape here updates every installed footer block at once, so the family never
 * drifts field-by-field across a repo.
 *
 * `brandLabel` is required even when a `logo` upload is set: it is the accessible
 * name for the home link, so an icon-only mark still announces itself to a screen
 * reader instead of reading as a bare image. When no logo is uploaded it also
 * renders as the visible text wordmark.
 *
 * `footerLinkFields` is the one-link shape reused by every variant. Its `href` is
 * validated with `validateFooterHref` in the admin and re-checked at render with
 * `getSafeFooterHref`, so an unexpected scheme cannot reach the DOM even if a row
 * was written straight through the Local API — see `@/blocks/shared/footerUrls`.
 *
 * Installed once per repo at `src/blocks/shared/footerFields.ts`; re-running
 * `payload-components add footer-*` never overwrites a copy you have already edited.
 */
export const footerFields: Field[] = [
  {
    name: 'logo',
    type: 'upload',
    relationTo: 'media',
    admin: {
      description: 'Brand mark shown in the footer. Falls back to Brand label when empty.',
    },
  },
  {
    name: 'brandLabel',
    type: 'text',
    required: true,
    admin: {
      description:
        'Accessible name for the home link, and the visible wordmark when no logo is uploaded.',
    },
  },
  {
    name: 'copyright',
    type: 'text',
    required: true,
  },
]

export const footerLinkFields: Field[] = [
  {
    name: 'label',
    type: 'text',
    required: true,
  },
  {
    name: 'href',
    type: 'text',
    required: true,
    validate: validateFooterHref,
  },
]
