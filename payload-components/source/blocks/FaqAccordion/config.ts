import type { Block } from 'payload'

import { faqFields, faqItemsField } from '@/blocks/shared/faqFields'
import { linkGroup } from '@/fields/linkGroup'

export const FaqAccordion: Block = {
  slug: 'faqAccordion',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_faq_acc',
  interfaceName: 'FaqAccordionBlock',
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
    plural: 'FAQ Accordion Blocks',
    singular: 'FAQ Accordion',
  },
}
