import {
  catalogDescription,
  catalogTitle,
  faqEntries,
  githubRepoUrl,
  kitEntries,
  siteDescription,
  siteUrl,
  upcomingKits,
} from '@/lib/site'

/* Stable @id anchors. The Organization and WebSite nodes are emitted once,
   sitewide, from the root layout; page-level nodes reference them by @id
   instead of redefining them. Keep these in sync with app/layout.tsx. */
export const organizationId = `${siteUrl}/#organization`
export const websiteId = `${siteUrl}/#website`
export const softwareId = `${siteUrl}/#software`
export const documentationId = `${siteUrl}/docs#documentation`

const logoUrl = `${siteUrl}/favicon.svg`

type Node = Record<string, unknown>

export function organizationNode(): Node {
  return {
    '@id': organizationId,
    '@type': 'Organization',
    description: siteDescription,
    logo: logoUrl,
    name: 'Payload Components',
    sameAs: [githubRepoUrl],
    url: `${siteUrl}/`,
  }
}

export function websiteNode(): Node {
  return {
    '@id': websiteId,
    '@type': 'WebSite',
    description: siteDescription,
    inLanguage: 'en',
    name: 'Payload Components',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/api/search?query={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    publisher: { '@id': organizationId },
    url: `${siteUrl}/`,
  }
}

/* Payload Components is a free, open-source developer CLI + registry. */
export function softwareApplicationNode(): Node {
  return {
    '@id': softwareId,
    '@type': 'SoftwareApplication',
    applicationCategory: 'DeveloperApplication',
    author: { '@id': organizationId },
    codeRepository: githubRepoUrl,
    description: siteDescription,
    isAccessibleForFree: true,
    license: 'https://opensource.org/licenses/MIT',
    name: 'payload-components',
    alternateName: 'Payload Components',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    operatingSystem: 'Node.js (macOS, Linux, Windows)',
    programmingLanguage: 'TypeScript',
    publisher: { '@id': organizationId },
    runtimePlatform: 'Node.js',
    softwareHelp: `${siteUrl}/docs/installation`,
    softwareRequirements: 'Payload CMS v3, Next.js 15 or 16',
    url: `${siteUrl}/`,
  }
}

export function documentationCollectionNode(): Node {
  return {
    '@id': documentationId,
    '@type': 'CollectionPage',
    about: { '@id': softwareId },
    description: 'Payload Components installation, architecture, registry, and component documentation.',
    inLanguage: 'en',
    isPartOf: { '@id': websiteId },
    name: 'Payload Components documentation',
    url: `${siteUrl}/docs`,
  }
}

export function faqNode(): Node {
  return {
    '@id': `${siteUrl}/#faq`,
    '@type': 'FAQPage',
    name: 'Payload Components FAQ',
    mainEntity: faqEntries.map((entry) => ({
      '@type': 'Question',
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
      name: entry.question,
    })),
    url: `${siteUrl}/#faq`,
  }
}

export function breadcrumbNode(items: ReadonlyArray<{ name: string; path: string }>): Node {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      item: `${siteUrl}${item.path}`,
      name: item.name,
      position: index + 1,
    })),
  }
}

/* The component catalog as an ItemList of SoftwareSourceCode entries. Installable
   components link to their docs contract; in-development components point at the catalog. */
export function catalogItemListNode(): Node {
  const entries = [...kitEntries, ...upcomingKits]

  return {
    '@type': 'ItemList',
    description: catalogDescription,
    itemListElement: entries.map((kit, index) => ({
      '@type': 'ListItem',
      item: {
        '@type': 'SoftwareSourceCode',
        codeRepository: githubRepoUrl,
        description: kit.description,
        isPartOf: { '@id': softwareId },
        name: kit.title,
        programmingLanguage: 'TypeScript',
        runtimePlatform: 'Payload CMS v3, Next.js',
        url: 'href' in kit ? `${siteUrl}${kit.href}` : `${siteUrl}/components`,
      },
      position: index + 1,
    })),
    name: 'Payload Components catalog',
    numberOfItems: entries.length,
  }
}

export function catalogCollectionPageNode(): Node {
  return {
    '@id': `${siteUrl}/components#catalog`,
    '@type': 'CollectionPage',
    description: catalogDescription,
    isPartOf: { '@id': websiteId },
    mainEntity: catalogItemListNode(),
    name: catalogTitle,
    url: `${siteUrl}/components`,
  }
}

/* Per-kit detail schema for an individual kit doc page. Reads the registry
   entry so version, target, and description never drift from the catalog. */
export function kitSoftwareApplicationNode(kit: (typeof kitEntries)[number]): Node {
  return {
    '@type': 'SoftwareApplication',
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: 'Payload CMS component',
    author: { '@id': organizationId },
    codeRepository: githubRepoUrl,
    description: kit.description,
    isAccessibleForFree: true,
    isPartOf: { '@id': softwareId },
    license: 'https://opensource.org/licenses/MIT',
    name: `${kit.title} — Payload Component`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    operatingSystem: 'Node.js (macOS, Linux, Windows)',
    publisher: { '@id': organizationId },
    softwareRequirements: 'Payload CMS v3, Next.js 15 or 16',
    softwareVersion: kit.version,
    url: `${siteUrl}${kit.href}`,
  }
}

export function techArticleNode(opts: {
  description?: string
  image?: string
  title: string
  url: string
}): Node {
  return {
    '@id': `${siteUrl}${opts.url}#article`,
    '@type': 'TechArticle',
    author: { '@id': organizationId },
    description: opts.description,
    headline: opts.title,
    inLanguage: 'en',
    isPartOf: { '@id': documentationId },
    mainEntityOfPage: `${siteUrl}${opts.url}`,
    publisher: { '@id': organizationId },
    url: `${siteUrl}${opts.url}`,
    ...(opts.image ? { image: `${siteUrl}${opts.image}` } : {}),
  }
}

/* Wrap one or more nodes into a single @graph document. */
export function graph(...nodes: Node[]): Node {
  return { '@context': 'https://schema.org', '@graph': nodes }
}
