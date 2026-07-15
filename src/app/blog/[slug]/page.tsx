import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { InlineTOC } from 'fumadocs-ui/components/inline-toc'
import { ArrowLeft } from 'lucide-react'

import { RelatedPosts } from '@/components/blog/RelatedPosts'
import { getMDXComponents } from '@/components/mdx'
import { JsonLd } from '@/components/seo/JsonLd'
import { blogSeries } from '@/lib/blog'
import { blogSource } from '@/lib/blog-source'
import { siteUrl } from '@/lib/site'
import { blogPostingNode, graph } from '@/lib/structured-data'

interface BlogPostProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return blogSource.getPages().map((page) => ({ slug: page.slugs[0] }))
}

export async function generateMetadata({ params }: BlogPostProps): Promise<Metadata> {
  const { slug } = await params
  const page = blogSource.getPage([slug])
  if (!page) return {}
  const socialImage = `${siteUrl}/og/blog/${slug}/image.png`

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: { canonical: `${siteUrl}${page.url}` },
    openGraph: {
      type: 'article',
      title: page.data.title,
      description: page.data.description,
      images: [
        { alt: page.data.cover.alt, height: 630, url: socialImage, width: 1200 },
      ],
      url: `${siteUrl}${page.url}`,
      publishedTime: new Date(page.data.date).toISOString(),
    },
    twitter: { card: 'summary_large_image', title: page.data.title, description: page.data.description, images: [socialImage] },
  }
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params
  const page = blogSource.getPage([slug])
  if (!page) notFound()

  const MDX = page.data.body
  const series = blogSeries[page.data.series]
  const structuredData = graph(
    blogPostingNode({
      author: page.data.author,
      datePublished: page.data.date,
      description: page.data.description,
      image: page.data.cover.src,
      tags: page.data.tags,
      title: page.data.title,
      url: page.url,
    }),
  )

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 md:px-8 md:py-16">
      <JsonLd data={structuredData} />
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to blog
      </Link>

      <header className="mt-7 max-w-4xl">
        <span className="inline-flex rounded-full border border-brand/20 bg-brand-50 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-micro text-brand-600">
          {series.label}
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
            {new Date(page.data.date).toDateString()}
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
