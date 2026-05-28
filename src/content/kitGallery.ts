import type { FeatureGridBasicBlock, HeroBasicBlock } from '@/payload-types'
import type { PayloadPostAuthor, PayloadPostSummary } from '@/components/posts/types'

export const componentsGalleryRoute = '/components'

type GalleryPreview<TData> = {
  data: TData
  description: string
  label: string
}

type GalleryEntryBase<TSlug extends string, TData> = {
  installCommand: string
  preview: GalleryPreview<TData>
  slug: TSlug
  statusLabel: string
  summary: string
  title: string
}

type PostArchivePreview = {
  description: string
  eyebrow: string
  posts: PayloadPostSummary[]
  title: string
}

type RelatedPostsPreview = {
  description: string
  posts: PayloadPostSummary[]
  title: string
}

type PostListPreview = {
  description: string
  posts: PayloadPostSummary[]
  title: string
}

type AuthorCardPreview = {
  author: PayloadPostAuthor
}

type NewsletterCalloutPreview = {
  action: string
  buttonLabel: string
  description: string
  title: string
}

export type HeroGalleryEntry = GalleryEntryBase<'hero-basic', HeroBasicBlock>
export type FeatureGridGalleryEntry = GalleryEntryBase<'feature-grid-basic', FeatureGridBasicBlock>
export type PostCardGalleryEntry = GalleryEntryBase<'post-card', PayloadPostSummary>
export type PostArchiveGalleryEntry = GalleryEntryBase<'post-archive', PostArchivePreview>
export type PostHeroGalleryEntry = GalleryEntryBase<'post-hero', PayloadPostSummary>
export type FeaturedPostGalleryEntry = GalleryEntryBase<'featured-post', PayloadPostSummary>
export type PostListGalleryEntry = GalleryEntryBase<'post-list', PostListPreview>
export type AuthorCardGalleryEntry = GalleryEntryBase<'author-card', AuthorCardPreview>
export type NewsletterCalloutGalleryEntry = GalleryEntryBase<'newsletter-callout', NewsletterCalloutPreview>
export type RelatedPostsGalleryEntry = GalleryEntryBase<'related-posts', RelatedPostsPreview>

export type KitGalleryEntry =
  | AuthorCardGalleryEntry
  | FeatureGridGalleryEntry
  | FeaturedPostGalleryEntry
  | HeroGalleryEntry
  | NewsletterCalloutGalleryEntry
  | PostArchiveGalleryEntry
  | PostCardGalleryEntry
  | PostHeroGalleryEntry
  | PostListGalleryEntry
  | RelatedPostsGalleryEntry

const shippedAlpha = 'Shipped alpha'
const shadcnNative = 'shadcn-native'

const postOne: PayloadPostSummary = {
  id: 'post-one',
  categories: [{ slug: 'strategy', title: 'Strategy' }],
  meta: {
    description: 'A practical guide to shipping reusable Payload website surfaces.',
    image: {
      alt: 'Payload dashboard preview',
      height: 720,
      url: '/website-template-OG.webp',
      width: 1280,
    },
  },
  populatedAuthors: [{ name: 'Payload Kits Team' }],
  publishedAt: '2026-04-21T10:00:00.000Z',
  slug: 'payload-component-workflow',
  title: 'Build a reusable Payload component workflow',
}

const postTwo: PayloadPostSummary = {
  id: 'post-two',
  categories: [{ slug: 'registry', title: 'Registry' }],
  meta: {
    description: 'How shadcn registry delivery and payload-kit wiring split responsibilities.',
  },
  populatedAuthors: [{ name: 'Payload Kits Team' }],
  publishedAt: '2026-04-22T10:00:00.000Z',
  slug: 'payload-registry-boundary',
  title: 'Define the Payload registry boundary',
}

const postThree: PayloadPostSummary = {
  id: 'post-three',
  categories: [{ slug: 'delivery', title: 'Delivery' }],
  meta: {
    description: 'A checklist for keeping shadcn-native kits safe for direct installs.',
  },
  publishedAt: '2026-04-23T10:00:00.000Z',
  slug: 'direct-shadcn-safe-kits',
  title: 'Keep direct shadcn installs honest',
}

const author: PayloadPostAuthor = {
  avatar: {
    alt: 'Portrait of Maya Chen',
    height: 320,
    url: '/website-template-OG.webp',
    width: 320,
  },
  bio: 'Maya helps Payload teams turn reusable CMS patterns into reliable delivery systems.',
  name: 'Maya Chen',
  role: 'Payload architect',
}

export const kitGalleryEntries: KitGalleryEntry[] = [
  {
    installCommand: 'npx payload-kit add hero-basic',
    preview: {
      data: {
        blockName: null,
        blockType: 'heroBasic',
        description:
          'Install the first public kit and land a complete hero block with typed props, schema wiring, and import-map-safe output.',
        eyebrow: 'Payload Kits alpha',
        id: 'hero-basic-preview',
        links: [
          {
            id: 'hero-primary',
            link: {
              appearance: 'default',
              label: 'Open the live gallery',
              newTab: false,
              type: 'custom',
              url: componentsGalleryRoute,
            },
          },
        ],
        proofItems: [
          { id: 'hero-proof-1', label: 'Registry-backed install' },
          { id: 'hero-proof-2', label: 'Payload-aware wiring' },
          { id: 'hero-proof-3', label: 'Types generated automatically' },
        ],
        title: 'Ship a production-ready hero without manual repo cleanup.',
      },
      description:
        'A headline-first section with CTA support and a proof ribbon for install confidence.',
      label: 'Marketing hero',
    },
    slug: 'hero-basic',
    statusLabel: shippedAlpha,
    summary:
      'A headline-first hero block with proof items and CTA support, shipped through the real payload-kit alpha flow.',
    title: 'Hero Basic',
  },
  {
    installCommand: 'npx payload-kit add feature-grid-basic',
    preview: {
      data: {
        blockName: null,
        blockType: 'featureGridBasic',
        description:
          'The second shipped alpha kit gives teams a structured feature section without adding new primitives or manual layout glue.',
        eyebrow: 'Product features',
        id: 'feature-grid-basic-preview',
        items: [
          {
            description:
              'Adds the block files, layout registration, and render wiring through the real alpha install path.',
            id: 'feature-grid-product-1',
            title: 'Real install surface',
          },
          {
            description:
              'Keeps the content model intentionally small so editors get useful structure without extra ceremony.',
            id: 'feature-grid-product-2',
            title: 'Text-first schema',
          },
          {
            description:
              'Finishes with generated types and import-map updates instead of leaving fragile manual steps behind.',
            id: 'feature-grid-product-3',
            title: 'Post-install cleanup handled',
          },
        ],
        links: [
          {
            id: 'feature-grid-product-link',
            link: {
              appearance: 'default',
              label: 'Install feature-grid-basic',
              newTab: false,
              type: 'custom',
              url: '#install-feature-grid-basic',
            },
          },
        ],
        title: 'Show the product layer with a feature grid that belongs in the repo immediately.',
      },
      description: 'A product-facing grid with three editor-friendly items and one CTA.',
      label: 'Product features',
    },
    slug: 'feature-grid-basic',
    statusLabel: shippedAlpha,
    summary:
      'A text-first feature grid for product and agency landing pages, installed through the same real alpha workflow.',
    title: 'Feature Grid Basic',
  },
  {
    installCommand: 'npx shadcn add @payload-kits/post-card',
    preview: {
      data: postOne,
      description: 'A single-card Posts surface for archives, related content, and editorial grids.',
      label: 'Post card',
    },
    slug: 'post-card',
    statusLabel: shadcnNative,
    summary:
      'A direct shadcn install for Payload post-shaped data with image, categories, date, title, and summary.',
    title: 'Post Card',
  },
  {
    installCommand: 'npx shadcn add @payload-kits/post-archive',
    preview: {
      data: {
        description: 'A shadcn-native archive that only needs post-shaped data.',
        eyebrow: 'Latest posts',
        posts: [postOne, postTwo, postThree],
        title: 'Payload implementation notes',
      },
      description: 'A responsive archive grid that uses the shared Post Card without Payload patches.',
      label: 'Posts archive',
    },
    slug: 'post-archive',
    statusLabel: shadcnNative,
    summary:
      'A responsive posts grid for Payload archive pages. No Payload file patching, generated types, or import-map changes.',
    title: 'Post Archive',
  },
  {
    installCommand: 'npx shadcn add @payload-kits/post-hero',
    preview: {
      data: postOne,
      description: 'A post detail hero with category, author, published date, summary, and image.',
      label: 'Post hero',
    },
    slug: 'post-hero',
    statusLabel: shadcnNative,
    summary:
      'A first-viewport article hero for existing Payload post detail pages that already have the post document.',
    title: 'Post Hero',
  },
  {
    installCommand: 'npx shadcn add @payload-kits/featured-post',
    preview: {
      data: postOne,
      description: 'A larger editorial card for the one post you want readers to open first.',
      label: 'Featured post',
    },
    slug: 'featured-post',
    statusLabel: shadcnNative,
    summary:
      'A featured article surface with image, category, date, summary, and CTA. It remains a direct shadcn install.',
    title: 'Featured Post',
  },
  {
    installCommand: 'npx shadcn add @payload-kits/post-list',
    preview: {
      data: {
        description: 'Compact Payload posts for sidebars, index pages, and editorial modules.',
        posts: [postOne, postTwo, postThree],
        title: 'Recent notes',
      },
      description: 'A compact post list with dates, categories, descriptions, links, and empty state.',
      label: 'Post list',
    },
    slug: 'post-list',
    statusLabel: shadcnNative,
    summary:
      'A compact post list for sidebars and resource pages that consumes existing post-shaped data.',
    title: 'Post List',
  },
  {
    installCommand: 'npx shadcn add @payload-kits/author-card',
    preview: {
      data: {
        author,
      },
      description: 'An author profile card for post footers, sidebars, and editorial attribution.',
      label: 'Author card',
    },
    slug: 'author-card',
    statusLabel: shadcnNative,
    summary:
      'A Payload author profile card with avatar fallback, role, bio, and a compact label.',
    title: 'Author Card',
  },
  {
    installCommand: 'npx shadcn add @payload-kits/newsletter-callout',
    preview: {
      data: {
        action: '/api/newsletter',
        buttonLabel: 'Join list',
        description: 'Get the next Payload kit release notes before they ship.',
        title: 'Follow the kit catalog',
      },
      description: 'A configurable newsletter form section for post pages and resource hubs.',
      label: 'Newsletter callout',
    },
    slug: 'newsletter-callout',
    statusLabel: shadcnNative,
    summary:
      'A shadcn-native newsletter callout with configurable copy, action, input name, and button label.',
    title: 'Newsletter Callout',
  },
  {
    installCommand: 'npx shadcn add @payload-kits/related-posts',
    preview: {
      data: {
        description: 'Continue reading about the registry delivery surface.',
        posts: [postOne, postTwo],
        title: 'Related implementation guides',
      },
      description: 'A compact related-posts section with a built-in empty state.',
      label: 'Related posts',
    },
    slug: 'related-posts',
    statusLabel: shadcnNative,
    summary:
      'A related content section for post pages that renders compact recommendations with the shared Post Card.',
    title: 'Related Posts',
  },
]
