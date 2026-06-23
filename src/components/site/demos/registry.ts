import type { ComponentType } from 'react'

import { CallToActionBoxedDemo } from './CallToActionBoxedDemo'
import { CallToActionCenteredDemo } from './CallToActionCenteredDemo'
import { CallToActionSignupDemo } from './CallToActionSignupDemo'
import { ComparatorGridDemo } from './ComparatorGridDemo'
import { ComparatorStackDemo } from './ComparatorStackDemo'
import { ComparatorTableDemo } from './ComparatorTableDemo'
import { ContentColumnsDemo } from './ContentColumnsDemo'
import { ContentCommunityDemo } from './ContentCommunityDemo'
import { ContentFeatureMediaDemo } from './ContentFeatureMediaDemo'
import { ContentFeatureSplitDemo } from './ContentFeatureSplitDemo'
import { ContentImageFrameDemo } from './ContentImageFrameDemo'
import { ContentImageLeadDemo } from './ContentImageLeadDemo'
import { ContentListDemo } from './ContentListDemo'
import { ContentListColumnsDemo } from './ContentListColumnsDemo'
import { ContentListIconsDemo } from './ContentListIconsDemo'
import { ContentQuoteDemo } from './ContentQuoteDemo'
import { ContentRowsDemo } from './ContentRowsDemo'
import { ContentShowcaseDemo } from './ContentShowcaseDemo'
import { ContentSplitRowsDemo } from './ContentSplitRowsDemo'
import { ContentStatsDemo } from './ContentStatsDemo'
import { EmbedBasicDemo } from './EmbedBasicDemo'
import { FaqAccordionDemo } from './FaqAccordionDemo'
import { FaqCardDemo } from './FaqCardDemo'
import { FaqGridDemo } from './FaqGridDemo'
import { FaqGroupedDemo } from './FaqGroupedDemo'
import { FaqIconsDemo } from './FaqIconsDemo'
import { FaqSplitDemo } from './FaqSplitDemo'
import { FeatureBentoDemo } from './FeatureBentoDemo'
import { FeatureGridBasicDemo } from './FeatureGridBasicDemo'
import { FeatureSplitDemo } from './FeatureSplitDemo'
import { FeatureStepsDemo } from './FeatureStepsDemo'
import { HeroBasicDemo } from './HeroBasicDemo'
import { IntegrationClusterDemo } from './IntegrationClusterDemo'
import { IntegrationConnectDemo } from './IntegrationConnectDemo'
import { IntegrationGridDemo } from './IntegrationGridDemo'
import { IntegrationListDemo } from './IntegrationListDemo'
import { IntegrationMarqueeDemo } from './IntegrationMarqueeDemo'
import { IntegrationOrbitDemo } from './IntegrationOrbitDemo'
import { IntegrationSplitDemo } from './IntegrationSplitDemo'
import { IntegrationTestimonialDemo } from './IntegrationTestimonialDemo'
import { LogoCloudGridDemo } from './LogoCloudGridDemo'
import { LogoCloudHoverDemo } from './LogoCloudHoverDemo'
import { LogoCloudInlineDemo } from './LogoCloudInlineDemo'
import { LogoCloudInlineWrapDemo } from './LogoCloudInlineWrapDemo'
import { LogoCloudMarqueeDemo } from './LogoCloudMarqueeDemo'
import { PricingCardsDemo } from './PricingCardsDemo'
import { PricingCardsCtaDemo } from './PricingCardsCtaDemo'
import { PricingCardsMutedDemo } from './PricingCardsMutedDemo'
import { PricingEnterpriseDemo } from './PricingEnterpriseDemo'
import { PricingSplitDemo } from './PricingSplitDemo'
import { TeamGridDemo } from './TeamGridDemo'
import { TeamRosterDemo } from './TeamRosterDemo'
import { TestimonialsBentoDemo } from './TestimonialsBentoDemo'
import { TestimonialsGridDemo } from './TestimonialsGridDemo'
import { TestimonialsQuoteDemo } from './TestimonialsQuoteDemo'
import { TestimonialsRatingDemo } from './TestimonialsRatingDemo'
import { TestimonialsSpotlightDemo } from './TestimonialsSpotlightDemo'
import { TestimonialsWallDemo } from './TestimonialsWallDemo'

/* Single source of truth mapping a component slug to its live demo twin. Shared by
 * the catalog preview thumbnails (ComponentPreviewThumb) and the docs-page live
 * render (ComponentDocPreview / the <ComponentPreview> MDX component) so the two surfaces
 * never drift. Every twin defaults its own sample content and is already
 * aria-hidden + presentational. Slugs without a twin render nothing. */
export const demosBySlug: Record<string, ComponentType> = {
  'call-to-action-boxed': CallToActionBoxedDemo,
  'call-to-action-centered': CallToActionCenteredDemo,
  'call-to-action-signup': CallToActionSignupDemo,
  'comparator-grid': ComparatorGridDemo,
  'comparator-stack': ComparatorStackDemo,
  'comparator-table': ComparatorTableDemo,
  'content-columns': ContentColumnsDemo,
  'content-community': ContentCommunityDemo,
  'content-feature-media': ContentFeatureMediaDemo,
  'content-feature-split': ContentFeatureSplitDemo,
  'content-image-frame': ContentImageFrameDemo,
  'content-image-lead': ContentImageLeadDemo,
  'content-list': ContentListDemo,
  'content-list-columns': ContentListColumnsDemo,
  'content-list-icons': ContentListIconsDemo,
  'content-quote': ContentQuoteDemo,
  'content-rows': ContentRowsDemo,
  'content-showcase': ContentShowcaseDemo,
  'content-split-rows': ContentSplitRowsDemo,
  'content-stats': ContentStatsDemo,
  'embed-basic': EmbedBasicDemo,
  'faq-accordion': FaqAccordionDemo,
  'faq-card': FaqCardDemo,
  'faq-grid': FaqGridDemo,
  'faq-grouped': FaqGroupedDemo,
  'faq-icons': FaqIconsDemo,
  'faq-split': FaqSplitDemo,
  'feature-bento': FeatureBentoDemo,
  'feature-grid-basic': FeatureGridBasicDemo,
  'feature-split': FeatureSplitDemo,
  'feature-steps': FeatureStepsDemo,
  'hero-basic': HeroBasicDemo,
  'integration-cluster': IntegrationClusterDemo,
  'integration-connect': IntegrationConnectDemo,
  'integration-grid': IntegrationGridDemo,
  'integration-list': IntegrationListDemo,
  'integration-marquee': IntegrationMarqueeDemo,
  'integration-orbit': IntegrationOrbitDemo,
  'integration-split': IntegrationSplitDemo,
  'integration-testimonial': IntegrationTestimonialDemo,
  'logo-cloud-grid': LogoCloudGridDemo,
  'logo-cloud-hover': LogoCloudHoverDemo,
  'logo-cloud-inline': LogoCloudInlineDemo,
  'logo-cloud-inline-wrap': LogoCloudInlineWrapDemo,
  'logo-cloud-marquee': LogoCloudMarqueeDemo,
  'pricing-cards': PricingCardsDemo,
  'pricing-cards-cta': PricingCardsCtaDemo,
  'pricing-cards-muted': PricingCardsMutedDemo,
  'pricing-enterprise': PricingEnterpriseDemo,
  'pricing-split': PricingSplitDemo,
  'team-roster': TeamRosterDemo,
  'team-grid': TeamGridDemo,
  'testimonials-quote': TestimonialsQuoteDemo,
  'testimonials-spotlight': TestimonialsSpotlightDemo,
  'testimonials-grid': TestimonialsGridDemo,
  'testimonials-rating': TestimonialsRatingDemo,
  'testimonials-bento': TestimonialsBentoDemo,
  'testimonials-wall': TestimonialsWallDemo,
}

export function hasComponentDemo(slug: string) {
  return slug in demosBySlug
}
