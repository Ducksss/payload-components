import type { Block } from 'payload'

export const ContentList: Block = {
  slug: 'contentList',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_con_lis',
  interfaceName: 'ContentListBlock',
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
    plural: 'Content List Blocks',
    singular: 'Content List',
  },
}
