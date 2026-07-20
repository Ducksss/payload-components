import type { Block } from 'payload'

import {
  contactChannelTypeOptions,
  validateContactValue,
} from '@/blocks/shared/contactUrls'
import { validateSameOriginFormAction } from '@/blocks/shared/safeUrls'

export const ContactRoutingForm: Block = {
  slug: 'contactRoutingForm',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_contact_route',
  interfaceName: 'ContactRoutingFormBlock',
  fields: [
    {
      name: 'eyebrow',
      type: 'text',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'channels',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 4,
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'type',
          type: 'select',
          options: contactChannelTypeOptions.map((value) => ({
            label: value.charAt(0).toUpperCase() + value.slice(1),
            value,
          })),
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          validate: validateContactValue,
        },
        {
          name: 'description',
          type: 'text',
        },
      ],
    },
    {
      name: 'formTitle',
      type: 'text',
      required: true,
    },
    {
      name: 'formDescription',
      type: 'textarea',
    },
    {
      name: 'formLabels',
      type: 'group',
      fields: [
        { name: 'name', type: 'text', defaultValue: 'Name', required: true },
        { name: 'email', type: 'text', defaultValue: 'Email', required: true },
        { name: 'organization', type: 'text', defaultValue: 'Organization', required: true },
        { name: 'phone', type: 'text', defaultValue: 'Phone', required: true },
        { name: 'message', type: 'text', defaultValue: 'Message', required: true },
      ],
    },
    {
      name: 'submitLabel',
      type: 'text',
      defaultValue: 'Send inquiry',
      required: true,
    },
    {
      name: 'action',
      type: 'text',
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
