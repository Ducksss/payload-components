import { DemoFitFrame } from '@/components/site/demos/DemoFitFrame'
import { demosBySlug } from '@/components/site/demos/registry'

/* Live preview strip for the catalog masonry cards: the same demo twins the
 * landing renders, dropped into DemoFitFrame so each shows at its *natural*
 * height (the wall's variable-size rhythm comes from here). A generous max
 * height + a whisper-thin bottom fade tames the few tall twins (hero, the
 * 3x2 feature grid) without making the short ones look clipped. Twins default
 * their own sample content and are already aria-hidden + pointer-events-none.
 * Slugs without a twin render nothing — ComponentCard falls back to a plain
 * body. */

export function ComponentPreviewThumb({ slug }: { slug: string }) {
  const Demo = demosBySlug[slug]

  if (!Demo) return null

  return (
    <div className="relative overflow-hidden border-b border-border bg-muted/40">
      {/* zoom-based frame self-sizes to the twin; the hover lift rides on the
          frame's transform and is reduced-motion safe. */}
      <DemoFitFrame className="max-h-[26rem] transition-transform duration-500 ease-out [mask-image:linear-gradient(to_bottom,black_93%,transparent)] group-hover:scale-[1.01] motion-reduce:transform-none motion-reduce:transition-none">
        <div className="px-4 py-4">
          <Demo />
        </div>
      </DemoFitFrame>
      <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/90 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground backdrop-blur">
        <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
        Live preview
      </span>
    </div>
  )
}
