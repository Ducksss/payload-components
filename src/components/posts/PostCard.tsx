import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
  post: PayloadPostSummary
  showCategories?: boolean
}

export const PostCard = ({ basePath = '/posts', className, post, showCategories = true }: Props) => {
  const href = getPostHref(post, basePath)
  const image = getPostImage(post)
  const categories = getPostCategories(post)
  const description = getPostDescription(post)
  const dateLabel = formatPostDate(post.publishedAt ?? post.createdAt)
  const title = post.title ?? post.meta?.title ?? 'Untitled post'

  return (
    <Card className={cn('h-full overflow-hidden border-border/70 bg-background/90 shadow-none', className)}>
      {image?.url ? (
        <Link href={href} className="block overflow-hidden border-b border-border/70 bg-muted/40">
          <Image
            alt={image.alt ?? title}
            className="aspect-[16/9] w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
            height={image.height ?? 720}
            src={image.url}
            width={image.width ?? 1280}
          />
        </Link>
      ) : null}

      <CardHeader className="gap-4 p-5">
        {showCategories && categories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge key={category.slug ?? category.title} variant="outline" className="rounded-full px-3 py-1">
                {category.title ?? 'Untitled category'}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="grid gap-2">
          {dateLabel ? (
            <time className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground" dateTime={post.publishedAt ?? post.createdAt ?? undefined}>
              {dateLabel}
            </time>
          ) : null}
          <CardTitle className="text-2xl leading-tight tracking-[-0.04em]">
            <Link href={href} className="underline-offset-4 hover:underline">
              {title}
            </Link>
          </CardTitle>
        </div>
      </CardHeader>

      {description ? (
        <CardContent className="p-5 pt-0">
          <CardDescription className="text-sm leading-7">{description}</CardDescription>
        </CardContent>
      ) : null}
    </Card>
  )
}
