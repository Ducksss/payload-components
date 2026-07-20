import type { Block } from 'payload'

import { featureFields } from '@/blocks/shared/featureFields'
import { createFeatureIconField } from '@/blocks/shared/featureIcons'
import { linkGroup } from '@/fields/linkGroup'

export const FeatureIconGrid: Block = {
  slug: 'featureIconGrid',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_feat_icon_grid',
  interfaceName: 'FeatureIconGridBlock',
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
        createFeatureIconField(true),
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
    plural: 'Feature Icon Grid Blocks',
    singular: 'Feature Icon Grid',
  },
}
