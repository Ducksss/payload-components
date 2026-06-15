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
import { homeStructuredData, toJsonLd } from '@/lib/site'

/* Landing arc: claim → stack → the tax (problem) → how it works → the wiring
 * proof → the catalog live → questions → open-source close. */
export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(homeStructuredData) }}
      />
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
