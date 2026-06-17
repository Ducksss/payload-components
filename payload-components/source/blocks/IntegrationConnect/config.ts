import type { Block } from 'payload'

import { integrationFeaturedMark, integrationFields } from '@/blocks/shared/integrationFields'

export const IntegrationConnect: Block = {
  slug: 'integrationConnect',
  interfaceName: 'IntegrationConnectBlock',
  fields: [
    // Shared integration core (heading + subtext + integrations). Edit the shared
    // shape in @/blocks/shared/integrationFields to update every integration variant.
    ...integrationFields,
    // Variant-specific: a featured center brand mark the logos connect to.
    integrationFeaturedMark,
  ],
  labels: {
    plural: 'Integration Connect Blocks',
    singular: 'Integration Connect',
  },
}
