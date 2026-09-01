import type { Block } from 'payload'

import { createCallToActionFields } from '@/blocks/shared/callToActionFields'

const validateAction = (value: unknown) => {
  if (typeof value !== 'string' || value.trim() === '') {
    return 'Enter a form action URL.'
  }

  const action = value.trim()

  if (action.startsWith('/') && !action.startsWith('//')) {
    return true
  }

  try {
    const url = new URL(action)
    return ['http:', 'https:'].includes(url.protocol) || 'Use a relative, http, or https URL.'
  } catch {
    return 'Use a relative, http, or https URL.'
  }
}

export const CallToActionSignup: Block = {
  slug: 'callToActionSignup',
  interfaceName: 'CallToActionSignupBlock',
  fields: [
    // Shared call-to-action core (title, description). Variant-specific fields
    // follow; edit the shared shape in @/blocks/shared/callToActionFields.
    ...createCallToActionFields(),
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
      required: true,
      admin: {
        description: 'Where the email form posts (your newsletter or signup endpoint).',
      },
      validate: validateAction,
    },
  ],
  labels: {
    plural: 'Call To Action Signup Blocks',
    singular: 'Call To Action Signup',
  },
}
