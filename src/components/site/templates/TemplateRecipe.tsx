import type { TemplateShowcase } from '@/lib/templates/types'

import { TemplateRecipeRow } from '@/components/site/templates/TemplateRecipeRow'
import { componentEntries } from '@/lib/site'

const componentEntryBySlug = new Map(componentEntries.map((entry) => [entry.slug, entry]))

/* The ordered block recipe, grouped by page. Every row is a real registry
 * block in render order, linking to its /docs/components contract — the
 * recipe is the product; the template is just its composition.
 *
 * Server component: the row's ordinal → arrow micro-interaction lives in the
 * TemplateRecipeRow client island so componentEntries stays on the server. */
export function TemplateRecipe({ template }: { template: TemplateShowcase }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {template.pages.map((page) => (
        <section
          key={page.path}
          aria-label={`${page.label} page block recipe`}
          className="flex flex-col rounded-card border border-border bg-card shadow-card"
        >
          <h3 className="flex items-baseline justify-between gap-3 border-b border-border px-5 py-3.5 text-base font-medium text-foreground">
            {page.label}
            <span className="font-mono text-[11px] uppercase tracking-eyebrow text-muted-foreground">
              {page.sections.length} blocks
            </span>
          </h3>
          <ol className="flex flex-col p-2">
            {page.sections.map((section, index) => {
              const entry = componentEntryBySlug.get(section.componentSlug)

              return (
                <TemplateRecipeRow
                  key={section.id}
                  href={entry?.href ?? `/docs/components/${section.componentSlug}`}
                  ordinal={String(index + 1).padStart(2, '0')}
                  properties={{
                    page: page.path,
                    revision: template.revision,
                    source: 'detail',
                    template: template.slug,
                  }}
                  slug={section.componentSlug}
                  title={entry?.title ?? section.componentSlug}
                />
              )
            })}
          </ol>
        </section>
      ))}
    </div>
  )
}
