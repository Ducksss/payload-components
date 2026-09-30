import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import type { Node } from 'fumadocs-core/page-tree'
import { notFound } from 'next/navigation'
import { ImageResponse } from 'next/og'

import { normalizeSiteLocale, type SiteLocale } from '@/i18n/config'
import { familyOfSlug } from '@/lib/component-page-tree'
import { componentEntries, siteUrl } from '@/lib/site'
import { getPageImage, source } from '@/lib/source'

/* ImageResponse rasterizes raw image elements server-side; next/image is a
   browser component and cannot participate in Satori's render tree. */
/* eslint-disable @next/next/no-img-element */

type DocsImageRouteProps = {
  params: Promise<{
    locale: string
    slug: string[]
  }>
}

export const revalidate = false

/* Same deterministic composition rules as the root opengraph-image: vendored
   fonts read from disk, monochrome ink on white, emerald used once. Docs cards
   are left-aligned because their titles and descriptions come from frontmatter,
   and the long ones need a reading edge rather than a centre line. */
const fontFile = (name: string) => readFileSync(join(process.cwd(), 'src/app/_fonts', name))

const fonts = [
  {
    data: fontFile('Geist-Regular.ttf'),
    name: 'Geist',
    style: 'normal' as const,
    weight: 400 as const,
  },
  {
    data: fontFile('Geist-Bold.ttf'),
    name: 'Geist',
    style: 'normal' as const,
    weight: 700 as const,
  },
  {
    data: fontFile('GeistMono-Regular.ttf'),
    name: 'Geist Mono',
    style: 'normal' as const,
    weight: 400 as const,
  },
  {
    data: fontFile('GeistMono-Medium.ttf'),
    name: 'Geist Mono',
    style: 'normal' as const,
    weight: 500 as const,
  },
  {
    data: fontFile('InstrumentSerif-Italic.ttf'),
    name: 'Instrument Serif',
    style: 'italic' as const,
    weight: 400 as const,
  },
]

const INK = '#111113'
const MUTED = '#71717a'
const FAINT = '#a1a1aa'
const EMERALD = '#059669'

/* The brand mark, read from the canonical public/favicon.svg (as the blog card
   does) rather than adding another inline copy of the geometry Logomark.tsx
   asks every copy to keep in sync. */
const MARK_DATA_URI = `data:image/svg+xml;base64,${readFileSync(
  join(process.cwd(), 'public/favicon.svg'),
).toString('base64')}`

/* The site's one background texture — the hero's .bg-dots grid — scaled up so
   it survives a feed thumbnail, masked to the right so the text sits on plain
   white, under the root card's faint emerald wash. Drawn as one SVG because
   Satori's CSS gradients cannot tile a dot or feather a mask reliably. */
const BACKDROP_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><defs><pattern id="dots" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="13" cy="13" r="1.7" fill="${INK}" fill-opacity="0.13"/></pattern><linearGradient id="fade" x1="0" y1="0" x2="1" y2="0"><stop offset="0.38" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff" stop-opacity="1"/></linearGradient><mask id="reveal"><rect width="1200" height="630" fill="url(#fade)"/></mask><radialGradient id="wash" cx="1110" cy="40" r="640" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${EMERALD}" stop-opacity="0.11"/><stop offset="0.25" stop-color="${EMERALD}" stop-opacity="0.083"/><stop offset="0.5" stop-color="${EMERALD}" stop-opacity="0.044"/><stop offset="0.75" stop-color="${EMERALD}" stop-opacity="0.013"/><stop offset="1" stop-color="${EMERALD}" stop-opacity="0"/></radialGradient></defs><rect width="1200" height="630" fill="#fff"/><rect width="1200" height="630" fill="url(#wash)"/><rect width="1200" height="630" fill="url(#dots)" mask="url(#reveal)"/></svg>`
const BACKDROP_DATA_URI = `data:image/svg+xml;base64,${Buffer.from(BACKDROP_SVG).toString('base64')}`

const domain = siteUrl.replace(/^https?:\/\//, '')

/* Titles run from "CLI reference" to 60-character guide names. The size steps,
   not a line clamp, keep the longest inside the card: Satori ellipsizes a
   balanced title at the wrong width, cutting titles that would fit. */
const titleSize = (title: string) =>
  title.length <= 24 ? 80 : title.length <= 40 ? 68 : title.length <= 60 ? 60 : 52

const containsUrl = (node: Node, url: string): boolean =>
  node.type === 'page'
    ? node.url === url
    : node.type === 'folder' &&
      (node.index?.url === url || node.children.some((child) => containsUrl(child, url)))

/* The sidebar section a page sits under ("Get Started", "Reference", …): the
   nearest separator above its top-level entry in the page tree. */
function sectionOf(url: string, locale: SiteLocale) {
  let section: string | undefined
  for (const node of source.getPageTree(locale).children) {
    if (node.type === 'separator') section = typeof node.name === 'string' ? node.name : undefined
    else if (containsUrl(node, url)) return section
  }
  return undefined
}

export async function GET(_request: Request, { params }: DocsImageRouteProps) {
  const { locale: localeParam, slug } = await params
  const locale = normalizeSiteLocale(localeParam)
  const page = source.getPage(slug.slice(0, -1), locale)

  if (!page) {
    notFound()
  }

  /* Component pages carry the same facts as their header chips and end on the
     exact install command; every other page ends on its own URL. */
  const component =
    page.slugs.length === 2 && page.slugs[0] === 'components'
      ? componentEntries.find((entry) => entry.slug === page.slugs[1])
      : undefined
  const eyebrow = component
    ? `${component.family === 'pages' ? 'Page block' : 'Post component'} · ${familyOfSlug(component.slug).label} family`
    : sectionOf(page.url, locale)
  const { description, title } = page.data
  const size = titleSize(title)

  return new ImageResponse(
    <div
      style={{
        backgroundColor: '#ffffff',
        color: INK,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '64px 80px 60px',
        position: 'relative',
        width: '100%',
      }}
    >
      <img
        alt=""
        height={630}
        src={BACKDROP_DATA_URI}
        style={{ left: 0, position: 'absolute', top: 0 }}
        width={1200}
      />

      {/* Wordmark, with the one serif accent word the site allows a heading */}
      <div style={{ alignItems: 'center', display: 'flex', gap: 14 }}>
        <img alt="" height={44} src={MARK_DATA_URI} width={44} />
        <div style={{ display: 'flex', fontSize: 28, fontWeight: 700, letterSpacing: -0.6 }}>
          Payload Components
        </div>
        <div
          style={{
            display: 'flex',
            fontFamily: 'Instrument Serif',
            fontSize: 34,
            fontStyle: 'italic',
            marginLeft: 2,
            marginTop: 2,
          }}
        >
          docs
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
        {eyebrow ? (
          <div
            style={{
              color: EMERALD,
              display: 'flex',
              fontFamily: 'Geist Mono',
              fontSize: 19,
              fontWeight: 500,
              letterSpacing: 2.6,
              marginBottom: 20,
              textTransform: 'uppercase',
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        <div
          style={{
            display: 'flex',
            fontSize: size,
            fontWeight: 700,
            letterSpacing: size * -0.04,
            lineHeight: 1.06,
            maxWidth: 1000,
            textWrap: 'balance',
          }}
        >
          {title}
        </div>
        {description ? (
          <div
            style={{
              color: MUTED,
              display: 'block',
              fontSize: 28,
              lineClamp: 3,
              lineHeight: 1.45,
              marginTop: 24,
              maxWidth: 960,
            }}
          >
            {description}
          </div>
        ) : null}
      </div>

      <div style={{ display: 'flex', fontFamily: 'Geist Mono' }}>
        {component ? (
          <div style={{ color: MUTED, display: 'flex', fontSize: 21, gap: 10 }}>
            <div style={{ color: INK, display: 'flex' }}>$</div>
            <div style={{ display: 'flex' }}>{component.command}</div>
          </div>
        ) : (
          <div
            style={{ color: FAINT, display: 'flex', fontSize: 19 }}
          >{`${domain}${page.url}`}</div>
        )}
      </div>
    </div>,
    {
      fonts,
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
