import type { UpcomingComponent } from '@/lib/site'

import { cn } from '@/utilities/ui'

/* Catalog-page building blocks for the in-development posts suite.
 * (The landing page renders the installable components live — see
 * CatalogIndex and the demos/ twins; these skeleton thumbs stay
 * deliberately lower-fi to separate "planned" from "real".) */

/* ------------------------------------------------------------------ */
/* Skeleton thumbnails — one abstract composition per component shape.      */
/* Pure shapes, aria-hidden; emerald appears at most once per thumb.  */
/* ------------------------------------------------------------------ */

function ThumbShapes({ slug }: { slug: string }) {
  switch (slug) {
    case 'post-card':
      return (
        <div className="mx-auto flex w-3/4 flex-col gap-1.5 rounded-md border border-foreground/10 bg-background p-2">
          <span className="h-10 w-full rounded bg-foreground/12" />
          <span className="flex items-center gap-1.5 pt-0.5">
            <span className="h-1.5 w-7 rounded-full bg-brand/50" />
            <span className="h-1.5 w-9 rounded-full bg-foreground/12" />
          </span>
          <span className="h-2 w-5/6 rounded-full bg-foreground/60" />
        </div>
      )
    case 'post-archive':
      return (
        <div className="grid w-full grid-cols-3 gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="flex flex-col gap-1 rounded-md border border-foreground/10 bg-background p-1.5"
            >
              <span className="h-8 w-full rounded bg-foreground/12" />
              <span className="h-1.5 w-5/6 rounded-full bg-foreground/50" />
              <span className="h-1 w-2/3 rounded-full bg-foreground/12" />
            </span>
          ))}
        </div>
      )
    case 'post-hero':
      return (
        <div className="flex w-full flex-col gap-2">
          <span className="h-12 w-full rounded-md bg-foreground/12" />
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-8 rounded-full bg-foreground/20" />
            <span className="h-1.5 w-10 rounded-full bg-foreground/12" />
          </span>
          <span className="h-2.5 w-2/3 rounded-full bg-foreground/65" />
        </div>
      )
    case 'featured-post':
      return (
        <div className="grid w-full grid-cols-[1.2fr_1fr] items-center gap-2.5">
          <span className="h-16 rounded-md bg-foreground/12" />
          <span className="flex flex-col gap-1.5">
            <span className="h-1.5 w-8 rounded-full bg-brand/50" />
            <span className="h-2 w-full rounded-full bg-foreground/60" />
            <span className="h-2 w-4/5 rounded-full bg-foreground/60" />
            <span className="h-1.5 w-full rounded-full bg-foreground/12" />
          </span>
        </div>
      )
    case 'post-list':
      return (
        <div className="flex w-full flex-col divide-y divide-foreground/8">
          {['w-3/4', 'w-5/6', 'w-2/3'].map((width) => (
            <span key={width} className="flex items-center gap-2 py-2">
              <span className="h-1.5 w-8 shrink-0 rounded-full bg-foreground/15" />
              <span className={cn('h-2 rounded-full bg-foreground/45', width)} />
            </span>
          ))}
        </div>
      )
    case 'author-card':
      return (
        <div className="mx-auto flex w-3/4 flex-col gap-2 rounded-md border border-foreground/10 bg-background p-2.5">
          <span className="flex items-center gap-2">
            <span className="size-7 shrink-0 rounded-full bg-foreground/15" />
            <span className="flex flex-col gap-1">
              <span className="h-2 w-16 rounded-full bg-foreground/60" />
              <span className="h-1.5 w-12 rounded-full bg-foreground/15" />
            </span>
          </span>
          <span className="h-1.5 w-full rounded-full bg-foreground/12" />
          <span className="h-1.5 w-5/6 rounded-full bg-foreground/12" />
        </div>
      )
    case 'newsletter-callout':
      return (
        <div className="flex w-full flex-col items-center gap-2">
          <span className="h-2.5 w-1/2 rounded-full bg-foreground/60" />
          <span className="h-1.5 w-2/3 rounded-full bg-foreground/15" />
          <span className="flex w-full items-center gap-1.5 pt-1">
            <span className="h-6 flex-1 rounded-full border border-foreground/15 bg-background" />
            <span className="h-6 w-14 rounded-full bg-foreground/85" />
          </span>
        </div>
      )
    case 'related-posts':
      return (
        <div className="flex w-full flex-col gap-2">
          <span className="h-2 w-1/3 rounded-full bg-foreground/60" />
          <span className="grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="flex flex-col gap-1 rounded-md border border-foreground/10 bg-background p-1.5"
              >
                <span className="h-6 w-full rounded bg-foreground/10" />
                <span className="h-1.5 w-3/4 rounded-full bg-foreground/45" />
              </span>
            ))}
          </span>
        </div>
      )
    default:
      return null
  }
}

function ComponentThumb({ muted = false, slug }: { muted?: boolean; slug: string }) {
  return (
    <div
      aria-hidden="true"
      className="flex h-28 items-center justify-center border-b border-border bg-muted/40 px-4"
    >
      <div className={cn('w-full max-w-[16rem]', muted && 'opacity-55')}>
        <ThumbShapes slug={slug} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Cards                                                               */
/* ------------------------------------------------------------------ */

export function UpcomingComponentCard({ component }: { component: UpcomingComponent }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-dashed border-border bg-card/50">
      <ComponentThumb muted slug={component.slug} />
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-[13px] font-semibold tracking-tight text-foreground/80">
            {component.title}
          </h3>
          <span className="shrink-0 rounded-full border border-border bg-background px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Soon
          </span>
        </div>
        <p className="line-clamp-2 text-xs leading-5 text-muted-foreground">
          {component.description}
        </p>
        <span className="mt-auto truncate pt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground/80">
          {component.target}
        </span>
      </div>
    </article>
  )
}

/* ------------------------------------------------------------------ */
/* Family groups                                                       */
/* ------------------------------------------------------------------ */

export function ComponentFamilyHeader({
  countLabel,
  description,
  layout = 'row',
  name,
}: {
  countLabel: string
  description: string
  /* 'row' floats the description to the right (full-width landing index);
     'stack' sits it under the title — tighter beside the catalog sidebar. */
  layout?: 'row' | 'stack'
  name: string
}) {
  const header = (
    <div className="flex items-baseline gap-3">
      <h3 className="text-lg font-semibold tracking-tight text-foreground">{name}</h3>
      <span className="rounded-full border border-border bg-background px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {countLabel}
      </span>
    </div>
  )

  if (layout === 'stack') {
    return (
      <div className="border-b border-border pb-4">
        {header}
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      {header}
      <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-right">
        {description}
      </p>
    </div>
  )
}
