import { footerSimpleDemoContent, type FooterDemoContent } from '@/lib/demo-content'

/* DEMO TWIN of payload-components/source/blocks/FooterSimple/Component.tsx
 * (footer-simple@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions — nothing else may diverge:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <nav aria-label>                         → <div> (aria-hidden twins hold no landmarks)
 *   <a href> link                            → <div> (aria-hidden twins hold no focusable elements)
 *   <Media> upload                           → the block's own brandLabel branch
 *   FooterSimpleBlockData                    → FooterDemoContent (@/payload-types is consumer-only)
 *   cn() inner wrapper                       → fixed max-width div
 * If the component Component.tsx changes, update this file in the same PR. */

export function FooterSimpleDemo({
  className,
  content = footerSimpleDemoContent,
}: {
  className?: string
  content?: FooterDemoContent
}) {
  const { brandLabel, copyright, links } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-5xl flex-col gap-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <span className="text-lg font-medium tracking-title text-foreground">{brandLabel}</span>

            <div>
              <ul className="flex flex-wrap gap-x-6 gap-y-3" role="list">
                {links?.map((link, index) => (
                  <li key={`${link.label}-${index}`}>
                    <div className="text-sm leading-6 text-muted-foreground transition-colors hover:text-foreground">
                      {link.label}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="border-t border-border/70 pt-6 text-sm text-muted-foreground">
            {copyright}
          </p>
        </div>
      </div>
    </div>
  )
}
