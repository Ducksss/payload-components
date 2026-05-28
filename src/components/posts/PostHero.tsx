import Image from 'next/image'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

import {
  formatAuthors,
  formatPostDate,
  getPostCategories,
  getPostDescription,
  getPostImage,
  type PayloadPostSummary,
} from './types'

type Props = {
  className?: string
  post: PayloadPostSummary
}

export const PostHero = ({ className, post }: Props) => {
  const image = getPostImage(post)
  const categories = getPostCategories(post)
  const dateLabel = formatPostDate(post.publishedAt ?? post.createdAt)
  const authors = formatAuthors(post.populatedAuthors)
  const title = post.title ?? post.meta?.title ?? 'Untitled post'
  const description = getPostDescription(post)

  return (
    <section className={cn('border-b border-border/70 bg-background', className)}>
      <div className="container grid gap-8 py-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(24rem,0.85fr)] lg:items-center lg:py-16">
        <div className="grid gap-6">
          {categories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge key={category.slug ?? category.title} variant="outline" className="rounded-full px-3 py-1">
                  {category.title ?? 'Untitled category'}
                </Badge>
              ))}
            </div>
          ) : null}

          <div className="grid gap-4">
            <h1 className="text-5xl font-medium leading-[1.02] tracking-[-0.06em] text-balance sm:text-6xl">
              {title}
            </h1>
            {description ? (
              <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            {authors ? (
              <div className="grid gap-1">
                <span className="font-medium text-foreground">Author</span>
                <span>{authors}</span>
              </div>
            ) : null}
            {dateLabel ? (
              <div className="grid gap-1">
                <span className="font-medium text-foreground">Published</span>
                <time dateTime={post.publishedAt ?? post.createdAt ?? undefined}>{dateLabel}</time>
              </div>
            ) : null}
          </div>
        </div>

        {image?.url ? (
          <div className="overflow-hidden rounded-lg border border-border/70 bg-card/40">
            <Image
              alt={image.alt ?? title}
              className="aspect-[4/3] w-full object-cover"
              height={image.height ?? 900}
              priority
              src={image.url}
              width={image.width ?? 1200}
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}
