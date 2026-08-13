import { footerCenteredDemoContent, type FooterDemoContent } from '@/lib/demo-content'

/* DEMO TWIN of payload-components/source/blocks/FooterCentered/Component.tsx
 * (footer-centered@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions — nothing else may diverge:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <nav aria-label>                         → <div> (aria-hidden twins hold no landmarks)
 *   <a href> link                            → <div> (aria-hidden twins hold no focusable elements)
 *   <Media> upload                           → the block's own brandLabel branch
 *   FooterCenteredBlockData                  → FooterDemoContent (@/payload-types is consumer-only)
 *   cn() inner wrapper                       → fixed max-width div
 * If the component Component.tsx changes, update this file in the same PR. */

export function FooterCenteredDemo({
  className,
  content = footerCenteredDemoContent,
}: {
  className?: string
  content?: FooterDemoContent
}) {
  const { brandLabel, copyright, legalLinks, links, tagline } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-3xl flex-col gap-10">
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="text-lg font-medium tracking-title text-foreground">{brandLabel}</span>

            {tagline ? (
              <p className="max-w-md text-sm leading-6 text-muted-foreground">{tagline}</p>
            ) : null}
          </div>

          <div>
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3" role="list">
              {links?.map((link, index) => (
                <li key={`${link.label}-${index}`}>
                  <div className="text-sm leading-6 text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col-reverse items-center gap-4 border-t border-border/70 pt-8 sm:flex-row sm:justify-between">
            <p className="text-sm text-muted-foreground">{copyright}</p>

            {legalLinks && legalLinks.length > 0 ? (
              <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3" role="list">
                {legalLinks.map((link, index) => (
                  <li key={`${link.label}-${index}`}>
                    <div className="text-sm leading-6 text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
