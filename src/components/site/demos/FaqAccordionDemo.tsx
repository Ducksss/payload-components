import { Badge } from '@/components/ui/badge'
import { faqAccordionDemoContent, type FaqDemoContent } from '@/lib/demo-content'

import { DemoLink } from './DemoLink'

/* DEMO TWIN of payload-components/source/blocks/FaqAccordion/Component.tsx
 * (faq-accordion@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions — nothing else may diverge:
 *   <section className={cn('container', …)}>  → <div> root (no landmark)
 *   <h2>                                      → <div> (the catalog owns its outline)
 *   shadcn <Accordion>/<AccordionItem>/…      → static <div>s rendered open
 *   CMSLink                                   → <DemoLink> (@/components/Link is consumer-only)
 *   FaqAccordionBlockData                     → FaqDemoContent (@/payload-types is consumer-only)
 * Badge is the same shadcn primitive the component installs — imported real.
 * If the component Component.tsx changes, update this file in the same PR. */

export function FaqAccordionDemo({
  className,
  content = faqAccordionDemoContent,
}: {
  className?: string
  content?: FaqDemoContent
}) {
  const { description, eyebrow, items, links, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-3xl flex-col gap-10">
          <div className="flex flex-col gap-4 text-center">
            {eyebrow ? (
              <Badge
                variant="outline"
                className="mx-auto w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow"
              >
                {eyebrow}
              </Badge>
            ) : null}

            <div className="text-4xl font-medium tracking-display text-balance sm:text-5xl">
              {title}
            </div>

            {description ? (
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
            ) : null}
          </div>

          {items.length > 0 ? (
            <div className="w-full">
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

          {links.length > 0 ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              {links.map(({ link }, index) => (
                <DemoLink key={index} appearance={link.appearance} label={link.label} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
