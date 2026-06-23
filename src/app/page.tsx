import type { Metadata } from 'next'

import { JsonLd } from '@/components/seo/JsonLd'
import { ParallaxController } from '@/components/site/ParallaxController'
import { CatalogSection } from '@/components/site/sections/CatalogSection'
import { CommunityCta } from '@/components/site/sections/CommunityCta'
import { FaqSection } from '@/components/site/sections/FaqSection'
import { HeroSection } from '@/components/site/sections/HeroSection'
import { InstallProofSection } from '@/components/site/sections/InstallProofSection'
import { StackBand } from '@/components/site/sections/StackBand'
import { WiringSection } from '@/components/site/sections/WiringSection'
import { WorkflowSection } from '@/components/site/sections/WorkflowSection'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { faqNode, graph, softwareApplicationNode } from '@/lib/structured-data'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

/* SoftwareApplication answers "what is Payload Components" for AI engines; FAQPage
   mirrors the on-page FAQ (both read from faqEntries) for rich results. */
const homeStructuredData = graph(softwareApplicationNode(), faqNode())

/* Landing arc: claim → stack → the install boundary (problem + proof) → how it
 * works → the catalog live → questions → open-source close. */
export default function HomePage() {
  return (
    <>
      <JsonLd data={homeStructuredData} />
      <ParallaxController />
      <SiteHeader />

      <main className="flex-1">
        <HeroSection />
        <StackBand />
        <InstallProofSection />
        <WiringSection />
        <WorkflowSection />
        <CatalogSection />
        <FaqSection />
        <CommunityCta />
      </main>

      <SiteFooter />
    </>
  )
}
