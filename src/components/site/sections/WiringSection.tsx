import { siteIcons } from '@/components/site/icons'
import { Section, SectionHeading } from '@/components/site/section'
import { WiringLedger } from '@/components/site/WiringLedger'
import { landingSections, receipts, wiringIntro, wiringLedger } from '@/lib/site'

/* The differentiator as a verifiable artifact table, backed by the receipts
 * strip — every claim is checkable in the repository. */
export function WiringSection() {
  return (
    <Section id={landingSections.wiring.id}>
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <SectionHeading
          accentWord="hard"
          eyebrow="The install boundary"
          heading={landingSections.wiring.heading}
          intro={wiringIntro}
        />
        <code className="hidden shrink-0 pb-1 font-mono text-[11px] text-muted-foreground lg:block">
          source: {wiringLedger.source}
        </code>
      </div>

      <div className="reveal-on-scroll mt-12">
        <WiringLedger />
      </div>

      {/* Receipts — the ledger's claims, each checkable in the repo. */}
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
