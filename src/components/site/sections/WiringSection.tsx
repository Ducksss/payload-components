import { siteIcons } from '@/components/site/icons'
import { Section, SectionHeading } from '@/components/site/section'
import { WiringLedger } from '@/components/site/WiringLedger'
import { WiringFlow } from '@/components/site/graphics/WiringFlow'
import { landingSections, receipts, wiringIntro, wiringLedger, wiringMapCaption } from '@/lib/site'

/* The install boundary — the page's single "copying isn't the hard part"
 * beat. The node map shows the shape (one file a paste covers, four
 * payload-components wires); the ledger is the artifact-by-artifact receipt
 * against a plain shadcn add. */
export function WiringSection() {
  return (
    <Section id={landingSections.wiring.id}>
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <SectionHeading
          accentWord="wired"
          eyebrow="The install boundary"
          heading={landingSections.wiring.heading}
          intro={wiringIntro}
        />
        <code className="hidden shrink-0 pb-1 font-mono text-[11px] text-muted-foreground lg:block">
          source: {wiringLedger.source}
        </code>
      </div>

      {/* The shape of an install: one file a paste covers, four wired by us. */}
      <div className="reveal-on-scroll mt-12">
        <WiringFlow caption={wiringMapCaption} />
      </div>

      {/* The receipts: the same five artifacts, row by row, vs a plain shadcn add. */}
      <div className="reveal-on-scroll mt-6">
        <WiringLedger />
      </div>

      {/* Receipts strip — each claim checkable in the repo. */}
      <div className="reveal-on-scroll mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border pt-8">
        {receipts.map((receipt) => {
          const Icon = siteIcons[receipt.icon]

          return (
            <span
              key={receipt.label}
              className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
            >
              <Icon className="size-3.5 text-brand" aria-hidden="true" />
              {receipt.label}
            </span>
          )
        })}
      </div>
    </Section>
  )
}
