import type { Block } from 'payload'

import { contentFields } from '@/blocks/shared/contentFields'

export const ContentQuote: Block = {
  slug: 'contentQuote',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_con_quo',
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
      custom: { payloadComponents: { localization: 'localized' } },
      required: true,
    },
    {
      name: 'citation',
      type: 'text',
      custom: { payloadComponents: { localization: 'global' } },
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Small logo shown under the citation. Falls back to Logo label when empty.',
      },
    },
    {
      name: 'logoLabel',
      type: 'text',
      custom: { payloadComponents: { localization: 'localized' } },
      admin: {
        description:
          'Text wordmark used when no logo upload is set. Leave both empty for an unbadged quote.',
      },
    },
  ],
  labels: {
    plural: 'Content Quote Blocks',
    singular: 'Content Quote',
  },
}
