import type { ReactNode } from 'react'

import { DemoFitFrame } from '@/components/site/demos/DemoFitFrame'
import { cn } from '@/utilities/ui'

/* A framed live-preview surface — the generalised sibling of ComponentSpecimen.
 * Wraps a demo twin (sized by DemoFitFrame's zoom, so the card grows with the
 * twin) in the same "technical drawing" chrome: an optional mono file/label
 * header, a "rendered from source" badge, and an optional caption. The twin is
 * presentational already; the surface reinforces aria-hidden and adds no
 * heading tags, so it never pollutes the page's h1/h2 outline. */
export function PreviewSurface({
  badge = 'Rendered from source',
  caption,
  children,
  className,
  label,
}: {
  badge?: string | null
  caption?: ReactNode
  children: ReactNode
  className?: string
  label?: string
}) {
  return (
    <figure
      className={cn(
        'hover-lift overflow-hidden rounded-[1.5rem] border border-border bg-background shadow-card',
        className,
      )}
    >
      {label || badge ? (
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-border bg-muted/40 px-4 py-2.5 sm:px-5">
          {label ? (
            <code className="truncate font-mono text-[11px] text-muted-foreground">{label}</code>
          ) : (
            <span />
          )}
          {badge ? (
            <span className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
              {badge}
            </span>
          ) : null}
        </div>
      ) : null}

      <DemoFitFrame className="bg-muted/15 [mask-image:linear-gradient(to_bottom,black_88%,transparent)]">
        <div className="px-4 py-5 sm:px-6">{children}</div>
      </DemoFitFrame>

      {caption ? (
        <figcaption className="border-t border-border px-4 py-3 text-xs leading-5 text-muted-foreground sm:px-5">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
