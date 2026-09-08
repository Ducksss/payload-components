import type { Block } from 'payload'

import { iconField } from '@/blocks/shared/contentIcons'

export const ContentListIcons: Block = {
  slug: 'contentListIcons',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_con_lis_ico',
  interfaceName: 'ContentListIconsBlock',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      custom: { payloadComponents: { localization: 'localized' } },
    },
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
    },
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
        iconField,
        {
          name: 'term',
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
  ],
  labels: {
    plural: 'Content List Icons Blocks',
    singular: 'Content List Icons',
  },
}
