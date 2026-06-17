import type { Block } from 'payload'

import { featureFields } from '@/blocks/shared/featureFields'
import { linkGroup } from '@/fields/linkGroup'

export const FeatureBento: Block = {
  slug: 'featureBento',
  interfaceName: 'FeatureBentoBlock',
  fields: [
    // Shared feature core (eyebrow, title, description). Variant-specific fields
    // follow; edit the shared shape in @/blocks/shared/featureFields.
    ...featureFields,
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 3,
      maxRows: 6,
      admin: {
        initCollapsed: true,
        description: 'The first item leads the grid as the featured cell.',
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
        maxRows: 1,
      },
    }),
  ],
  labels: {
    plural: 'Feature Bento Blocks',
    singular: 'Feature Bento',
  },
}
