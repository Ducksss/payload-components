import { CheckCircle2 } from 'lucide-react'

import type { Step } from './content'

type StepCardProps = {
  step: Step
}

export const StepCard = ({ step }: StepCardProps) => {
  return (
    <article className="flex h-full flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
            {step.label}
          </p>
          <span className="rounded-full border border-border/80 px-3 py-1 text-[0.72rem] uppercase tracking-[0.16em] text-muted-foreground">
            CLI
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-3xl font-medium tracking-[-0.05em] text-balance">{step.title}</h3>
          <p className="text-base leading-7 text-muted-foreground">{step.description}</p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="w-fit max-w-full overflow-x-auto rounded-full border border-border/80 bg-background/90 px-4 py-2.5 text-sm font-medium text-foreground">
          <code>{step.command}</code>
        </div>

        <div className="flex flex-col gap-3 border-l border-border/70 pl-4">
          {step.items.map((item) => (
            <div key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-foreground" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}
