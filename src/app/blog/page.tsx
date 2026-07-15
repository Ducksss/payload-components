import type { Metadata } from 'next'

import { BlogCard } from '@/components/blog/BlogCard'
import { sortBlogPages } from '@/lib/blog'
import { siteUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Practical Payload CMS guides, installer internals, component design, and open-source field notes from Payload Components.',
  alternates: { canonical: `${siteUrl}/blog` },
  openGraph: { title: 'Blog', description: 'Practical Payload CMS guides, installer internals, component design, and open-source field notes from Payload Components.', url: `${siteUrl}/blog`, type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Blog', description: 'Practical Payload CMS guides, installer internals, component design, and open-source field notes from Payload Components.' },
}

export default function BlogIndex() {
  const posts = sortBlogPages()

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-16">
      <header className="mb-12 max-w-3xl">
        <p className="font-mono text-[11px] font-medium uppercase tracking-eyebrow text-brand-600">
          Field notes from the registry
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-display text-foreground sm:text-5xl">
          Build Payload sites with the wiring visible.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
          Practical guides, installer internals, component decisions, and the lessons behind an
          MIT registry built in public.
        </p>
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
