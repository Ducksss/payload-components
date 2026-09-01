import type { Block } from 'payload'

import { createIntegrationFeaturedMark, createIntegrationFields } from '@/blocks/shared/integrationFields'

export const IntegrationOrbit: Block = {
  slug: 'integrationOrbit',
  interfaceName: 'IntegrationOrbitBlock',
  fields: [
    // Shared integration core (heading + subtext + integrations). Edit the shared
    // shape in @/blocks/shared/integrationFields to update every integration variant.
    ...createIntegrationFields(),
    // Variant-specific: a featured center brand mark the rings orbit around.
    createIntegrationFeaturedMark(),
  ],
  labels: {
    plural: 'Integration Orbit Blocks',
    singular: 'Integration Orbit',
  },
}
