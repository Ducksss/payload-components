import { Faq } from '@/components/site/Faq'
import { Section, SectionHeading } from '@/components/site/section'
import { faqIntro, landingSections } from '@/lib/site'

export function FaqSection() {
  return (
    <Section id={landingSections.faq.id}>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16 lg:items-start">
        {/* Heading pinned left to match every other section's rhythm; on lg it
            stays in view while the answers scroll beside it. */}
        <div className="lg:sticky lg:top-28">
          <SectionHeading
            accentWord="straight"
            eyebrow="FAQ"
            heading={landingSections.faq.heading}
            intro={faqIntro}
          />
        </div>

        <div className="reveal-on-scroll">
          <Faq />
        </div>
      </div>
    </Section>
  )
}
