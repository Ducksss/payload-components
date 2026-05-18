import type { Metadata } from 'next'

import { KitGalleryPage } from '@/components/gallery/KitGalleryPage'
import { buildSEOMetadata } from '@/utilities/seo'

export const metadata: Metadata = buildSEOMetadata({
  description:
    'Browse the live Payload Kits gallery for the currently shipped alpha kits, including Hero Basic and Feature Grid Basic, with real install commands and rendered block previews.',
  path: '/components',
  title: 'Payload Kits Components Gallery | Live previews for shipped alpha kits',
})

export default KitGalleryPage
