import type { Block } from 'payload'

import { statsFields } from '@/blocks/shared/statsFields'

export const StatsGrid: Block = {
  slug: 'statsGrid',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_stats_grid',
  interfaceName: 'StatsGridBlock',
  fields: [
    // Shared stats core (eyebrow, title, description). Variant-specific fields
    // follow; edit the shared shape in @/blocks/shared/statsFields.
    ...statsFields,
    {
      name: 'metrics',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 4,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'detail',
          type: 'text',
          admin: {
            description: 'Optional qualifier shown under the label — a period, source, or caveat.',
          },
        },
      ],
    },
    {
      name: 'footnote',
      type: 'text',
      admin: {
        description: 'Optional measurement note rendered under the grid.',
      },
    },
  ],
  labels: {
    plural: 'Stats Grid Blocks',
    singular: 'Stats Grid',
  },
}
