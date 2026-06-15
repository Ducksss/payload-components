import type { Metadata } from 'next'

import { notFound } from 'next/navigation'
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
  MarkdownCopyButton,
  ViewOptionsPopover,
} from 'fumadocs-ui/layouts/docs/page'
import { createRelativeLink } from 'fumadocs-ui/mdx'

import { getMDXComponents } from '@/components/mdx'
import { docsPageStructuredData, githubContentBranch, githubRepoUrl, toJsonLd } from '@/lib/site'
import { getPageImage, getPageMarkdownUrl, source } from '@/lib/source'

type DocsPageProps = {
  params: Promise<{
    slug?: string[]
  }>
}

export function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata({ params }: DocsPageProps): Promise<Metadata> {
  const { slug } = await params
  const page = source.getPage(slug)

  if (!page) {
    return {}
  }

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
      title: page.data.title,
      description: page.data.description,
      type: 'article',
      url: page.url,
    },
    twitter: {
      card: 'summary_large_image',
      title: page.data.title,
      description: page.data.description,
    },
  }
}

export default async function Page({ params }: DocsPageProps) {
  const { slug } = await params
  const page = source.getPage(slug)

  if (!page) {
    notFound()
  }

  const MDX = page.data.body
  const markdownUrl = getPageMarkdownUrl(page).url
  const githubUrl = `${githubRepoUrl}/blob/${githubContentBranch}/content/docs/${page.path}`
  const pageStructuredData = docsPageStructuredData({
    description: page.data.description,
    imageUrl: getPageImage(page).url,
    title: page.data.title,
    url: page.url,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(pageStructuredData) }}
      />
      <DocsPage toc={page.data.toc} full={page.data.full}>
        <DocsTitle className="font-bold tracking-tight">{page.data.title}</DocsTitle>
        <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
        <div className="flex flex-row items-center gap-2 border-b pb-6">
          <MarkdownCopyButton markdownUrl={markdownUrl} />
          <ViewOptionsPopover markdownUrl={markdownUrl} githubUrl={githubUrl} />
        </div>
        <DocsBody>
          <MDX
            components={getMDXComponents({
              a: createRelativeLink(source, page),
            })}
          />
        </DocsBody>
      </DocsPage>
    </>
  )
}
