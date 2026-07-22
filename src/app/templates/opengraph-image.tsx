import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { ImageResponse } from 'next/og'

import { siteUrl } from '@/lib/site'
import { TEMPLATE_CONCEPT_STATUS_LABEL } from '@/lib/templates/types'

export const alt = 'Payload Components — full-site template concepts'
export const contentType = 'image/png'
export const size = { height: 630, width: 1200 }

/* Same deterministic composition rules as the root opengraph-image: vendored
   fonts read from disk, monochrome ink on white, emerald used once. */
const fontFile = (name: string) => readFileSync(join(process.cwd(), 'src/app/_fonts', name))

const INK = '#111113'
const MUTED = '#71717a'
const FAINT = '#a1a1aa'
const EMERALD = '#059669'

const MARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" viewBox="0 0 24 24"><rect width="24" height="24" rx="6" fill="${EMERALD}"/><polyline points="7,7.5 11.5,12 7,16.5" fill="none" stroke="#ffffff" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/><rect x="14" y="7.5" width="3.6" height="9" rx="1" fill="#ffffff"/></svg>`
const MARK_DATA_URI = `data:image/svg+xml;base64,${Buffer.from(MARK_SVG).toString('base64')}`

const domain = siteUrl.replace(/^https?:\/\//, '')

export default function TemplatesOpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: 'center',
          backgroundColor: '#ffffff',
          color: INK,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center',
          padding: '60px 80px',
          position: 'relative',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            background: 'radial-gradient(circle, rgba(5, 150, 105, 0.10) 0%, transparent 68%)',
            display: 'flex',
            height: 720,
            left: 100,
            position: 'absolute',
            top: 120,
            width: 1000,
          }}
        />

        <div style={{ alignItems: 'center', display: 'flex', gap: 14 }}>
          <img alt="" height={46} src={MARK_DATA_URI} width={46} />
          <div style={{ display: 'flex', fontSize: 29, fontWeight: 700, letterSpacing: -0.6 }}>
            Payload Components
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 84,
            fontWeight: 700,
            letterSpacing: -3.4,
            lineHeight: 1.04,
            marginTop: 44,
          }}
        >
          Full-site template concepts
        </div>

        <div
          style={{
            color: MUTED,
            display: 'flex',
            fontSize: 30,
            lineHeight: 1.4,
            marginTop: 22,
            maxWidth: 940,
          }}
        >
          Complete site concepts composed from open-source Payload blocks.
        </div>

        <div
          style={{
            alignItems: 'center',
            border: `2px solid ${EMERALD}`,
            borderRadius: 999,
            color: EMERALD,
            display: 'flex',
            fontFamily: 'Geist Mono',
            fontSize: 19,
            letterSpacing: 2.4,
            marginTop: 34,
            padding: '8px 24px',
            textTransform: 'uppercase',
          }}
        >
          {TEMPLATE_CONCEPT_STATUS_LABEL}
        </div>

        <div
          style={{
            bottom: 48,
            color: FAINT,
            display: 'flex',
            fontFamily: 'Geist Mono',
            fontSize: 18,
            justifyContent: 'center',
            left: 0,
            position: 'absolute',
            right: 0,
          }}
        >
          {`${domain}/templates`}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { data: fontFile('Geist-Regular.ttf'), name: 'Geist', style: 'normal', weight: 400 },
        { data: fontFile('Geist-Bold.ttf'), name: 'Geist', style: 'normal', weight: 700 },
        { data: fontFile('GeistMono-Regular.ttf'), name: 'Geist Mono', style: 'normal', weight: 400 },
      ],
    },
  )
}
