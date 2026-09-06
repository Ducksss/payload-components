import React, { type ReactNode } from 'react'

export type PostHeroProps = {
  title: string
  description?: string | null
  publishedAt?: string | null
  categories?: readonly string[] | null
  author?: string | null
  /** Pass your populated Payload Media or Next Image element, with meaningful alt text. */
  image?: ReactNode
  locale?: string
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

/** Compose in your article template; this is not a Payload layout block. */
export function PostHero({
  title,
  description,
  publishedAt,
  categories,
  author,
  image,
  locale = 'en',
  id,
  className,
  disableInnerContainer = false,
}: PostHeroProps) {
  const date = publishedAt ? new Date(publishedAt) : undefined
  const validDate = date && !Number.isNaN(date.valueOf()) ? date : undefined
  let dateLabel: string | undefined
  if (validDate) {
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }
    try {
      dateLabel = new Intl.DateTimeFormat(locale, options).format(validDate)
    } catch {
      dateLabel = new Intl.DateTimeFormat('en', options).format(validDate)
    }
  }

  return (
    <header
      id={id}
      className={['bg-background py-12 text-foreground md:py-20', className]
        .filter(Boolean)
        .join(' ')}
    >
      <div className={disableInnerContainer ? undefined : 'container mx-auto px-6'}>
        <div className="mx-auto max-w-4xl border-t border-border pt-6">
          {categories?.length ? (
            <div className="mb-6 flex flex-wrap gap-3 text-xs font-medium uppercase tracking-eyebrow text-muted-foreground">
              {categories.map((category, index) => (
                <span key={`${category}-${index}`}>{category}</span>
              ))}
            </div>
          ) : null}
          <h1 className="max-w-4xl break-words font-serif text-4xl leading-tight tracking-title md:text-6xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">{description}</p>
          ) : null}
          {author || validDate ? (
            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-5 text-sm">
              {author ? <span className="font-medium">{author}</span> : null}
              {validDate ? (
                <time className="text-muted-foreground" dateTime={validDate.toISOString()}>
                  {dateLabel}
                </time>
              ) : null}
            </div>
          ) : null}
        </div>
        {image ? (
          <div className="mt-10 overflow-hidden rounded-lg bg-muted [&_img]:h-auto [&_img]:w-full">
            {image}
          </div>
        ) : null}
      </div>
    </header>
  )
}
