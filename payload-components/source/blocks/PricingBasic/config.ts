import type { Block } from 'payload'

import { pricingFields } from '@/blocks/shared/pricingFields'

export const PricingBasic: Block = {
  slug: 'pricingBasic',
  interfaceName: 'PricingBasicBlock',
  fields: [
    // Shared pricing core (header + plans). Keep this variant static: no billing
    // or checkout logic ships with the block.
    ...pricingFields,
  ],
  labels: {
    plural: 'Pricing Basic Blocks',
    singular: 'Pricing Basic',
  },
}
