import type { Block } from 'payload'

import { callToActionFields } from '@/blocks/shared/callToActionFields'

export const CallToActionSignup: Block = {
  slug: 'callToActionSignup',
  interfaceName: 'CallToActionSignupBlock',
  fields: [
    // Shared call-to-action core (title, description). Variant-specific fields
    // follow; edit the shared shape in @/blocks/shared/callToActionFields.
    ...callToActionFields,
    {
      name: 'emailPlaceholder',
      type: 'text',
    },
    {
      name: 'submitLabel',
      type: 'text',
    },
    {
      name: 'action',
      type: 'text',
      admin: {
        description: 'Where the email form posts (your newsletter or signup endpoint).',
      },
    },
  ],
  labels: {
    plural: 'Call To Action Signup Blocks',
    singular: 'Call To Action Signup',
  },
}
