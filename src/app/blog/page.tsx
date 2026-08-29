import type { Metadata } from 'next'
import Link from 'next/link'

import { ArrowRight, Blocks, TerminalSquare, Wrench } from 'lucide-react'

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

const featuredGuides = [
  {
    description:
      'Add a real block with the supported CLI, then review every file and wiring change that lands.',
    href: '/docs/installation',
    icon: TerminalSquare,
    label: 'Installation guide',
    title: 'Install a wired Payload block',
  },
  {
    description:
      'Follow a Payload CMS v3 block from config through registration, rendering, generated types, and the admin import map.',
    href: '/docs/payload-blocks',
    icon: Blocks,
    label: 'Block wiring guide',
    title: 'Wire a reusable block',
  },
  {
    description:
      'Check the four places that usually explain why a saved block does not appear on the page.',
    href: '/blog/anatomy-of-an-install',
    icon: Wrench,
    label: 'Troubleshooting guide',
    title: 'Fix a block that will not render',
  },
] as const

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

      <section
        aria-labelledby="featured-guides-title"
        className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(20rem,0.75fr)]"
        data-guide-gateway
      >
        <h2 id="featured-guides-title" className="sr-only">
          Start with a proven guide
        </h2>

        {featuredGuides.slice(0, 1).map((guide) => {
          const Icon = guide.icon

          return (
            <Link
              key={guide.href}
              href={guide.href}
              className="group flex min-h-72 flex-col justify-between rounded-card bg-foreground p-6 text-background shadow-frame transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 sm:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-medium uppercase tracking-eyebrow text-background/65">
                  {guide.label}
                </span>
                <span className="grid size-11 place-items-center rounded-full border border-background/15 bg-background/5">
                  <Icon className="size-5 text-success" aria-hidden="true" />
                </span>
              </div>

              <div>
                <p className="font-mono text-xs text-success">
                  npx payload-components add hero-basic
                </p>
                <h3 className="mt-4 max-w-xl text-balance text-3xl font-semibold tracking-heading sm:text-4xl">
                  {guide.title}
                </h3>
                <p className="mt-4 max-w-2xl text-pretty text-sm leading-6 text-background/70 sm:text-base sm:leading-7">
                  {guide.description}
                </p>
                <span className="mt-7 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-background">
                  Follow the installation guide
                  <ArrowRight
                    className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Link>
          )
        })}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {featuredGuides.slice(1).map((guide) => {
            const Icon = guide.icon

            return (
              <Link
                key={guide.href}
                href={guide.href}
                className="group flex min-h-52 flex-col justify-between rounded-card border border-border bg-card p-6 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-frame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 sm:p-7"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-[11px] font-medium uppercase tracking-eyebrow text-brand-600">
                    {guide.label}
                  </span>
                  <Icon className="size-5 text-brand" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-balance text-xl font-semibold tracking-heading text-foreground">
                    {guide.title}
                  </h3>
                  <p className="mt-2 text-pretty text-sm leading-6 text-muted-foreground">
                    {guide.description}
                  </p>
                  <span className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-foreground">
                    Read the guide
                    <ArrowRight
                      className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

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
        <Link
          href="/components"
          className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
        >
          Browse all {componentEntries.length} installable components
        </Link>
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
