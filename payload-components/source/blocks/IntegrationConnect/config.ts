import type { Block } from 'payload'

import { createIntegrationFeaturedMark, createIntegrationFields } from '@/blocks/shared/integrationFields'

export const IntegrationConnect: Block = {
  slug: 'integrationConnect',
  interfaceName: 'IntegrationConnectBlock',
  fields: [
    // Shared integration core (heading + subtext + integrations). Edit the shared
    // shape in @/blocks/shared/integrationFields to update every integration variant.
    ...createIntegrationFields(),
    // Variant-specific: a featured center brand mark the logos connect to.
    createIntegrationFeaturedMark(),
  ],
  labels: {
    plural: 'Integration Connect Blocks',
    singular: 'Integration Connect',
  },
}
