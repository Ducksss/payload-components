import type { ComponentType } from 'react'

import { EmbedBasicDemo } from './EmbedBasicDemo'
import { FeatureBentoDemo } from './FeatureBentoDemo'
import { FeatureGridBasicDemo } from './FeatureGridBasicDemo'
import { FeatureSplitDemo } from './FeatureSplitDemo'
import { FeatureStepsDemo } from './FeatureStepsDemo'
import { HeroBasicDemo } from './HeroBasicDemo'

/* Single source of truth mapping a kit slug to its live demo twin. Shared by
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
}

export function hasComponentDemo(slug: string) {
  return slug in demosBySlug
}
