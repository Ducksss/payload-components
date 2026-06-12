import Link from 'next/link'

import { ArrowRight } from 'lucide-react'

import { CatalogIndex } from '@/components/site/CatalogIndex'
import { KitSpecimen } from '@/components/site/KitSpecimen'
import { Section, SectionHeading } from '@/components/site/section'
import { kitsIntro, landingSections } from '@/lib/site'

/* The catalog — the real components rendered live (specimen first, dense
 * index second), no screenshots. */
export function CatalogSection() {
  return (
    <Section id={landingSections.kits.id} className="bg-muted/40">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <SectionHeading
          accentWord="live"
          eyebrow="The catalog"
          heading={landingSections.kits.heading}
          intro={kitsIntro}
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
        <KitSpecimen />
      </div>

      <div className="reveal-on-scroll mt-12">
        <CatalogIndex />
      </div>
    </Section>
  )
}
