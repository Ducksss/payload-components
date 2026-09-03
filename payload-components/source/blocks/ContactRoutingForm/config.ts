import type { Block } from 'payload'

import { contactChannelFields, contactFields } from '@/blocks/shared/contactFields'
import { validateSameOriginFormAction } from '@/blocks/shared/safeUrls'

export const ContactRoutingForm: Block = {
  slug: 'contactRoutingForm',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_contact_route',
  interfaceName: 'ContactRoutingFormBlock',
  fields: [
    // Shared contact core (eyebrow, title, description). Variant-specific fields
    // follow; edit the shared shape in @/blocks/shared/contactFields.
    ...contactFields,
    {
      name: 'channels',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 4,
      admin: {
        initCollapsed: true,
      },
      // Shared channel shape — see @/blocks/shared/contactFields.
      fields: contactChannelFields,
    },
    {
      name: 'formTitle',
      type: 'text',
      custom: { payloadComponents: { localization: 'localized' } },
      required: true,
    },
    {
      name: 'formDescription',
      type: 'textarea',
      custom: { payloadComponents: { localization: 'localized' } },
    },
    {
      name: 'formLabels',
      type: 'group',
      fields: [
        {
          name: 'name',
          type: 'text',
          custom: { payloadComponents: { localization: 'localized' } },
          defaultValue: 'Name',
          required: true,
        },
        {
          name: 'email',
          type: 'text',
          custom: { payloadComponents: { localization: 'localized' } },
          defaultValue: 'Email',
          required: true,
        },
        {
          name: 'organization',
          type: 'text',
          custom: { payloadComponents: { localization: 'localized' } },
          defaultValue: 'Organization',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
          custom: { payloadComponents: { localization: 'localized' } },
          defaultValue: 'Phone',
          required: true,
        },
        {
          name: 'message',
          type: 'text',
          custom: { payloadComponents: { localization: 'localized' } },
          defaultValue: 'Message',
          required: true,
        },
      ],
    },
    {
      name: 'submitLabel',
      type: 'text',
      custom: { payloadComponents: { localization: 'localized' } },
      defaultValue: 'Send inquiry',
      required: true,
    },
    {
      name: 'action',
      type: 'text',
      custom: { payloadComponents: { localization: 'global' } },
      required: true,
      validate: validateSameOriginFormAction,
      admin: {
        description: 'Same-origin path where the inquiry form posts, such as /api/contact.',
      },
    },
  ],
  labels: {
    plural: 'Contact Routing Form Blocks',
    singular: 'Contact Routing Form',
  },
}
