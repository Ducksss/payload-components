import type { Block } from 'payload'

import { integrationFields } from '@/blocks/shared/integrationFields'

export const IntegrationList: Block = {
  slug: 'integrationList',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_int_lis',
  interfaceName: 'IntegrationListBlock',
  fields: [
    // Shared integration core (heading + subtext + integrations). Edit the shared
    // shape in @/blocks/shared/integrationFields to update every integration variant.
    // Each row uses the per-item description and optional href for its action.
    ...integrationFields,
  ],
  labels: {
    plural: 'Integration List Blocks',
    singular: 'Integration List',
  },
}
