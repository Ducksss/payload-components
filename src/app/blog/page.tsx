import type { Metadata } from 'next'
import Link from 'next/link'

import { blogSource } from '@/lib/blog-source'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Updates, deep dives, and release notes from the Payload Components team.',
}

export default function BlogIndex() {
  const posts = [...blogSource.getPages()].sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  )

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-12 md:px-8 md:py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">Blog</h1>
        <p className="mt-2 text-muted-foreground">
          Updates, deep dives, and release notes from the Payload Components team.
        </p>
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
