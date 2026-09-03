import type { Block } from 'payload'

import { heroFields } from '@/blocks/shared/heroFields'

export const HeroKinetic: Block = {
  slug: 'heroKinetic',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_hero_kinetic',
  interfaceName: 'HeroKineticBlock',
  fields: [
    // Shared hero core (eyebrow, title, description, CTA links). Variant-specific
    // fields follow; edit the shared shape in @/blocks/shared/heroFields.
    ...heroFields,
    {
      name: 'marqueeItems',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          custom: { payloadComponents: { localization: 'localized' } },
          required: true,
        },
      ],
      maxRows: 8,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'imageCaption',
      type: 'text',
      custom: { payloadComponents: { localization: 'localized' } },
    },
    {
      name: 'proofItems',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          custom: { payloadComponents: { localization: 'localized' } },
          required: true,
        },
      ],
      maxRows: 4,
    },
  ],
  labels: {
    plural: 'Hero Kinetic Blocks',
    singular: 'Hero Kinetic',
  },
}
