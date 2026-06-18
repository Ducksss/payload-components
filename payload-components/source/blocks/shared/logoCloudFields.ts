import type { Field } from 'payload'

/**
 * Shared field core for the Logo Cloud kit family.
 *
 * Every logo-cloud variant (logo-cloud-grid, logo-cloud-hover,
 * logo-cloud-marquee, logo-cloud-inline, logo-cloud-inline-wrap, …) spreads
 * these fields first and then appends its own variant-specific shape (for
 * example the hover variant adds a CTA link group). Editing the shared
 * heading/logos shape here updates every installed logo-cloud block at once,
 * so the family never drifts field-by-field across a repo.
 *
 * Each logo is an editable Media upload plus an accessible name and an
 * optional link, so editors manage the wall of logos from the admin instead
 * of shipping hardcoded brand SVGs.
 *
 * Installed once per repo at `src/blocks/shared/logoCloudFields.ts`; re-running
 * `payload-components add logo-cloud-*` never overwrites a copy you have already edited.
 */
export const logoCloudFields: Field[] = [
  {
    name: 'heading',
    type: 'text',
    required: true,
  },
  {
    name: 'logos',
    type: 'array',
    required: true,
    minRows: 2,
    maxRows: 12,
    admin: {
      initCollapsed: true,
    },
    fields: [
      {
        name: 'logo',
        type: 'upload',
        relationTo: 'media',
        required: true,
      },
      {
        name: 'name',
        type: 'text',
        required: true,
      },
      {
        name: 'href',
        type: 'text',
      },
    ],
  },
]
