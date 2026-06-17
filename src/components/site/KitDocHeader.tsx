import Link from 'next/link'

import { MarkdownCopyButton, ViewOptionsPopover } from 'fumadocs-ui/layouts/docs/page'
import { ArrowLeft, ArrowRight } from 'lucide-react'

/* shadcn-style header for kit doc pages (rendered by src/app/docs/[[...slug]]/page.tsx
 * for /docs/kits/*): title + description on the left; Copy Page controls and
 * prev/next arrows (walking the catalog order) on the right. The <h1> stays the
 * page title — the e2e kit-page loop asserts H1 === kit.title. */

type KitNav = { href: string; title: string }

function NavArrow({ direction, kit }: { direction: 'next' | 'prev'; kit?: KitNav }) {
  const Icon = direction === 'prev' ? ArrowLeft : ArrowRight
  const base =
    'inline-flex size-8 items-center justify-center rounded-md border border-border bg-background'

  if (!kit) {
    return (
      <span aria-hidden="true" className={`${base} text-muted-foreground/40`}>
        <Icon className="size-4" />
      </span>
    )
  }

  return (
    <Link
      href={kit.href}
      title={kit.title}
      aria-label={`${direction === 'prev' ? 'Previous' : 'Next'} kit: ${kit.title}`}
      className={`${base} text-foreground transition-colors hover:bg-secondary`}
    >
      <Icon className="size-4" aria-hidden="true" />
    </Link>
  )
}

export function KitDocHeader({
  chips,
  description,
  githubUrl,
  markdownUrl,
  next,
  prev,
  title,
}: {
  chips?: string[]
  description?: string
  githubUrl: string
  markdownUrl: string
  next?: KitNav
  prev?: KitNav
  title: string
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h1>
        {description ? (
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">{description}</p>
        ) : null}
        {chips && chips.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-border bg-muted/50 px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground"
              >
                {chip}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover markdownUrl={markdownUrl} githubUrl={githubUrl} />
        <div className="ml-1 flex items-center gap-1">
          <NavArrow direction="prev" kit={prev} />
          <NavArrow direction="next" kit={next} />
        </div>
      </div>
    </div>
  )
}
