import type { Metadata } from 'next'

import { BlogCard } from '@/components/blog/BlogCard'
import { JsonLd } from '@/components/seo/JsonLd'
import { sortBlogPages } from '@/lib/blog'
import { blogDescription, blogTitle, feedMetadataAlternates, siteUrl } from '@/lib/site'
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
      <header className="max-w-4xl">
        <p className="font-mono text-[11px] font-medium uppercase tracking-eyebrow text-brand-600">
          Practical Payload CMS v3 guidance
        </p>
        <h1 className="mt-3 text-balance text-4xl font-semibold tracking-display text-foreground sm:text-5xl">
          {blogTitle}
        </h1>
        <p className="mt-4 max-w-3xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
          {blogDescription}
        </p>
      </header>

      <div className="mb-8 mt-16 flex flex-col gap-4 border-t border-border pt-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[11px] font-medium uppercase tracking-eyebrow text-brand-600">
            Field notes from the registry
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-heading text-foreground sm:text-3xl">
            More Payload CMS field notes
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Browse implementation lessons, component design notes, and release stories from the open
            registry.
          </p>
        </div>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet — check back soon.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <BlogCard key={post.url} page={post} priority={index < 3} compact />
          ))}
        </div>
      )}
    </main>
  )
}
