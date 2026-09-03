import type { Block } from 'payload'

import { comparatorFields } from '@/blocks/shared/comparatorFields'
import { linkGroup } from '@/fields/linkGroup'

export const ComparatorGrid: Block = {
  slug: 'comparatorGrid',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_com_gri',
  interfaceName: 'ComparatorGridBlock',
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
            description: 'Optional pill above the plan name, e.g. "Most popular".',
          },
        },
        {
          name: 'highlighted',
          type: 'checkbox',
          admin: {
            description: 'Tints this column to draw the eye to the recommended plan.',
          },
        },
        linkGroup({
          overrides: {
            maxRows: 1,
          },
        }),
      ],
    },
    {
      name: 'features',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'feature',
          type: 'text',
          custom: { payloadComponents: { localization: 'localized' } },
          required: true,
        },
        {
          name: 'values',
          type: 'array',
          admin: {
            description:
              'One cell per plan, in the same order as Plans. Tick "included" for a checkmark, or set a label for a text value.',
          },
          fields: [
            {
              name: 'included',
              type: 'checkbox',
            },
            {
              name: 'label',
              type: 'text',
              custom: { payloadComponents: { localization: 'localized' } },
            },
          ],
        },
      ],
    },
  ],
  labels: {
    plural: 'Comparator Grid Blocks',
    singular: 'Comparator Grid',
  },
}
