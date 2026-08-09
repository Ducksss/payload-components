import type { Block } from 'payload'

import { footerFields, footerLinkFields } from '@/blocks/shared/footerFields'

export const FooterSimple: Block = {
  slug: 'footerSimple',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_foo_sim',
  interfaceName: 'FooterSimpleBlock',
  fields: [
    // Shared footer core (logo, brandLabel, copyright). Variant-specific fields
    // follow; edit the shared shape in @/blocks/shared/footerFields.
    ...footerFields,
    {
      name: 'links',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 8,
      admin: {
        description: 'A single flat row of links — keep it short so the row stays on one line.',
        initCollapsed: true,
      },
      // Shared link shape — see @/blocks/shared/footerFields.
      fields: footerLinkFields,
    },
  ],
  labels: {
    plural: 'Footer Simple Blocks',
    singular: 'Footer Simple',
  },
}
