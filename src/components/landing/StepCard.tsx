import { CheckCircle2, Clock3 } from 'lucide-react'

import { cn } from '@/utilities/ui'

import type { Step } from './content'
import styles from './landing.module.css'

type StepCardProps = {
  step: Step
}

export const StepCard = ({ step }: StepCardProps) => {
  const isShipped = step.status === 'shipped'
  const StatusIcon = isShipped ? CheckCircle2 : Clock3

  return (
    <article
      className={cn(
        styles.stepCard,
        'flex h-full min-w-0 flex-col gap-6 rounded-2xl border border-border bg-background p-6 transition-shadow duration-200 hover:shadow-[0_16px_50px_-28px_rgba(15,23,42,0.35)] sm:p-7',
      )}
      data-status={step.status}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-2xl font-semibold tracking-[-0.04em] text-brand">
          {step.label}
        </span>

        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[0.68rem] font-semibold tracking-[0.12em] uppercase',
            isShipped
              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
              : 'border border-border text-muted-foreground',
          )}
        >
          <StatusIcon className="size-3" aria-hidden="true" />
          {step.statusLabel}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-display text-2xl font-semibold tracking-[-0.02em] text-balance">
          {step.title}
        </h3>
        <p className="text-base leading-7 text-muted-foreground">{step.description}</p>
      </div>

      <div className="mt-auto flex flex-col gap-5">
        <div className="overflow-x-auto rounded-xl bg-zinc-950 px-4 py-3">
          <code className="font-mono text-[0.82rem] whitespace-nowrap text-zinc-100">
            <span aria-hidden="true" className="select-none text-zinc-500">
              ${' '}
            </span>
            {step.command}
          </code>
        </div>

        <ul className="flex flex-col gap-2.5">
          {step.items.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
              <CheckCircle2 className="mt-[3px] size-4 shrink-0 text-brand" aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
