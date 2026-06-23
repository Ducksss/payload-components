import type { Block } from 'payload'

import { planFields, pricingFields } from '@/blocks/shared/pricingFields'

export const PricingCards: Block = {
  slug: 'pricingCards',
  interfaceName: 'PricingCardsBlock',
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
    plural: 'Pricing Cards Blocks',
    singular: 'Pricing Cards',
  },
}
