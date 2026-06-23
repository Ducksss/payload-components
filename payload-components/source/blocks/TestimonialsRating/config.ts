import type { Block } from 'payload'

import { testimonialFields, testimonialItemFields } from '@/blocks/shared/testimonialFields'

export const TestimonialsRating: Block = {
  slug: 'testimonialsRating',
  interfaceName: 'TestimonialsRatingBlock',
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
      fields: [
        {
          name: 'rating',
          type: 'number',
          required: true,
          min: 1,
          max: 5,
          defaultValue: 5,
        },
        // Shared one-quote shape — see @/blocks/shared/testimonialFields.
        ...testimonialItemFields,
      ],
    },
  ],
  labels: {
    plural: 'Testimonials Rating Blocks',
    singular: 'Testimonials Rating',
  },
}
