import type { Block } from 'payload'

import { comparatorFields } from '@/blocks/shared/comparatorFields'
import { linkGroup } from '@/fields/linkGroup'

export const ComparatorStack: Block = {
  slug: 'comparatorStack',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_com_sta',
  interfaceName: 'ComparatorStackBlock',
  fields: [
    // Shared comparator header (title, description). Variant-specific fields
    // follow; edit the shared shape in @/blocks/shared/comparatorFields.
    ...comparatorFields,
    {
      name: 'plans',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 4,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          custom: { payloadComponents: { localization: 'localized' } },
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          custom: { payloadComponents: { localization: 'localized' } },
        },
        {
          name: 'price',
          type: 'text',
          custom: { payloadComponents: { localization: 'global' } },
        },
        {
          name: 'period',
          type: 'text',
          custom: { payloadComponents: { localization: 'localized' } },
          admin: {
            description: 'Shown next to the price, e.g. "/month".',
          },
        },
        {
          name: 'badge',
          type: 'text',
          custom: { payloadComponents: { localization: 'localized' } },
          admin: {
            description: 'Optional pill beside the plan name, e.g. "Most popular".',
          },
        },
        {
          name: 'highlighted',
          type: 'checkbox',
          admin: {
            description: 'Adds an accent ring to draw the eye to the recommended plan.',
          },
        },
        linkGroup({
          overrides: {
            maxRows: 1,
          },
        }),
        {
          name: 'features',
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
            {
              name: 'included',
              type: 'checkbox',
            },
            {
              name: 'value',
              type: 'text',
              custom: { payloadComponents: { localization: 'localized' } },
              admin: {
                description:
                  'Text value for this feature. Leave "included" unticked and this empty for an excluded feature.',
              },
            },
          ],
        },
      ],
    },
  ],
  labels: {
    plural: 'Comparator Stack Blocks',
    singular: 'Comparator Stack',
  },
}
