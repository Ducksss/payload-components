import type { ReactNode } from 'react'

import { cn } from '@/utilities/ui'

/* Natural-height sibling of DemoScaleFrame, built for the catalog masonry wall.
 *
 * DemoScaleFrame positions its inner layer `absolute` and shrinks it with a CSS
 * `transform`, so the frame contributes *no* layout height and the caller must
 * pin one (`h-44`). That is exactly wrong for a Pinterest-style wall, where each
 * card should size to its own demo.
 *
 * `zoom` (unlike `transform: scale`) scales an element's used size, so the inner
 * layer reserves its scaled height in the flow. Spec-compliant `zoom` resolves a
 * child's percentage widths against the containing block divided by the zoom
 * factor, so `w-full` already lays the twin out at 2x card width (the "real
 * desktop type ramp at card width" the scale frame gives) before zooming to 0.5
 * — a true, variable height per twin. (An explicit `w-[200%]` here double-counts
 * that and overflows.) Inner stays presentational; the wrapper reinforces
 * aria-hidden + pointer-events-none. */
export function DemoFitFrame({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none relative select-none overflow-hidden', className)}
    >
      <div className="w-full [zoom:0.5]">{children}</div>
    </div>
  )
}
