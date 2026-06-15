import type { Metadata } from 'next'

import { JsonLd } from '@/components/seo/JsonLd'
import { CatalogSection } from '@/components/site/sections/CatalogSection'
import { CommunityCta } from '@/components/site/sections/CommunityCta'
import { FaqSection } from '@/components/site/sections/FaqSection'
import { HeroSection } from '@/components/site/sections/HeroSection'
import { StackBand } from '@/components/site/sections/StackBand'
import { TaxSection } from '@/components/site/sections/TaxSection'
import { WiringSection } from '@/components/site/sections/WiringSection'
import { WorkflowSection } from '@/components/site/sections/WorkflowSection'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { faqNode, graph, softwareApplicationNode } from '@/lib/structured-data'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

/* SoftwareApplication answers "what is Payload Kits" for AI engines; FAQPage
   mirrors the on-page FAQ (both read from faqEntries) for rich results. */
const homeStructuredData = graph(softwareApplicationNode(), faqNode())

/* Landing arc: claim → stack → the tax (problem) → how it works → the wiring
 * proof → the catalog live → questions → open-source close. */
export default function HomePage() {
  return (
    <>
      <JsonLd data={homeStructuredData} />
      <SiteHeader />

      <main className="flex-1">
        <HeroSection />
        <StackBand />
        <TaxSection />
        <WorkflowSection />
        <WiringSection />
        <CatalogSection />
        <FaqSection />
        <CommunityCta />
      </main>

      <SiteFooter />
    </>
  )
}
