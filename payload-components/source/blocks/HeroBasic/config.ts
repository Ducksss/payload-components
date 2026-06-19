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
        description: 'Add 2-4 short trust badges (e.g. SOC 2 Type II).',
        initCollapsed: true,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'SOC 2 Type II',
          },
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
