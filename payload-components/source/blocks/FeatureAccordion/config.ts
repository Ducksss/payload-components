import type { Block } from 'payload'

import { featureFields } from '@/blocks/shared/featureFields'
import { createFeatureIconField } from '@/blocks/shared/featureIcons'
import { linkGroup } from '@/fields/linkGroup'

export const FeatureAccordion: Block = {
  slug: 'featureAccordion',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_feat_accordion',
  interfaceName: 'FeatureAccordionBlock',
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
          custom: { payloadComponents: { localization: 'localized' } },
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          custom: { payloadComponents: { localization: 'localized' } },
          required: true,
        },
        createFeatureIconField(),
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
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
    plural: 'Feature Accordion Blocks',
    singular: 'Feature Accordion',
  },
}
