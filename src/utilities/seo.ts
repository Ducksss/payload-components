import type { Metadata } from 'next'
import type { CollectionSlug } from 'payload'

import type { Config, Media, Page, Post } from '@/payload-types'

import { absoluteURL, normalizePathname, siteConfig, withSiteTitle } from './site'

type SEOCollectionSlug = Extract<CollectionSlug, 'pages' | 'posts'>
type SEOImage = Media | Config['db']['defaultIDType'] | null | undefined
type SEODoc = Partial<Page> | Partial<Post> | null

export type JsonLdNode = Record<string, unknown>

const isMedia = (image: SEOImage): image is Media =>
  Boolean(image && typeof image === 'object' && 'url' in image)

export const getCanonicalPath = ({
  collectionSlug,
  path,
  slug,
}: {
  collectionSlug?: SEOCollectionSlug
  path?: string
  slug?: string | null
}): string => {
  if (path) {
    return normalizePathname(path)
  }

  if (collectionSlug === 'posts') {
    return slug ? normalizePathname(`/posts/${slug}`) : '/posts'
  }

  if (collectionSlug === 'pages') {
    return !slug || slug === 'home' ? '/' : normalizePathname(`/${slug}`)
  }

  return slug ? normalizePathname(`/${slug}`) : '/'
}

export const getSocialImage = (image?: SEOImage): NonNullable<Metadata['openGraph']>['images'] => {
  if (!isMedia(image)) {
    return [
      {
        alt: `${siteConfig.name} social preview`,
        height: 630,
        url: absoluteURL(siteConfig.defaultOgImagePath),
        width: 1200,
      },
    ]
  }

  const ogImage = image.sizes?.og
  const url = ogImage?.url || image.url

  return [
    {
      alt: image.alt || `${siteConfig.name} social preview`,
      height: ogImage?.height || image.height || 630,
      url: absoluteURL(url),
      width: ogImage?.width || image.width || 1200,
    },
  ]
}

export const buildSEOMetadata = ({
  collectionSlug,
  description,
  image,
  modifiedTime,
  openGraphType,
  path,
  publishedTime,
  robots,
  slug,
  title,
}: {
  collectionSlug?: SEOCollectionSlug
  description?: string | null
  image?: SEOImage
  modifiedTime?: string | null
  openGraphType?: 'article' | 'website'
  path?: string
  publishedTime?: string | null
  robots?: Metadata['robots']
  slug?: string | null
  title?: string | null
}): Metadata => {
  const canonicalPath = getCanonicalPath({ collectionSlug, path, slug })
  const canonicalURL = absoluteURL(canonicalPath)
  const metadataTitle = withSiteTitle(title)
  const metadataDescription = description || siteConfig.defaultDescription
  const images = getSocialImage(image)
  const resolvedOpenGraphType =
    openGraphType || (collectionSlug === 'posts' ? 'article' : 'website')

  const metadata: Metadata = {
    alternates: {
      canonical: canonicalURL,
    },
    description: metadataDescription,
    openGraph: {
      description: metadataDescription,
      images,
      siteName: siteConfig.name,
      title: metadataTitle,
      type: resolvedOpenGraphType,
      url: canonicalURL,
      ...(resolvedOpenGraphType === 'article'
        ? {
            modifiedTime: modifiedTime || undefined,
            publishedTime: publishedTime || undefined,
          }
        : {}),
    },
    robots,
    title: metadataTitle,
    twitter: {
      card: 'summary_large_image',
      creator: siteConfig.twitterCreator,
      description: metadataDescription,
      images,
      title: metadataTitle,
    },
  }

  return metadata
}

export const generateMeta = async ({
  collectionSlug,
  doc,
  path,
}: {
  collectionSlug?: SEOCollectionSlug
  doc: SEODoc
  path?: string
}): Promise<Metadata> => {
  return buildSEOMetadata({
    collectionSlug,
    description: doc?.meta?.description,
    image: doc?.meta?.image,
    modifiedTime: doc?.updatedAt,
    path,
    publishedTime: doc && 'publishedAt' in doc ? doc.publishedAt : undefined,
    slug: doc?.slug,
    title: doc?.meta?.title || doc?.title,
  })
}

export const buildBreadcrumbJsonLd = (
  items: { name: string; path: string }[],
): JsonLdNode => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    item: absoluteURL(item.path),
    name: item.name,
    position: index + 1,
  })),
})

export const buildItemListJsonLd = ({
  description,
  items,
  name,
  path,
}: {
  description?: string
  items: { name: string; path: string }[]
  name: string
  path: string
}): JsonLdNode => ({
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  description,
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      item: absoluteURL(item.path),
      name: item.name,
      position: index + 1,
    })),
  },
  name,
  url: absoluteURL(path),
})

export const buildWebSiteJsonLd = (): JsonLdNode => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  description: siteConfig.defaultDescription,
  name: siteConfig.name,
  publisher: {
    '@id': `${absoluteURL('/')}#organization`,
  },
  url: absoluteURL('/'),
})

export const buildSoftwareApplicationJsonLd = ({
  description = siteConfig.defaultDescription,
  name = siteConfig.name,
  path = '/',
}: {
  description?: string
  name?: string
  path?: string
} = {}): JsonLdNode => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  applicationCategory: 'DeveloperApplication',
  description,
  name,
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  operatingSystem: 'Any',
  url: absoluteURL(path),
})

export const buildFAQJsonLd = (
  items: { answer: string; question: string }[],
): JsonLdNode => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
    name: item.question,
  })),
})

export const buildOrganizationJsonLd = (): JsonLdNode => ({
  '@context': 'https://schema.org',
  '@id': `${absoluteURL('/')}#organization`,
  '@type': 'Organization',
  name: siteConfig.name,
  sameAs: [siteConfig.githubUrl],
  url: absoluteURL('/'),
})
