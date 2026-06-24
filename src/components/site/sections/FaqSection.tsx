import { Faq } from '@/components/site/Faq'
import { Section, SectionHeading } from '@/components/site/section'
import { faqIntro, landingSections } from '@/lib/site'

export function FaqSection() {
  return (
    <Section id={landingSections.faq.id}>
      <SectionHeading
        accentWord="straight"
        eyebrow="FAQ"
        heading={landingSections.faq.heading}
        intro={faqIntro}
      />

      <div className="reveal-on-scroll mt-10">
        <Faq />
      </div>

      {/* Quiet dogfood note: this FAQ is itself one of the catalog blocks. */}
      <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1.5 font-mono text-[11px] text-muted-foreground">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
        This section is one of our blocks
        <code className="rounded-md border border-border bg-muted/60 px-1.5 py-0.5 text-foreground/80">
          npx payload-components add faq-accordion
        </code>
      </p>
    </Section>
  )
}
