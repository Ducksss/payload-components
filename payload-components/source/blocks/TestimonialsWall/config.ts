import type { Block } from 'payload'

import { testimonialFields, testimonialItemFields } from '@/blocks/shared/testimonialFields'

export const TestimonialsWall: Block = {
  slug: 'testimonialsWall',
  interfaceName: 'TestimonialsWallBlock',
  fields: [
    // Shared testimonials heading (eyebrow, title, description). Edit the shared
    // shape in @/blocks/shared/testimonialFields to update every variant.
    ...testimonialFields,
    {
      name: 'testimonials',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 24,
      admin: {
        initCollapsed: true,
      },
      // Shared one-quote shape — see @/blocks/shared/testimonialFields.
      fields: testimonialItemFields,
    },
  ],
  labels: {
    plural: 'Testimonials Wall Blocks',
    singular: 'Testimonials Wall',
  },
}
