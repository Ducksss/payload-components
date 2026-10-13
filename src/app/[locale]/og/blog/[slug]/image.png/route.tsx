import path from 'node:path'

import { ImageResponse } from 'next/og'
import sharp from 'sharp'

import { blogSeries } from '@/lib/blog'
import { blogSource } from '@/lib/blog-source'
import { normalizeSiteLocale } from '@/i18n/config'
import { BlogCard } from '@/lib/og/cards'
import { ogFonts } from '@/lib/og/datasheet-card'

export const size = { height: 630, width: 1200 }
export const revalidate = false

const coverCache = new Map<string, Promise<string>>()

/* Covers are WebP/AVIF on disk; Satori embeds PNG. */
function pngCover(coverPath: string) {
  const cached = coverCache.get(coverPath)
  if (cached) return cached

  const encoded = sharp(coverPath)
    .png()
    .toBuffer()
    .then((buffer) => `data:image/png;base64,${buffer.toString('base64')}`)
  coverCache.set(coverPath, encoded)
  return encoded
}

type BlogImageRouteProps = {
  params: Promise<{ locale: string; slug: string }>
}

export function generateStaticParams() {
  return blogSource.getPages('en').map((page) => ({ slug: page.slugs[0] }))
}

/* A post as a page of the site's datasheet (src/lib/og/cards.tsx): its series
   in the strip, the title beside the cover as the sheet's figure. */
export async function GET(_request: Request, { params }: BlogImageRouteProps) {
  const { locale: localeParam, slug } = await params
  const locale = normalizeSiteLocale(localeParam)
  const page = blogSource.getPage([slug], locale)
  if (!page) return new Response('Not found', { status: 404 })

  const coverPath = path.join(process.cwd(), 'public', page.data.cover.src.replace(/^\//, ''))

  return new ImageResponse(
    <BlogCard
      cover={await pngCover(coverPath)}
      description={page.data.description}
      series={blogSeries[page.data.series].label}
      title={page.data.title}
      url={`/blog/${slug}`}
    />,
    { ...size, fonts: ogFonts },
  )
}
