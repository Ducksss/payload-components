import { Logomark } from '@/components/site/Logomark'
import { cn } from '@/utilities/ui'

export function Wordmark({
  mobileIconOnly = false,
  withBadge = false,
}: {
  mobileIconOnly?: boolean
  withBadge?: boolean
}) {
  return (
    <span className="flex items-center gap-2.5">
      <Logomark />
      <span
        className={cn(
          'text-[15px] font-semibold tracking-tight text-foreground',
          mobileIconOnly && 'hidden sm:inline',
        )}
      >
        Payload Components
      </span>
      {withBadge ? (
        <span className="hidden rounded-full border border-border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:inline">
          MIT
        </span>
      ) : null}
    </span>
  )
}
