import type { TemplateShowcase } from '@/lib/templates/types'

import { TemplateTrackedLink } from '@/components/site/templates/TemplateTrackedLink'
import { componentEntries } from '@/lib/site'

const componentEntryBySlug = new Map(componentEntries.map((entry) => [entry.slug, entry]))

/* The ordered block recipe, grouped by page. Every row is a real registry
 * block in render order, linking to its /docs/components contract — the
 * recipe is the product; the template is just its composition. */
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
                <li key={section.id}>
                  <TemplateTrackedLink
                    event="template_recipe_click"
                    href={entry?.href ?? `/docs/components/${section.componentSlug}`}
                    properties={{
                      page: page.path,
                      revision: template.revision,
                      source: 'detail',
                      template: template.slug,
                    }}
                    className="group flex items-baseline gap-3 rounded-md px-3 py-2 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
                  >
                    <span
                      aria-hidden="true"
                      className="w-5 shrink-0 font-mono text-xs text-brand"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {entry?.title ?? section.componentSlug}
                    </span>
                    <span className="ml-auto truncate font-mono text-xs text-muted-foreground transition-colors group-hover:text-foreground">
                      {section.componentSlug}
                    </span>
                  </TemplateTrackedLink>
                </li>
              )
            })}
          </ol>
        </section>
      ))}
    </div>
  )
}
