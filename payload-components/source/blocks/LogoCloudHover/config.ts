import type { Block } from 'payload'

import { logoCloudFields } from '@/blocks/shared/logoCloudFields'
import { linkGroup } from '@/fields/linkGroup'

export const LogoCloudHover: Block = {
  slug: 'logoCloudHover',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_log_clo_hov',
  interfaceName: 'LogoCloudHoverBlock',
  fields: [
    // Shared logo-cloud core (heading + logos). Edit the shared shape in
    // @/blocks/shared/logoCloudFields to update every logo-cloud variant.
    ...logoCloudFields,
    // Variant-specific: a single CTA revealed on hover over the logo wall.
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
    plural: 'Logo Cloud Hover Blocks',
    singular: 'Logo Cloud Hover',
  },
}
