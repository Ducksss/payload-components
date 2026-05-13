import type { KitGalleryEntry } from '@/content/kitGallery'

import { FeatureGridBasicBlock } from '@/blocks/FeatureGridBasic/Component'
import { HeroBasicBlock } from '@/blocks/HeroBasic/Component'

type Props = {
  entry: KitGalleryEntry
}

export const KitPreviewSurface = ({ entry }: Props) => {
  switch (entry.slug) {
    case 'hero-basic': {
      const data = entry.preview.data

      return (
        <HeroBasicBlock
          {...data}
          className="px-0"
          disableInnerContainer
          id={data.id ?? undefined}
        />
      )
    }
    case 'feature-grid-basic': {
      const data = entry.preview.data

      return (
        <FeatureGridBasicBlock
          {...data}
          className="px-0"
          disableInnerContainer
          id={data.id ?? undefined}
        />
      )
    }
    default:
      return null
  }
}
