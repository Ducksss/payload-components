import type { Block } from 'payload'

import { testimonialFields, testimonialItemFields } from '@/blocks/shared/testimonialFields'

export const TestimonialsGrid: Block = {
  slug: 'testimonialsGrid',
  interfaceName: 'TestimonialsGridBlock',
  fields: [
    // Shared testimonials heading (eyebrow, title, description). Edit the shared
    // shape in @/blocks/shared/testimonialFields to update every variant.
    ...testimonialFields,
    {
      name: 'testimonials',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 12,
      admin: {
        initCollapsed: true,
      },
      // Shared one-quote shape — see @/blocks/shared/testimonialFields.
      fields: testimonialItemFields,
    },
  ],
  labels: {
    plural: 'Testimonials Grid Blocks',
    singular: 'Testimonials Grid',
  },
}
