import { readFileSync } from 'node:fs'
import path from 'node:path'

import { ImageResponse } from 'next/og'
import sharp from 'sharp'

import { blogSeries } from '@/lib/blog'
import { blogSource } from '@/lib/blog-source'
import { siteUrl } from '@/lib/site'

/* ImageResponse rasterizes raw image elements server-side; next/image is a
   browser component and cannot participate in Satori's render tree. */
/* eslint-disable @next/next/no-img-element */

export const size = { height: 630, width: 1200 }
export const revalidate = false

const font = (name: string) => readFileSync(path.join(process.cwd(), 'src/app/_fonts', name))
const fonts = [
  {
    data: font('Geist-Regular.ttf'),
    name: 'Geist',
    style: 'normal' as const,
    weight: 400 as const,
  },
  { data: font('Geist-Bold.ttf'), name: 'Geist', style: 'normal' as const, weight: 700 as const },
  {
    data: font('GeistMono-Regular.ttf'),
    name: 'Geist Mono',
    style: 'normal' as const,
    weight: 400 as const,
  },
]
const coverCache = new Map<string, Promise<string>>()
const mark = sharp(path.join(process.cwd(), 'public/favicon.svg'))
  .resize(46, 46)
  .png()
  .toBuffer()
  .then((buffer) => `data:image/png;base64,${buffer.toString('base64')}`)

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
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return blogSource.getPages().map((page) => ({ slug: page.slugs[0] }))
}

export async function GET(_request: Request, { params }: BlogImageRouteProps) {
  const { slug } = await params
  const page = blogSource.getPage([slug])
  if (!page) return new Response('Not found', { status: 404 })

  const coverPath = path.join(process.cwd(), 'public', page.data.cover.src.replace(/^\//, ''))
  const [cover, markSource] = await Promise.all([pngCover(coverPath), mark])
  const series = blogSeries[page.data.series]

  return new ImageResponse(
    <div
      style={{
        background: '#ffffff',
        color: '#111113',
        display: 'flex',
        height: '100%',
        padding: 48,
        width: '100%',
      }}
    >
      <div
        style={{ display: 'flex', flex: 1, flexDirection: 'column', padding: '16px 48px 12px 8px' }}
      >
        <div
          style={{ alignItems: 'center', display: 'flex', fontSize: 24, fontWeight: 700, gap: 12 }}
        >
          <img alt="" height={46} src={markSource} width={46} />
          Payload Components
        </div>
        <div
          style={{
            color: '#059669',
            display: 'flex',
            fontFamily: 'Geist Mono',
            fontSize: 18,
            marginTop: 72,
            textTransform: 'uppercase',
          }}
        >
          {series.label}
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 52,
            fontWeight: 700,
            letterSpacing: -2.2,
            lineHeight: 1.05,
            marginTop: 18,
          }}
        >
          {page.data.title}
        </div>
        <div
          style={{
            color: '#71717a',
            display: 'flex',
            fontSize: 20,
            lineHeight: 1.45,
            marginTop: 22,
          }}
        >
          {page.data.description}
        </div>
        <div
          style={{
            color: '#a1a1aa',
            display: 'flex',
            fontFamily: 'Geist Mono',
            fontSize: 16,
            marginTop: 'auto',
          }}
        >
          {siteUrl.replace(/^https?:\/\//, '')}
        </div>
      </div>
      <div
        style={{
          border: '1px solid #e4e4e7',
          borderRadius: 24,
          display: 'flex',
          overflow: 'hidden',
          width: 440,
        }}
      >
        <img
          alt=""
          height={534}
          src={cover}
          style={{ height: '100%', objectFit: 'cover', width: '100%' }}
          width={440}
        />
      </div>
    </div>,
    {
      ...size,
      fonts,
    },
  )
}
