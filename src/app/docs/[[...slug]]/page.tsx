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

import { JsonLd } from '@/components/seo/JsonLd'
import { getMDXComponents } from '@/components/mdx'
import { docsRoute, githubContentBranch, githubRepoUrl, componentEntries } from '@/lib/site'
import { getPageImage, getPageMarkdownUrl, source } from '@/lib/source'
import {
  breadcrumbNode,
  graph,
  componentSoftwareApplicationNode,
  techArticleNode,
} from '@/lib/structured-data'

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

  /* Component doc pages get a keyword-rich <title> for search ("… — Payload CMS
     block") while the on-page H1 stays the short catalog name. Page blocks
     read "block"; post components read "component". */
  const component =
    slug?.length === 2 && slug[0] === 'components'
      ? componentEntries.find((entry) => entry.slug === slug[1])
      : undefined
  const title = component
    ? `${page.data.title} — Payload CMS ${component.family === 'pages' ? 'block' : 'component'}`
    : page.data.title

  return {
    alternates: { canonical: page.url },
    title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
      title,
      description: page.data.description,
      type: 'article',
      url: page.url,
    },
    twitter: {
      card: 'summary_large_image',
      title,
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

  /* Breadcrumb trail: Home › Documentation › this page. The docs index is its
     own root, so it skips the redundant "Documentation" rung. */
  const crumbs = [{ name: 'Home', path: '/' }]
  if (page.url !== docsRoute) {
    crumbs.push({ name: 'Documentation', path: docsRoute })
  }
  crumbs.push({ name: page.data.title, path: page.url })

  /* Component doc pages (/docs/components/<slug>) also carry per-component SoftwareApplication
     detail, pulled from the registry entry so it stays in sync with the catalog. */
  const component =
    slug?.length === 2 && slug[0] === 'components'
      ? componentEntries.find((entry) => entry.slug === slug[1])
      : undefined

  const structuredData = graph(
    breadcrumbNode(crumbs),
    techArticleNode({
      description: page.data.description,
      image: getPageImage(page).url,
      title: page.data.title,
      url: page.url,
    }),
    ...(component ? [componentSoftwareApplicationNode(component)] : []),
  )

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <JsonLd data={structuredData} />
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
  )
}
