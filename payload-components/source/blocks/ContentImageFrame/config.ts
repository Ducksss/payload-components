import type { Block } from 'payload'

import { createContentFields } from '@/blocks/shared/contentFields'

export const ContentImageFrame: Block = {
  slug: 'contentImageFrame',
  interfaceName: 'ContentImageFrameBlock',
  fields: [
    // Shared content core (eyebrow, title, paragraphs). Variant-specific fields
    // follow; edit the shared shape in @/blocks/shared/contentFields.
    ...createContentFields(),
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
