import type { Field } from 'payload'

import { contactChannelTypeOptions, validateContactValue } from './contactUrls'

/**
 * Shared field core for the Contact component family.
 *
 * Every contact variant (contact-routing-form, contact-channels, …) spreads
 * `contactFields` first for the shared heading, then appends its own
 * variant-specific shape — the inquiry form for the routing layout, or the
 * footnote for the channels-only layout. Editing the shared
 * eyebrow/title/description here updates every installed contact block at once,
 * so the family never drifts field-by-field across a repo.
 *
 * `contactChannelFields` is the one-channel shape (label, type, value, optional
 * description) reused by every variant, so a channel looks and validates the
 * same everywhere it appears. The `value` validator lives in
 * `@/blocks/shared/contactUrls` and rejects anything that would not resolve to a
 * safe `mailto:` / `tel:` / HTTPS href, so an editor cannot publish a channel
 * that renders as a dead or unsafe link.
 *
 * Installed once per repo at `src/blocks/shared/contactFields.ts`; re-running
 * `payload-components add contact-*` never overwrites a copy you have already edited.
 */
export const contactFields: Field[] = [
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

export const contactChannelFields: Field[] = [
  {
    name: 'label',
    type: 'text',
    required: true,
  },
  {
    name: 'type',
    type: 'select',
    options: contactChannelTypeOptions.map((value) => ({
      label: value.charAt(0).toUpperCase() + value.slice(1),
      value,
    })),
    required: true,
  },
  {
    name: 'value',
    type: 'text',
    required: true,
    validate: validateContactValue,
  },
  {
    name: 'description',
    type: 'text',
  },
]
