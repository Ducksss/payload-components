import type { Block } from 'payload'

import { faqFields, faqItemsField } from '@/blocks/shared/faqFields'

export const FaqGrid: Block = {
  slug: 'faqGrid',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_faq_gri',
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
