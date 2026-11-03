import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'

import { exampleBasicThumbnail } from './thumbnail'

export const ExampleBasic: Block = {
  slug: 'exampleBasic',
  interfaceName: 'ExampleBasicBlock',
  admin: {
    group: 'Example',
    images: {
      thumbnail: exampleBasicThumbnail,
    },
  },
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
      custom: { payloadComponents: { localization: 'localized' } },
    },
    {
      name: 'title',
      type: 'text',
      custom: { payloadComponents: { localization: 'localized' } },
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      custom: { payloadComponents: { localization: 'localized' } },
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
