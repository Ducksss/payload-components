import type { ReactNode } from 'react'

import { cn } from '@/utilities/ui'

/* Miniature window for rendering a demo twin at half scale: the inner
 * layer is laid out at 200% of the container width and scaled by 0.5,
 * so the block renders with its real desktop type ramp at a believable
 * "site width" while fitting any card or panel. The caller sets the
 * visible height via className; transformed content contributes no
 * layout height, so the absolute inner layer is simply clipped. */
export function DemoScaleFrame({
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
      <div className="absolute left-0 top-0 w-[200%] origin-top-left scale-[0.5]">{children}</div>
    </div>
  )
}
