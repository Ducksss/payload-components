import {
  blogDescription,
  blogTitle,
  catalogDescription,
  catalogTitle,
  faqEntries,
  githubRepoUrl,
  maintainerNote,
  componentEntries,
  siteDescription,
  siteUrl,
} from '@/lib/site'

/* Stable @id anchors. The Organization and WebSite nodes are emitted once,
   sitewide, from the root layout; page-level nodes reference them by @id
   instead of redefining them. Keep these in sync with app/layout.tsx. */
export const organizationId = `${siteUrl}/#organization`
export const websiteId = `${siteUrl}/#website`
export const softwareId = `${siteUrl}/#software`
export const documentationId = `${siteUrl}/docs#documentation`
export const blogId = `${siteUrl}/blog#blog`

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
    description:
      'Payload Components installation, architecture, registry, and component documentation.',
    inLanguage: 'en',
    isPartOf: { '@id': websiteId },
    name: 'Payload Components documentation',
    url: `${siteUrl}/docs`,
  }
}

export function blogNode(): Node {
  return {
    '@id': blogId,
    '@type': 'Blog',
    description: blogDescription,
    inLanguage: 'en',
    isPartOf: { '@id': websiteId },
    name: blogTitle,
    publisher: { '@id': organizationId },
    url: `${siteUrl}/blog`,
  }
}

type BlogPostingNodeOptions = {
  author: string
  description?: string
  image?: string
  tags?: readonly string[]
  title: string
  url: string
} & (
  { date: Date | string; datePublished?: never } | { date?: never; datePublished: Date | string }
)

export function blogPostingNode(opts: BlogPostingNodeOptions): Node {
  const published = opts.datePublished ?? opts.date

  return {
    '@id': `${siteUrl}${opts.url}#article`,
    '@type': 'BlogPosting',
    author: {
      '@type': 'Person',
      name: opts.author,
      url: maintainerNote.href,
    },
    datePublished: new Date(published).toISOString(),
    description: opts.description,
    headline: opts.title,
    inLanguage: 'en',
    isPartOf: { '@id': blogId },
    ...(opts.image ? { image: `${siteUrl}${opts.image}` } : {}),
    ...(opts.tags?.length ? { keywords: opts.tags.join(', ') } : {}),
    mainEntityOfPage: `${siteUrl}${opts.url}`,
    publisher: { '@id': organizationId },
    url: `${siteUrl}${opts.url}`,
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
   components only: the visible catalog also teases upcoming components, but the
   list's name/description claim installable items, and upcoming entries have no
   distinct URL — counting them inflated numberOfItems and emitted duplicate
   /components ListItems. */
export function catalogItemListNode(): Node {
  return {
    '@type': 'ItemList',
    description: catalogDescription,
    itemListElement: componentEntries.map((component, index) => ({
      '@type': 'ListItem',
      item: {
        '@type': 'SoftwareSourceCode',
        codeRepository: githubRepoUrl,
        description: component.description,
        isPartOf: { '@id': softwareId },
        name: component.title,
        programmingLanguage: 'TypeScript',
        runtimePlatform: 'Payload CMS v3, Next.js',
        url: `${siteUrl}${component.href}`,
      },
      position: index + 1,
    })),
    name: 'Payload Components catalog',
    numberOfItems: componentEntries.length,
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

/* Per-component detail schema for an individual component doc page. Reads the registry
   entry so version, target, and description never drift from the catalog. */
export function componentSoftwareApplicationNode(
  component: (typeof componentEntries)[number],
): Node {
  const noun = component.family === 'pages' ? 'block' : 'component'

  return {
    '@type': 'SoftwareApplication',
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: `Payload CMS ${noun}`,
    author: { '@id': organizationId },
    codeRepository: githubRepoUrl,
    description: component.description,
    isAccessibleForFree: true,
    isPartOf: { '@id': softwareId },
    keywords: `Payload CMS ${noun}, Payload ${noun}, ${component.title}, Payload CMS`,
    license: 'https://opensource.org/licenses/MIT',
    name: `${component.title} — Payload CMS ${noun}`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    operatingSystem: 'Node.js (macOS, Linux, Windows)',
    publisher: { '@id': organizationId },
    softwareRequirements: 'Payload CMS v3, Next.js 15 or 16',
    softwareVersion: component.version,
    url: `${siteUrl}${component.href}`,
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
