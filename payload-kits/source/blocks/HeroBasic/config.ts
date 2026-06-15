import type { Block } from 'payload'

import { heroFields } from '@/blocks/shared/heroFields'

export const HeroBasic: Block = {
  slug: 'heroBasic',
  interfaceName: 'HeroBasicBlock',
  fields: [
    // Shared hero core (eyebrow, title, description, CTA links). Variant-specific
    // fields follow; edit the shared shape in @/blocks/shared/heroFields.
    ...heroFields,
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
    plural: 'Hero Basic Blocks',
    singular: 'Hero Basic',
  },
}
