import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { ImageResponse } from 'next/og'

import { heroHeadlineAccent, heroHeadlinePrimary, primaryInstallCommand } from '@/lib/site'

export const alt = 'Payload Components — Payload blocks, fully wired'
export const contentType = 'image/png'
export const size = { height: 630, width: 1200 }

/* Fonts are vendored under ./_fonts and read from disk — never fetched — so
   the build stays deterministic and the CI release gate never waits on a
   network font request. Geist matches the site body/headline, Geist Mono the
   terminal, and Instrument Serif italic the on-site `--font-serif` accent. */
const fontFile = (name: string) => readFileSync(join(process.cwd(), 'src/app/_fonts', name))

const INK = '#09090b'
const INK_SOFT = '#18181b'
const MUTED = '#71717a'
const EMERALD = '#34d399'

/* A compact replay of a real `payload-components add` run (mirrors
   terminalDemoLines in src/lib/site.ts) — the proof that the install does the
   wiring a plain paste leaves as a TODO list. Glyphs are restricted to ones
   Geist ships ($ + · —); next/og would otherwise try to network-fetch a font
   for a missing glyph (e.g. ✓), which breaks the deterministic build. */
const terminalLines: { tone: 'cmd' | 'add' | 'ok'; text: string }[] = [
  { tone: 'cmd', text: primaryInstallCommand },
  { tone: 'add', text: 'registered block · mapped renderer' },
  { tone: 'add', text: 'generated types · admin import map' },
  { tone: 'ok', text: '5 files wired — one reviewable diff' },
]

/* Static at build time on purpose: no dynamic APIs, no network. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: '#ffffff',
          backgroundImage: 'radial-gradient(rgba(9, 9, 11, 0.06) 1.5px, transparent 1.5px)',
          backgroundSize: '26px 26px',
          color: INK,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'Geist',
          height: '100%',
          justifyContent: 'space-between',
          padding: 60,
          position: 'relative',
          width: '100%',
        }}
      >
        {/* Emerald bloom — the site's signal accent. A wide ambient wash from
           the top-right, plus a brighter band behind the console so it reads
           as if the install is emitting the glow. */}
        <div
          style={{
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 72%)',
            display: 'flex',
            height: 1000,
            position: 'absolute',
            right: -300,
            top: -380,
            width: 1120,
          }}
        />
        <div
          style={{
            background:
              'radial-gradient(circle, rgba(52, 211, 153, 0.32) 0%, rgba(52, 211, 153, 0.10) 40%, transparent 66%)',
            display: 'flex',
            height: 760,
            left: 80,
            position: 'absolute',
            top: 250,
            width: 1180,
          }}
        />

        {/* Header */}
        <div style={{ alignItems: 'center', display: 'flex', gap: 16 }}>
          <div
            style={{
              alignItems: 'center',
              backgroundColor: INK_SOFT,
              borderRadius: 10,
              color: '#fafafa',
              display: 'flex',
              fontFamily: 'Geist Mono',
              fontSize: 26,
              fontWeight: 700,
              height: 46,
              justifyContent: 'center',
              width: 46,
            }}
          >
            &gt;_
          </div>
          <div style={{ display: 'flex', fontSize: 29, fontWeight: 700, letterSpacing: -0.5 }}>
            Payload Components
          </div>
          <div
            style={{
              border: '1px solid rgba(9, 9, 11, 0.15)',
              borderRadius: 999,
              color: MUTED,
              display: 'flex',
              fontSize: 15,
              letterSpacing: 3,
              padding: '6px 15px',
              textTransform: 'uppercase',
            }}
          >
            Public alpha
          </div>
        </div>

        {/* Headline + console, vertically centered between header and footer */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 34,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                fontSize: 92,
                fontWeight: 700,
                letterSpacing: -4.5,
                lineHeight: 0.92,
              }}
            >
              {heroHeadlinePrimary}
            </div>
            <div
              style={{
                color: INK,
                display: 'flex',
                fontFamily: 'Instrument Serif',
                fontSize: 104,
                fontStyle: 'italic',
                fontWeight: 400,
                letterSpacing: -2,
                lineHeight: 0.98,
                marginTop: 2,
              }}
            >
              {heroHeadlineAccent}
            </div>
          </div>

          {/* Console — the wiring proof, full width */}
          <div
            style={{
              backgroundColor: INK_SOFT,
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 18,
              boxShadow: '0 36px 80px -36px rgba(9, 9, 11, 0.5)',
              display: 'flex',
              flexDirection: 'column',
              padding: '22px 28px',
            }}
          >
            <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ alignItems: 'center', display: 'flex', gap: 8 }}>
                <div style={{ backgroundColor: '#3f3f46', borderRadius: 999, display: 'flex', height: 11, width: 11 }} />
                <div style={{ backgroundColor: '#3f3f46', borderRadius: 999, display: 'flex', height: 11, width: 11 }} />
                <div style={{ backgroundColor: '#3f3f46', borderRadius: 999, display: 'flex', height: 11, width: 11 }} />
                <div style={{ color: '#71717a', display: 'flex', fontFamily: 'Geist Mono', fontSize: 14, marginLeft: 10 }}>
                  acme-site — zsh
                </div>
              </div>
              <div style={{ color: '#52525b', display: 'flex', fontFamily: 'Geist Mono', fontSize: 14 }}>
                hero-basic@0.1.0
              </div>
            </div>

            <div style={{ display: 'flex', fontFamily: 'Geist Mono', fontSize: 19, gap: 36 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {terminalLines.map((line) => (
                  <div
                    key={line.text}
                    style={{ alignItems: 'baseline', display: 'flex', gap: 12 }}
                  >
                    <div
                      style={{
                        color: line.tone === 'ok' ? 'transparent' : EMERALD,
                        display: 'flex',
                        fontWeight: 500,
                        width: 14,
                      }}
                    >
                      {line.tone === 'cmd' ? '$' : line.tone === 'add' ? '+' : ''}
                    </div>
                    <div
                      style={{
                        color: line.tone === 'ok' ? EMERALD : line.tone === 'cmd' ? '#fafafa' : '#a1a1aa',
                        display: 'flex',
                        fontWeight: line.tone === 'cmd' || line.tone === 'ok' ? 500 : 400,
                      }}
                    >
                      {line.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            alignItems: 'center',
            borderTop: '1px solid rgba(9, 9, 11, 0.08)',
            color: MUTED,
            display: 'flex',
            fontSize: 18,
            justifyContent: 'space-between',
            paddingTop: 20,
          }}
        >
          <div style={{ display: 'flex' }}>A plain shadcn add stops at your filesystem. Components don&apos;t.</div>
          <div style={{ display: 'flex', fontFamily: 'Geist Mono' }}>MIT · Payload v3 · Next 15/16</div>
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
