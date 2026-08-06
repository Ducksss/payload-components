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
 * aria-hidden + pointer-events-none.
 *
 * `zoom` is kept here (unlike ComponentWall, which had to move to
 * `transform: scale`) because the variable height IS the feature and a transform
 * contributes no layout size. The tradeoff: `zoom` triggers WebKit's text
 * autosizer, which inflates type when the zoomed layout width outruns the
 * viewport. At 0.5 the layout is only 2x the card — measured 18px vs Chromium's
 * 16px on a 390px viewport, a 1.125x boost that is cosmetic and does not break
 * the masonry. ComponentWall's 0.18 zoom laid out at 1280px and boosted 3.1x,
 * which DID collapse it. If this frame's zoom ever drops much below 0.5, re-check
 * it in WebKit — the boost scales with layoutWidth/viewport, not with the zoom. */
export function DemoFitFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none relative select-none overflow-hidden', className)}
    >
      <div className="w-full [zoom:0.5]">{children}</div>
    </div>
  )
}
