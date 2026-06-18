import type { Block } from 'payload'

import { contentFields } from '@/blocks/shared/contentFields'
import { iconField } from '@/blocks/shared/contentIcons'

export const ContentStats: Block = {
  slug: 'contentStats',
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
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
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
          required: true,
        },
        {
          name: 'label',
          type: 'text',
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
