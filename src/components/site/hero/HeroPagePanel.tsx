import { HeroBasicDemo } from '@/components/site/demos/HeroBasicDemo'
import { DemoScaleFrame } from '@/components/site/demos/DemoScaleFrame'
import { heroStage } from '@/lib/site'
import { cn } from '@/utilities/ui'

import { HeroPanelLabel } from './HeroPanelLabel'
import { heroTimeline, spawnStyle } from './motion'

/* Surface 2, center stage: the block rendering on the site. A browser-chrome
 * card where the "before" skeleton yields to the real hero-basic demo twin
 * materializing part by part — the payoff of the run, so it lands last. */
const twinPartDelays = {
  description: heroTimeline.twinStart + 2 * heroTimeline.twinStagger,
  eyebrow: heroTimeline.twinStart,
  links: heroTimeline.twinStart + 3 * heroTimeline.twinStagger,
  proofItems: heroTimeline.twinStart + 4 * heroTimeline.twinStagger,
  title: heroTimeline.twinStart + heroTimeline.twinStagger,
}

export function HeroPagePanel({ className }: { className?: string }) {
  const { page } = heroStage.panels

  return (
    <div className={cn('flex min-w-0 flex-col gap-2.5', className)}>
      <HeroPanelLabel caption={page.caption} step={page.step} surface={page.surface} />

      <div
        aria-hidden="true"
        className="select-none overflow-hidden rounded-2xl border border-border bg-background shadow-card"
      >
        <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-preview-close" />
            <span className="size-2.5 rounded-full bg-preview-minimize" />
            <span className="size-2.5 rounded-full bg-preview-zoom" />
          </span>
          <span className="mx-auto flex min-w-0 items-center rounded-md bg-secondary px-3 py-0.5 font-mono text-[10px] text-muted-foreground">
            acme-site.com
          </span>
          <span className="w-10" />
        </div>

        <div className="relative">
          {/* Layer 1: the "before" skeleton, visible from t=0, fading as the
              install completes. */}
          <div
            className="skeleton-fade absolute inset-0 z-10 grid content-start gap-3 px-5 py-5"
            style={spawnStyle(heroTimeline.skeletonFade)}
          >
            <div className="h-3 w-20 rounded-full bg-foreground/15" />
            <div className="h-7 w-4/5 rounded-full bg-foreground/75" />
            <div className="h-7 w-3/5 rounded-full bg-foreground/20" />
            <div className="flex gap-3 pt-2">
              <div className="h-10 w-28 rounded-full bg-foreground" />
              <div className="h-10 w-28 rounded-full border border-border" />
            </div>
          </div>
          {/* Layer 2: the real hero-basic twin materializing. */}
          <DemoScaleFrame className="h-64 [mask-image:linear-gradient(to_bottom,black_84%,transparent)]">
            <div className="px-4 py-4">
              <HeroBasicDemo partDelays={twinPartDelays} />
            </div>
          </DemoScaleFrame>
        </div>
      </div>

      <p className="truncate font-mono text-[11px] text-muted-foreground">{page.footer}</p>
    </div>
  )
}
