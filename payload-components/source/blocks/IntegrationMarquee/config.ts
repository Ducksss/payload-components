import type { Block } from 'payload'

import { createIntegrationFeaturedMark, createIntegrationFields } from '@/blocks/shared/integrationFields'

export const IntegrationMarquee: Block = {
  slug: 'integrationMarquee',
  interfaceName: 'IntegrationMarqueeBlock',
  fields: [
    // Shared integration core (heading + subtext + integrations). Edit the shared
    // shape in @/blocks/shared/integrationFields to update every integration variant.
    ...createIntegrationFields(),
    // Variant-specific: a featured center brand mark over the scrolling rows.
    createIntegrationFeaturedMark(),
  ],
  labels: {
    plural: 'Integration Marquee Blocks',
    singular: 'Integration Marquee',
  },
}
