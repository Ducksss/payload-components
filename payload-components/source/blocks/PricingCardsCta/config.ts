import type { Block } from 'payload'

import { planFields, pricingFields } from '@/blocks/shared/pricingFields'

import { pricingCardsCtaThumbnail } from './thumbnail'

export const PricingCardsCta: Block = {
  slug: 'pricingCardsCta',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_pri_car_cta',
  interfaceName: 'PricingCardsCtaBlock',
  admin: {
    group: 'Pricing',
    images: {
      thumbnail: pricingCardsCtaThumbnail,
    },
  },
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
    plural: 'Pricing Cards CTA Blocks',
    singular: 'Pricing Cards CTA',
  },
}
