import type { Block } from 'payload'

import { contentFields } from '@/blocks/shared/contentFields'
import { linkGroup } from '@/fields/linkGroup'

export const ContentImageLead: Block = {
  slug: 'contentImageLead',
  interfaceName: 'ContentImageLeadBlock',
  fields: [
    // Shared content core (eyebrow, title, paragraphs). Variant-specific fields
    // follow; edit the shared shape in @/blocks/shared/contentFields.
    ...contentFields,
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    linkGroup({
      overrides: {
        admin: {
          initCollapsed: true,
        },
        maxRows: 1,
      },
    }),
  ],
  labels: {
    plural: 'Content Image Lead Blocks',
    singular: 'Content Image Lead',
  },
}
