import type { Block } from 'payload'

import { integrationFeaturedMark, integrationFields } from '@/blocks/shared/integrationFields'

export const IntegrationOrbit: Block = {
  slug: 'integrationOrbit',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_int_orb',
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
