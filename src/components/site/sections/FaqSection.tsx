import { Faq } from '@/components/site/Faq'
import { Section, SectionHeading } from '@/components/site/section'
import { faqIntro, landingSections } from '@/lib/site'

export function FaqSection() {
  return (
    <Section id={landingSections.faq.id}>
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          accentWord="straight"
          eyebrow="FAQ"
          heading={landingSections.faq.heading}
          intro={faqIntro}
        />

        <div className="reveal-on-scroll mt-10">
          <Faq />
        </div>
      </div>
    </Section>
  )
}
