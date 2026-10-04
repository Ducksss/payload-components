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
      {/* Set in the Datasheet display face at text width: the lockup lives
          only in site chrome (header, footer, brand guide). */}
      <span
        className={cn(
          'font-display text-[15px] font-[650] tracking-[-0.005em] text-foreground',
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
