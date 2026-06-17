import type { Block } from 'payload'

import { featureFields } from '@/blocks/shared/featureFields'
import { linkGroup } from '@/fields/linkGroup'

export const FeatureSplit: Block = {
  slug: 'featureSplit',
  interfaceName: 'FeatureSplitBlock',
  fields: [
    // Shared feature core (eyebrow, title, description). Variant-specific fields
    // follow; edit the shared shape in @/blocks/shared/featureFields.
    ...featureFields,
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 6,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
      ],
    },
    linkGroup({
      overrides: {
        admin: {
          initCollapsed: true,
        },
        maxRows: 2,
      },
    }),
  ],
  labels: {
    plural: 'Feature Split Blocks',
    singular: 'Feature Split',
  },
}
