import Link from '@/i18n/Link'
import { useTranslations } from 'next-intl'

import { MarkdownCopyButton, ViewOptionsPopover } from 'fumadocs-ui/layouts/docs/page'
import { ArrowLeft, ArrowRight } from 'lucide-react'

/* The header of a component reference page (src/app/[locale]/docs/[[...slug]]/page.tsx
 * renders it for /docs/components/*): the title, one sentence, and one quiet meta
 * line on the left; Copy Markdown, view options, and prev/next arrows (walking the
 * catalog order) on the right. The <h1> stays the page title — the e2e
 * component-page loop asserts H1 === component.title — and the kind ("Page block"
 * / "Post component") is its own element, which the e2e reads by exact text. The
 * family is not repeated here: the sidebar already groups by it. */

type ComponentNav = { href: string; title: string }

export type ComponentDocMeta = {
  /* "Page block" or "Post component". */
  kind: string
  /* The install target, e.g. payload-website-starter. */
  target: string
  version: string
}

const control =
  'inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-background'

function NavArrow({
  component,
  direction,
}: {
  component?: ComponentNav
  direction: 'next' | 'prev'
}) {
  const t = useTranslations('Docs')
  const Icon = direction === 'prev' ? ArrowLeft : ArrowRight

  if (!component) {
    return (
      <span aria-hidden="true" className={`${control} text-muted-foreground/40`}>
        <Icon className="size-4" />
      </span>
    )
  }

  return (
    <Link
      href={component.href}
      title={component.title}
      aria-label={t(direction === 'prev' ? 'previousComponent' : 'nextComponent', {
        title: component.title,
      })}
      className={`${control} text-foreground transition-colors duration-150 ease-out hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`}
    >
      <Icon className="size-4" aria-hidden="true" />
    </Link>
  )
}

export function ComponentDocHeader({
  description,
  githubUrl,
  markdownUrl,
  meta,
  next,
  prev,
  title,
}: {
  description?: string
  githubUrl: string
  markdownUrl: string
  meta?: ComponentDocMeta
  next?: ComponentNav
  prev?: ComponentNav
  title: string
}) {
  return (
    <div className="mt-4 flex flex-col gap-6 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
      <div className="flex min-w-0 flex-col gap-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h1>
        {description ? (
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">{description}</p>
        ) : null}
        {meta ? (
          <p className="flex flex-wrap items-center gap-x-2 font-mono text-xs leading-5 text-muted-foreground">
            <span>v{meta.version}</span>
            <span aria-hidden="true">·</span>
            <span>{meta.kind}</span>
            <span aria-hidden="true">·</span>
            <span>{meta.target}</span>
          </p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <MarkdownCopyButton markdownUrl={markdownUrl} className="h-9 rounded-md px-4 text-sm" />
        <ViewOptionsPopover
          markdownUrl={markdownUrl}
          githubUrl={githubUrl}
          className="h-9 rounded-md px-4 text-sm"
        />
        <NavArrow direction="prev" component={prev} />
        <NavArrow direction="next" component={next} />
      </div>
    </div>
  )
}
