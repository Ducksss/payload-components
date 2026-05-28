import type { KitGalleryEntry } from '@/content/kitGallery'

import { FeatureGridBasicBlock } from '@/blocks/FeatureGridBasic/Component'
import { HeroBasicBlock } from '@/blocks/HeroBasic/Component'
import { AuthorCard } from '@/components/posts/AuthorCard'
import { FeaturedPost } from '@/components/posts/FeaturedPost'
import { NewsletterCallout } from '@/components/posts/NewsletterCallout'
import { PostArchive } from '@/components/posts/PostArchive'
import { PostCard } from '@/components/posts/PostCard'
import { PostHero } from '@/components/posts/PostHero'
import { PostList } from '@/components/posts/PostList'
import { RelatedPosts } from '@/components/posts/RelatedPosts'

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
    case 'post-card':
      return <PostCard post={entry.preview.data} />

    case 'post-archive': {
      const data = entry.preview.data

      return <PostArchive {...data} className="px-0 py-0" />
    }

    case 'post-hero':
      return <PostHero post={entry.preview.data} className="border-0" />

    case 'featured-post':
      return <FeaturedPost post={entry.preview.data} />

    case 'post-list': {
      const data = entry.preview.data

      return <PostList {...data} />
    }

    case 'author-card':
      return <AuthorCard author={entry.preview.data.author} />

    case 'newsletter-callout': {
      const data = entry.preview.data

      return <NewsletterCallout {...data} />
    }

    case 'related-posts': {
      const data = entry.preview.data

      return <RelatedPosts {...data} className="px-0 py-0" />
    }

    default:
      return null
  }
}
