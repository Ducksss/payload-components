import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/utilities/ui'

import {
  formatPostDate,
  getPostCategories,
  getPostDescription,
  getPostHref,
  getPostImage,
  type PayloadPostSummary,
} from './types'

type Props = {
  basePath?: string
  className?: string
  ctaLabel?: string
  label?: string
  post: PayloadPostSummary
}

export const FeaturedPost = ({
  basePath = '/posts',
  className,
  ctaLabel = 'Read featured guide',
  label = 'Featured post',
  post,
}: Props) => {
  const categories = getPostCategories(post)
  const dateLabel = formatPostDate(post.publishedAt ?? post.createdAt)
  const description = getPostDescription(post)
  const href = getPostHref(post, basePath)
  const image = getPostImage(post)
  const title = post.title ?? post.meta?.title ?? 'Untitled post'

  return (
    <Card className={cn('overflow-hidden border-border/70 bg-background shadow-none', className)}>
      <CardContent className="grid gap-0 p-0 lg:grid-cols-[0.9fr_1.1fr]">
        {image?.url ? (
          <Link href={href} className="block overflow-hidden border-b border-border/70 bg-muted/40 lg:border-b-0 lg:border-r">
            <Image
              alt={image.alt ?? title}
              className="aspect-[16/11] h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
              height={image.height ?? 900}
              src={image.url}
              width={image.width ?? 1280}
            />
          </Link>
        ) : null}

        <div className="flex flex-col justify-center gap-6 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              {label}
            </Badge>
            {categories[0] ? (
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {categories[0].title ?? 'Untitled category'}
              </Badge>
            ) : null}
          </div>

          <div className="grid gap-3">
            {dateLabel ? (
              <time
                className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground"
                dateTime={post.publishedAt ?? post.createdAt ?? undefined}
              >
                {dateLabel}
              </time>
            ) : null}
            <h2 className="text-4xl font-medium leading-tight tracking-[-0.05em] text-balance">
              <Link href={href} className="underline-offset-4 hover:underline">
                {title}
              </Link>
            </h2>
            {description ? <p className="text-base leading-7 text-muted-foreground">{description}</p> : null}
          </div>

          <Link
            href={href}
            className="inline-flex h-10 w-fit items-center justify-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            {ctaLabel}
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
