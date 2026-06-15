/**
 * Renders a schema.org node (or `@graph` document) as a JSON-LD script.
 *
 * The payload is built server-side from trusted site constants, but we still
 * escape `<` so a stray value can never terminate the <script> element.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
      type="application/ld+json"
    />
  )
}
