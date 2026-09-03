import type { Block } from 'payload'

import { callToActionFields } from '@/blocks/shared/callToActionFields'
import { linkGroup } from '@/fields/linkGroup'

export const CallToActionSplit: Block = {
  slug: 'callToActionSplit',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_cal_to_act_spl',
  interfaceName: 'CallToActionSplitBlock',
  fields: [
    // Shared call-to-action core (title, description). Variant-specific fields
    // follow; edit the shared shape in @/blocks/shared/callToActionFields.
    ...callToActionFields,
    {
      name: 'assurance',
      type: 'text',
      custom: { payloadComponents: { localization: 'localized' } },
      admin: {
        description: 'Optional reassurance line under the actions — pricing, timing, or terms.',
      },
    },
    linkGroup({
      overrides: {
        admin: {
          initCollapsed: true,
        },
        maxRows: 2,
        minRows: 1,
      },
    }),
  ],
  labels: {
    plural: 'Call To Action Split Blocks',
    singular: 'Call To Action Split',
  },
}
