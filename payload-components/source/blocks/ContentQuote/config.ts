import type { Block } from 'payload'

import { contentFields } from '@/blocks/shared/contentFields'

export const ContentQuote: Block = {
  slug: 'contentQuote',
  interfaceName: 'ContentQuoteBlock',
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
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'citation',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
  ],
  labels: {
    plural: 'Content Quote Blocks',
    singular: 'Content Quote',
  },
}
