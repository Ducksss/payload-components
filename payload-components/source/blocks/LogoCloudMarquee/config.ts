import type { Block } from 'payload'

import { logoCloudFields } from '@/blocks/shared/logoCloudFields'

export const LogoCloudMarquee: Block = {
  slug: 'logoCloudMarquee',
  interfaceName: 'LogoCloudMarqueeBlock',
  fields: [
    // Shared logo-cloud core (heading + logos). Edit the shared shape in
    // @/blocks/shared/logoCloudFields to update every logo-cloud variant.
    ...logoCloudFields,
  ],
  labels: {
    plural: 'Logo Cloud Marquee Blocks',
    singular: 'Logo Cloud Marquee',
  },
}
