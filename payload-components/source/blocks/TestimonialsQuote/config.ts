import type { Block } from 'payload'

import { testimonialItemFields } from '@/blocks/shared/testimonialFields'

export const TestimonialsQuote: Block = {
  slug: 'testimonialsQuote',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_tes_quo',
  interfaceName: 'TestimonialsQuoteBlock',
  fields: [
    // A single featured testimonial — the shared one-quote shape (quote, author,
    // optional role, optional avatar). Edit the shared shape in
    // @/blocks/shared/testimonialFields to update every testimonials variant.
    ...testimonialItemFields,
  ],
  labels: {
    plural: 'Testimonials Quote Blocks',
    singular: 'Testimonials Quote',
  },
}
