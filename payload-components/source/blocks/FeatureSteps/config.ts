import type { Block } from 'payload'

import { featureFields } from '@/blocks/shared/featureFields'
import { linkGroup } from '@/fields/linkGroup'

export const FeatureSteps: Block = {
  slug: 'featureSteps',
  interfaceName: 'FeatureStepsBlock',
  fields: [
    // Shared feature core (eyebrow, title, description). Variant-specific fields
    // follow; edit the shared shape in @/blocks/shared/featureFields.
    ...featureFields,
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 6,
      admin: {
        initCollapsed: true,
        description: 'Steps are numbered automatically in array order.',
      },
      fields: [
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
      ],
    },
    linkGroup({
      overrides: {
        admin: {
          initCollapsed: true,
        },
        maxRows: 1,
      },
    }),
  ],
  labels: {
    plural: 'Feature Steps Blocks',
    singular: 'Feature Steps',
  },
}
