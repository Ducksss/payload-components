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
import { KitDocHeader } from '@/components/site/KitDocHeader'
import { familyOfSlug } from '@/lib/kit-page-tree'
import { docsRoute, githubContentBranch, githubRepoUrl, kitEntries } from '@/lib/site'
import { getPageImage, getPageMarkdownUrl, source } from '@/lib/source'
import {
  breadcrumbNode,
  graph,
  kitSoftwareApplicationNode,
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

  return {
    alternates: { canonical: page.url },
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

  /* Breadcrumb trail: Home › Documentation › this page. The docs index is its
     own root, so it skips the redundant "Documentation" rung. */
  const crumbs = [{ name: 'Home', path: '/' }]
  if (page.url !== docsRoute) {
    crumbs.push({ name: 'Documentation', path: docsRoute })
  }
  crumbs.push({ name: page.data.title, path: page.url })

  /* Kit doc pages (/docs/kits/<slug>) also carry per-kit SoftwareApplication
     detail, pulled from the registry entry so it stays in sync with the catalog. */
  const kit =
    slug?.length === 2 && slug[0] === 'kits'
      ? kitEntries.find((entry) => entry.slug === slug[1])
      : undefined

  /* Catalog-order prev/next for the kit-page header arrows. */
  const kitIndex = kit ? kitEntries.findIndex((entry) => entry.slug === kit.slug) : -1
  const prevKit = kitIndex > 0 ? kitEntries[kitIndex - 1] : undefined
  const nextKit =
    kitIndex >= 0 && kitIndex < kitEntries.length - 1 ? kitEntries[kitIndex + 1] : undefined

  /* At-a-glance chips under the kit title. */
  const kitChips = kit
    ? [
        `v${kit.version}`,
        kit.family === 'pages' ? 'Page block' : 'Post component',
        `${familyOfSlug(kit.slug).label} family`,
        kit.target,
      ]
    : []

  const structuredData = graph(
    breadcrumbNode(crumbs),
    techArticleNode({
      description: page.data.description,
      image: getPageImage(page).url,
      title: page.data.title,
      url: page.url,
    }),
    ...(kit ? [kitSoftwareApplicationNode(kit)] : []),
  )

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <JsonLd data={structuredData} />
      {kit ? (
        <KitDocHeader
          title={page.data.title}
          description={page.data.description}
          chips={kitChips}
          markdownUrl={markdownUrl}
          githubUrl={githubUrl}
          prev={prevKit ? { href: prevKit.href, title: prevKit.title } : undefined}
          next={nextKit ? { href: nextKit.href, title: nextKit.title } : undefined}
        />
      ) : (
        <>
          <DocsTitle className="font-bold tracking-tight">{page.data.title}</DocsTitle>
          <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
          <div className="flex flex-row items-center gap-2 border-b pb-6">
            <MarkdownCopyButton markdownUrl={markdownUrl} />
            <ViewOptionsPopover markdownUrl={markdownUrl} githubUrl={githubUrl} />
          </div>
        </>
      )}
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
