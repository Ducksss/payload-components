import type { Block } from 'payload'

import { heroFields } from '@/blocks/shared/heroFields'

export const HeroAurora: Block = {
  slug: 'heroAurora',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_hero_aurora',
  interfaceName: 'HeroAuroraBlock',
  fields: [
    // Shared hero core (eyebrow, title, description, CTA links). Variant-specific
    // fields follow; edit the shared shape in @/blocks/shared/heroFields.
    ...heroFields,
    {
      name: 'metrics',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
      ],
      maxRows: 3,
    },
    {
      name: 'productImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'imageCaption',
      type: 'text',
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
          required: true,
        },
      ],
      maxRows: 4,
    },
  ],
  labels: {
    plural: 'Hero Aurora Blocks',
    singular: 'Hero Aurora',
  },
}
