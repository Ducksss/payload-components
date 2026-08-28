import type { Block } from 'payload'

import { heroFields } from '@/blocks/shared/heroFields'

export const HeroSplit: Block = {
  slug: 'heroSplit',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_hero_spl',
  interfaceName: 'HeroSplitBlock',
  fields: [
    // Shared hero core (eyebrow, title, description, CTA links). Variant-specific
    // fields follow; edit the shared shape in @/blocks/shared/heroFields.
    ...heroFields,
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      // Which side the visual sits on. A field rather than a second component,
      // because alternating sides down a page is a layout decision an editor
      // makes per block, not a different kind of hero.
      name: 'mediaPosition',
      type: 'select',
      defaultValue: 'right',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      name: 'highlights',
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
      maxRows: 3,
    },
  ],
  labels: {
    plural: 'Hero Split Blocks',
    singular: 'Hero Split',
  },
}
