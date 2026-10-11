import { ImageResponse } from 'next/og'
import { notFound } from 'next/navigation'

import { TemplateCard } from '@/lib/og/cards'
import { ogFonts, ogSize } from '@/lib/og/datasheet-card'
import { getTemplateShowcase, templateShowcases } from '@/lib/templates/registry'
import { TEMPLATE_CONCEPT_STATUS_LABEL } from '@/lib/templates/types'

export const alt = 'Payload Components — full-site template concept'
export const contentType = 'image/png'
export const size = ogSize

export function generateStaticParams() {
  return templateShowcases.map((template) => ({ slug: template.slug }))
}

/* One template concept as a page of the site's datasheet (src/lib/og/cards.tsx),
   with its bill of materials: the registry parts its pages use, in the order
   they first appear. */
export default async function TemplateOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const template = getTemplateShowcase(slug)
  if (!template) notFound()

  const parts = [
    ...new Set(
      template.pages.flatMap((page) =>
        page.sections.map((section) => `PC-${section.componentSlug.toUpperCase()}`),
      ),
    ),
  ]

  return new ImageResponse(
    <TemplateCard
      docId={`TEMPLATE · ${template.slug.toUpperCase()}`}
      parts={parts}
      status={TEMPLATE_CONCEPT_STATUS_LABEL}
      summary={template.summary}
      title={`${template.title} template`}
      url={`/templates/${template.slug}`}
    />,
    { ...ogSize, fonts: ogFonts },
  )
}
