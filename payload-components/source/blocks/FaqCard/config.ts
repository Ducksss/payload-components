import type { Block } from 'payload'

import { faqFields, faqItemsField } from '@/blocks/shared/faqFields'
import { linkGroup } from '@/fields/linkGroup'

export const FaqCard: Block = {
  slug: 'faqCard',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_faq_car',
  interfaceName: 'FaqCardBlock',
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
    plural: 'FAQ Card Blocks',
    singular: 'FAQ Card',
  },
}
