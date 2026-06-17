import Link from 'next/link'

import { familyOfSlug } from '@/lib/component-page-tree'
import { componentEntries } from '@/lib/site'
import { cn } from '@/utilities/ui'

/* Backs <ComponentFamily slug="…" /> — the sibling variants in this kit's family
 * (same taxonomy as the sidebar grouping), so readers can pick the right layout.
 * Renders nothing for a family of one. */
export function ComponentFamily({ slug }: { slug: string }) {
  const familyKey = familyOfSlug(slug).key
  const siblings = componentEntries.filter((kit) => familyOfSlug(kit.slug).key === familyKey)

  if (siblings.length <= 1) return null

  return (
    <div className="not-prose my-6 grid gap-3 sm:grid-cols-2">
      {siblings.map((kit) => {
        const current = kit.slug === slug

        return (
          <Link
            key={kit.slug}
            href={kit.href}
            aria-current={current ? 'page' : undefined}
            className={cn(
              'flex flex-col gap-1 rounded-lg border p-4 transition-colors',
              current
                ? 'border-brand/40 bg-brand/5'
                : 'border-border bg-background hover:border-foreground/20 hover:bg-muted/40',
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <code className="font-mono text-[13px] font-medium text-brand">{kit.slug}</code>
              {current ? (
                <span className="shrink-0 rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-brand">
                  current
                </span>
              ) : null}
            </div>
            <span className="text-sm font-semibold tracking-tight text-foreground">{kit.title}</span>
            <span className="text-sm leading-6 text-muted-foreground">{kit.description}</span>
          </Link>
        )
      })}
    </div>
  )
}
