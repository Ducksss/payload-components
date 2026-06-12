import { ImageResponse } from 'next/og'

import { heroHeadline, primaryInstallCommand } from '@/lib/site'

export const alt = 'Payload Kits — Payload blocks, fully wired'
export const contentType = 'image/png'
export const size = { height: 630, width: 1200 }

/* Static at build time on purpose: no dynamic APIs, no font fetches, so the
   CI release gate stays deterministic. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: '#ffffff',
          backgroundImage: 'radial-gradient(rgba(9, 9, 11, 0.07) 1.5px, transparent 1.5px)',
          backgroundSize: '26px 26px',
          color: '#09090b',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between',
          padding: 72,
          width: '100%',
        }}
      >
        <div style={{ alignItems: 'center', display: 'flex', gap: 18 }}>
          <div
            style={{
              alignItems: 'center',
              backgroundColor: '#18181b',
              borderRadius: 10,
              color: '#fafafa',
              display: 'flex',
              fontSize: 26,
              fontWeight: 700,
              height: 46,
              justifyContent: 'center',
              width: 46,
            }}
          >
            &gt;
          </div>
          <div style={{ display: 'flex', fontSize: 30, fontWeight: 700 }}>Payload Kits</div>
          <div
            style={{
              border: '1px solid rgba(9, 9, 11, 0.15)',
              backgroundColor: '#ffffff',
              borderRadius: 999,
              color: '#71717a',
              display: 'flex',
              fontSize: 16,
              letterSpacing: 3,
              padding: '6px 16px',
              textTransform: 'uppercase',
            }}
          >
            Public alpha
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 68,
              fontWeight: 700,
              letterSpacing: -2.5,
              lineHeight: 1.06,
              maxWidth: 1000,
            }}
          >
            {heroHeadline}
          </div>
          <div
            style={{
              alignItems: 'center',
              alignSelf: 'flex-start',
              backgroundColor: '#18181b',
              borderRadius: 14,
              color: '#fafafa',
              display: 'flex',
              fontSize: 26,
              gap: 14,
              padding: '16px 26px',
            }}
          >
            <div style={{ color: '#34d399', display: 'flex', fontWeight: 700 }}>$</div>
            <div style={{ display: 'flex' }}>{primaryInstallCommand}</div>
          </div>
        </div>

        <div
          style={{
            color: '#71717a',
            display: 'flex',
            fontSize: 19,
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex' }}>Typed Payload CMS block kits — wiring included</div>
          <div style={{ display: 'flex' }}>MIT · Payload v3 · Next.js</div>
        </div>
      </div>
    ),
    size,
  )
}
