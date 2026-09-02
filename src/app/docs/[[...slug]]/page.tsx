import type { Metadata } from 'next'
import type { ComponentProps } from 'react'

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
import { ComponentDocHeader } from '@/components/site/ComponentDocHeader'
import Link from '@/i18n/Link'
import { localizeHref, localeDetails } from '@/i18n/config'
import { getComponentManifest } from '@/lib/component-manifest'
import { familyOfSlug } from '@/lib/component-page-tree'
import { getSiteLocale } from '@/lib/i18n'
import {
  componentEntries,
  docsRoute,
  feedMetadataAlternates,
  githubContentBranch,
  githubRepoUrl,
  siteOpenGraphDefaults,
} from '@/lib/site'
import { getPageImage, getPageMarkdownUrl, source } from '@/lib/source'
import {
  breadcrumbNode,
  componentSoftwareApplicationNode,
  graph,
  techArticleNode,
} from '@/lib/structured-data'

type DocsPageProps = {
  params: Promise<{
    slug?: string[]
  }>
}

function LocalizedMdxLink({ href, ...props }: ComponentProps<'a'>) {
  if (!href) return <a {...props} />
  return <Link href={href} {...props} />
}

export function generateStaticParams() {
  return source.getPages('en').map((page) => ({ slug: page.slugs }))
}

export async function generateMetadata({ params }: DocsPageProps): Promise<Metadata> {
  const { slug } = await params
  const locale = await getSiteLocale()
  const page = source.getPage(slug, locale)

  if (!page) {
    return {}
  }

  /* Component doc pages get a keyword-rich <title> for search ("… — Payload CMS
     block") while the on-page H1 stays the short catalog name. Page blocks read
     "block"; post components read "component". */
  const component =
    slug?.length === 2 && slug[0] === 'components'
      ? componentEntries.find((entry) => entry.slug === slug[1])
      : undefined
  const title =
    page.data.seoTitle ??
    (component
      ? `${page.data.title} — Payload CMS ${component.family === 'pages' ? 'block' : 'component'}`
      : page.data.title)

  return {
    alternates: {
      canonical: localizeHref(page.url, locale),
      languages: {
        en: localizeHref(page.url, 'en'),
        'zh-CN': localizeHref(page.url, 'zh'),
        'x-default': localizeHref(page.url, 'en'),
      },
      ...feedMetadataAlternates,
    },
    title,
    description: page.data.description,
    openGraph: {
      ...siteOpenGraphDefaults,
      images: getPageImage(page, locale).url,
      locale: localeDetails[locale].openGraphLocale,
      title,
      description: page.data.description,
      type: 'article',
      url: localizeHref(page.url, locale),
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
  const locale = await getSiteLocale()
  const page = source.getPage(slug, locale)

  if (!page) {
    notFound()
  }

  const MDX = page.data.body
  const markdownUrl = getPageMarkdownUrl(page, locale).url
  const githubUrl = `${githubRepoUrl}/blob/${githubContentBranch}/content/docs/${page.path}`

  /* Breadcrumb trail: Home › Documentation › this page. The docs index is its
     own root, so it skips the redundant "Documentation" rung. */
  const localizedDocsRoute = localizeHref(docsRoute, locale)
  const crumbs = [{ name: locale === 'zh' ? '首页' : 'Home', path: localizeHref('/', locale) }]
  if (localizeHref(page.url, locale) !== localizedDocsRoute) {
    crumbs.push({ name: locale === 'zh' ? '文档' : 'Documentation', path: localizedDocsRoute })
  }
  crumbs.push({ name: page.data.title, path: localizeHref(page.url, locale) })

  /* Component doc pages (/docs/components/<slug>) carry per-component SoftwareApplication
     detail (from the registry entry) plus a custom header with prev/next and at-a-glance chips. */
  const component =
    slug?.length === 2 && slug[0] === 'components'
      ? componentEntries.find((entry) => entry.slug === slug[1])
      : undefined

  /* Catalog-order prev/next for the component-page header arrows. */
  const index = component
    ? componentEntries.findIndex((entry) => entry.slug === component.slug)
    : -1
  const prev = index > 0 ? componentEntries[index - 1] : undefined
  const next =
    index >= 0 && index < componentEntries.length - 1 ? componentEntries[index + 1] : undefined

  /* The newest changelog entry, so the version chip carries meaning instead of
     just a number. Suppressed while a component is still on its first release. */
  const manifest = component ? await getComponentManifest(component.slug) : null
  const [newestChange] = manifest?.changelog ?? []
  const latestChange =
    newestChange && (manifest?.changelog?.length ?? 0) > 1
      ? { summary: newestChange.summary, version: newestChange.version }
      : undefined

  /* At-a-glance chips under the component title. */
  const chips = component
    ? [
        `v${component.version}`,
        component.family === 'pages' ? 'Page block' : 'Post component',
        `${familyOfSlug(component.slug).label} family`,
        component.target,
      ]
    : []

  const structuredData = graph(
    breadcrumbNode(crumbs),
    techArticleNode({
      description: page.data.description,
      image: getPageImage(page, locale).url,
      locale,
      title: page.data.title,
      url: localizeHref(page.url, locale),
    }),
    ...(component ? [componentSoftwareApplicationNode(component)] : []),
  )

  return (
    <DocsPage role="main" toc={page.data.toc} full={page.data.full || Boolean(component)}>
      <JsonLd data={structuredData} />
      {component ? (
        <ComponentDocHeader
          title={page.data.title}
          description={page.data.description}
          chips={chips}
          markdownUrl={markdownUrl}
          githubUrl={githubUrl}
          latestChange={latestChange}
          prev={prev ? { href: prev.href, title: prev.title } : undefined}
          next={next ? { href: next.href, title: next.title } : undefined}
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
            a: createRelativeLink(source, page, LocalizedMdxLink),
          })}
        />
      </DocsBody>
    </DocsPage>
  )
}
