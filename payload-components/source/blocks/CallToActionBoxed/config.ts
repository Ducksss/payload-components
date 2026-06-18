import type { Block } from 'payload'

import { callToActionFields } from '@/blocks/shared/callToActionFields'
import { linkGroup } from '@/fields/linkGroup'

export const CallToActionBoxed: Block = {
  slug: 'callToActionBoxed',
  interfaceName: 'CallToActionBoxedBlock',
  fields: [
    // Shared call-to-action core (title, description). Variant-specific fields
    // follow; edit the shared shape in @/blocks/shared/callToActionFields.
    ...callToActionFields,
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
    plural: 'Call To Action Boxed Blocks',
    singular: 'Call To Action Boxed',
  },
}
