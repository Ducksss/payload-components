import { createRequire } from 'node:module'
import path from 'node:path'

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import LandingPage, { landingMetadata } from '@/components/landing/LandingPage'
import { KitGalleryTeaser } from '@/components/gallery/KitGalleryTeaser'
import { JsonLd } from '@/components/JsonLd'
import ResourcesPage from '@/app/(frontend)/resources/page'
import { marketingResources } from '@/content/marketingResources'
import { buildHomeJsonLd, getJsonLdGraphNodes } from '@/seo/geo'
import { normalizeServerURL } from '@/utilities/getURL'
import { normalizePathname, normalizeSiteURL } from '@/utilities/site'
import { generateMeta } from '@/utilities/generateMeta'
import { buildOrganizationJsonLd, buildWebSiteJsonLd } from '@/utilities/seo'

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}))

const originalServerURL = process.env.NEXT_PUBLIC_SERVER_URL
const originalVercelProductionURL = process.env.VERCEL_PROJECT_PRODUCTION_URL
const requireSitemapConfig = createRequire(import.meta.url)
const sitemapConfigPath = path.resolve(process.cwd(), 'next-sitemap.config.cjs')

type SitemapConfig = {
  robotsTxtOptions?: {
    additionalSitemaps?: string[]
    policies?: {
      allow?: string | string[]
      disallow?: string | string[]
      userAgent: string
    }[]
  }
  siteUrl: string
}

const deleteSitemapConfigCache = () => {
  delete requireSitemapConfig.cache[requireSitemapConfig.resolve(sitemapConfigPath)]
}

const loadSitemapConfig = () => {
  deleteSitemapConfigCache()

  return requireSitemapConfig(sitemapConfigPath) as SitemapConfig
}

afterEach(() => {
  cleanup()

  if (originalServerURL === undefined) {
    delete (process.env as Partial<NodeJS.ProcessEnv>).NEXT_PUBLIC_SERVER_URL
  } else {
    process.env.NEXT_PUBLIC_SERVER_URL = originalServerURL
  }

  if (originalVercelProductionURL === undefined) {
    delete (process.env as Partial<NodeJS.ProcessEnv>).VERCEL_PROJECT_PRODUCTION_URL
  } else {
    process.env.VERCEL_PROJECT_PRODUCTION_URL = originalVercelProductionURL
  }

  deleteSitemapConfigCache()
})

describe('SEO metadata', () => {
  it('normalizes public site URLs for canonicals and sitemaps', () => {
    expect(normalizeSiteURL('payloadkits.dev/')).toBe('https://payloadkits.dev')
    expect(normalizeSiteURL('https://payloadkits.dev/path')).toBe('https://payloadkits.dev')
    expect(normalizeSiteURL(undefined)).toBe('http://localhost:3000')
    expect(normalizeSiteURL('http://[::1')).toBe('http://localhost:3000')
  })

  it('ignores malformed environment URLs before building public URLs', () => {
    expect(normalizeServerURL('https://payloadkits.dev/docs')).toBe('https://payloadkits.dev')
    expect(normalizeServerURL('http://[::1')).toBeUndefined()
    expect(normalizePathname('https://payloadkits.dev/posts/payload-blocks?ref=docs#top')).toBe(
      '/posts/payload-blocks',
    )
    expect(normalizePathname('http://[::1')).toBe('/')
  })

  it('falls back to normalized server URLs when client URL normalization fails on the server', async () => {
    vi.resetModules()
    vi.doMock('@/utilities/canUseDOM', () => ({
      default: false,
    }))

    process.env.VERCEL_PROJECT_PRODUCTION_URL = 'http://[::1'
    process.env.NEXT_PUBLIC_SERVER_URL = 'payloadkits.dev/path'

    const { getClientSideURL } = await import('@/utilities/getURL')

    expect(getClientSideURL()).toBe('https://payloadkits.dev')

    process.env.NEXT_PUBLIC_SERVER_URL = 'http://[::1'

    expect(getClientSideURL()).toBe('http://localhost:3000')
  })

  it('falls back to the local URL when next-sitemap receives malformed environment URLs', () => {
    process.env.NEXT_PUBLIC_SERVER_URL = 'http://[::1'
    delete (process.env as Partial<NodeJS.ProcessEnv>).VERCEL_PROJECT_PRODUCTION_URL

    const sitemapConfig = loadSitemapConfig()

    expect(sitemapConfig.siteUrl).toBe('http://localhost:3000')
    expect(sitemapConfig.robotsTxtOptions?.additionalSitemaps).toEqual([
      'http://localhost:3000/pages-sitemap.xml',
      'http://localhost:3000/posts-sitemap.xml',
    ])
  })

  it('keeps public Payload media URLs crawlable while disallowing API routes', () => {
    const policy = loadSitemapConfig().robotsTxtOptions?.policies?.find(
      (item) => item.userAgent === '*',
    )

    expect(policy?.allow).toEqual(expect.arrayContaining(['/api/media/file/']))
    expect(policy?.disallow).toEqual(expect.arrayContaining(['/api/*']))
  })

  it('builds canonical CMS metadata with the correct public route', async () => {
    process.env.NEXT_PUBLIC_SERVER_URL = 'https://payloadkits.dev/'

    const args = {
      collectionSlug: 'posts',
      doc: {
        slug: 'payload-cms-blocks',
        title: 'Payload CMS blocks',
        meta: {
          description: 'Reusable Payload blocks need schema, render, type, and admin wiring.',
          title: 'Payload CMS blocks that survive real client repos',
        },
      },
      path: '/posts/payload-cms-blocks',
    } as Parameters<typeof generateMeta>[0] & {
      collectionSlug: 'posts'
      path: string
    }

    const metadata = await generateMeta(args)

    expect(metadata.title).toBe('Payload CMS blocks that survive real client repos | Payload Kits')
    expect(metadata.description).toBe(
      'Reusable Payload blocks need schema, render, type, and admin wiring.',
    )
    expect(metadata.alternates).toEqual({
      canonical: 'https://payloadkits.dev/posts/payload-cms-blocks',
    })
    expect(metadata.openGraph).toMatchObject({
      description: 'Reusable Payload blocks need schema, render, type, and admin wiring.',
      title: 'Payload CMS blocks that survive real client repos | Payload Kits',
      type: 'article',
      url: 'https://payloadkits.dev/posts/payload-cms-blocks',
    })
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      description: 'Reusable Payload blocks need schema, render, type, and admin wiring.',
      title: 'Payload CMS blocks that survive real client repos | Payload Kits',
    })
  })

  it('declares a canonical landing page with share-card metadata', () => {
    expect(landingMetadata.alternates).toEqual({ canonical: '/' })
    expect(landingMetadata.openGraph).toMatchObject({
      title: 'Payload Kits | shadcn-native kits for Payload CMS',
      type: 'website',
      url: '/',
    })
    expect(landingMetadata.twitter).toMatchObject({
      card: 'summary_large_image',
      title: 'Payload Kits | shadcn-native kits for Payload CMS',
    })
  })
})

describe('SEO structured data', () => {
  it('defines canonical global identity nodes for graph references', () => {
    expect(buildOrganizationJsonLd()).toMatchObject({
      '@context': 'https://schema.org',
      '@id': 'http://localhost:3000/#organization',
      '@type': 'Organization',
      description: expect.stringContaining('shadcn registry for Payload CMS teams'),
      name: 'Payload Kits',
    })

    expect(buildWebSiteJsonLd()).toMatchObject({
      '@context': 'https://schema.org',
      '@id': 'http://localhost:3000/#website',
      '@type': 'WebSite',
      publisher: { '@id': 'http://localhost:3000/#organization' },
      url: 'http://localhost:3000/',
    })
  })

  it('serializes software application and FAQ JSON-LD for the landing page', () => {
    const { container } = render(<JsonLd data={getJsonLdGraphNodes(buildHomeJsonLd())} />)

    const jsonLd = Array.from(container.querySelectorAll('script[type="application/ld+json"]')).map(
      (script) => JSON.parse(script.textContent || '{}') as Record<string, unknown>,
    )

    expect(jsonLd).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Payload Kits',
        }),
        expect.objectContaining({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
        }),
      ]),
    )
  })
})

describe('On-page SEO semantics', () => {
  it('uses descriptive resource links and level-two resource headings', () => {
    render(<ResourcesPage />)

    for (const resource of marketingResources) {
      expect(screen.getByRole('heading', { level: 2, name: resource.title })).toBeTruthy()
      expect(screen.getByRole('link', { name: `Read ${resource.title}` })).toBeTruthy()
    }
  })

  it('uses descriptive live preview link text in the kit gallery teaser', () => {
    render(<KitGalleryTeaser />)

    expect(screen.getByRole('link', { name: 'Open Hero Basic live preview' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Open Feature Grid Basic live preview' })).toBeTruthy()
  })

  it('keeps landing page stats as definition-list terms and definitions', () => {
    const { container } = render(<LandingPage />)

    expect(container.querySelectorAll('dl dt')).toHaveLength(3)
    expect(container.querySelectorAll('dl dd')).toHaveLength(6)
    expect(container.querySelector('dl p')).toBeNull()
  })
})
