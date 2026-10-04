import React, { type ReactNode, useId } from 'react'

export type RelatedPost = {
  title: string
  /** A site path such as /posts/slug, or an HTTP(S) URL. Other values are skipped. */
  href: string
  excerpt?: string | null
  /** Pass your populated Payload Media or Next Image element, with meaningful alt text. */
  image?: ReactNode
  publishedAt?: string | null
}

export type RelatedPostsProps = {
  /** The post this section is placed on, in the same form as each post href. It is never listed. */
  currentHref: string
  /** The posts your template selected, in display order. This component never queries or ranks posts. */
  posts: readonly RelatedPost[]
  title?: string
  locale?: string
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

const postHref = (value: string | null | undefined) => {
  if (!value) return undefined
  const href = value.trim()
  if (/^\/(?![\/\\])/.test(href) && !href.includes('\\') && !/[\u0000- ]/.test(href))
    return href
  try {
    const url = new URL(href)
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password
      ? url.href
      : undefined
  } catch {
    return undefined
  }
}

/* Two hrefs name the same post when they differ only by a trailing slash or a #fragment. */
const comparableHref = (href: string) => {
  const withoutFragment = href.split('#')[0] ?? ''
  const queryStart = withoutFragment.indexOf('?')
  const path = queryStart === -1 ? withoutFragment : withoutFragment.slice(0, queryStart)
  const query = queryStart === -1 ? '' : withoutFragment.slice(queryStart)
  return `${path.replace(/\/+$/, '') || '/'}${query}`
}

const formatDate = (value: string | null | undefined, locale: string) => {
  const date = value ? new Date(value) : undefined
  if (!date || Number.isNaN(date.valueOf())) return undefined
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }
  let label: string
  try {
    label = new Intl.DateTimeFormat(locale, options).format(date)
  } catch {
    label = new Intl.DateTimeFormat('en', options).format(date)
  }
  return { dateTime: date.toISOString(), label }
}

/** Compose once at the end of your post template; your template selects the posts. */
export function RelatedPosts({
  currentHref,
  posts,
  title = 'Related posts',
  locale = 'en',
  id,
  className,
  disableInnerContainer = false,
}: RelatedPostsProps) {
  const generatedId = useId()
  const headingId = id ? `${id}-title` : generatedId
  const current = postHref(currentHref)
  // The current post and repeated hrefs are skipped; the rest keep the caller's order.
  const seen = new Set<string>(current ? [comparableHref(current)] : [])
  const visible = posts.flatMap((post) => {
    const href = postHref(post.href)
    const key = href ? comparableHref(href) : undefined
    if (!href || !key || !post.title.trim() || seen.has(key)) return []
    seen.add(key)
    return [{ ...post, date: formatDate(post.publishedAt, locale), href, key }]
  })

  if (visible.length === 0) return null

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={['bg-background py-12 text-foreground', className].filter(Boolean).join(' ')}
    >
      <div className={disableInnerContainer ? undefined : 'container mx-auto px-6'}>
        <div className="mx-auto max-w-3xl">
          <h2 id={headingId} className="font-serif text-3xl tracking-tight">
            {title}
          </h2>
          <ul className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((post) => (
              <li
                key={post.key}
                className="group relative flex flex-col border-t border-border pt-4"
              >
                {post.image ? (
                  <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-muted [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
                    {post.image}
                  </div>
                ) : null}
                <h3 className="break-words text-lg font-medium leading-snug tracking-title">
                  <a
                    className="rounded-sm underline-offset-4 after:absolute after:inset-0 group-hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    href={post.href}
                  >
                    {post.title}
                  </a>
                </h3>
                {post.excerpt ? (
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {post.excerpt}
                  </p>
                ) : null}
                {post.date ? (
                  <time className="mt-3 text-xs text-muted-foreground" dateTime={post.date.dateTime}>
                    {post.date.label}
                  </time>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
