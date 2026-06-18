import Link from 'next/link'

import { ArrowRight } from 'lucide-react'

import { CatalogFamilyTeaser } from '@/components/site/CatalogFamilyTeaser'
import { ComponentSpecimen } from '@/components/site/ComponentSpecimen'
import { Section, SectionHeading } from '@/components/site/section'
import { componentsIntro, landingSections } from '@/lib/site'

/* The catalog — the real components rendered live (specimen first, dense
 * index second), no screenshots. */
export function CatalogSection() {
  return (
    <Section id={landingSections.components.id} className="bg-muted/40">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <SectionHeading
          accentWord="live"
          eyebrow="The catalog"
          heading={landingSections.components.heading}
          intro={componentsIntro}
        />
        <Link
          href="/components"
          className="inline-flex h-10 w-fit shrink-0 items-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          Browse the catalog
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="reveal-on-scroll mt-12">
        <ComponentSpecimen />
      </div>

      <div className="reveal-on-scroll mt-12">
        <CatalogFamilyTeaser />
      </div>
    </Section>
  )
}
