import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

export const ExampleBasic: Block = {
  slug: 'exampleBasic',
  interfaceName: 'ExampleBasicBlock',
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
  ],
  labels: {
    plural: 'Example Basic Blocks',
    singular: 'Example Basic',
  },
}
