import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

export const FeatureGridBasic: Block = {
  slug: 'featureGridBasic',
  interfaceName: 'FeatureGridBasicBlock',
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
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 3,
      maxRows: 6,
      admin: {
        initCollapsed: true,
      },
      fields: [
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
      ],
    },
    linkGroup({
      overrides: {
        admin: {
          initCollapsed: true,
        },
        maxRows: 1,
      },
    }),
  ],
  labels: {
    plural: 'Feature Grid Basic Blocks',
    singular: 'Feature Grid Basic',
  },
}
