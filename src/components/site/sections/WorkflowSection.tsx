import { FileText, GitCommitHorizontal, SquareTerminal } from 'lucide-react'

import { Section, SectionHeading } from '@/components/site/section'
import { landingSections, workflowIntro, workflowSteps } from '@/lib/site'

/* One glyph per move — read, run, commit — keyed to the step order. */
const stepGlyphs = [FileText, SquareTerminal, GitCommitHorizontal] as const

/* How it works — a single horizontal numbered rail, not another card grid. */
export function WorkflowSection() {
  return (
    <Section id={landingSections.workflow.id} className="bg-muted/40">
      <SectionHeading
        accentWord="commit"
        eyebrow="Workflow"
        heading={landingSections.workflow.heading}
        intro={workflowIntro}
      />

      <ol className="reveal-on-scroll mt-12 grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8 lg:border-t lg:border-border">
        {workflowSteps.map((step, index) => {
          const Glyph = stepGlyphs[index] ?? FileText

          return (
            <li key={step.title} className="relative flex flex-col gap-3 lg:pt-7">
              <span
                aria-hidden="true"
                className="absolute left-0 top-0 hidden h-3 w-px bg-brand lg:block"
              />
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl border border-border bg-background text-brand shadow-card">
                  <Glyph className="size-5" aria-hidden="true" />
                </span>
                <span className="font-mono text-sm font-semibold text-brand">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="text-base font-semibold tracking-tight text-foreground">
                {step.title}
              </h3>
              <p className="text-sm leading-6 text-muted-foreground">{step.description}</p>
              <code className="mt-1 block w-fit max-w-full overflow-x-auto whitespace-nowrap rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-foreground/80">
                {step.command}
              </code>
            </li>
          )
        })}
      </ol>
    </Section>
  )
}
