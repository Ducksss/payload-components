import { Check, ChevronRight, GripVertical } from 'lucide-react'

import { heroStage } from '@/lib/site'
import { cn } from '@/utilities/ui'

import { HeroPanelLabel } from './HeroPanelLabel'
import { heroTimeline, spawnStyle } from './motion'

/* Surface 1: the Payload admin learning the block. A mock of the Pages
 * layout builder — three blocks the project already had, then "Hero Basic"
 * popping into the list with a Registered chip as the install patches
 * src/collections/Pages/index.ts. This surface is the differentiator: a
 * plain registry copy never shows up in the admin at all. */
const existingBlocks = ['Content', 'Media', 'Call to action'] as const

export function HeroAdminPanel({ className }: { className?: string }) {
  const { admin } = heroStage.panels

  return (
    <div className={cn('flex min-w-0 flex-col gap-2.5', className)}>
      <HeroPanelLabel caption={admin.caption} step={admin.step} surface={admin.surface} />

      <div
        aria-hidden="true"
        className="select-none overflow-hidden rounded-2xl border border-border bg-background shadow-card"
      >
        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
          <span className="flex min-w-0 items-center gap-1 text-[11px] font-medium text-muted-foreground">
            Pages
            <ChevronRight className="size-3 shrink-0" />
            <span className="truncate text-foreground">Home</span>
          </span>
          <span className="rounded-md bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
            Layout
          </span>
        </div>

        <div className="flex flex-col gap-2 p-3.5">
          {existingBlocks.map((label) => (
            <div
              key={label}
              className="flex items-center gap-2.5 rounded-lg border border-border/70 bg-secondary/40 px-3 py-2"
            >
              <GripVertical className="size-3.5 shrink-0 text-muted-foreground/60" />
              <span className="truncate text-[13px] text-foreground/75">{label}</span>
              <span className="ml-auto shrink-0 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                block
              </span>
            </div>
          ))}

          <div
            className="admin-pop flex items-center gap-2.5 rounded-lg border border-brand/45 bg-brand-50 px-3 py-2 ring-[3px] ring-brand/10"
            style={spawnStyle(heroTimeline.adminPop)}
          >
            <GripVertical className="size-3.5 shrink-0 text-brand-600/70" />
            <span className="truncate text-[13px] font-medium text-foreground">Hero Basic</span>
            <span className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full border border-brand/30 bg-background px-2 py-0.5 text-[10px] font-semibold text-brand-600">
              <Check className="size-3" />
              Registered
            </span>
          </div>
        </div>
      </div>

      <p className="truncate font-mono text-[11px] text-muted-foreground">{admin.footer}</p>
    </div>
  )
}
