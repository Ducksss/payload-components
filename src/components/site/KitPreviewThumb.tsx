import type { ComponentType } from 'react'

import { DemoScaleFrame } from '@/components/site/demos/DemoScaleFrame'
import { FeatureGridBasicDemo } from '@/components/site/demos/FeatureGridBasicDemo'
import { HeroBasicDemo } from '@/components/site/demos/HeroBasicDemo'

/* Live preview strip for the catalog cards: the same demo twins the
 * landing renders, dropped into a fixed-height window via DemoScaleFrame
 * so the kit shows at its real desktop type ramp. Both twins default
 * their own sample content and are already aria-hidden +
 * pointer-events-none (the frame reinforces both). Slugs without a twin
 * render nothing — KitCard falls back to a plain body. */
const demosBySlug: Record<string, ComponentType> = {
  'feature-grid-basic': FeatureGridBasicDemo,
  'hero-basic': HeroBasicDemo,
}

export function hasKitDemo(slug: string) {
  return slug in demosBySlug
}

export function KitPreviewThumb({ slug }: { slug: string }) {
  const Demo = demosBySlug[slug]

  if (!Demo) return null

  return (
    <div className="relative border-b border-border bg-muted/40">
      {/* Height + bottom fade live on the frame (dev's DemoScaleFrame
          idiom); the pill sits outside it so the mask never touches it. */}
      <DemoScaleFrame className="h-44 [mask-image:linear-gradient(to_bottom,black_70%,transparent)]">
        <div className="px-4 py-4">
          <Demo />
        </div>
      </DemoScaleFrame>
      <span className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
        Live preview
      </span>
    </div>
  )
}
