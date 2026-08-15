import type { Block } from 'payload'

import { footerFields, footerLinkFields } from '@/blocks/shared/footerFields'

export const FooterColumns: Block = {
  slug: 'footerColumns',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_foo_col',
  interfaceName: 'FooterColumnsBlock',
  fields: [
    // Shared footer core (logo, brandLabel, copyright). Variant-specific fields
    // follow; edit the shared shape in @/blocks/shared/footerFields.
    ...footerFields,
    {
      name: 'tagline',
      type: 'textarea',
    },
    {
      name: 'groups',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 4,
      admin: {
        description: 'Each group becomes one labelled column of links.',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Column heading, and the accessible name for that group of links.',
          },
        },
        {
          name: 'links',
          type: 'array',
          required: true,
          minRows: 1,
          maxRows: 8,
          // Shared link shape — see @/blocks/shared/footerFields.
          fields: footerLinkFields,
        },
      ],
    },
  ],
  labels: {
    plural: 'Footer Columns Blocks',
    singular: 'Footer Columns',
  },
}
