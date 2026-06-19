import type { Block } from 'payload'

import { comparatorFields } from '@/blocks/shared/comparatorFields'
import { linkGroup } from '@/fields/linkGroup'

export const ComparatorStack: Block = {
  slug: 'comparatorStack',
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
          required: true,
        },
        {
          name: 'description',
          type: 'text',
        },
        {
          name: 'price',
          type: 'text',
        },
        {
          name: 'period',
          type: 'text',
          admin: {
            description: 'Shown next to the price, e.g. "/month".',
          },
        },
        {
          name: 'badge',
          type: 'text',
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
              required: true,
            },
            {
              name: 'included',
              type: 'checkbox',
            },
            {
              name: 'value',
              type: 'text',
              admin: {
                description: 'Text value for this feature. Leave "included" unticked and this empty for an excluded feature.',
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
