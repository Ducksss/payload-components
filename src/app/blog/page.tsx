import type { Metadata } from 'next'
import Link from 'next/link'

import { BlogCard } from '@/components/blog/BlogCard'
import { JsonLd } from '@/components/seo/JsonLd'
import { sortBlogPages } from '@/lib/blog'
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
  const posts = sortBlogPages()

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-16">
      <JsonLd data={blogStructuredData} />
      <header className="mb-12 max-w-3xl">
        <p className="font-mono text-[11px] font-medium uppercase tracking-eyebrow text-brand-600">
          Field notes from the registry
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-display text-foreground sm:text-5xl">
          {blogTitle}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          {blogDescription}
        </p>
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <BlogCard key={post.url} page={post} priority={index < 3} />
          ))}
        </div>
      )}
    </main>
  )
}
