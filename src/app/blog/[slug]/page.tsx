import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { InlineTOC } from 'fumadocs-ui/components/inline-toc'
import { ArrowLeft } from 'lucide-react'

import { getMDXComponents } from '@/components/mdx'
import { blogSource } from '@/lib/blog-source'

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

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: { canonical: page.url },
    openGraph: {
      type: 'article',
      title: page.data.title,
      description: page.data.description,
      url: page.url,
    },
  }
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params
  const page = blogSource.getPage([slug])
  if (!page) notFound()

  const MDX = page.data.body

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-8 md:py-16">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to blog
      </Link>

      <header className="mt-6 mb-8 border-b border-border pb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {page.data.title}
        </h1>
        {page.data.description ? (
          <p className="mt-3 text-lg text-muted-foreground">{page.data.description}</p>
        ) : null}
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{page.data.author}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={new Date(page.data.date).toISOString()}>
            {new Date(page.data.date).toDateString()}
          </time>
        </div>
      </header>

      <InlineTOC items={page.data.toc} />

      <article className="prose mt-8">
        <MDX components={getMDXComponents()} />
      </article>
    </main>
  )
}
