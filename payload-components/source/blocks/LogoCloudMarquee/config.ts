import type { Block } from 'payload'

import { createLogoCloudFields } from '@/blocks/shared/logoCloudFields'

export const LogoCloudMarquee: Block = {
  slug: 'logoCloudMarquee',
  interfaceName: 'LogoCloudMarqueeBlock',
  fields: [
    // Shared logo-cloud core (heading + logos). Edit the shared shape in
    // @/blocks/shared/logoCloudFields to update every logo-cloud variant.
    ...createLogoCloudFields(),
  ],
  labels: {
    plural: 'Logo Cloud Marquee Blocks',
    singular: 'Logo Cloud Marquee',
  },
}
