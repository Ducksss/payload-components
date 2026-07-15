import type { ComponentType } from 'react'

import { CallToActionCenteredDemo } from './CallToActionCenteredDemo'
import { ComparatorGridDemo } from './ComparatorGridDemo'
import { ContentShowcaseDemo } from './ContentShowcaseDemo'
import { EmbedBasicDemo } from './EmbedBasicDemo'
import { FeatureBentoDemo } from './FeatureBentoDemo'
import { HeroBasicDemo } from './HeroBasicDemo'
import { IntegrationOrbitDemo } from './IntegrationOrbitDemo'
import { LogoCloudMarqueeDemo } from './LogoCloudMarqueeDemo'
import { PricingCardsDemo } from './PricingCardsDemo'
import { TeamGridDemo } from './TeamGridDemo'
import { TestimonialsGridDemo } from './TestimonialsGridDemo'

/* The landing page only needs one representative demo per family. Keeping this
 * list separate from the full catalog registry prevents every demo twin from
 * joining the homepage's deferred bundle. The complete registry remains the
 * source for /components and component documentation. */
export const landingDemosBySlug: Record<string, ComponentType> = {
  'call-to-action-centered': CallToActionCenteredDemo,
  'comparator-grid': ComparatorGridDemo,
  'content-showcase': ContentShowcaseDemo,
  'embed-basic': EmbedBasicDemo,
  'feature-bento': FeatureBentoDemo,
  'hero-basic': HeroBasicDemo,
  'integration-orbit': IntegrationOrbitDemo,
  'logo-cloud-marquee': LogoCloudMarqueeDemo,
  'pricing-cards': PricingCardsDemo,
  'team-grid': TeamGridDemo,
  'testimonials-grid': TestimonialsGridDemo,
}
