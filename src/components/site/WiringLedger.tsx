import { Check, CircleDashed } from 'lucide-react'

import { wiringLedger, type WiringLedgerRow } from '@/lib/site'
import { cn } from '@/utilities/ui'

/* The differentiator as a ledger: five artifact rows, two commands.
 * Plain shadcn add covers one row; payload-components add covers all five.
 * Emerald appears only on the payload-components checks. Columns become
 * stacked verdict lines under md (each verdict carries its own mono
 * command prefix there). */

function Verdict({
  command,
  label,
  tone,
}: {
  command: string
  label: string | null
  tone: 'baseline' | 'component'
}) {
  return (
    <div className="flex items-center gap-x-3 gap-y-1 px-5 py-2.5 md:border-l md:border-border md:px-6 md:py-4">
      <code className="w-28 shrink-0 truncate font-mono text-[11px] text-muted-foreground md:hidden">
        {command.replace('npx ', '').split(' add')[0]} add
      </code>
      {label === null ? (
        <span className="flex items-center gap-2 text-sm text-muted-foreground">
          <CircleDashed className="size-4 shrink-0 opacity-70" aria-hidden="true" />
          left to you
        </span>
      ) : (
        <span
          className={cn(
            'flex items-center gap-2 text-sm',
            tone === 'component' ? 'font-medium text-foreground' : 'text-muted-foreground',
          )}
        >
          <Check
            className={cn(
              'size-4 shrink-0',
              tone === 'component' ? 'text-brand' : 'text-muted-foreground',
            )}
            aria-hidden="true"
          />
          {label}
        </span>
      )}
    </div>
  )
}

function LedgerRow({ row }: { row: WiringLedgerRow }) {
  return (
    <div className="grid grid-cols-1 border-t border-border md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1fr)]">
      <div className="flex flex-col gap-0.5 px-5 pb-1 pt-3.5 md:px-6 md:py-4">
        <span className="text-sm font-medium text-foreground">{row.artifact}</span>
        <code className="truncate font-mono text-[11px] text-muted-foreground">{row.path}</code>
      </div>
      <Verdict command={wiringLedger.columns.baseline.command} label={row.baseline} tone="baseline" />
      <div className="pb-2 md:bg-muted/30 md:pb-0">
        <Verdict command={wiringLedger.columns.component.command} label={row.component} tone="component" />
      </div>
    </div>
  )
}

export function WiringLedger() {
  const { baseline, component } = wiringLedger.columns

  return (
    <div className="overflow-hidden rounded-[1.75rem] border border-border bg-background shadow-card">
      {/* Column heads — the two commands. Hidden under md; each verdict
          cell carries its own command prefix there. */}
      <div className="hidden md:grid md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="px-6 py-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          Artifact
        </div>
        <div className="border-l border-border px-6 py-4">
          <code tabIndex={0} className="block overflow-x-auto whitespace-nowrap font-mono text-[13px] text-foreground/80">
            <span className="select-none text-muted-foreground">$ </span>
            {baseline.command}
          </code>
        </div>
        <div className="border-l border-border bg-muted/30 px-6 py-4">
          <code className="block overflow-x-auto whitespace-nowrap font-mono text-[13px] font-medium text-foreground">
            <span className="select-none text-muted-foreground">$ </span>
            {component.command}
          </code>
        </div>
      </div>

      {wiringLedger.rows.map((row) => (
        <LedgerRow key={row.artifact} row={row} />
      ))}

      {/* Tallies. */}
      <div className="grid grid-cols-1 border-t border-border md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="hidden md:block" />
        <div className="px-5 py-3.5 text-sm leading-6 text-muted-foreground md:border-l md:border-border md:px-6 md:py-4">
          {baseline.summary}
        </div>
        <div className="px-5 py-3.5 text-sm font-medium leading-6 text-foreground md:border-l md:border-border md:bg-muted/30 md:px-6 md:py-4">
          {component.summary}
        </div>
      </div>
    </div>
  )
}
