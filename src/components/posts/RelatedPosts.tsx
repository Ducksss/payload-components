import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

import { PostCard } from './PostCard'
import type { PayloadPostSummary } from './types'

type Props = {
  basePath?: string
  className?: string
  description?: string
  posts: PayloadPostSummary[]
  title?: string
}

export const RelatedPosts = ({
  basePath = '/posts',
  className,
  description,
  posts,
  title = 'Related posts',
}: Props) => {
  return (
    <section className={cn('container py-10 lg:py-14', className)}>
      <div className="grid gap-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="grid max-w-2xl gap-3">
            <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
              Keep reading
            </Badge>
            <h2 className="text-3xl font-medium tracking-[-0.05em] sm:text-4xl">{title}</h2>
            {description ? <p className="text-sm leading-7 text-muted-foreground">{description}</p> : null}
          </div>
        </div>

        {posts.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.id ?? post.slug} basePath={basePath} post={post} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border/80 bg-card/35 p-6 text-sm text-muted-foreground">
            No related posts available yet.
          </div>
        )}
      </div>
    </section>
  )
}
