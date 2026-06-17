import { embedBasicDemoContent, type EmbedBasicDemoContent } from '@/lib/demo-content'
import { cn } from '@/utilities/ui'

/* DEMO TWIN of payload-components/source/blocks/EmbedBasic/Component.tsx
 * (embed-basic@0.1.0). Class strings are copied verbatim from the kit
 * source, in source order. Deliberate substitutions — nothing else may
 * diverge:
 *   <section className="container"> → <div> root (frames own spacing; no landmark)
 *   <iframe>                        → <div> faux player (no third-party frame loads on the catalog)
 *   <figcaption>                    → <div> (role-neutral)
 *   EmbedBasicBlockData             → EmbedBasicDemoContent (@/payload-types is consumer-only)
 * The kit root's cn('container') and the cn() aspect wrapper are skipped
 * by the twin class-mirror check by construction.
 * If the kit Component.tsx changes, update this file in the same PR. */

const aspectClassByRatio: Record<EmbedBasicDemoContent['aspectRatio'], string> = {
  '16:9': 'aspect-video',
  '4:3': 'aspect-[4/3]',
  '1:1': 'aspect-square',
  '21:9': 'aspect-[21/9]',
}

export function EmbedBasicDemo({
  className,
  content = embedBasicDemoContent,
}: {
  className?: string
  content?: EmbedBasicDemoContent
}) {
  const { aspectRatio, caption } = content
  const aspectClass = aspectClassByRatio[aspectRatio] ?? aspectClassByRatio['16:9']

  return (
    <div aria-hidden="true" className={className}>
      <figure className="overflow-hidden rounded-[2rem] border border-border/70 bg-card/35">
        <div className={cn('relative w-full bg-muted', aspectClass)}>
          <div className="absolute inset-0 h-full w-full border-0">
            {/* Faux player surface — stands in for the real iframe, which
                must never load a third-party frame on the catalog. */}
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-muted to-card">
              <span className="flex size-14 items-center justify-center rounded-full bg-background/80 shadow-sm ring-1 ring-border">
                <svg
                  className="size-6 translate-x-0.5 text-foreground"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        {caption ? (
          <div className="px-6 py-4 text-sm text-muted-foreground">{caption}</div>
        ) : null}
      </figure>
    </div>
  )
}
