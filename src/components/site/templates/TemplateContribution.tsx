import { ArrowUpRight } from 'lucide-react'

import { TemplateTrackedLink } from '@/components/site/templates/TemplateTrackedLink'
import { templatesContribution } from '@/lib/site'

/* Community close, shared by the gallery and the detail page: templates are a
 * public question, answered on GitHub — never a waitlist or an email capture.
 * Both links carry the approved contribution-click event. */
export function TemplateContribution({
  revision,
  source,
  template,
}: {
  revision?: number
  source: 'detail' | 'gallery'
  template?: string
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {templatesContribution.links.map((link) => (
        <TemplateTrackedLink
          key={link.href}
          event="template_contribution_click"
          external={link.external}
          href={link.href}
          properties={{ revision, source, template }}
          className="group flex flex-col gap-2 rounded-card border border-border bg-card p-6 shadow-card transition-shadow duration-300 hover:shadow-frame focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span className="flex items-center justify-between gap-3 text-base font-medium text-foreground">
            {link.label}
            <ArrowUpRight
              className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-brand"
              aria-hidden="true"
            />
          </span>
          <span className="text-sm leading-6 text-muted-foreground">{link.description}</span>
        </TemplateTrackedLink>
      ))}
    </div>
  )
}
