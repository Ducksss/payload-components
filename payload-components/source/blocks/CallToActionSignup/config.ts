import type { Block } from 'payload'

import { callToActionFields } from '@/blocks/shared/callToActionFields'
import { validateSameOriginFormAction } from '@/blocks/shared/safeUrls'

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
      validate: validateSameOriginFormAction,
      admin: {
        description: 'Same-origin path where the email form posts, such as /api/newsletter.',
      },
    },
  ],
  labels: {
    plural: 'Call To Action Signup Blocks',
    singular: 'Call To Action Signup',
  },
}
