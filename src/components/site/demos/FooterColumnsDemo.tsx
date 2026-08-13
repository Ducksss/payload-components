import { footerColumnsDemoContent, type FooterDemoContent } from '@/lib/demo-content'

/* DEMO TWIN of payload-components/source/blocks/FooterColumns/Component.tsx
 * (footer-columns@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions — nothing else may diverge:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <nav aria-label>                         → <div> (aria-hidden twins hold no landmarks)
 *   <a href> link                            → <div> (aria-hidden twins hold no focusable elements)
 *   <Media> upload                           → the block's own brandLabel branch
 *   FooterColumnsBlockData                   → FooterDemoContent (@/payload-types is consumer-only)
 *   cn() inner wrapper                       → fixed max-width div
 * If the component Component.tsx changes, update this file in the same PR. */

export function FooterColumnsDemo({
  className,
  content = footerColumnsDemoContent,
}: {
  className?: string
  content?: FooterDemoContent
}) {
  const { brandLabel, copyright, groups, tagline } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-5xl flex-col gap-12">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-4">
              <span className="text-lg font-medium tracking-title text-foreground">
                {brandLabel}
              </span>

              {tagline ? (
                <p className="max-w-xs text-sm leading-6 text-muted-foreground">{tagline}</p>
              ) : null}
            </div>

            {groups && groups.length > 0
              ? groups.map((group, index) => (
                  <div className="flex flex-col gap-4" key={`${group.name}-${index}`}>
                    <span className="text-sm font-medium text-foreground">{group.name}</span>

                    <ul className="flex flex-col gap-3" role="list">
                      {group.links.map((link, linkIndex) => (
                        <li key={`${link.label}-${linkIndex}`}>
                          <div className="text-sm leading-6 text-muted-foreground transition-colors hover:text-foreground">
                            {link.label}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              : null}
          </div>

          <p className="border-t border-border/70 pt-8 text-sm text-muted-foreground">
            {copyright}
          </p>
        </div>
      </div>
    </div>
  )
}
