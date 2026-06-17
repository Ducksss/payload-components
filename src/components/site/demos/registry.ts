import type { ComponentType } from 'react'

import { EmbedBasicDemo } from './EmbedBasicDemo'
import { FeatureBentoDemo } from './FeatureBentoDemo'
import { FeatureGridBasicDemo } from './FeatureGridBasicDemo'
import { FeatureSplitDemo } from './FeatureSplitDemo'
import { FeatureStepsDemo } from './FeatureStepsDemo'
import { HeroBasicDemo } from './HeroBasicDemo'
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
  'embed-basic': EmbedBasicDemo,
  'feature-bento': FeatureBentoDemo,
  'feature-grid-basic': FeatureGridBasicDemo,
  'feature-split': FeatureSplitDemo,
  'feature-steps': FeatureStepsDemo,
  'hero-basic': HeroBasicDemo,
  'logo-cloud-grid': LogoCloudGridDemo,
  'logo-cloud-hover': LogoCloudHoverDemo,
  'logo-cloud-inline': LogoCloudInlineDemo,
  'logo-cloud-inline-wrap': LogoCloudInlineWrapDemo,
  'logo-cloud-marquee': LogoCloudMarqueeDemo,
}

export function hasComponentDemo(slug: string) {
  return slug in demosBySlug
}
