import type { JsonLdNode } from '@/utilities/seo'

const serializeJsonLd = (data: JsonLdNode) =>
  JSON.stringify(data).replace(/</g, '\\u003c').replace(/>/g, '\\u003e')

export const JsonLd = ({ data }: { data: JsonLdNode | JsonLdNode[] }) => {
  const nodes = Array.isArray(data) ? data : [data]

  return (
    <>
      {nodes.map((node, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(node) }}
        />
      ))}
    </>
  )
}
