import type { Metadata } from 'next'
import type { ComponentType } from 'react'

import { notFound } from 'next/navigation'
import type { TOCItemType } from 'fumadocs-core/toc'
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page'

import { JsonLd } from '@/components/JsonLd'
import { getMDXComponents } from '@/components/mdx'
import { getDocsPageByPath } from '@/content/docs'
import { source } from '@/lib/source'
import { buildBreadcrumbJsonLd, buildSEOMetadata } from '@/utilities/seo'
import { absoluteURL, siteConfig } from '@/utilities/site'
import type { MDXComponents } from 'mdx/types'

type Args = {
  params: Promise<{
    slug?: string[]
  }>
}

type FumadocsPage = {
  data: {
    body: ComponentType<{ components?: MDXComponents }>
    description?: string
    title: string
    toc?: TOCItemType[]
  }
  path: string
  url: string
}

const getPage = async ({ params }: Args) => {
  const { slug } = await params

  return source.getPage(slug) as FumadocsPage | undefined
}

export function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata(args: Args): Promise<Metadata> {
  const page = await getPage(args)

  if (!page) {
    return {}
  }

  return buildSEOMetadata({
    description: page.data.description ?? '',
    path: page.url,
    title: page.data.title,
  })
}

export default async function Page(args: Args) {
  const page = await getPage(args)

  if (!page) {
    notFound()
  }

  const MDX = page.data.body
  const docsPage = getDocsPageByPath(page.url)
  const sourceFile = docsPage?.sourceFile ?? `content/docs/${page.path}`
  const docsUrl = absoluteURL(page.url)
  const editUrl = `${siteConfig.githubUrl}/blob/main/${sourceFile}`

  return (
    <DocsPage
      toc={page.data.toc}
      tableOfContent={{
        style: 'clerk',
      }}
    >
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: 'Home', path: '/' },
            { name: 'Docs', path: '/docs' },
            ...(page.url === '/docs' ? [] : [{ name: page.data.title, path: page.url }]),
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            about: ['Payload CMS', 'Next.js', 'shadcn registry', 'Payload Kits'],
            description: page.data.description,
            headline: page.data.title,
            inLanguage: 'en',
            mainEntityOfPage: {
              '@id': docsUrl,
            },
            publisher: {
              '@id': `${absoluteURL('/')}#organization`,
            },
            url: docsUrl,
          },
        ]}
      />

      <ViewOptionsPopover githubUrl={editUrl} />
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  )
}
