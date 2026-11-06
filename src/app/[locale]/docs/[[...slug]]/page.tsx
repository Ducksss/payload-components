import type { Metadata } from 'next'
import type { ComponentProps } from 'react'

import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
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
import { EditorialDocHeader } from '@/components/site/EditorialDocHeader'
import Link from '@/i18n/Link'
import { localizeHref, localeDetails } from '@/i18n/config'
import { getPublication, publicationContentAttributes, publicationRobots } from '@/i18n/publication'
import { getComponentManifest } from '@/lib/component-manifest'
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
  const publication = getPublication(page.url, locale)

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
      canonical: publication.canonical,
      languages: publication.alternates,
      ...feedMetadataAlternates,
    },
    title,
    description: page.data.description,
    openGraph: {
      ...siteOpenGraphDefaults,
      images: getPageImage(page, locale).url,
      locale: localeDetails[publication.contentLocale].openGraphLocale,
      title,
      description: page.data.description,
      type: 'article',
      url: publication.canonical,
    },
    robots: publicationRobots(publication),
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
  const publication = getPublication(page.url, locale)

  const MDX = page.data.body
  const markdownUrl = getPageMarkdownUrl(page, locale).url
  const githubUrl = `${githubRepoUrl}/blob/${githubContentBranch}/content/docs/${page.path}`

  /* Breadcrumb trail: Home › Documentation › this page. The docs index is its
     own root, so it skips the redundant "Documentation" rung. */
  const localizedDocsRoute = localizeHref(docsRoute, locale)
  const commonT = await getTranslations({ locale, namespace: 'Common' })
  const crumbs = [{ name: commonT('home'), path: localizeHref('/', locale) }]
  if (localizeHref(page.url, locale) !== localizedDocsRoute) {
    crumbs.push({ name: commonT('documentation'), path: localizedDocsRoute })
  }
  crumbs.push({ name: page.data.title, path: localizeHref(page.url, locale) })

  /* Component doc pages (/docs/components/<slug>) carry per-component SoftwareApplication
     detail (from the registry entry) plus a custom header with prev/next and a meta line.
     They keep the right-rail table of contents (`full` stays an editorial opt-in) and
     mark the article [data-component-page] for the section rhythm in docs.css. */
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

  /* The one quiet meta line under the component title: version, kind, and the
     install target (the manifest's first supported target, e.g.
     payload-website-starter). The family is not repeated — the sidebar already
     groups by it. */
  const manifest = component ? await getComponentManifest(component.slug) : null
  const meta =
    component && manifest
      ? {
          kind: component.family === 'pages' ? 'Page block' : 'Post component',
          target: manifest.supportedTargets[0] ?? component.target,
          version: component.version,
        }
      : undefined

  const structuredData = graph(
    breadcrumbNode(crumbs),
    techArticleNode({
      description: page.data.description,
      image: getPageImage(page, locale).url,
      locale: publication.contentLocale,
      title: page.data.title,
      url: publication.canonical,
    }),
    ...(component ? [componentSoftwareApplicationNode(component)] : []),
  )

  return (
    <DocsPage
      {...publicationContentAttributes(publication)}
      data-component-page={component ? '' : undefined}
      data-editorial={page.data.editorial ? '' : undefined}
      role="main"
      toc={page.data.toc}
      full={page.data.full}
    >
      <JsonLd data={structuredData} />
      {component ? (
        <ComponentDocHeader
          title={page.data.title}
          description={page.data.description}
          meta={meta}
          markdownUrl={markdownUrl}
          githubUrl={githubUrl}
          prev={prev ? { href: prev.href, title: prev.title } : undefined}
          next={next ? { href: next.href, title: next.title } : undefined}
        />
      ) : page.data.editorial ? (
        <EditorialDocHeader
          accent={page.data.editorial.accent}
          description={page.data.description}
          eyebrow={page.data.editorial.eyebrow}
          githubUrl={githubUrl}
          markdownUrl={markdownUrl}
          title={page.data.title}
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
      <DocsBody className={page.data.editorial ? '@container' : undefined}>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page, LocalizedMdxLink),
          })}
        />
      </DocsBody>
    </DocsPage>
  )
}
