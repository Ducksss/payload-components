import type { Block } from 'payload'

import { createLogoCloudFields } from '@/blocks/shared/logoCloudFields'

export const LogoCloudInlineWrap: Block = {
  slug: 'logoCloudInlineWrap',
  interfaceName: 'LogoCloudInlineWrapBlock',
  fields: [
    // Shared logo-cloud core (heading + logos). Edit the shared shape in
    // @/blocks/shared/logoCloudFields to update every logo-cloud variant.
    ...createLogoCloudFields(),
  ],
  labels: {
    plural: 'Logo Cloud Inline Wrap Blocks',
    singular: 'Logo Cloud Inline Wrap',
  },
}
