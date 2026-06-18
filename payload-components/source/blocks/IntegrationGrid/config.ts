import type { Block } from 'payload'

import { integrationFields } from '@/blocks/shared/integrationFields'

export const IntegrationGrid: Block = {
  slug: 'integrationGrid',
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
