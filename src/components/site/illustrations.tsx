import { wiringLedger } from '@/lib/site'

/* In-brand illustration for the landing's install-boundary beat. Monochrome
 * (currentColor / border tokens) with a single emerald accent, aria-hidden and
 * presentational — the adjacent table carries the accessible meaning. No
 * animation that violates the perf guardrails (no infinite background loops, no
 * animated blur). */

/* The "after" for the install boundary, paired with the wiring ledger table:
 * a five-cell coverage track per command. `shadcn add` fills one cell (the file
 * copy); `payload-components add` fills all five. The five cells map to the five
 * ledger artifacts; the table below carries the accessible detail. */
export function WiringCoverage() {
  const artifacts = wiringLedger.rows.map((row) => row.artifact)
  const baselineFilled = wiringLedger.rows.filter((row) => row.baseline !== null).length
  const tracks = [
    { filled: baselineFilled, label: 'shadcn add', tone: 'plain' as const },
    { filled: artifacts.length, label: 'payload-components add', tone: 'brand' as const },
  ]

  return (
    <figure
      aria-hidden="true"
      className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-5 shadow-card sm:p-6"
    >
      {/* artifact legend, aligned over the tracks */}
      <div className="grid grid-cols-[6.5rem_repeat(5,minmax(0,1fr))] items-end gap-x-2 sm:grid-cols-[9rem_repeat(5,minmax(0,1fr))]">
        <span />
        {artifacts.map((artifact) => (
          <span
            key={artifact}
            className="font-mono text-[9px] uppercase leading-tight tracking-[0.08em] text-muted-foreground"
          >
            {artifact}
          </span>
        ))}
      </div>

      {tracks.map((track) => (
        <div
          key={track.label}
          className="grid grid-cols-[6.5rem_repeat(5,minmax(0,1fr))] items-center gap-x-2 sm:grid-cols-[9rem_repeat(5,minmax(0,1fr))]"
        >
          <span className="truncate font-mono text-[11px] text-foreground/80">{track.label}</span>
          {artifacts.map((artifact, index) => {
            const isFilled = index < track.filled
            return (
              <span
                key={artifact}
                className={
                  isFilled
                    ? track.tone === 'brand'
                      ? 'h-7 rounded-md bg-brand'
                      : 'h-7 rounded-md bg-foreground/80'
                    : 'h-7 rounded-md border border-dashed border-border bg-muted/30'
                }
              />
            )
          })}
        </div>
      ))}

      <div className="flex items-center justify-between border-t border-border pt-3 font-mono text-[11px] text-muted-foreground">
        <span>1 of 5 wired</span>
        <span className="text-brand">5 of 5 wired</span>
      </div>
    </figure>
  )
}
