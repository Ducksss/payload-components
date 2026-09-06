import Link from 'next/link'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/utilities/ui'

export type PostCardData = Pick<Post, 'categories' | 'meta' | 'publishedAt' | 'slug' | 'title'>

export function PostCard({
  className,
  post,
  variant = 'grid',
}: {
  className?: string
  post: PostCardData
  variant?: 'featured' | 'grid' | 'list'
}) {
  const image = post.meta?.image
  const description = post.meta?.description?.replace(/\s+/g, ' ').trim()
  const href = `/posts/${post.slug}`
  const publishedAt = post.publishedAt ? new Date(post.publishedAt) : undefined
  const categories = (post.categories ?? []).flatMap((category) =>
    typeof category === 'object' && category?.title ? [category.title] : [],
  )

  return (
    <Card
      className={cn(
        'group gap-0 overflow-hidden border-border/70 bg-card py-0 shadow-none transition-colors hover:border-foreground/25',
        variant === 'list' && 'sm:grid sm:grid-cols-[14rem_minmax(0,1fr)]',
        className,
      )}
    >
      <div className={cn('overflow-hidden bg-muted', variant === 'featured' && 'lg:aspect-[2/1]')}>
        {image && typeof image === 'object' ? (
          <Media
            imgClassName="aspect-[16/10] h-full w-full object-cover transition-transform duration-500 motion-reduce:transform-none group-hover:scale-[1.02]"
            resource={image}
            size={variant === 'list' ? '14rem' : '(min-width: 1024px) 33vw, 100vw'}
          />
        ) : (
          <div className="aspect-[16/10] bg-muted" />
        )}
      </div>

      <div className="flex min-w-0 flex-col">
        <CardHeader className="flex flex-col gap-3 p-5">
          <div className="flex flex-wrap items-center gap-2">
            {categories.slice(0, 2).map((category, index) => (
              <Badge key={`${category}-${index}`} variant="outline" className="font-normal">
                {category}
              </Badge>
            ))}
            {publishedAt && !Number.isNaN(publishedAt.valueOf()) ? (
              <time
                className="text-xs text-muted-foreground"
                dateTime={publishedAt.toISOString()}
              >
                {new Intl.DateTimeFormat('en', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  timeZone: 'UTC',
                }).format(publishedAt)}
              </time>
            ) : null}
          </div>
          <CardTitle className="text-balance text-xl font-medium leading-snug tracking-title">
            <Link
              className="rounded-sm outline-none transition-colors group-hover:text-brand focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              href={href}
            >
              {post.title}
            </Link>
          </CardTitle>
        </CardHeader>

        {description ? (
          <CardContent className="px-5 pb-5 pt-0">
            <CardDescription className="line-clamp-3 text-sm leading-6">
              {description}
            </CardDescription>
          </CardContent>
        ) : null}
      </div>
    </Card>
  )
}
