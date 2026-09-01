import { siteIcons } from '@/components/site/icons'
import { useTranslations } from 'next-intl'
import { Reveal, RevealItem, RevealStagger } from '@/components/site/motion/Reveal'
import { Section, SectionHeading } from '@/components/site/section'
import { WiringLedger } from '@/components/site/WiringLedger'
import { WiringFlow } from '@/components/site/graphics/WiringFlow'
import { landingSections, receipts, wiringLedger, wiringMapCaption } from '@/lib/site'

/* The install boundary — the page's single "copying isn't the hard part"
 * beat. The node map shows the shape (one file a paste covers, four
 * payload-components wires); the ledger is the artifact-by-artifact receipt
 * against a plain shadcn add. */
export function WiringSection() {
  const t = useTranslations('Landing.wiring')

  return (
    <Section id={landingSections.wiring.id}>
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <SectionHeading
          accentWord="wired"
          eyebrow={t('eyebrow')}
          heading={t('heading')}
          intro={t('intro')}
        />
        <code className="hidden shrink-0 pb-1 font-mono text-[11px] text-muted-foreground lg:block">
          {t('source')}: {wiringLedger.source}
        </code>
      </div>

      {/* The shape of an install: one file a paste covers, four wired by us. */}
      <Reveal className="mt-12">
        <WiringFlow caption={wiringMapCaption} />
      </Reveal>

      {/* The receipts: the same five artifacts, row by row, vs a plain shadcn add. */}
      <Reveal className="mt-6">
        <WiringLedger />
      </Reveal>

      {/* Receipts strip — each claim checkable in the repo. */}
      <RevealStagger
        className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border pt-8"
        stagger={0.05}
      >
        {receipts.map((receipt) => {
          const Icon = siteIcons[receipt.icon]

          return (
            <RevealItem
              key={receipt.label}
              className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
              y={10}
            >
              <Icon className="size-3.5 text-brand" aria-hidden="true" />
              {receipt.label}
            </RevealItem>
          )
        })}
      </RevealStagger>
    </Section>
  )
}
