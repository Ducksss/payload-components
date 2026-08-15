import type { Block } from 'payload'

import { statsFields, statsMetricFields } from '@/blocks/shared/statsFields'

export const StatsGrid: Block = {
  slug: 'statsGrid',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_sta_gri',
  interfaceName: 'StatsGridBlock',
  fields: [
    // Shared stats core (eyebrow, title). Variant-specific fields follow; edit the
    // shared shape in @/blocks/shared/statsFields.
    ...statsFields,
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'metrics',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 8,
      admin: {
        initCollapsed: true,
      },
      // Shared metric shape — see @/blocks/shared/statsFields.
      fields: statsMetricFields,
    },
  ],
  labels: {
    plural: 'Stats Grid Blocks',
    singular: 'Stats Grid',
  },
}
