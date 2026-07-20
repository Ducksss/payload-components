import type { Block } from 'payload'

import { heroFields } from '@/blocks/shared/heroFields'

export const HeroProductTilt: Block = {
  slug: 'heroProductTilt',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_hero_prod_tilt',
  interfaceName: 'HeroProductTiltBlock',
  fields: [
    // Shared hero core (eyebrow, title, description, CTA links). Variant-specific
    // fields follow; edit the shared shape in @/blocks/shared/heroFields.
    ...heroFields,
    {
      name: 'productImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
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
    plural: 'Hero Product Tilt Blocks',
    singular: 'Hero Product Tilt',
  },
}
