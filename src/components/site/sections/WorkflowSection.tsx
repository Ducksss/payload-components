import { FeatureSplitDemo } from '@/components/site/demos/FeatureSplitDemo'
import { useTranslations } from 'next-intl'
import { PreviewSurface } from '@/components/site/graphics/PreviewSurface'
import { HeroInstallReplay } from '@/components/site/HeroInstallReplay'
import { HeroProductFrame } from '@/components/site/HeroProductFrame'
import { Reveal, RevealItem, RevealStagger } from '@/components/site/motion/Reveal'
import { Section, SectionHeading } from '@/components/site/section'
import { landingSections, workflowSteps } from '@/lib/site'

/* How it works — a vertical numbered timeline beside the live result: three
 * moves on the left, a source-mirrored visual specimen on the right, then the
 * install replay underneath as the receipt.
 *
 * The replay used to headline the hero; it reads better here, where "run the
 * command" is literally step one and the transcript answers it, than as the
 * first thing a visitor meets. */
export function WorkflowSection() {
  const t = useTranslations('Landing.workflow')
  const localizedSteps = [
    {
      ...workflowSteps[0],
      description: t('steps.oneDescription'),
      title: t('steps.oneTitle'),
    },
    {
      ...workflowSteps[1],
      description: t('steps.twoDescription'),
      title: t('steps.twoTitle'),
    },
    {
      ...workflowSteps[2],
      description: t('steps.threeDescription'),
      title: t('steps.threeTitle'),
    },
  ]

  return (
    <Section id={landingSections.workflow.id} className="bg-muted/40">
      <SectionHeading
        accentWord="commit"
        eyebrow={t('eyebrow')}
        heading={t('heading')}
        intro={t('intro')}
      />

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:items-center lg:gap-16">
        <RevealStagger as="ol" className="flex flex-col gap-7" stagger={0.09}>
          {localizedSteps.map((step, index) => (
            <RevealItem as="li" key={step.title} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="grid size-8 shrink-0 place-items-center rounded-full border border-brand/30 bg-brand-50 font-mono text-sm font-semibold text-brand">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {index < localizedSteps.length - 1 ? (
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
            </RevealItem>
          ))}
        </RevealStagger>

        <Reveal delay={0.08}>
          <PreviewSurface badge={t('badge')} caption={t('caption')}>
            <FeatureSplitDemo />
          </PreviewSurface>
        </Reveal>
      </div>

      {/* The receipt for step one: the command's real transcript, replayable. */}
      <Reveal className="mt-14">
        <HeroInstallReplay>
          <HeroProductFrame />
        </HeroInstallReplay>
      </Reveal>
    </Section>
  )
}
