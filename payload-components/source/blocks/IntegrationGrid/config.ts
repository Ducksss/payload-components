import type { Block } from 'payload'

import { integrationFields } from '@/blocks/shared/integrationFields'

export const IntegrationGrid: Block = {
  slug: 'integrationGrid',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_int_gri',
  interfaceName: 'IntegrationGridBlock',
  fields: [
    // Shared integration core (heading + subtext + integrations). Edit the shared
    // shape in @/blocks/shared/integrationFields to update every integration variant.
    ...integrationFields,
  ],
  labels: {
    plural: 'Integration Grid Blocks',
    singular: 'Integration Grid',
  },
}
