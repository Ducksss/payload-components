import type { Block } from 'payload'

import { footerFields, footerLinkFields } from '@/blocks/shared/footerFields'

export const FooterCentered: Block = {
  slug: 'footerCentered',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_foo_cen',
  interfaceName: 'FooterCenteredBlock',
  fields: [
    // Shared footer core (logo, brandLabel, copyright). Variant-specific fields
    // follow; edit the shared shape in @/blocks/shared/footerFields.
    ...footerFields,
    {
      name: 'tagline',
      type: 'textarea',
      custom: { payloadComponents: { localization: 'localized' } },
    },
    {
      name: 'links',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 8,
      admin: {
        description: 'Primary navigation, centred under the brand.',
        initCollapsed: true,
      },
      // Shared link shape — see @/blocks/shared/footerFields.
      fields: footerLinkFields,
    },
    {
      name: 'legalLinks',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      admin: {
        description: 'Policy links shown beside the copyright line — privacy, terms, cookies.',
        initCollapsed: true,
      },
      // Shared link shape — see @/blocks/shared/footerFields.
      fields: footerLinkFields,
    },
  ],
  labels: {
    plural: 'Footer Centered Blocks',
    singular: 'Footer Centered',
  },
}
