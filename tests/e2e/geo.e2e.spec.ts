import { expect, test, type Page } from '@playwright/test'

import { marketingResources } from '../../src/content/marketingResources'

const baseURL = 'http://localhost:3000'
const githubRepoUrl = 'https://github.com/Ducksss/payload-components'

type JsonRecord = Record<string, unknown>
type JsonLdNode = JsonRecord & {
  '@type'?: string | string[]
}

const isRecord = (value: unknown): value is JsonRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const getJsonLdDocuments = async (page: Page) => {
  const scripts = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((elements) =>
      elements.map((element) => element.textContent?.trim() ?? '').filter(Boolean),
    )

  return scripts.map((script) => JSON.parse(script) as unknown)
}

const collectJsonLdNodes = (value: unknown): JsonLdNode[] => {
  if (Array.isArray(value)) {
    return value.flatMap(collectJsonLdNodes)
  }

  if (!isRecord(value)) {
    return []
  }

  if (Array.isArray(value['@graph'])) {
    return collectJsonLdNodes(value['@graph'])
  }

  return [value as JsonLdNode]
}

const nodeHasType = (node: JsonLdNode, type: string) => {
  const rawType = node['@type']
  const types = Array.isArray(rawType) ? rawType : [rawType]

  return types.includes(type)
}

const findDocumentsContaining = (documents: unknown[], requiredTypes: string[]) => {
  const nodes = documents.flatMap(collectJsonLdNodes)
  const hasSchemaContext = documents.some(
    (document) => isRecord(document) && document['@context'] === 'https://schema.org',
  )

  if (hasSchemaContext && requiredTypes.every((type) => nodes.some((node) => nodeHasType(node, type)))) {
    return { nodes }
  }

  throw new Error(
    `Expected JSON-LD documents containing ${requiredTypes.join(', ')}. Found ${JSON.stringify(
      documents,
      null,
      2,
    )}`,
  )
}

const findNode = (
  nodes: JsonLdNode[],
  type: string,
  predicate: (node: JsonLdNode) => boolean = () => true,
) => {
  const node = nodes.find((candidate) => nodeHasType(candidate, type) && predicate(candidate))

  expect(node, `Expected JSON-LD graph to contain ${type}`).toBeDefined()

  return node as JsonLdNode
}

const expectArray = (value: unknown, label: string) => {
  expect(Array.isArray(value), label).toBe(true)

  return value as unknown[]
}

const countNodes = (nodes: JsonLdNode[], type: string, id?: string) =>
  nodes.filter((node) => nodeHasType(node, type) && (!id || node['@id'] === id)).length

test.describe('Generative Engine Optimization surfaces', () => {
  test('homepage exposes a Payload Kits Organization, SoftwareApplication, and FAQPage JSON-LD graph', async ({
    page,
  }) => {
    await page.goto(`${baseURL}/`)

    const documents = await getJsonLdDocuments(page)
    const { nodes } = findDocumentsContaining(documents, [
      'Organization',
      'WebSite',
      'SoftwareApplication',
      'FAQPage',
    ])

    expect(countNodes(nodes, 'Organization', `${baseURL}/#organization`)).toBe(1)
    expect(countNodes(nodes, 'WebSite', `${baseURL}/#website`)).toBe(1)

    const organization = findNode(
      nodes,
      'Organization',
      (node) => typeof node.description === 'string',
    )
    expect(organization).toMatchObject({
      '@type': 'Organization',
      description: expect.stringContaining('shadcn registry for Payload CMS teams'),
      name: 'Payload Kits',
      url: `${baseURL}/`,
    })
    expect(organization.sameAs).toEqual(expect.arrayContaining([githubRepoUrl]))

    const software = findNode(nodes, 'SoftwareApplication')
    expect(software).toMatchObject({
      '@type': 'SoftwareApplication',
      applicationCategory: 'DeveloperApplication',
      name: 'Payload Kits',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      operatingSystem: 'Payload CMS v3 and Next.js App Router projects',
      url: `${baseURL}/`,
    })

    const faq = findNode(nodes, 'FAQPage')
    const questions = expectArray(faq.mainEntity, 'FAQPage mainEntity should be an array')

    expect(questions.length).toBeGreaterThanOrEqual(3)
    expect(questions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          '@type': 'Question',
          acceptedAnswer: expect.objectContaining({
            '@type': 'Answer',
            text: expect.stringContaining('shadcn-native kits install frontend files'),
          }),
          name: 'What actually gets installed when I add a kit?',
        }),
      ]),
    )
  })

  test('/llms.txt publishes a concise text/plain AI source map with key Payload Kits links', async ({
    request,
  }) => {
    const response = await request.get(`${baseURL}/llms.txt`)

    expect(response.ok()).toBe(true)
    expect(response.headers()['content-type']).toContain('text/plain')

    const body = await response.text()

    expect(body).toContain('# Payload Kits')
    expect(body).toContain('> Payload-native kit platform')
    expect(body).toContain('## Key links')
    expect(body).toContain(`- [Payload Kits home](${baseURL}/)`)
    expect(body).toContain(`- [Payload Kits documentation](${baseURL}/docs)`)
    expect(body).toContain(`- [Payload Kits components gallery](${baseURL}/components)`)
    expect(body).toContain(`- [Payload Kits resources](${baseURL}/resources)`)
    expect(body).toContain(`- [Payload Kits public registry](${baseURL}/r/registry.json)`)
    expect(body).toContain(`- [Payload Kits GitHub repository](${githubRepoUrl})`)
    expect(body).toContain('## Answer-ready facts')
    expect(body).toContain('Payload Kits is a public registry for Payload-native kits')
    expect(body).toContain('payload-kit add hero-basic')

    for (const resource of marketingResources) {
      expect(body).toContain(`- [${resource.title}](${baseURL}/resources/${resource.slug})`)
    }
  })

  test('/llms-full.txt publishes the full resource guide body as text/plain', async ({
    request,
  }) => {
    const response = await request.get(`${baseURL}/llms-full.txt`)

    expect(response.ok()).toBe(true)
    expect(response.headers()['content-type']).toContain('text/plain')

    const body = await response.text()

    expect(body).toContain('# Payload Kits')

    for (const resource of marketingResources) {
      expect(body).toContain(`## ${resource.title}`)
      expect(body).toContain(resource.description)
      expect(body).toContain(resource.summary)

      for (const section of resource.sections) {
        expect(body).toContain(`### ${section.title}`)

        for (const paragraph of section.paragraphs) {
          expect(body).toContain(paragraph)
        }

        for (const bullet of section.bullets ?? []) {
          expect(body).toContain(bullet)
        }
      }
    }
  })

  test('resource detail pages expose Article and BreadcrumbList JSON-LD graphs', async ({
    page,
  }) => {
    for (const resource of marketingResources) {
      await test.step(resource.slug, async () => {
        const canonicalUrl = `${baseURL}/resources/${resource.slug}`

        await page.goto(canonicalUrl)
        await expect(page.getByRole('heading', { level: 1, name: resource.title })).toBeVisible()

        const documents = await getJsonLdDocuments(page)
        const { nodes } = findDocumentsContaining(documents, ['Article', 'BreadcrumbList'])

        const article = findNode(nodes, 'Article')
        expect(article).toMatchObject({
          '@type': 'Article',
          description: resource.description,
          headline: resource.title,
          mainEntityOfPage: { '@id': canonicalUrl },
          url: canonicalUrl,
        })
        expect(article.about).toEqual(
          expect.arrayContaining([resource.keyword, 'Payload CMS', 'Payload Kits']),
        )

        const breadcrumbs = findNode(nodes, 'BreadcrumbList')
        expect(breadcrumbs.itemListElement).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              '@type': 'ListItem',
              item: `${baseURL}/`,
              name: 'Home',
              position: 1,
            }),
            expect.objectContaining({
              '@type': 'ListItem',
              item: `${baseURL}/resources`,
              name: 'Resources',
              position: 2,
            }),
            expect.objectContaining({
              '@type': 'ListItem',
              item: canonicalUrl,
              name: resource.title,
              position: 3,
            }),
          ]),
        )
      })
    }
  })
})
