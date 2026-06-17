import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { ImageResponse } from 'next/og'

import { heroHeadlineAccent, heroHeadlinePrimary, primaryInstallCommand, siteUrl } from '@/lib/site'

export const alt = 'Payload Components — Payload blocks, fully wired'
export const contentType = 'image/png'
export const size = { height: 630, width: 1200 }

/* Fonts are vendored under ./_fonts and read from disk — never fetched — so
   the build stays deterministic and the CI release gate never waits on a
   network font request. Geist matches the site body/headline, Geist Mono the
   wordmark + command, and Instrument Serif italic the on-site `--font-serif`
   accent. */
const fontFile = (name: string) => readFileSync(join(process.cwd(), 'src/app/_fonts', name))

/* Hex equivalents of the light-theme tokens in globals.css. Emerald is the one
   accent (--brand, the light-background shade — NOT the bright terminal green)
   and is used sparingly: just the command prompt here. */
const INK = '#111113' // ~ --foreground
const MUTED = '#71717a' // ~ --muted-foreground
const FAINT = '#a1a1aa'
const EMERALD = '#059669' // ~ --brand, legible on white
const MARK = '#18181b'

const domain = siteUrl.replace(/^https?:\/\//, '')

/* Static at build time on purpose: no dynamic APIs, no network. A clean,
   centered composition — wordmark, the brand headline, one quiet command. */
export default function OpenGraphImage() {
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
        {/* A single, very faint emerald wash behind the headline so the white
           card has depth without clutter. Source-ordered first → never washes
           out the ink text above it. */}
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

        {/* Wordmark */}
        <div style={{ alignItems: 'center', display: 'flex', gap: 14 }}>
          <div
            style={{
              alignItems: 'center',
              backgroundColor: MARK,
              borderRadius: 11,
              color: '#fafafa',
              display: 'flex',
              fontFamily: 'Geist Mono',
              fontSize: 24,
              fontWeight: 700,
              height: 46,
              justifyContent: 'center',
              width: 46,
            }}
          >
            &gt;_
          </div>
          <div style={{ display: 'flex', fontSize: 29, fontWeight: 700, letterSpacing: -0.6 }}>
            Payload Components
          </div>
        </div>

        {/* Headline — monochrome ink, the serif accent carries the brand voice */}
        <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', marginTop: 40 }}>
          <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, letterSpacing: -3.2, lineHeight: 1.04 }}>
            {heroHeadlinePrimary}
          </div>
          <div
            style={{
              display: 'flex',
              fontFamily: 'Instrument Serif',
              fontSize: 82,
              fontStyle: 'italic',
              fontWeight: 400,
              letterSpacing: -1.4,
              lineHeight: 1.1,
              marginTop: 4,
              paddingBottom: 6,
            }}
          >
            {heroHeadlineAccent}
          </div>
        </div>

        {/* One quiet command — the single emerald accent is the prompt */}
        <div
          style={{
            alignItems: 'baseline',
            color: MUTED,
            display: 'flex',
            fontFamily: 'Geist Mono',
            fontSize: 23,
            gap: 11,
            marginTop: 38,
          }}
        >
          <div style={{ color: EMERALD, display: 'flex', fontWeight: 500 }}>$</div>
          <div style={{ display: 'flex' }}>{primaryInstallCommand}</div>
        </div>

        {/* Bottom anchor */}
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
          {domain}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { data: fontFile('Geist-Regular.ttf'), name: 'Geist', style: 'normal', weight: 400 },
        { data: fontFile('Geist-Bold.ttf'), name: 'Geist', style: 'normal', weight: 700 },
        { data: fontFile('GeistMono-Regular.ttf'), name: 'Geist Mono', style: 'normal', weight: 400 },
        { data: fontFile('GeistMono-Medium.ttf'), name: 'Geist Mono', style: 'normal', weight: 500 },
        {
          data: fontFile('InstrumentSerif-Italic.ttf'),
          name: 'Instrument Serif',
          style: 'italic',
          weight: 400,
        },
      ],
    },
  )
}
