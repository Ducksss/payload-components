import type { Block } from 'payload'

import { contentFields } from '@/blocks/shared/contentFields'
import { iconField } from '@/blocks/shared/contentIcons'

export const ContentFeatureSplit: Block = {
  slug: 'contentFeatureSplit',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_con_fea_spl',
  interfaceName: 'ContentFeatureSplitBlock',
  fields: [
    // Shared content core (eyebrow, title, paragraphs). Variant-specific fields
    // follow; edit the shared shape in @/blocks/shared/contentFields.
    ...contentFields,
    {
      name: 'features',
      type: 'array',
      minRows: 2,
      maxRows: 2,
      admin: {
        initCollapsed: true,
      },
      fields: [
        iconField,
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
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
  labels: {
    plural: 'Content Feature Split Blocks',
    singular: 'Content Feature Split',
  },
}
