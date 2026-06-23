import type { Block } from 'payload'

import { planFields, pricingFields } from '@/blocks/shared/pricingFields'

export const PricingSplit: Block = {
  slug: 'pricingSplit',
  interfaceName: 'PricingSplitBlock',
  fields: [
    // Shared pricing heading (eyebrow, title, description). Variant-specific
    // fields follow; edit the shared shape in @/blocks/shared/pricingFields.
    ...pricingFields,
    {
      name: 'plans',
      type: 'array',
      required: true,
      // Exactly two plans: the entry plan on the left, the featured plan
      // (mark one `featured`) expanded across the right panel.
      minRows: 2,
      maxRows: 2,
      admin: {
        initCollapsed: true,
      },
      fields: planFields,
    },
  ],
  labels: {
    plural: 'Pricing Split Blocks',
    singular: 'Pricing Split',
  },
}
