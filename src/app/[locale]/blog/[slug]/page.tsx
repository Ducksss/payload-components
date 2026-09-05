import type { Metadata } from 'next'
import Image from 'next/image'
import Link from '@/i18n/Link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { InlineTOC } from 'fumadocs-ui/components/inline-toc'
import { ArrowLeft } from 'lucide-react'

import { RelatedPosts } from '@/components/blog/RelatedPosts'
import { getMDXComponents } from '@/components/mdx'
import { JsonLd } from '@/components/seo/JsonLd'
import { localeDetails, localizeHref } from '@/i18n/config'
import { getPublication, publicationContentAttributes, publicationRobots } from '@/i18n/publication'
import { blogSource } from '@/lib/blog-source'
import { getSiteLocale } from '@/lib/i18n'
import { feedMetadataAlternates, siteUrl, siteOpenGraphDefaults } from '@/lib/site'
import { blogPostingNode, breadcrumbNode, graph } from '@/lib/structured-data'

interface BlogPostProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return blogSource.getPages('en').map((page) => ({ slug: page.slugs[0] }))
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const { slug } = await params
  const locale = await getSiteLocale()
  const page = blogSource.getPage([slug], locale)
  if (!page) return {}
  const publication = getPublication(page.url, locale)
  /* The OG route resolves its locale from the request, so the advertised URL
     has to carry the prefix — an unprefixed one renders the English card. */
  const socialImage = `${siteUrl}${localizeHref(`/og/blog/${slug}/image.png`, publication.contentLocale)}`

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: publication.canonical,
      languages: publication.alternates,
      ...feedMetadataAlternates,
    },
    openGraph: {
      ...siteOpenGraphDefaults,
      locale: localeDetails[publication.contentLocale].openGraphLocale,
      type: 'article',
      title: page.data.title,
      description: page.data.description,
      images: [{ alt: page.data.cover.alt, height: 630, url: socialImage, width: 1200 }],
      url: publication.canonical,
      publishedTime: new Date(page.data.date).toISOString(),
    },
    robots: publicationRobots(publication),
    twitter: {
      card: 'summary_large_image',
      title: page.data.title,
      description: page.data.description,
      images: [socialImage],
    },
  }
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params
  const locale = await getSiteLocale()
  const t = await getTranslations({ locale, namespace: 'Blog' })
  const commonT = await getTranslations({ locale, namespace: 'Common' })
  const page = blogSource.getPage([slug], locale)
  if (!page) notFound()
  const publication = getPublication(page.url, locale)

  const MDX = page.data.body
  const structuredData = graph(
    breadcrumbNode([
      { name: commonT('home'), path: localizeHref('/', locale) },
      { name: commonT('blog'), path: localizeHref('/blog', locale) },
      { name: page.data.title, path: localizeHref(page.url, locale) },
    ]),
    blogPostingNode({
      author: page.data.author,
      datePublished: page.data.date,
      description: page.data.description,
      image: page.data.cover.src,
      locale: publication.contentLocale,
      tags: page.data.tags,
      title: page.data.title,
      url: publication.canonical,
    }),
  )

  return (
    <main
      {...publicationContentAttributes(publication)}
      id="main"
      className="mx-auto w-full max-w-6xl px-4 py-12 md:px-8 md:py-16"
    >
      <JsonLd data={structuredData} />
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        {t('back')}
      </Link>

      <header className="mt-7 max-w-4xl">
        <span className="inline-flex rounded-full border border-brand/20 bg-brand-50 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-micro text-brand-600">
          {t(`series.${page.data.series}`)}
        </span>
        <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-display text-foreground sm:text-5xl md:text-6xl">
          {page.data.title}
        </h1>
        {page.data.description ? (
          <p className="mt-3 text-lg text-muted-foreground">{page.data.description}</p>
        ) : null}
        <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{page.data.author}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={new Date(page.data.date).toISOString()}>
            {new Date(page.data.date).toLocaleDateString(localeDetails[locale].htmlLang, {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </time>
          <span aria-hidden="true">·</span>
          <span>{page.data.tags.join(' · ')}</span>
        </div>
      </header>

      <div className="relative mt-10 aspect-[40/21] overflow-hidden rounded-frame border border-border bg-muted shadow-[var(--shadow-frame)]">
        <Image
          alt={page.data.cover.alt}
          className="object-cover"
          data-blog-cover
          fill
          priority
          sizes="(min-width: 1024px) 1088px, 100vw"
          src={page.data.cover.src}
        />
      </div>

      <div className="mx-auto mt-10 max-w-3xl">
        <InlineTOC items={page.data.toc} />
        <article className="prose mt-8">
          <MDX components={getMDXComponents()} />
        </article>
      </div>

      <RelatedPosts page={page} />
    </main>
  )
}
