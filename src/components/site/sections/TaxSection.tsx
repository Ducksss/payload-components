import { Square } from 'lucide-react'

import { Section, SectionHeading } from '@/components/site/section'
import {
  landingSections,
  taxChecklist,
  taxEyebrow,
  taxIntro,
  taxKicker,
} from '@/lib/site'

/* The problem beat: the unchecked grunt-work checklist sets up the wiring
 * ledger, which checks the same five items off. */
export function TaxSection() {
  return (
    <Section id={landingSections.tax.id}>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-center lg:gap-16">
        <div className="flex max-w-xl flex-col">
          <SectionHeading
            accentWord="problem"
            eyebrow={taxEyebrow}
            heading={landingSections.tax.heading}
            intro={taxIntro}
          />
          <p className="mt-8 max-w-md text-lg font-medium leading-7 tracking-[-0.01em] text-foreground">
            {taxKicker}
          </p>
        </div>

        <figure className="reveal-on-scroll rounded-[1.5rem] border border-border bg-muted/40 p-6 sm:p-7">
          <figcaption className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span aria-hidden="true" className="inline-block size-1.5 rounded-full bg-muted-foreground/50" />
            After every paste, on every project
          </figcaption>
          <ul className="mt-5 flex flex-col gap-3">
            {taxChecklist.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 font-mono text-[13px] leading-6 text-foreground/75"
              >
                <Square
                  className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/55"
                  aria-hidden="true"
                />
                {item}
              </li>
            ))}
          </ul>
        </figure>
      </div>
    </Section>
  )
}
