import Link from '@/i18n/Link'
import { useTranslations } from 'next-intl'

import { Check, Plus } from 'lucide-react'

import { CommandCopyButton } from '@/components/site/CommandCopyButton'
import { ComponentPreviewThumb } from '@/components/site/ComponentPreviewThumb'
import { type componentEntries } from '@/lib/site'
import { cn } from '@/utilities/ui'

type Component = (typeof componentEntries)[number]

/* Masonry cell for the catalog wall. The live preview is the whole pitch, so
 * the chrome is deliberately thin: one footer row with the human name, the
 * install slug, and a copy control. Version, fields, and the long description
 * live on the contract page — keeping them off the card is what lets ~100 of
 * these scan as a gallery.
 *
 * The card self-sizes (no fixed height) and the title carries a stretched link
 * so the entire surface navigates to the contract; the copy button opts back
 * out with a higher stacking context. */

export function ComponentCard({
  className,
  component,
  onToggleSelect,
  selected,
}: {
  className?: string
  component: Component
  /* Optional: only the catalog browser composes a selection. Passing nothing
     keeps the card exactly as it renders elsewhere. */
  onToggleSelect?: (slug: string) => void
  selected?: boolean
}) {
  const t = useTranslations('CatalogBrowser')
  const componentT = useTranslations('Components')

  return (
    <article
      id={component.slug}
      data-selected={onToggleSelect && selected ? 'true' : undefined}
      className={cn(
        'group relative mb-4 flex break-inside-avoid flex-col overflow-hidden rounded-xl border bg-card shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-frame focus-within:ring-2 focus-within:ring-brand',
        selected
          ? 'border-brand/45 ring-1 ring-brand/25'
          : 'border-border hover:border-foreground/15',
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
              {componentT(`${component.slug}.title`)}
            </Link>
          </h3>
          <code className="mt-0.5 block truncate font-mono text-[10px] text-muted-foreground">
            {component.slug}
          </code>
        </div>
        <span className="relative z-20 flex shrink-0 items-center gap-1.5">
          {onToggleSelect ? (
            <button
              type="button"
              aria-label={
                selected
                  ? t('composerRemove', { slug: component.slug })
                  : t('composerAdd', { slug: component.slug })
              }
              aria-pressed={selected ? 'true' : 'false'}
              onClick={() => onToggleSelect(component.slug)}
              className={cn(
                'inline-flex size-8 shrink-0 items-center justify-center rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                selected
                  ? 'border-brand/40 bg-brand/10 text-brand'
                  : 'border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground',
              )}
            >
              {selected ? (
                <Check className="size-3.5" aria-hidden="true" />
              ) : (
                <Plus className="size-3.5" aria-hidden="true" />
              )}
            </button>
          ) : null}
          <CommandCopyButton command={component.command} />
        </span>
      </div>
    </article>
  )
}
