import type { ComponentType } from 'react'

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

/* Single source of truth mapping a component slug to its live demo twin. Shared by
 * the catalog preview thumbnails (ComponentPreviewThumb) and the docs-page live
 * render (ComponentDocPreview / the <ComponentPreview> MDX component) so the two surfaces
 * never drift. Every twin defaults its own sample content and is already
 * aria-hidden + presentational. Slugs without a twin render nothing. */
export const demosBySlug: Record<string, ComponentType> = {
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
}

export function hasComponentDemo(slug: string) {
  return slug in demosBySlug
}
