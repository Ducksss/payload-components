import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/utilities/ui'
import { CheckCircle2 } from 'lucide-react'

import type { Step } from './content'
import styles from './landing.module.css'

type StepCardProps = {
  step: Step
}

export const StepCard = ({ step }: StepCardProps) => {
  return (
    <Card
      className={cn(
        styles.panelLift,
        'h-full rounded-[1.75rem] border-border/70 bg-card/70 shadow-none backdrop-blur-sm',
      )}
    >
      <CardHeader className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
            {step.label}
          </p>
          <span className="rounded-full border border-border/80 px-3 py-1 text-xs text-muted-foreground">
            CLI
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <CardTitle className="text-3xl tracking-[-0.05em]">{step.title}</CardTitle>
          <CardDescription className="text-base leading-7">{step.description}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <div className="overflow-x-auto rounded-[1.25rem] border border-border/80 bg-background px-4 py-4 text-sm font-medium text-foreground">
          <code>{step.command}</code>
        </div>

        <div className="flex flex-col gap-3">
          {step.items.map((item) => (
            <div key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-foreground" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
