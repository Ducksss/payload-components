import { notFound } from 'next/navigation'
import { ImageResponse } from 'next/og'
import { generate as DefaultImage } from 'fumadocs-ui/og'

import { getSiteLocale } from '@/lib/i18n'
import { getPageImage, source } from '@/lib/source'

type DocsImageRouteProps = {
  params: Promise<{
    slug: string[]
  }>
}

export const revalidate = false

export async function GET(_request: Request, { params }: DocsImageRouteProps) {
  const { slug } = await params
  const locale = await getSiteLocale()
  const page = source.getPage(slug.slice(0, -1), locale)

  if (!page) {
    notFound()
  }

  return new ImageResponse(
    <DefaultImage
      title={page.data.title}
      description={page.data.description}
      site="Payload Components"
    />,
    {
      height: 630,
      width: 1200,
    },
  )
}

export function generateStaticParams() {
  return source.getPages('en').map((page) => ({
    slug: getPageImage(page).segments,
  }))
}
