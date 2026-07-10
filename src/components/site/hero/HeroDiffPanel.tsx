import { heroStage, wiringLedger } from '@/lib/site'
import { cn } from '@/utilities/ui'

import { HeroPanelLabel } from './HeroPanelLabel'
import { heroTimeline, lineStyle, spawnStyle } from './motion'

/* Surface 3: the repo. A dark diff-stat panel printing the five artifacts
 * the install writes — rows come straight from wiringLedger so the hero and
 * the wiring section below can never disagree about what one run lands. */
const ROW_DURATION_MS = 150

const glyphs = {
  copied: '+',
  patched: 'M',
  regenerated: '⟳',
} as const

export function HeroDiffPanel({ className }: { className?: string }) {
  const { diff } = heroStage.panels

  return (
    <div className={cn('flex min-w-0 flex-col gap-2.5', className)}>
      <HeroPanelLabel caption={diff.caption} step={diff.step} surface={diff.surface} />

      <div
        aria-hidden="true"
        className="select-none overflow-hidden rounded-2xl border border-terminal-border bg-terminal text-terminal-foreground shadow-card"
      >
        <div className="flex items-center gap-3 border-b border-terminal-border bg-terminal-chrome px-4 py-2.5">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-terminal-foreground/25" />
            <span className="size-2.5 rounded-full bg-terminal-foreground/15" />
            <span className="size-2.5 rounded-full bg-terminal-foreground/10" />
          </span>
          <span className="truncate font-mono text-[11px] text-terminal-muted">
            git diff --stat
          </span>
        </div>

        <div className="relative p-3.5 font-mono text-xs leading-6">
          {/* Idle repo, fading the moment the diff starts printing. */}
          <span
            className="skeleton-fade absolute inset-x-3.5 top-3.5 truncate text-terminal-muted"
            style={spawnStyle(heroTimeline.diffStart)}
          >
            $ git status · clean
          </span>

          <div className="flex flex-col">
            {wiringLedger.rows.map((row, index) => (
              <span
                key={row.artifact}
                className="terminal-reveal flex items-center gap-2.5"
                style={lineStyle(
                  heroTimeline.diffStart + index * heroTimeline.diffStagger,
                  ROW_DURATION_MS,
                )}
              >
                <span className="w-3 shrink-0 text-center font-semibold text-success">
                  {glyphs[row.component]}
                </span>
                <span className="truncate text-terminal-foreground/90">{row.path}</span>
              </span>
            ))}
            <span
              className="terminal-reveal mt-2 truncate text-terminal-muted"
              style={lineStyle(
                heroTimeline.diffStart + wiringLedger.rows.length * heroTimeline.diffStagger,
                ROW_DURATION_MS,
              )}
            >
              {wiringLedger.rows.length} artifacts changed · one commit
            </span>
          </div>
        </div>
      </div>

      <p className="truncate font-mono text-[11px] text-muted-foreground">{diff.footer}</p>
    </div>
  )
}
