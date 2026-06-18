import type { Block } from 'payload'

import { integrationFields } from '@/blocks/shared/integrationFields'

export const IntegrationList: Block = {
  slug: 'integrationList',
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
