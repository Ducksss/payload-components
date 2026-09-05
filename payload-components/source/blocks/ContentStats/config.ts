import type { Block } from 'payload'

import { contentFields } from '@/blocks/shared/contentFields'
import { iconField } from '@/blocks/shared/contentIcons'

export const ContentStats: Block = {
  slug: 'contentStats',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_con_sta',
  interfaceName: 'ContentStatsBlock',
  fields: [
    // Shared content core (eyebrow, title, paragraphs). Variant-specific fields
    // follow; edit the shared shape in @/blocks/shared/contentFields.
    ...contentFields,
    {
      name: 'features',
      type: 'array',
      minRows: 2,
      maxRows: 6,
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
      name: 'stats',
      type: 'array',
      minRows: 1,
      maxRows: 8,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'value',
          type: 'text',
          custom: { payloadComponents: { localization: 'global' } },
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          custom: { payloadComponents: { localization: 'localized' } },
          required: true,
        },
      ],
    },
  ],
  labels: {
    plural: 'Content Stats Blocks',
    singular: 'Content Stats',
  },
}
