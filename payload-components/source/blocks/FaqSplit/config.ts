import type { Block } from 'payload'

import { faqFields, faqItemsField } from '@/blocks/shared/faqFields'
import { linkGroup } from '@/fields/linkGroup'

export const FaqSplit: Block = {
  slug: 'faqSplit',
  interfaceName: 'FaqSplitBlock',
  fields: [
    // Shared FAQ core (eyebrow, title, description). Variant-specific fields
    // follow; edit the shared shape in @/blocks/shared/faqFields.
    ...faqFields,
    faqItemsField,
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
    plural: 'FAQ Split Blocks',
    singular: 'FAQ Split',
  },
}
