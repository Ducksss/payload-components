import type { Metadata } from 'next'
import Link from 'next/link'

import { JsonLd } from '@/components/seo/JsonLd'
import { getBlogPages } from '@/lib/blog-source'
import {
  blogDescription,
  blogTitle,
  componentEntries,
  feedMetadataAlternates,
  siteUrl,
} from '@/lib/site'
import { blogNode, breadcrumbNode, graph } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: blogTitle,
  description: blogDescription,
  alternates: { canonical: `${siteUrl}/blog`, ...feedMetadataAlternates },
  openGraph: {
    title: blogTitle,
    description: blogDescription,
    url: `${siteUrl}/blog`,
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: blogTitle, description: blogDescription },
}

const blogStructuredData = graph(
  breadcrumbNode([
    { name: 'Home', path: '/' },
    { name: blogTitle, path: '/blog' },
  ]),
  blogNode(),
)

export default function BlogIndex() {
  const posts = getBlogPages()

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 md:px-8 md:py-16">
      <JsonLd data={blogStructuredData} />
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {blogTitle}
        </h1>
        <p className="mt-2 text-muted-foreground">{blogDescription}</p>
        <Link
          href="/components"
          className="mt-4 inline-flex text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
        >
          Browse all {componentEntries.length} installable components
        </Link>
      </header>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet — check back soon.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.url}
              href={post.url}
              className="group flex flex-col rounded-lg border border-border bg-card p-6 transition-colors hover:border-brand/40 hover:bg-brand/5"
            >
              <h2 className="text-lg font-semibold tracking-tight text-foreground group-hover:text-brand">
                {post.data.title}
              </h2>
              {post.data.description ? (
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                  {post.data.description}
                </p>
              ) : null}
              <time
                dateTime={new Date(post.data.date).toISOString()}
                className="mt-4 text-xs font-medium text-muted-foreground"
              >
                {new Date(post.data.date).toDateString()}
              </time>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
