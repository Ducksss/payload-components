import { Badge } from '@/components/ui/badge'
import { faqSplitDemoContent, type FaqDemoContent } from '@/lib/demo-content'

import { DemoLink } from './DemoLink'

/* DEMO TWIN of payload-components/source/blocks/FaqSplit/Component.tsx
 * (faq-split@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions — nothing else may diverge:
 *   <section className={cn('container', …)}>  → <div> root (no landmark)
 *   <h2>                                      → <div> (the catalog owns its outline)
 *   shadcn <Accordion>/<AccordionItem>/…      → static <div>s rendered open
 *   CMSLink                                   → <DemoLink> (@/components/Link is consumer-only)
 *   FaqSplitBlockData                         → FaqDemoContent (@/payload-types is consumer-only)
 * Badge is the same shadcn primitive the component installs — imported real.
 * If the component Component.tsx changes, update this file in the same PR. */

export function FaqSplitDemo({
  className,
  content = faqSplitDemoContent,
}: {
  className?: string
  content?: FaqDemoContent
}) {
  const { description, eyebrow, items, links, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-5 md:gap-12">
          <div className="flex flex-col gap-4 md:col-span-2">
            {eyebrow ? (
              <Badge
                variant="outline"
                className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow"
              >
                {eyebrow}
              </Badge>
            ) : null}

            <div className="text-4xl font-medium tracking-display text-balance">{title}</div>

            {description ? (
              <p className="text-base leading-7 text-muted-foreground">{description}</p>
            ) : null}

            {links.length > 0 ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                {links.map(({ link }, index) => (
                  <DemoLink key={index} appearance={link.appearance} label={link.label} />
                ))}
              </div>
            ) : null}
          </div>

          {items.length > 0 ? (
            <div className="w-full md:col-span-3">
              {items.map((item, index) => (
                <div className="border-border/70 border-b py-4" key={index}>
                  <div className="text-left text-base tracking-title hover:no-underline">
                    {item.question}
                  </div>
                  <div className="mt-3 text-sm leading-7 text-muted-foreground">{item.answer}</div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
