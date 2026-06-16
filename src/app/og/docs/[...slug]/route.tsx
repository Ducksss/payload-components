import { notFound } from 'next/navigation'
import { ImageResponse } from 'next/og'
import { generate as DefaultImage } from 'fumadocs-ui/og'

import { getPageImage, source } from '@/lib/source'

type DocsImageRouteProps = {
  params: Promise<{
    slug: string[]
  }>
}

export const revalidate = false

export async function GET(_request: Request, { params }: DocsImageRouteProps) {
  const { slug } = await params
  const page = source.getPage(slug.slice(0, -1))

  if (!page) {
    notFound()
  }

  return new ImageResponse(
    <DefaultImage title={page.data.title} description={page.data.description} site="Payload Components" />,
    {
      height: 630,
      width: 1200,
    },
  )
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: getPageImage(page).segments,
  }))
}
