import type { Block } from 'payload'

import { contentFields } from '@/blocks/shared/contentFields'

export const ContentSplitRows: Block = {
  slug: 'contentSplitRows',
  interfaceName: 'ContentSplitRowsBlock',
  fields: [
    // Shared content core (eyebrow, title, paragraphs). Variant-specific fields
    // follow; edit the shared shape in @/blocks/shared/contentFields.
    ...contentFields,
    {
      name: 'rows',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 4,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
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
  ],
  labels: {
    plural: 'Content Split Rows Blocks',
    singular: 'Content Split Rows',
  },
}
