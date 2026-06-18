import type { Block } from 'payload'

import { contentFields } from '@/blocks/shared/contentFields'
import { iconField } from '@/blocks/shared/contentIcons'

export const ContentFeatureMedia: Block = {
  slug: 'contentFeatureMedia',
  interfaceName: 'ContentFeatureMediaBlock',
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
  ],
  labels: {
    plural: 'Content Feature Media Blocks',
    singular: 'Content Feature Media',
  },
}
