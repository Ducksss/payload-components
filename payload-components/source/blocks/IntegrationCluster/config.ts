import type { Block } from 'payload'

import { integrationFeaturedMark, integrationFields } from '@/blocks/shared/integrationFields'
import { linkGroup } from '@/fields/linkGroup'

export const IntegrationCluster: Block = {
  slug: 'integrationCluster',
  interfaceName: 'IntegrationClusterBlock',
  fields: [
    // Shared integration core (heading + subtext + integrations). Edit the shared
    // shape in @/blocks/shared/integrationFields to update every integration variant.
    ...integrationFields,
    // Variant-specific: a featured center brand mark and a single CTA.
    integrationFeaturedMark,
    linkGroup({
      overrides: {
        admin: {
          initCollapsed: true,
        },
        maxRows: 1,
      },
    }),
  ],
  labels: {
    plural: 'Integration Cluster Blocks',
    singular: 'Integration Cluster',
  },
}
