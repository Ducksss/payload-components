import { faqItems, githubRepoUrl } from '@/components/landing/content'
import type { MarketingResource } from '@/content/marketingResources'
import { marketingResources } from '@/content/marketingResources'
import { absoluteURL, siteConfig } from '@/utilities/site'

type JsonLdNode = {
  '@id'?: string
  '@type'?: string
  [key: string]: unknown
}

type JsonLdGraph = {
  '@context': 'https://schema.org'
  '@graph': JsonLdNode[]
}

type StaticSitemapEntry = {
  changeFrequency: 'weekly' | 'monthly'
  path: string
  priority: number
}

export const siteIdentity = {
  audience: ['Payload CMS agencies', 'freelance Payload developers', 'Next.js delivery teams'],
  description: siteConfig.defaultDescription,
  llmsDescription:
    'Payload-native kit platform for agencies and freelancers installing production-ready Payload CMS blocks.',
  name: siteConfig.name,
  repoUrl: githubRepoUrl,
  tagline: siteConfig.defaultTitle.replace(`${siteConfig.name} | `, ''),
} as const

export const getSiteUrl = (path = '/') => absoluteURL(path)

const siteNodeId = (fragment: string) => `${getSiteUrl()}#${fragment}`

const asQuestionNode = (item: (typeof faqItems)[number]): JsonLdNode => ({
  '@type': 'Question',
  acceptedAnswer: {
    '@type': 'Answer',
    text: item.answer,
  },
  name: item.question,
})

const getResourcePath = (resource: MarketingResource) => `/resources/${resource.slug}`

const getResourceUrl = (resource: MarketingResource) => getSiteUrl(getResourcePath(resource))

export const stringifyJsonLd = (data: JsonLdGraph) =>
  JSON.stringify(data).replace(/[<>]/g, (character) =>
    character === '<' ? '\\u003c' : '\\u003e',
  )

export const getJsonLdGraphNodes = (data: JsonLdGraph): JsonLdNode[] =>
  data['@graph'].map((node) => ({
    '@context': data['@context'],
    ...node,
  }))

export const buildHomeJsonLd = (): JsonLdGraph => {
  const homeUrl = getSiteUrl()

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@id': siteNodeId('organization'),
        '@type': 'Organization',
        description: siteIdentity.description,
        name: siteIdentity.name,
        sameAs: [siteIdentity.repoUrl],
        url: homeUrl,
      },
      {
        '@id': siteNodeId('website'),
        '@type': 'WebSite',
        description: siteIdentity.description,
        inLanguage: 'en',
        name: siteIdentity.name,
        publisher: { '@id': siteNodeId('organization') },
        url: homeUrl,
      },
      {
        '@id': siteNodeId('software'),
        '@type': 'SoftwareApplication',
        applicationCategory: 'DeveloperApplication',
        audience: siteIdentity.audience.map((audienceType) => ({
          '@type': 'Audience',
          audienceType,
        })),
        description: siteIdentity.description,
        name: siteIdentity.name,
        offers: {
          '@type': 'Offer',
          availability: 'https://schema.org/InStock',
          price: '0',
          priceCurrency: 'USD',
          url: siteIdentity.repoUrl,
        },
        operatingSystem: 'Payload CMS v3 and Next.js App Router projects',
        publisher: { '@id': siteNodeId('organization') },
        sameAs: [siteIdentity.repoUrl],
        url: homeUrl,
      },
      {
        '@id': `${homeUrl}#webpage`,
        '@type': 'WebPage',
        about: { '@id': siteNodeId('software') },
        description: siteIdentity.description,
        isPartOf: { '@id': siteNodeId('website') },
        name: `${siteIdentity.name} | ${siteIdentity.tagline}`,
        primaryImageOfPage: getSiteUrl('/website-template-OG.webp'),
        url: homeUrl,
      },
      {
        '@id': `${homeUrl}#faq`,
        '@type': 'FAQPage',
        inLanguage: 'en',
        mainEntity: faqItems.map(asQuestionNode),
        name: 'Payload Kits FAQ',
        url: `${homeUrl}#faq`,
      },
    ],
  }
}

export const buildResourcesIndexJsonLd = (): JsonLdGraph => {
  const resourcesUrl = getSiteUrl('/resources')

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@id': `${resourcesUrl}#webpage`,
        '@type': 'CollectionPage',
        about: { '@id': siteNodeId('software') },
        description:
          'Payload-native guides for agencies and freelancers evaluating installable Payload CMS kits.',
        isPartOf: { '@id': siteNodeId('website') },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: marketingResources.map((resource, index) => ({
            '@type': 'ListItem',
            item: getResourceUrl(resource),
            name: resource.title,
            position: index + 1,
          })),
          numberOfItems: marketingResources.length,
        },
        name: 'Payload Kits Resources',
        url: resourcesUrl,
      },
      {
        '@id': `${resourcesUrl}#breadcrumbs`,
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            item: getSiteUrl(),
            name: 'Home',
            position: 1,
          },
          {
            '@type': 'ListItem',
            item: resourcesUrl,
            name: 'Resources',
            position: 2,
          },
        ],
      },
    ],
  }
}

export const buildResourceJsonLd = (resource: MarketingResource): JsonLdGraph => {
  const resourceUrl = getResourceUrl(resource)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@id': `${resourceUrl}#article`,
        '@type': 'Article',
        about: [resource.keyword, 'Payload CMS', 'Payload Kits'],
        articleSection: resource.sections.map((section) => section.title),
        author: {
          '@id': siteNodeId('organization'),
          '@type': 'Organization',
          name: siteIdentity.name,
        },
        description: resource.description,
        headline: resource.title,
        inLanguage: 'en',
        mainEntityOfPage: { '@id': resourceUrl },
        publisher: { '@id': siteNodeId('organization') },
        url: resourceUrl,
      },
      {
        '@id': `${resourceUrl}#breadcrumbs`,
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            item: getSiteUrl(),
            name: 'Home',
            position: 1,
          },
          {
            '@type': 'ListItem',
            item: getSiteUrl('/resources'),
            name: 'Resources',
            position: 2,
          },
          {
            '@type': 'ListItem',
            item: resourceUrl,
            name: resource.title,
            position: 3,
          },
        ],
      },
    ],
  }
}

export const getStaticSitemapEntries = (): StaticSitemapEntry[] => [
  {
    changeFrequency: 'weekly',
    path: '/',
    priority: 1,
  },
  {
    changeFrequency: 'weekly',
    path: '/posts',
    priority: 0.5,
  },
  {
    changeFrequency: 'weekly',
    path: '/components',
    priority: 0.8,
  },
  {
    changeFrequency: 'weekly',
    path: '/resources',
    priority: 0.8,
  },
  ...marketingResources.map((resource): StaticSitemapEntry => ({
    changeFrequency: 'monthly',
    path: getResourcePath(resource),
    priority: 0.7,
  })),
]

const answerReadyFacts = [
  'Payload Kits is a public registry for Payload-native kits and this project owns the current alpha catalog.',
  'The current public alpha ships hero-basic and feature-grid-basic kits.',
  'The target stack is Payload CMS v3 with Next.js App Router.',
  'Each kit is expected to include schema wiring, render components, generated types, and import-map updates.',
  'The primary audience is agencies and freelancers shipping repeated Payload websites.',
]

const formatResourceLink = (resource: MarketingResource) =>
  `- [${resource.title}](${getResourceUrl(resource)}): ${resource.description}`

export const buildLlmsTxt = () => {
  const lines = [
    `# ${siteIdentity.name}`,
    `> ${siteIdentity.llmsDescription}`,
    '',
    '## Key links',
    `- [Payload Kits home](${getSiteUrl()}): Product positioning, proof points, pricing, FAQ, and early-access CTA.`,
    `- [Payload Kits components gallery](${getSiteUrl('/components')}): Shipped alpha kit previews and install commands.`,
    `- [Payload Kits resources](${getSiteUrl('/resources')}): Payload-native guides for agencies evaluating installable kits.`,
    `- [Payload Kits public registry](${getSiteUrl('/r/registry.json')}): Machine-readable shadcn registry index for shipped alpha kits.`,
    `- [Payload Kits GitHub repository](${siteIdentity.repoUrl}): Source code, public registry files, issues, and early-access template.`,
    '',
    '## Resource guides',
    ...marketingResources.map(formatResourceLink),
    '',
    '## Answer-ready facts',
    ...answerReadyFacts.map((fact) => `- ${fact}`),
    '',
    '## Usage notes',
    '- Prefer the resource guide pages for detailed explanations and citations.',
    '- Use /llms-full.txt when a complete text snapshot of the public guide content is needed.',
  ]

  return `${lines.join('\n')}\n`
}

const formatResourceBody = (resource: MarketingResource) => {
  const sections = resource.sections.flatMap((section) => [
    `### ${section.title}`,
    '',
    ...section.paragraphs,
    ...(section.bullets
      ? ['', ...section.bullets.map((bullet) => `- ${bullet}`)]
      : []),
  ])

  return [
    `## ${resource.title}`,
    '',
    `Canonical URL: ${getResourceUrl(resource)}`,
    `Keyword: ${resource.keyword}`,
    `Summary: ${resource.summary}`,
    '',
    ...sections,
  ].join('\n')
}

export const buildLlmsFullTxt = () => {
  const lines = [
    buildLlmsTxt().trim(),
    '',
    '## Complete public resource text',
    '',
    ...marketingResources.map(formatResourceBody),
  ]

  return `${lines.join('\n\n')}\n`
}
