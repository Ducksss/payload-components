import type { Block } from 'payload'

import { statsFields, statsMetricFields } from '@/blocks/shared/statsFields'

export const StatsInline: Block = {
  slug: 'statsInline',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_sta_inl',
  interfaceName: 'StatsInlineBlock',
  fields: [
    // Shared stats core (eyebrow, title). Variant-specific fields follow; edit the
    // shared shape in @/blocks/shared/statsFields.
    ...statsFields,
    {
      name: 'description',
      type: 'textarea',
      custom: { payloadComponents: { localization: 'localized' } },
    },
    {
      name: 'metrics',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 6,
      admin: {
        description:
          'Each row reads as one sentence — the value leads, the label completes it ("99.9% uptime guarantee").',
        initCollapsed: true,
      },
      // Shared metric shape — see @/blocks/shared/statsFields.
      fields: statsMetricFields,
    },
  ],
  labels: {
    plural: 'Stats Inline Blocks',
    singular: 'Stats Inline',
  },
}
