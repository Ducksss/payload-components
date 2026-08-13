import type { Block } from 'payload'

import { statsFields, statsMetricFields } from '@/blocks/shared/statsFields'

export const StatsProof: Block = {
  slug: 'statsProof',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_stats_proof',
  interfaceName: 'StatsProofBlock',
  fields: [
    // Shared stats core (eyebrow, title). Variant-specific fields follow; edit the
    // shared shape in @/blocks/shared/statsFields.
    ...statsFields,
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
    },
    {
      name: 'metrics',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 4,
      admin: {
        initCollapsed: true,
      },
      // Shared metric shape — see @/blocks/shared/statsFields.
      fields: statsMetricFields,
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'author',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Customer logo shown above the quote. Falls back to Logo label when empty.',
      },
    },
    {
      name: 'logoLabel',
      type: 'text',
      admin: {
        description:
          'Text wordmark used when no logo upload is set — for customers whose mark you do not have as an asset.',
      },
    },
  ],
  labels: {
    plural: 'Stats Proof Blocks',
    singular: 'Stats Proof',
  },
}
