import type { Block } from 'payload'

import { testimonialFields, testimonialItemFields } from '@/blocks/shared/testimonialFields'

export const TestimonialsBento: Block = {
  slug: 'testimonialsBento',
  interfaceName: 'TestimonialsBentoBlock',
  fields: [
    // Shared testimonials heading (eyebrow, title, description). Edit the shared
    // shape in @/blocks/shared/testimonialFields to update every variant.
    ...testimonialFields,
    {
      name: 'testimonials',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 8,
      admin: {
        initCollapsed: true,
      },
      fields: [
        // Shared one-quote shape — see @/blocks/shared/testimonialFields.
        ...testimonialItemFields,
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'featured',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Give this testimonial the large bento cell.',
          },
        },
      ],
    },
  ],
  labels: {
    plural: 'Testimonials Bento Blocks',
    singular: 'Testimonials Bento',
  },
}
