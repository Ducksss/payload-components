import type { Block } from 'payload'

import { logoCloudFields } from '@/blocks/shared/logoCloudFields'

export const LogoCloudGrid: Block = {
  slug: 'logoCloudGrid',
  interfaceName: 'LogoCloudGridBlock',
  fields: [
    // Shared logo-cloud core (heading + logos). Edit the shared shape in
    // @/blocks/shared/logoCloudFields to update every logo-cloud variant.
    ...logoCloudFields,
  ],
  labels: {
    plural: 'Logo Cloud Grid Blocks',
    singular: 'Logo Cloud Grid',
  },
}
