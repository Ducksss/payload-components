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
    {
      name: 'title',
      type: 'text',
      custom: { payloadComponents: { localization: 'localized' } },
      required: true,
      defaultValue: 'Let’s talk.',
    },
    {
      name: 'description',
      type: 'textarea',
      custom: { payloadComponents: { localization: 'localized' } },
    },
    {
      name: 'action',
      type: 'text',
      custom: { payloadComponents: { localization: 'global' } },
      required: true,
      validate: validateSameOriginFormAction,
      admin: {
        description:
          'Your same-origin endpoint, such as /api/contact. Accepts multipart form data and returns JSON { success: true } after accepting the message.',
      },
    },
    {
      name: 'submitLabel',
      type: 'text',
      custom: { payloadComponents: { localization: 'localized' } },
      defaultValue: 'Send message',
    },
    {
      name: 'successMessage',
      type: 'textarea',
      custom: { payloadComponents: { localization: 'localized' } },
      required: true,
      defaultValue: 'Thanks for reaching out. Your message has been received.',
    },
    {
      name: 'nameLabel',
      type: 'text',
      custom: { payloadComponents: { localization: 'localized' } },
      defaultValue: 'Name',
    },
    {
      name: 'emailLabel',
      type: 'text',
      custom: { payloadComponents: { localization: 'localized' } },
      defaultValue: 'Email',
    },
    {
      name: 'organizationLabel',
      type: 'text',
      custom: { payloadComponents: { localization: 'localized' } },
      defaultValue: 'Organization',
    },
    {
      name: 'messageLabel',
      type: 'text',
      custom: { payloadComponents: { localization: 'localized' } },
      defaultValue: 'Message',
    },
  ],
}
