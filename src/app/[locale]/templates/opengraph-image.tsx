import { ImageResponse } from 'next/og'

import { TemplateCard } from '@/lib/og/cards'
import { ogFonts, ogSize } from '@/lib/og/datasheet-card'
import { templateShowcases } from '@/lib/templates/registry'
import { TEMPLATE_CONCEPT_STATUS_LABEL } from '@/lib/templates/types'

export const alt = 'Payload Components — full-site template concepts'
export const contentType = 'image/png'
export const size = ogSize

/* The template gallery as a page of the site's datasheet (src/lib/og/cards.tsx),
   stamped as a concept the way a datasheet is stamped "preliminary". */
export default function TemplatesOpenGraphImage() {
  return new ImageResponse(
    <TemplateCard
      docId={`${templateShowcases.length} CONCEPTS`}
      status={TEMPLATE_CONCEPT_STATUS_LABEL}
      summary="Complete site concepts composed from open-source Payload blocks."
      title="Full-site template concepts"
      url="/templates"
    />,
    { ...ogSize, fonts: ogFonts },
  )
}
