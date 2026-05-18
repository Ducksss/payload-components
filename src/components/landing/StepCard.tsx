import { CheckCircle2, Clock3, TerminalSquare } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

import type { Step } from './content'
import styles from './landing.module.css'

type StepCardProps = {
  isLast?: boolean
  step: Step
}

export const StepCard = ({ isLast = false, step }: StepCardProps) => {
  const isShipped = step.status === 'shipped'
  const StatusIcon = isShipped ? CheckCircle2 : Clock3

  return (
    <article
      className={cn(
        styles.stepCard,
        'group relative flex h-full flex-col gap-6 rounded-[1.75rem] border border-border/70 bg-background/82 p-6 backdrop-blur-sm transition-all duration-200 sm:p-7',
        'hover:-translate-y-1 hover:border-border hover:shadow-[0_24px_60px_-40px_rgba(15,23,42,0.5)]',
      )}
      data-status={step.status}
    >
      {!isLast && <span aria-hidden="true" className={styles.stepConnector} />}

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              styles.stepBadge,
              'grid size-10 place-items-center rounded-2xl border border-border/70 bg-card text-base font-semibold tracking-[-0.04em] text-foreground',
              isShipped && styles.stepBadgeShipped,
            )}
          >
            {step.label}
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Step {step.label}
          </span>
        </div>

        <Badge
          variant={isShipped ? 'secondary' : 'outline'}
          className={cn(
            'flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.16em]',
            isShipped ? 'bg-foreground text-background hover:bg-foreground' : 'text-muted-foreground',
          )}
        >
          <StatusIcon className="size-3" />
          {step.statusLabel}
        </Badge>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-2xl font-medium tracking-[-0.05em] text-balance sm:text-[1.65rem]">
          {step.title}
        </h3>
        <p className="text-base leading-7 text-muted-foreground">{step.description}</p>
      </div>

      <div className="flex flex-col gap-5">
        <div
          className={cn(
            'flex items-center gap-3 overflow-x-auto rounded-2xl border border-border/80 bg-card/85 px-4 py-3 text-sm text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
          )}
        >
          <TerminalSquare className="size-4 shrink-0 text-muted-foreground" />
          <code className="font-mono text-[0.85rem] tracking-tight">{step.command}</code>
        </div>

        <ul className="flex flex-col gap-2.5">
          {step.items.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
            >
              <CheckCircle2 className="mt-[3px] size-4 shrink-0 text-foreground/85" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
