import React, { type ReactNode } from 'react'

export type AuthorCardProps = {
  name: string
  role?: string | null
  bio?: string | null
  /** Pass your populated Payload Media or Next Image element. */
  avatar?: ReactNode
  href?: string | null
  label?: string
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

const profileHref = (value: string | null | undefined) => {
  if (!value) return undefined
  const href = value.trim()
  if (/^\/(?![\/\\])/.test(href) && !href.includes('\\') && !/[\u0000-\u0020]/.test(href))
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

/** Presentational author profile; your template owns author data and access rules. */
export function AuthorCard({
  name,
  role,
  bio,
  avatar,
  href,
  label = 'About the author',
  id,
  className,
  disableInnerContainer = false,
}: AuthorCardProps) {
  const safeHref = profileHref(href)
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => Array.from(part)[0] ?? '')
    .join('')
    .toUpperCase()

  return (
    <aside
      id={id}
      aria-label={label}
      className={['bg-background py-8 text-foreground', className].filter(Boolean).join(' ')}
    >
      <div className={disableInnerContainer ? undefined : 'container mx-auto px-6'}>
        <div className="mx-auto max-w-3xl border-y border-border py-8">
          <p className="mb-6 text-xs font-medium uppercase tracking-eyebrow text-muted-foreground">
            {label}
          </p>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted font-serif text-2xl text-muted-foreground [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
              {avatar ?? <span aria-hidden="true">{initials}</span>}
            </div>
            <div className="min-w-0 flex-1">
              <p className="break-words text-xl font-medium tracking-title">
                {safeHref ? (
                  <a
                    className="rounded-sm underline decoration-border underline-offset-4 transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    href={safeHref}
                  >
                    {name}
                  </a>
                ) : (
                  name
                )}
              </p>
              {role ? <p className="mt-1 text-sm text-muted-foreground">{role}</p> : null}
              {bio ? (
                <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">{bio}</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
