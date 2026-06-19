import type { Block } from 'payload'

import { planFields, pricingFields } from '@/blocks/shared/pricingFields'

export const PricingCardsMuted: Block = {
  slug: 'pricingCardsMuted',
  interfaceName: 'PricingCardsMutedBlock',
  fields: [
    // Shared pricing heading (eyebrow, title, description). Variant-specific
    // fields follow; edit the shared shape in @/blocks/shared/pricingFields.
    ...pricingFields,
    {
      name: 'plans',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 4,
      admin: {
        initCollapsed: true,
      },
      fields: planFields,
    },
  ],
  labels: {
    plural: 'Pricing Cards Muted Blocks',
    singular: 'Pricing Cards Muted',
  },
}
