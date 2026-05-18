import { describe, expect, it } from 'vitest'

import { faqItems } from '@/components/landing/content'
import { marketingResources } from '@/content/marketingResources'
import {
  buildHomeJsonLd,
  buildLlmsFullTxt,
  buildLlmsTxt,
  buildResourceJsonLd,
  getStaticSitemapEntries,
  stringifyJsonLd,
} from '@/seo/geo'

type JsonLdNode = {
  '@type'?: string
  [key: string]: unknown
}

const findGraphNode = (graph: JsonLdNode[], type: string) => {
  const node = graph.find((item) => item['@type'] === type)
  expect(node).toBeDefined()

  return node as JsonLdNode
}

describe('GEO structured surfaces', () => {
  it('builds homepage product, page, and FAQ facts without duplicating global identity nodes', () => {
    const jsonLd = buildHomeJsonLd()
    const graph = jsonLd['@graph'] as JsonLdNode[]

    expect(graph.map((node) => node['@type'])).not.toEqual(
      expect.arrayContaining(['Organization', 'WebSite']),
    )

    const software = findGraphNode(graph, 'SoftwareApplication')
    expect(software.name).toBe('Payload Kits')
    expect(software.applicationCategory).toBe('DeveloperApplication')
    expect(software.operatingSystem).toBe('Payload CMS v3 and Next.js App Router projects')
    expect(software.offers).toMatchObject({
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    })
    expect(software.publisher).toMatchObject({ '@id': 'http://localhost:3000/#organization' })

    const webpage = findGraphNode(graph, 'WebPage')
    expect(webpage.isPartOf).toMatchObject({ '@id': 'http://localhost:3000/#website' })

    const faq = findGraphNode(graph, 'FAQPage')
    expect((faq.mainEntity as JsonLdNode[]).map((question) => question.name)).toEqual(
      faqItems.map((item) => item.question),
    )
  })

  it('serializes JSON-LD without raw angle brackets for safe script embedding', () => {
    const serialized = stringifyJsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Thing',
          name: '</script><img src=x onerror=alert(1)>',
        },
      ],
    })

    expect(serialized).not.toContain('<')
    expect(serialized).not.toContain('>')
    expect(serialized).toContain('\\u003c/script\\u003e\\u003cimg src=x onerror=alert(1)\\u003e')

    const parsed = JSON.parse(serialized) as { '@graph': JsonLdNode[] }
    expect(parsed['@graph'][0]?.name).toBe('</script><img src=x onerror=alert(1)>')
  })

  it('publishes concise and full AI-readable source maps for the public site', () => {
    const concise = buildLlmsTxt()

    expect(concise).toContain('# Payload Kits')
    expect(concise).toContain('> Payload-native kit platform')
    expect(concise).toContain('- [Payload Kits home](http://localhost:3000/)')
    expect(concise).toContain('## Answer-ready facts')
    expect(concise).toContain('Payload Kits is a public registry for Payload-native kits')

    for (const resource of marketingResources) {
      expect(concise).toContain(
        `- [${resource.title}](http://localhost:3000/resources/${resource.slug})`,
      )
    }

    const full = buildLlmsFullTxt()
    expect(full).toContain('## Payload CMS blocks that survive real client repos')
    expect(full).toContain('### The block is not the whole install')
    expect(full).toContain(
      'Reusable Payload blocks fail when teams optimize for screenshots instead of repo behavior.',
    )
  })

  it('builds article and breadcrumb schema for every marketing resource guide', () => {
    for (const resource of marketingResources) {
      const jsonLd = buildResourceJsonLd(resource)
      const graph = jsonLd['@graph'] as JsonLdNode[]
      const canonicalUrl = `http://localhost:3000/resources/${resource.slug}`

      const article = findGraphNode(graph, 'Article')
      expect(article.headline).toBe(resource.title)
      expect(article.description).toBe(resource.description)
      expect(article.url).toBe(canonicalUrl)
      expect(article.mainEntityOfPage).toMatchObject({ '@id': canonicalUrl })
      expect(article.about).toEqual(
        expect.arrayContaining([resource.keyword, 'Payload CMS', 'Payload Kits']),
      )

      const breadcrumbs = findGraphNode(graph, 'BreadcrumbList')
      expect(breadcrumbs.itemListElement).toContainEqual(
        expect.objectContaining({
          item: canonicalUrl,
          name: resource.title,
          position: 3,
        }),
      )
    }
  })

  it('includes static resource pages in the discoverable sitemap entries', () => {
    const paths = getStaticSitemapEntries().map((entry) => entry.path)

    expect(paths).toEqual(
      expect.arrayContaining([
        '/',
        '/components',
        '/posts',
        '/resources',
        ...marketingResources.map((resource) => `/resources/${resource.slug}`),
      ]),
    )
    expect(paths).not.toContain('/search')
  })
})
