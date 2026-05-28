import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

import {
  formatPostDate,
  getPostCategories,
  getPostDescription,
  getPostHref,
  type PayloadPostSummary,
} from './types'

type Props = {
  basePath?: string
  className?: string
  description?: string
  posts: PayloadPostSummary[]
  title?: string
}

export const PostList = ({
  basePath = '/posts',
  className,
  description,
  posts,
  title = 'Latest posts',
}: Props) => {
  return (
    <section className={cn('grid gap-6', className)}>
      <div className="grid gap-2">
        <h2 className="text-3xl font-medium tracking-[-0.05em]">{title}</h2>
        {description ? <p className="text-sm leading-7 text-muted-foreground">{description}</p> : null}
      </div>

      {posts.length > 0 ? (
        <div className="divide-y divide-border/70 rounded-lg border border-border/70 bg-background">
          {posts.map((post) => {
            const categories = getPostCategories(post)
            const dateLabel = formatPostDate(post.publishedAt ?? post.createdAt)
            const description = getPostDescription(post)
            const href = getPostHref(post, basePath)
            const title = post.title ?? post.meta?.title ?? 'Untitled post'

            return (
              <article key={post.id ?? post.slug} className="grid gap-3 p-5 sm:grid-cols-[1fr_auto] sm:items-start">
                <div className="grid gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {categories[0] ? (
                      <Badge variant="outline" className="rounded-full px-3 py-1">
                        {categories[0].title ?? 'Untitled category'}
                      </Badge>
                    ) : null}
                    {dateLabel ? (
                      <time className="text-xs text-muted-foreground" dateTime={post.publishedAt ?? post.createdAt ?? undefined}>
                        {dateLabel}
                      </time>
                    ) : null}
                  </div>

                  <h3 className="text-xl font-medium tracking-[-0.03em]">
                    <Link href={href} className="underline-offset-4 hover:underline">
                      {title}
                    </Link>
                  </h3>
                  {description ? <p className="text-sm leading-7 text-muted-foreground">{description}</p> : null}
                </div>

                <Link href={href} className="text-sm font-medium underline-offset-4 hover:underline">
                  Read
                </Link>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border/80 bg-card/35 p-6 text-sm text-muted-foreground">
          No posts to list yet.
        </div>
      )}
    </section>
  )
}
