import type { Block } from 'payload'

import { createIntegrationFields } from '@/blocks/shared/integrationFields'

export const IntegrationTestimonial: Block = {
  slug: 'integrationTestimonial',
  interfaceName: 'IntegrationTestimonialBlock',
  fields: [
    // Shared integration core (heading + subtext + integrations). Edit the shared
    // shape in @/blocks/shared/integrationFields to update every integration variant.
    ...createIntegrationFields(),
    // Variant-specific: a customer quote shown beside the grid of integration cards.
    {
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'author',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
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
