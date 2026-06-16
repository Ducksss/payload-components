import { FeatureGridBasicDemo } from '@/components/site/demos/FeatureGridBasicDemo'

const annotatedFields = ['eyebrow', 'title', 'description', 'items[] · 3–6', 'links[]'] as const

/* Full-width specimen: the feature-grid-basic kit rendered for real
 * (hero-basic already stars in the hero install replay), framed like a
 * technical drawing. At xl+ a reserved left gutter receives the
 * leader-line field annotations the twin projects in annotate mode;
 * below xl the figcaption chip row carries the field names instead. */
export function KitSpecimen() {
  return (
    <figure className="overflow-hidden rounded-[1.75rem] border border-border bg-background shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-border bg-muted/40 px-5 py-2.5 sm:px-6">
        <code className="truncate font-mono text-[11px] text-muted-foreground">
          payload-components/source/blocks/FeatureGridBasic/Component.tsx
        </code>
        <span className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
          Rendered from component source · sample content
        </span>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none select-none px-4 py-6 sm:px-6 sm:py-8 xl:py-10 xl:pl-44 xl:pr-10"
      >
        <FeatureGridBasicDemo annotate />
      </div>

      <figcaption className="border-t border-border px-5 py-4 text-sm leading-6 text-muted-foreground sm:px-6">
        Every annotated part is a field in the block config —{' '}
        <code className="rounded-md border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-xs text-foreground/80">
          npx payload-components add feature-grid-basic
        </code>{' '}
        installs the schema, this component, and the wiring between them.
        <span className="mt-2.5 flex flex-wrap gap-1.5 xl:hidden">
          {annotatedFields.map((field) => (
            <span
              key={field}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground"
            >
              <span aria-hidden="true" className="size-1 rounded-full bg-brand" />
              {field}
            </span>
          ))}
        </span>
      </figcaption>
    </figure>
  )
}
