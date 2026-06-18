import type { Block } from 'payload'

import { contentFields } from '@/blocks/shared/contentFields'
import { linkGroup } from '@/fields/linkGroup'

export const ContentColumns: Block = {
  slug: 'contentColumns',
  interfaceName: 'ContentColumnsBlock',
  fields: [
    // Shared content core (eyebrow, title, paragraphs). Variant-specific fields
    // follow; edit the shared shape in @/blocks/shared/contentFields.
    ...contentFields,
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
    plural: 'Content Columns Blocks',
    singular: 'Content Columns',
  },
}
