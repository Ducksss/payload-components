import type { Block } from 'payload'

import { statsFields, statsMetricFields } from '@/blocks/shared/statsFields'

export const StatsCard: Block = {
  slug: 'statsCard',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_sta_car',
  interfaceName: 'StatsCardBlock',
  fields: [
    // Shared stats core (eyebrow, title). Variant-specific fields follow; edit the
    // shared shape in @/blocks/shared/statsFields.
    ...statsFields,
    {
      name: 'metrics',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 4,
      admin: {
        description:
          'Each metric becomes one column of the divided panel — two to four keeps the row readable.',
        initCollapsed: true,
      },
      // Shared metric shape — see @/blocks/shared/statsFields.
      fields: statsMetricFields,
    },
  ],
  labels: {
    plural: 'Stats Card Blocks',
    singular: 'Stats Card',
  },
}
