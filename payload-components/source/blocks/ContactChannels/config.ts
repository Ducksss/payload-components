import type { Block } from 'payload'

import { contactChannelFields, contactFields } from '@/blocks/shared/contactFields'

export const ContactChannels: Block = {
  slug: 'contactChannels',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_contact_chan',
  interfaceName: 'ContactChannelsBlock',
  fields: [
    // Shared contact core (eyebrow, title, description). Variant-specific fields
    // follow; edit the shared shape in @/blocks/shared/contactFields.
    ...contactFields,
    {
      name: 'channels',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 6,
      admin: {
        initCollapsed: true,
      },
      // Shared channel shape — see @/blocks/shared/contactFields.
      fields: contactChannelFields,
    },
    {
      name: 'footnote',
      type: 'text',
      custom: { payloadComponents: { localization: 'localized' } },
      admin: {
        description: 'Optional response-time or hours note rendered under the channels.',
      },
    },
  ],
  labels: {
    plural: 'Contact Channels Blocks',
    singular: 'Contact Channels',
  },
}
