import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

export const HeroBasic: Block = {
  slug: 'heroBasic',
  interfaceName: 'HeroBasicBlock',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    linkGroup({
      overrides: {
        admin: {
          initCollapsed: true,
        },
        maxRows: 2,
        minRows: 1,
      },
    }),
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
