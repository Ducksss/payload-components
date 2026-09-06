import type { Block } from 'payload'

import { validateSameOriginFormAction } from '@/blocks/shared/safeUrls'

export const ContactFormBasic: Block = {
  slug: 'contactFormBasic',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_con_for_bas',
  interfaceName: 'ContactFormBasicBlock',
  labels: { singular: 'Contact Form Basic', plural: 'Contact Form Basic Blocks' },
  fields: [
    { name: 'title', type: 'text', required: true, defaultValue: 'Let’s talk.' },
    { name: 'description', type: 'textarea' },
    {
      name: 'action',
      type: 'text',
      required: true,
      validate: validateSameOriginFormAction,
      admin: {
        description:
          'Your same-origin endpoint, such as /api/contact. Accepts multipart form data and returns JSON { success: true } after accepting the message.',
      },
    },
    { name: 'submitLabel', type: 'text', defaultValue: 'Send message' },
    {
      name: 'successMessage',
      type: 'textarea',
      required: true,
      defaultValue: 'Thanks for reaching out. Your message has been received.',
    },
    { name: 'nameLabel', type: 'text', defaultValue: 'Name' },
    { name: 'emailLabel', type: 'text', defaultValue: 'Email' },
    { name: 'organizationLabel', type: 'text', defaultValue: 'Organization' },
    { name: 'messageLabel', type: 'text', defaultValue: 'Message' },
  ],
}
