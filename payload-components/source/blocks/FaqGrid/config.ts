import type { Block } from 'payload'

import { faqFields, faqItemsField } from '@/blocks/shared/faqFields'

export const FaqGrid: Block = {
  slug: 'faqGrid',
  interfaceName: 'FaqGridBlock',
  fields: [
    // Shared FAQ core (eyebrow, title, description). Variant-specific fields
    // follow; edit the shared shape in @/blocks/shared/faqFields.
    ...faqFields,
    faqItemsField,
  ],
  labels: {
    plural: 'FAQ Grid Blocks',
    singular: 'FAQ Grid',
  },
}
