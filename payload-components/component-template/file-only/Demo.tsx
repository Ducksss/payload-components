/* Demo twin for example-basic, a file-only article component.
 *
 * Keep every className="…" group from
 * payload-components/source/components/ExampleBasic/Component.tsx on one corresponding element
 * (tests/int/demo-twins.int.spec.ts). Keep the root aria-hidden and use no interactive elements
 * or headings: the section becomes a div, h2/h3 become div, links become span, and image slots
 * become bg-muted placeholders. Every surface that renders demosBySlug wraps the twin in
 * .preview-scope (tests/int/brand-layer.int.spec.ts), so the twin sets no tokens or scope itself.
 */
export function ExampleBasicDemo() {
  return (
    <div aria-hidden="true" className="bg-background py-12 text-foreground">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl">
          <div className="font-serif text-3xl tracking-tight">Example Basic</div>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            TODO: sample copy for the Example Basic preview.
          </p>
        </div>
      </div>
    </div>
  )
}
