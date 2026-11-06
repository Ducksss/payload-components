import type { ReactNode } from 'react'

import Link from '@/i18n/Link'

import { DemoFitFrame } from '@/components/site/demos/DemoFitFrame'
import { demosBySlug } from '@/components/site/demos/registry'
import { familyOfSlug } from '@/lib/component-page-tree'
import { componentEntries } from '@/lib/site'
import { cn } from '@/utilities/ui'

/* Backs <ComponentFamily slug="…" /> — the sibling variants in this component's family
 * (same taxonomy as the sidebar grouping), each with a live thumbnail of its demo
 * twin so readers can pick a layout by eye. The current variant is a plain card,
 * not a link. Renders nothing for a family of one. */

const card = 'flex flex-col overflow-hidden rounded-lg border bg-background'

function Thumbnail({ slug }: { slug: string }) {
  const Demo = demosBySlug[slug]

  if (!Demo) return null

  /* DemoFitFrame is aria-hidden, pointer-events-none and preview-scope; the
     natural-height twin is clamped at 11rem with a bottom fade. */
  return (
    <div className="border-b border-border bg-muted/40">
      <DemoFitFrame className="max-h-44 [mask-image:linear-gradient(to_bottom,black_70%,transparent)]">
        <div className="p-4">
          <Demo />
        </div>
      </DemoFitFrame>
    </div>
  )
}

function CardBody({
  description,
  tag,
  title,
  titleId,
}: {
  description: string
  tag?: ReactNode
  title: string
  titleId: string
}) {
  return (
    <div className="flex flex-col gap-1 p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-medium leading-6 text-foreground" id={titleId}>
          {title}
        </span>
        {tag}
      </div>
      <span className="line-clamp-2 text-sm leading-6 text-muted-foreground">{description}</span>
    </div>
  )
}

export function ComponentFamily({ slug }: { slug: string }) {
  const familyKey = familyOfSlug(slug).key
  const siblings = componentEntries.filter(
    (component) => familyOfSlug(component.slug).key === familyKey,
  )

  if (siblings.length <= 1) return null

  return (
    <div className="not-prose grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
      {siblings.map((component) => {
        const titleId = `family-${component.slug}`

        if (component.slug === slug) {
          return (
            <div className={cn(card, 'border-brand')} key={component.slug}>
              <Thumbnail slug={component.slug} />
              <CardBody
                description={component.description}
                tag={
                  <span className="shrink-0 rounded-md border border-brand/30 bg-brand-50 px-1.5 font-mono text-xs uppercase leading-5 tracking-eyebrow text-brand-600">
                    Current
                  </span>
                }
                title={component.title}
                titleId={titleId}
              />
            </div>
          )
        }

        return (
          <Link
            aria-labelledby={titleId}
            className={cn(
              card,
              'border-border transition-colors duration-200 ease-out hover:border-foreground/20',
            )}
            href={component.href}
            key={component.slug}
          >
            <Thumbnail slug={component.slug} />
            <CardBody
              description={component.description}
              title={component.title}
              titleId={titleId}
            />
          </Link>
        )
      })}
    </div>
  )
}
