import type { Block } from 'payload'

import { callToActionFields } from '@/blocks/shared/callToActionFields'
import { validateSameOriginFormAction } from '@/blocks/shared/safeUrls'

import { callToActionSignupThumbnail } from './thumbnail'

export const CallToActionSignup: Block = {
  slug: 'callToActionSignup',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_cal_to_act_sig',
  interfaceName: 'CallToActionSignupBlock',
  admin: {
    group: 'Call to action',
    images: {
      thumbnail: callToActionSignupThumbnail,
    },
  },
  fields: [
    // Shared call-to-action core (title, description). Variant-specific fields
    // follow; edit the shared shape in @/blocks/shared/callToActionFields.
    ...callToActionFields,
    {
      name: 'emailPlaceholder',
      type: 'text',
      custom: { payloadComponents: { localization: 'localized' } },
    },
    {
      name: 'submitLabel',
      type: 'text',
      custom: { payloadComponents: { localization: 'localized' } },
    },
    {
      name: 'action',
      type: 'text',
      required: true,
      custom: { payloadComponents: { localization: 'global' } },
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
