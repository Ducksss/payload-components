import type { ComponentType } from 'react'

import { CallToActionBoxedDemo } from './CallToActionBoxedDemo'
import { CallToActionCenteredDemo } from './CallToActionCenteredDemo'
import { CallToActionSignupDemo } from './CallToActionSignupDemo'
import { CallToActionSplitDemo } from './CallToActionSplitDemo'
import { ComparatorGridDemo } from './ComparatorGridDemo'
import { ComparatorStackDemo } from './ComparatorStackDemo'
import { ComparatorTableDemo } from './ComparatorTableDemo'
import { ContactChannelsDemo } from './ContactChannelsDemo'
import { ContactRoutingFormDemo } from './ContactRoutingFormDemo'
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
import { FeatureAccordionDemo } from './FeatureAccordionDemo'
import { FeatureBentoDemo } from './FeatureBentoDemo'
import { FeatureCardsMediaDemo } from './FeatureCardsMediaDemo'
import { FeatureGridBasicDemo } from './FeatureGridBasicDemo'
import { FeatureIconGridDemo } from './FeatureIconGridDemo'
import { FeatureSplitDemo } from './FeatureSplitDemo'
import { FeatureStepsDemo } from './FeatureStepsDemo'
import { HeroAuroraDemo } from './HeroAuroraDemo'
import { HeroBasicDemo } from './HeroBasicDemo'
import { HeroKineticDemo } from './HeroKineticDemo'
import { HeroProductTiltDemo } from './HeroProductTiltDemo'
import { HeroVideoDemo } from './HeroVideoDemo'
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
import { StatsGridDemo } from './StatsGridDemo'
import { StatsProofDemo } from './StatsProofDemo'
import { TeamBiosDemo } from './TeamBiosDemo'
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
  'call-to-action-split': CallToActionSplitDemo,
  'comparator-grid': ComparatorGridDemo,
  'comparator-stack': ComparatorStackDemo,
  'comparator-table': ComparatorTableDemo,
  'contact-channels': ContactChannelsDemo,
  'contact-routing-form': ContactRoutingFormDemo,
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
  'feature-accordion': FeatureAccordionDemo,
  'feature-bento': FeatureBentoDemo,
  'feature-cards-media': FeatureCardsMediaDemo,
  'feature-grid-basic': FeatureGridBasicDemo,
  'feature-icon-grid': FeatureIconGridDemo,
  'feature-split': FeatureSplitDemo,
  'feature-steps': FeatureStepsDemo,
  'hero-aurora': HeroAuroraDemo,
  'hero-basic': HeroBasicDemo,
  'hero-kinetic': HeroKineticDemo,
  'hero-product-tilt': HeroProductTiltDemo,
  'hero-video': HeroVideoDemo,
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
  'stats-grid': StatsGridDemo,
  'stats-proof': StatsProofDemo,
  'team-roster': TeamRosterDemo,
  'team-bios': TeamBiosDemo,
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
