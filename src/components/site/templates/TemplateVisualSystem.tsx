import type { TemplateShowcase } from '@/lib/templates/types'

/* Visual-system summary: the fictional brand's palette swatches (data-driven
 * hex values rendered via inline style — they are template content, not site
 * design tokens), the theme description, and the declared visual tone. */
export function TemplateVisualSystem({ template }: { template: TemplateShowcase }) {
  return (
    <div className="grid gap-6 rounded-card border border-border bg-card p-6 shadow-card sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-10 sm:p-7">
      <div className="flex flex-col gap-3">
        <h3 className="font-mono text-[11px] uppercase tracking-eyebrow text-muted-foreground">
          Palette
        </h3>
        <ul className="flex items-center gap-3" aria-label={`${template.title} palette swatches`}>
          {template.theme.swatches.map((swatch) => (
            <li key={swatch} className="flex flex-col items-center gap-1.5">
              <span
                className="block size-10 rounded-full border border-border shadow-card"
                style={{ backgroundColor: swatch }}
              />
              <span className="font-mono text-[11px] text-muted-foreground">{swatch}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-mono text-[11px] uppercase tracking-eyebrow text-muted-foreground">
          Direction
        </h3>
        <p className="max-w-prose text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
          {template.theme.description}
        </p>
        <ul className="flex flex-wrap items-center gap-1.5" aria-label="Visual tone">
          {template.visualTone.map((tone) => (
            <li
              key={tone}
              className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
            >
              {tone}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
