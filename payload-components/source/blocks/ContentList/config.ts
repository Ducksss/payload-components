import type { Block } from 'payload'

export const ContentList: Block = {
  slug: 'contentList',
  interfaceName: 'ContentListBlock',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
    },
    {
      name: 'title',
      type: 'text',
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
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
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
