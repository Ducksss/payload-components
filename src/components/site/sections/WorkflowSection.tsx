import { FeatureSplitDemo } from '@/components/site/demos/FeatureSplitDemo'
import { PreviewSurface } from '@/components/site/graphics/PreviewSurface'
import { Section, SectionHeading } from '@/components/site/section'
import { landingSections, workflowIntro, workflowSteps } from '@/lib/site'

/* How it works — a vertical numbered timeline beside the live result: three
 * moves on the left, a real block rendered from source on the right. */
export function WorkflowSection() {
  return (
    <Section id={landingSections.workflow.id} className="bg-muted/40">
      <SectionHeading
        accentWord="commit"
        eyebrow="Workflow"
        heading={landingSections.workflow.heading}
        intro={workflowIntro}
      />

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:items-center lg:gap-16">
        <ol className="reveal-on-scroll flex flex-col gap-7">
          {workflowSteps.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-brand/30 bg-brand-50 font-mono text-sm font-semibold text-brand">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {index < workflowSteps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="mt-1 w-px flex-1 bg-gradient-to-b from-brand/40 to-border"
                  />
                ) : null}
              </div>
              <div className="min-w-0 pb-1">
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{step.description}</p>
                <code
                  tabIndex={0}
                  className="mt-2.5 block w-fit max-w-full overflow-x-auto whitespace-nowrap rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-foreground/80"
                >
                  {step.command}
                </code>
              </div>
            </li>
          ))}
        </ol>

        <div className="reveal-on-scroll">
          <PreviewSurface
            badge="Rendered from source"
            caption="The committed result — real component source, wired into Payload and reviewed like any PR."
          >
            <FeatureSplitDemo />
          </PreviewSurface>
        </div>
      </div>
    </Section>
  )
}
