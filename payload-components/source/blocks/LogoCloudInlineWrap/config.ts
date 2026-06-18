import type { Block } from 'payload'

import { logoCloudFields } from '@/blocks/shared/logoCloudFields'

export const LogoCloudInlineWrap: Block = {
  slug: 'logoCloudInlineWrap',
  interfaceName: 'LogoCloudInlineWrapBlock',
  fields: [
    // Shared logo-cloud core (heading + logos). Edit the shared shape in
    // @/blocks/shared/logoCloudFields to update every logo-cloud variant.
    ...logoCloudFields,
  ],
  labels: {
    plural: 'Logo Cloud Inline Wrap Blocks',
    singular: 'Logo Cloud Inline Wrap',
  },
}
