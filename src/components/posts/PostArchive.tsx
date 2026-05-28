import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

import { PostCard } from './PostCard'
import type { PayloadPostSummary } from './types'

type Props = {
  basePath?: string
  className?: string
  description?: string
  eyebrow?: string
  posts: PayloadPostSummary[]
  title?: string
}

export const PostArchive = ({
  basePath = '/posts',
  className,
  description,
  eyebrow,
  posts,
  title = 'Latest posts',
}: Props) => {
  return (
    <section className={cn('container py-12 lg:py-16', className)}>
      <div className="grid gap-8">
        <div className="max-w-3xl space-y-4">
          {eyebrow ? (
            <Badge variant="outline" className="rounded-full px-3 py-1 uppercase tracking-[0.14em]">
              {eyebrow}
            </Badge>
          ) : null}
          <h2 className="text-4xl font-medium leading-tight tracking-[-0.05em] text-balance sm:text-5xl">
            {title}
          </h2>
          {description ? <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p> : null}
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id ?? post.slug} basePath={basePath} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border/80 bg-card/35 p-8 text-sm text-muted-foreground">
            No posts available yet.
          </div>
        )}
      </div>
    </section>
  )
}
