import type { Field } from 'payload'

/**
 * Shared field core for the Call To Action component family.
 *
 * Every call-to-action variant (call-to-action-centered, call-to-action-boxed,
 * call-to-action-signup, …) spreads these heading fields first and then appends
 * its own variant-specific shape — the CTA link group for the centered and boxed
 * layouts, or the email-capture fields for the signup layout. Editing the shared
 * title/description here updates every installed call-to-action block at once, so
 * the family never drifts field-by-field across a repo.
 *
 * Installed once per repo at `src/blocks/shared/callToActionFields.ts`; re-running
 * `payload-components add call-to-action-*` never overwrites a copy you have already edited.
 */
export const callToActionFields: Field[] = [
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
