import {
  catalogDescription,
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

const logoUrl = `${siteUrl}/favicon.svg`

type Node = Record<string, unknown>

export function organizationNode(): Node {
  return {
    '@id': organizationId,
    '@type': 'Organization',
    description: siteDescription,
    logo: logoUrl,
    name: 'Payload Kits',
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
    name: 'Payload Kits',
    publisher: { '@id': organizationId },
    url: `${siteUrl}/`,
  }
}

/* Payload Kits is a free, open-source developer CLI + registry. */
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
    name: 'Payload Kits',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    operatingSystem: 'Node.js (macOS, Linux, Windows)',
    publisher: { '@id': organizationId },
    softwareRequirements: 'Payload CMS v3, Next.js 15 or 16',
    url: `${siteUrl}/`,
  }
}

export function faqNode(): Node {
  return {
    '@id': `${siteUrl}/#faq`,
    '@type': 'FAQPage',
    mainEntity: faqEntries.map((entry) => ({
      '@type': 'Question',
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
      name: entry.question,
    })),
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

/* The kit catalog as an ItemList of SoftwareSourceCode entries. Installable
   kits link to their docs contract; in-development kits point at the catalog. */
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
    name: 'Payload Kits catalog',
    numberOfItems: entries.length,
  }
}

/* Per-kit detail schema for an individual kit doc page. Reads the registry
   entry so version, target, and description never drift from the catalog. */
export function kitSoftwareApplicationNode(kit: (typeof kitEntries)[number]): Node {
  return {
    '@type': 'SoftwareApplication',
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: 'Payload CMS block kit',
    author: { '@id': organizationId },
    codeRepository: githubRepoUrl,
    description: kit.description,
    isAccessibleForFree: true,
    isPartOf: { '@id': softwareId },
    license: 'https://opensource.org/licenses/MIT',
    name: `${kit.title} — Payload Kit`,
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
    '@type': 'TechArticle',
    author: { '@id': organizationId },
    description: opts.description,
    headline: opts.title,
    inLanguage: 'en',
    isPartOf: { '@id': websiteId },
    publisher: { '@id': organizationId },
    url: `${siteUrl}${opts.url}`,
    ...(opts.image ? { image: `${siteUrl}${opts.image}` } : {}),
  }
}

/* Wrap one or more nodes into a single @graph document. */
export function graph(...nodes: Node[]): Node {
  return { '@context': 'https://schema.org', '@graph': nodes }
}
