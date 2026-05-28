import type { Metadata } from 'next'

import { KitGalleryPage } from '@/components/gallery/KitGalleryPage'
import { buildSEOMetadata } from '@/utilities/seo'

export const metadata: Metadata = buildSEOMetadata({
  description:
    'Browse the live Payload Kits gallery for wrapper-required Payload blocks and shadcn-native Posts components, with real install commands and rendered previews.',
  path: '/components',
  title: 'Payload Kits Components Gallery | Live previews for shipped kits',
})

export default KitGalleryPage
