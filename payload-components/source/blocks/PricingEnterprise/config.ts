import type { Block } from 'payload'

import { planFields, pricingFields } from '@/blocks/shared/pricingFields'

export const PricingEnterprise: Block = {
  slug: 'pricingEnterprise',
  interfaceName: 'PricingEnterpriseBlock',
  fields: [
    // Shared pricing heading (eyebrow, title, description). Variant-specific
    // fields follow; edit the shared shape in @/blocks/shared/pricingFields.
    ...pricingFields,
    {
      name: 'plans',
      type: 'array',
      required: true,
      // A single enterprise plan rendered as one wide panel.
      minRows: 1,
      maxRows: 1,
      admin: {
        initCollapsed: true,
      },
      fields: planFields,
    },
    {
      // Editable trust logos — uploaded images with an accessible name and an
      // optional link, mirroring the shared logo-cloud shape so editors insert
      // their own brand marks instead of shipping hardcoded SVGs.
      name: 'logos',
      type: 'array',
      minRows: 0,
      maxRows: 8,
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
          // Logos link out to arbitrary customer sites, so this can't reuse the
          // embed/form allowlists in shared/safeUrls — but still reject anything
          // that isn't an absolute http(s) URL (e.g. a `javascript:` payload).
          validate: (value: unknown) => {
            if (value === null || value === undefined || value === '') return true

            try {
              const { protocol } = new URL(String(value))

              return protocol === 'https:' || protocol === 'http:'
                ? true
                : 'Use an absolute http(s) URL.'
            } catch {
              return 'Use an absolute http(s) URL.'
            }
          },
        },
      ],
    },
  ],
  labels: {
    plural: 'Pricing Enterprise Blocks',
    singular: 'Pricing Enterprise',
  },
}
