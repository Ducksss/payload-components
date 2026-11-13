import type { Block } from 'payload'

import { integrationFeaturedMark, integrationFields } from '@/blocks/shared/integrationFields'

import { integrationMarqueeThumbnail } from './thumbnail'

export const IntegrationMarquee: Block = {
  slug: 'integrationMarquee',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_int_mar',
  interfaceName: 'IntegrationMarqueeBlock',
  admin: {
    group: 'Integration',
    images: {
      thumbnail: integrationMarqueeThumbnail,
    },
  },
  fields: [
    // Shared integration core (heading + subtext + integrations). Edit the shared
    // shape in @/blocks/shared/integrationFields to update every integration variant.
    ...integrationFields,
    // Variant-specific: a featured center brand mark over the scrolling rows.
    integrationFeaturedMark,
  ],
  labels: {
    plural: 'Integration Marquee Blocks',
    singular: 'Integration Marquee',
  },
}
