import type { Block } from 'payload'

import { logoCloudFields } from '@/blocks/shared/logoCloudFields'

import { logoCloudInlineWrapThumbnail } from './thumbnail'

export const LogoCloudInlineWrap: Block = {
  slug: 'logoCloudInlineWrap',
  // Existing apps must migrate stored data before adopting this identifier:
  // https://www.payload-components.xyz/docs/registry#installed-source-and-migrations
  dbName: 'pc_log_clo_inl_wra',
  interfaceName: 'LogoCloudInlineWrapBlock',
  admin: {
    group: 'Logo cloud',
    images: {
      thumbnail: logoCloudInlineWrapThumbnail,
    },
  },
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
