import { Check } from 'lucide-react'

import { cn } from '@/utilities/ui'

type TerminalLineInput = {
  kind: 'command' | 'info' | 'step' | 'success'
  text: string
}

/* Hero replay timing. Steps begin after the command finishes typing. */
const TYPING_DELAY_S = 0.4
const TYPING_DURATION_S = 1.6
const INFO_DELAY_S = TYPING_DELAY_S + TYPING_DURATION_S + 0.15
const STEP_BASE_S = INFO_DELAY_S + 0.35
const STEP_STAGGER_S = 0.32

function heroLineDelay(index: number, lineCount: number): number {
  if (index === 0) return TYPING_DELAY_S
  if (index === 1) return INFO_DELAY_S
  if (index === lineCount - 1) return STEP_BASE_S + (lineCount - 3) * STEP_STAGGER_S + 0.45
  return STEP_BASE_S + (index - 2) * STEP_STAGGER_S
}

function TerminalLineRow({
  animated,
  delay,
  line,
  typed,
}: {
  animated: boolean
  delay: number
  line: TerminalLineInput
  typed: boolean
}) {
  const reveal = animated && !typed
  const style = reveal ? { animationDelay: `${delay}s` } : undefined

  if (line.kind === 'command') {
    return (
      <div className={cn('flex items-center gap-2', reveal && 'animate-line-in')} style={style}>
        <span aria-hidden="true" className="select-none font-semibold text-success">
          $
        </span>
        {typed ? (
          <span
            className="animate-typing inline-block font-medium text-terminal-foreground"
            style={{
              ['--typing-steps' as string]: line.text.length,
              ['--typing-width' as string]: `${line.text.length}ch`,
            }}
          >
            {line.text}
          </span>
        ) : (
          <span className="font-medium text-terminal-foreground">{line.text}</span>
        )}
      </div>
    )
  }

  if (line.kind === 'step') {
    return (
      <div className={cn('flex items-start gap-2', reveal && 'animate-line-in')} style={style}>
        <Check aria-hidden="true" className="mt-[3px] size-3.5 shrink-0 text-success" />
        <span className="text-terminal-foreground/80">{line.text}</span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'pl-[1.375rem]',
        line.kind === 'success' ? 'font-medium text-success' : 'text-terminal-muted',
        reveal && 'animate-line-in',
      )}
      style={style}
    >
      {line.text}
    </div>
  )
}

export function Terminal({
  animated = false,
  className,
  lines,
  title,
}: {
  animated?: boolean
  className?: string
  lines: readonly TerminalLineInput[]
  title: string
}) {
  const lastDelay = heroLineDelay(lines.length - 1, lines.length)

  return (
    <div
      className={cn(
        'min-w-0 overflow-hidden rounded-xl border border-terminal-border bg-terminal shadow-frame',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4 border-b border-terminal-border bg-terminal-chrome px-4 py-2.5">
        <div aria-hidden="true" className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
        </div>
        <span className="font-mono text-[11px] text-terminal-muted">{title}</span>
        <span className="font-mono text-[11px] text-terminal-muted/70">payload-kit 0.1.0</span>
      </div>

      <div className="overflow-x-auto px-4 py-4 sm:px-5">
        <div className="min-w-max space-y-1.5 pr-4 font-mono text-[12.5px] leading-relaxed sm:text-[13px]">
          {lines.map((line, index) => (
            <TerminalLineRow
              key={`${line.kind}-${index}`}
              animated={animated}
              delay={heroLineDelay(index, lines.length)}
              line={line}
              typed={animated && index === 0}
            />
          ))}

          {animated ? (
            <div
              className="animate-line-in flex items-center gap-2"
              style={{ animationDelay: `${lastDelay + 0.4}s` }}
            >
              <span aria-hidden="true" className="select-none font-semibold text-success">
                $
              </span>
              <span aria-hidden="true" className="animate-caret inline-block h-4 w-2 bg-success/80" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

