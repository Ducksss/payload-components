import { notFound } from 'next/navigation'
import { ImageResponse } from 'next/og'
import { generate as DefaultImage } from 'fumadocs-ui/og'

import { normalizeSiteLocale } from '@/i18n/config'
import { getPageImage, source } from '@/lib/source'

type DocsImageRouteProps = {
  params: Promise<{
    locale: string
    slug: string[]
  }>
}

export const revalidate = false

export async function GET(_request: Request, { params }: DocsImageRouteProps) {
  const { locale: localeParam, slug } = await params
  const locale = normalizeSiteLocale(localeParam)
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
