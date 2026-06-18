import type { Block } from 'payload'

import { integrationFeaturedMark, integrationFields } from '@/blocks/shared/integrationFields'

export const IntegrationOrbit: Block = {
  slug: 'integrationOrbit',
  interfaceName: 'IntegrationOrbitBlock',
  fields: [
    // Shared integration core (heading + subtext + integrations). Edit the shared
    // shape in @/blocks/shared/integrationFields to update every integration variant.
    ...integrationFields,
    // Variant-specific: a featured center brand mark the rings orbit around.
    integrationFeaturedMark,
  ],
  labels: {
    plural: 'Integration Orbit Blocks',
    singular: 'Integration Orbit',
  },
}
