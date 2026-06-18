import type { Field } from 'payload'

/**
 * Shared field core for the Integration block family.
 *
 * Every integration variant (integration-grid, integration-cluster,
 * integration-split, integration-connect, integration-orbit, integration-list,
 * integration-marquee, integration-testimonial, …) spreads these fields first
 * and then appends its own variant-specific shape (for example the cluster
 * variants add a featured center mark, and the testimonial variant adds a
 * quote). Editing the shared heading/integrations shape here updates every
 * installed integration block at once, so the family never drifts
 * field-by-field across a repo.
 *
 * Each integration is an editable Media upload plus an accessible name, an
 * optional supporting description, and an optional link, so editors manage the
 * wall of partner/tool logos from the admin instead of shipping hardcoded
 * brand SVGs. Logo-only variants simply ignore the per-item description/href.
 *
 * Installed once per repo at `src/blocks/shared/integrationFields.ts`; re-running
 * `payload-components add integration-*` never overwrites a copy you have already edited.
 */
export const integrationFields: Field[] = [
  {
    name: 'heading',
    type: 'text',
    required: true,
  },
  {
    name: 'subtext',
    type: 'textarea',
  },
  {
    name: 'integrations',
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
        name: 'description',
        type: 'textarea',
      },
      {
        name: 'href',
        type: 'text',
      },
    ],
  },
]

/**
 * Optional center brand mark, spread by the variants that arrange the
 * integration logos around a focal point (cluster, split, connect, orbit,
 * marquee). Left empty, the variant renders without a center mark.
 */
export const integrationFeaturedMark: Field = {
  name: 'featuredLogo',
  type: 'upload',
  relationTo: 'media',
  admin: {
    description: 'Optional center brand mark shown at the focal point of the integration layout.',
  },
}
