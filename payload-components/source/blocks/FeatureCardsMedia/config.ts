import type { Block } from 'payload'

import { featureFields } from '@/blocks/shared/featureFields'
import { createFeatureIconField } from '@/blocks/shared/featureIcons'
import { linkGroup } from '@/fields/linkGroup'

export const FeatureCardsMedia: Block = {
  slug: 'featureCardsMedia',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_feat_card_med',
  interfaceName: 'FeatureCardsMediaBlock',
  fields: [
    // Shared feature core (eyebrow, title, description). Variant-specific fields
    // follow; edit the shared shape in @/blocks/shared/featureFields.
    ...featureFields,
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 4,
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
        createFeatureIconField(),
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
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
    plural: 'Feature Cards Media Blocks',
    singular: 'Feature Cards Media',
  },
}
