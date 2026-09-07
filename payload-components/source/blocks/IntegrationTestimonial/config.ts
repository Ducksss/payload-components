import type { Block } from 'payload'

import { integrationFields } from '@/blocks/shared/integrationFields'

export const IntegrationTestimonial: Block = {
  slug: 'integrationTestimonial',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_int_tes',
  interfaceName: 'IntegrationTestimonialBlock',
  fields: [
    // Shared integration core (heading + subtext + integrations). Edit the shared
    // shape in @/blocks/shared/integrationFields to update every integration variant.
    ...integrationFields,
    // Variant-specific: a customer quote shown beside the grid of integration cards.
    {
      name: 'quote',
      type: 'textarea',
      custom: { payloadComponents: { localization: 'localized' } },
      required: true,
    },
    {
      name: 'author',
      type: 'text',
      custom: { payloadComponents: { localization: 'global' } },
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      custom: { payloadComponents: { localization: 'localized' } },
    },
    {
      name: 'authorAvatar',
      type: 'upload',
      relationTo: 'media',
    },
  ],
  labels: {
    plural: 'Integration Testimonial Blocks',
    singular: 'Integration Testimonial',
  },
}
