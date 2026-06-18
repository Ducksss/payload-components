import type { Block } from 'payload'

import { contentFields } from '@/blocks/shared/contentFields'

export const ContentImageFrame: Block = {
  slug: 'contentImageFrame',
  interfaceName: 'ContentImageFrameBlock',
  fields: [
    // Shared content core (eyebrow, title, paragraphs). Variant-specific fields
    // follow; edit the shared shape in @/blocks/shared/contentFields.
    ...contentFields,
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
  labels: {
    plural: 'Content Image Frame Blocks',
    singular: 'Content Image Frame',
  },
}
