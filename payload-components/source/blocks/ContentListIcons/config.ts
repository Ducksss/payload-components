import type { Block } from 'payload'

import { iconField } from '@/blocks/shared/contentIcons'

export const ContentListIcons: Block = {
  slug: 'contentListIcons',
  interfaceName: 'ContentListIconsBlock',
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
      name: 'description',
      type: 'textarea',
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
    plural: 'Content List Icons Blocks',
    singular: 'Content List Icons',
  },
}
