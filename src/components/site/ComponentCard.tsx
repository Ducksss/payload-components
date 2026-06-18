import Link from 'next/link'

import { CommandCopyButton } from '@/components/site/CommandCopyButton'
import { ComponentPreviewThumb } from '@/components/site/ComponentPreviewThumb'
import type { componentEntries } from '@/lib/site'
import { cn } from '@/utilities/ui'

type Component = (typeof componentEntries)[number]

/* Masonry cell for the catalog wall. The live preview is the whole pitch, so
 * the chrome is deliberately thin: one footer row with the human name, the
 * install slug, and a copy control. Version/status (uniformly Alpha · 0.1.0),
 * the field list, and the long description live on the contract page — keeping
 * them off the card is what lets ~100 of these scan as a gallery.
 *
 * The card self-sizes (no fixed height) and the title carries a stretched link
 * so the entire surface navigates to the contract; the copy button opts back
 * out with a higher stacking context. */

export function ComponentCard({ className, component }: { className?: string; component: Component }) {
  return (
    <article
      id={component.slug}
      className={cn(
        'group relative mb-4 flex break-inside-avoid flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-frame focus-within:ring-2 focus-within:ring-brand/25',
        className,
      )}
    >
      <ComponentPreviewThumb slug={component.slug} />

      <div className="flex items-center justify-between gap-3 p-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[13px] font-semibold tracking-tight text-foreground">
            <Link
              href={component.href}
              className="outline-none transition-colors before:absolute before:inset-0 before:z-10 before:content-[''] hover:text-brand"
            >
              {component.title}
            </Link>
          </h3>
          <code className="mt-0.5 block truncate font-mono text-[10px] text-muted-foreground">
            {component.slug}
          </code>
        </div>
        <span className="relative z-20 shrink-0">
          <CommandCopyButton command={component.command} />
        </span>
      </div>
    </article>
  )
}
