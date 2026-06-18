import type { Block } from 'payload'

import { contentFields } from '@/blocks/shared/contentFields'

export const ContentCommunity: Block = {
  slug: 'contentCommunity',
  interfaceName: 'ContentCommunityBlock',
  fields: [
    // Shared content core (eyebrow, title, paragraphs). Variant-specific fields
    // follow; edit the shared shape in @/blocks/shared/contentFields.
    ...contentFields,
    {
      name: 'avatars',
      type: 'array',
      required: true,
      minRows: 3,
      maxRows: 24,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          type: 'text',
        },
      ],
    },
  ],
  labels: {
    plural: 'Content Community Blocks',
    singular: 'Content Community',
  },
}
