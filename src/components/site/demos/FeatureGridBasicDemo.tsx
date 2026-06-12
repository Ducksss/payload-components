import type { ReactNode } from 'react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  featureGridBasicDemoContent,
  type FeatureGridBasicDemoContent,
} from '@/lib/demo-content'
import { cn } from '@/utilities/ui'

import { DemoLink } from './DemoLink'

/* DEMO TWIN of payload-kits/source/blocks/FeatureGridBasic/Component.tsx
 * (feature-grid-basic@0.1.0). Class strings are copied verbatim from the
 * kit source, in source order. Deliberate substitutions — nothing else
 * may diverge:
 *   <section className="container"> → <div> root (frames own spacing; no landmark)
 *   <h2>                            → <div> (role-neutral; the landing owns its heading outline)
 *   CMSLink                         → <DemoLink> (@/components/Link exists only in consumer repos)
 *   FeatureGridBasicBlockData       → FeatureGridBasicDemoContent (@/payload-types exists only in consumer repos)
 *   overflow-hidden                 → overflow-visible in annotate mode (gutter labels project past the shell)
 * Badge/Card are the same shadcn primitives the kit installs — imported real.
 * If the kit Component.tsx changes, update this file in the same PR. */

/* Technical-drawing leader line: mono field label + hairline + emerald
 * dot, projected into the gutter reserved by KitSpecimen (xl:pl-44).
 * Hidden below xl; the specimen figcaption carries the labels instead. */
function FieldAnnotation({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="relative">
      {children}
      <span className="absolute right-[calc(100%+1.25rem)] top-[0.4em] hidden items-center gap-2 whitespace-nowrap xl:flex">
        <span className="font-mono text-[11px] tracking-tight text-muted-foreground">{label}</span>
        <span className="h-px w-10 bg-foreground/25" />
        <span className="size-1 rounded-full bg-brand" />
      </span>
    </div>
  )
}

export function FeatureGridBasicDemo({
  annotate = false,
  className,
  content = featureGridBasicDemoContent,
}: {
  /* Annotate mode wraps each field in a leader-line label naming the
     block-config field that renders it — used by KitSpecimen. */
  annotate?: boolean
  className?: string
  content?: FeatureGridBasicDemoContent
}) {
  const { description, eyebrow, items, links, title } = content

  const field = (label: string, node: ReactNode) =>
    annotate ? <FieldAnnotation label={label}>{node}</FieldAnnotation> : node

  return (
    <div aria-hidden="true" className={className}>
      <div
        className={cn(
          'rounded-[2rem] border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14',
          annotate ? 'overflow-visible' : 'overflow-hidden',
        )}
      >
        <div className="mx-auto flex max-w-5xl flex-col gap-8">
          <div className="flex max-w-3xl flex-col gap-4">
            {eyebrow
              ? field(
                  'eyebrow',
                  <Badge
                    variant="outline"
                    className="w-fit rounded-full px-3 py-1 uppercase tracking-[0.18em]"
                  >
                    {eyebrow}
                  </Badge>,
                )
              : null}

            {field(
              'title',
              <div className="text-4xl font-medium tracking-[-0.06em] text-balance sm:text-5xl">
                {title}
              </div>,
            )}

            {description
              ? field(
                  'description',
                  <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                    {description}
                  </p>,
                )
              : null}
          </div>

          {items.length > 0
            ? field(
                'items[] · 3–6',
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {items.map((item, index) => (
                    <Card
                      key={`${item.title}-${index}`}
                      className="border-border/70 bg-background/85 shadow-none"
                    >
                      <CardHeader className="gap-3 p-5">
                        <CardTitle className="text-xl tracking-[-0.04em]">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-5 pt-0">
                        <CardDescription className="text-sm leading-7 text-muted-foreground">
                          {item.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>,
              )
            : null}

          {links.length > 0
            ? field(
                'links[]',
                <div className="flex flex-col gap-3 sm:flex-row">
                  {links.map(({ link }, index) => (
                    <DemoLink key={index} appearance={link.appearance} label={link.label} />
                  ))}
                </div>,
              )
            : null}
        </div>
      </div>
    </div>
  )
}
