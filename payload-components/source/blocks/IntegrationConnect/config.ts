import type { Block } from 'payload'

import { integrationFeaturedMark, integrationFields } from '@/blocks/shared/integrationFields'

export const IntegrationConnect: Block = {
  slug: 'integrationConnect',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_int_con',
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
