import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import type { ReactNode } from 'react'

import type { Datasheet } from '@/lib/datasheet'
import { MARK_DATA_URI } from '@/lib/og/mark'
import { siteUrl } from '@/lib/site'

/* ImageResponse rasterizes raw image elements server-side; next/image is a
   browser component and cannot participate in Satori's render tree. */
/* eslint-disable @next/next/no-img-element */

/* The shared parts of every social card, drawn as a page of a datasheet: a
 * document strip naming the sheet, the content, and a footer rule. Used by the
 * root opengraph-image, the docs and blog image routes, and both template
 * cards, so the five cannot drift apart.
 *
 * Satori rules (see src/app/_fonts/README.md): fonts are vendored static
 * instances read from disk, never fetched; every drawing is one SVG data URI
 * with its labels laid over it as text, because Satori cannot draw text inside
 * an <img>; no `inset`, no CSS gradients, and never lineClamp with
 * textWrap: 'balance'. */

const fontFile = (name: string) => readFileSync(join(process.cwd(), 'src/app/_fonts', name))

/* Archivo condensed (wght 800, wdth 68) for headlines, Archivo for text and the
   wordmark, Azeret Mono for labels and commands — the site chrome's faces, as
   static instances. Geist is loaded last as a glyph fallback: Satori tries
   every loaded font before it would fetch one, and Geist covers the arrows and
   symbols the Archivo Latin cut leaves out. */
export const ogFonts = [
  {
    data: fontFile('Archivo-CondensedExtraBold.ttf'),
    name: 'Archivo Condensed',
    style: 'normal' as const,
    weight: 800 as const,
  },
  {
    data: fontFile('Archivo-Regular.ttf'),
    name: 'Archivo',
    style: 'normal' as const,
    weight: 400 as const,
  },
  {
    data: fontFile('Archivo-SemiBold.ttf'),
    name: 'Archivo',
    style: 'normal' as const,
    weight: 600 as const,
  },
  {
    data: fontFile('AzeretMono-Regular.ttf'),
    name: 'Azeret Mono',
    style: 'normal' as const,
    weight: 400 as const,
  },
  {
    data: fontFile('AzeretMono-Medium.ttf'),
    name: 'Azeret Mono',
    style: 'normal' as const,
    weight: 500 as const,
  },
  {
    data: fontFile('Geist-Regular.ttf'),
    name: 'Geist',
    style: 'normal' as const,
    weight: 400 as const,
  },
]

export const ogSize = { height: 630, width: 1200 }

/* Hex equivalents of the site tokens: --foreground, --muted-foreground, the
   trace green (--trace, #0B6B4F) and --wire (ink at 24% on paper). */
export const INK = '#111113'
export const MUTED = '#5f5f68'
export const FAINT = '#9b9ba3'
export const RULE = '#e4e4e7'
export const TRACE = '#0B6B4F'
export const WIRE = '#c4c4c6'

export const siteDomain = siteUrl.replace(/^https?:\/\//, '')

const svgUri = (svg: string) => `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`

/* The page: document strip, content, footer rule. */
export function DatasheetCard({
  children,
  docId,
  footer,
  footerEnd = 'MIT · open source',
  section,
}: {
  children: ReactNode
  docId?: string
  footer: string
  footerEnd?: string
  section?: string
}) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        color: INK,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'Archivo',
        height: '100%',
        padding: '40px 56px 34px',
        width: '100%',
      }}
    >
      <div
        style={{
          alignItems: 'center',
          borderBottom: `2px solid ${INK}`,
          display: 'flex',
          justifyContent: 'space-between',
          paddingBottom: 18,
        }}
      >
        <div style={{ alignItems: 'center', display: 'flex' }}>
          <img alt="" height={42} src={MARK_DATA_URI} width={42} />
          <div
            style={{
              display: 'flex',
              fontSize: 27,
              fontWeight: 600,
              letterSpacing: -0.3,
              marginLeft: 14,
            }}
          >
            Payload Components
          </div>
          {section ? (
            <div
              style={{
                borderLeft: `1.5px solid ${RULE}`,
                color: TRACE,
                display: 'flex',
                fontFamily: 'Azeret Mono',
                fontSize: 16,
                fontWeight: 500,
                letterSpacing: 2,
                marginLeft: 18,
                paddingLeft: 18,
              }}
            >
              {section}
            </div>
          ) : null}
        </div>
        {docId ? (
          <div
            style={{
              color: MUTED,
              display: 'flex',
              fontFamily: 'Azeret Mono',
              fontSize: 16,
              letterSpacing: 1.4,
            }}
          >
            {docId}
          </div>
        ) : null}
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>{children}</div>

      <div
        style={{
          borderTop: `1px solid ${RULE}`,
          color: FAINT,
          display: 'flex',
          fontFamily: 'Azeret Mono',
          fontSize: 17,
          justifyContent: 'space-between',
          paddingTop: 16,
        }}
      >
        <div style={{ display: 'flex' }}>{footer}</div>
        <div style={{ display: 'flex' }}>{footerEnd}</div>
      </div>
    </div>
  )
}

/* Headline type: Archivo condensed, sized down as titles get longer. Steps,
   not a clamp, keep long titles inside the card (Satori ellipsizes a balanced,
   clamped title at the wrong width). */
export function headlineSize(title: string, max = 104) {
  const steps = [
    [18, max],
    [28, max - 12],
    [40, max - 24],
    [60, max - 36],
  ] as const
  return steps.find(([length]) => title.length <= length)?.[1] ?? max - 44
}

export function Headline({ children, size }: { children: string; size: number }) {
  return (
    <div
      style={{
        display: 'flex',
        fontFamily: 'Archivo Condensed',
        fontSize: size,
        fontWeight: 800,
        letterSpacing: size * -0.01,
        lineHeight: 0.96,
        textWrap: 'balance',
      }}
    >
      {children}
    </div>
  )
}

export function Lead({ children, lines = 3 }: { children: string; lines?: number }) {
  return (
    <div
      style={{
        color: MUTED,
        display: 'block',
        fontSize: 26,
        lineClamp: lines,
        lineHeight: 1.42,
        marginTop: 22,
      }}
    >
      {children}
    </div>
  )
}

export function Command({ command, size = 21 }: { command: string; size?: number }) {
  return (
    <div
      style={{
        alignItems: 'baseline',
        color: INK,
        display: 'flex',
        fontFamily: 'Azeret Mono',
        fontSize: size,
      }}
    >
      <div style={{ color: TRACE, display: 'flex', fontWeight: 500, marginRight: 14 }}>$</div>
      <div style={{ display: 'flex' }}>{command}</div>
    </div>
  )
}

const MONO_ADVANCE = 0.65

/* A component's pinout at card size: the DIP part with its inputs on the left
   and its outputs traced to the J1 connector, laid out to fit width × height.
   Geometry is one SVG; labels are Satori text placed over it. The part number
   is already in the card's strip, so the chip carries only the die marking. */
export function CardPinout({
  datasheet,
  height,
  maxFont = 20,
  width,
}: {
  datasheet: Datasheet
  height: number
  maxFont?: number
  width: number
}) {
  const inputs = datasheet.inputs.map((pin) => pin.label)
  const { outputs } = datasheet
  const rows = Math.max(inputs.length, outputs.length)
  const longestIn = Math.max(...[...inputs, datasheet.inputKind].map((label) => label.length))
  const longestOut = Math.max(...[...outputs, 'J1 · YOUR PROJECT'].map((label) => label.length))
  const fixed = 6 + 14 + 18 + 96 + 18 + 70 + 20
  const font = Math.min(maxFont, (width - fixed) / ((longestIn + longestOut) * MONO_ADVANCE))

  const labelEnd = 6 + longestIn * font * MONO_ADVANCE
  const x0 = labelEnd + 14 + 18
  const x1 = x0 + 96
  const padX = x1 + 18 + 70
  const top = 40
  const pitch = Math.min(46, (height - top - 56) / Math.max(1, rows - 1 + 0.6))
  const pinY = (row: number) => top + 28 + row * pitch
  const y1 = pinY(rows - 1) + 28
  const outputRow = (index: number) => Math.floor((rows - outputs.length) / 2) + index
  const padPitch = pitch * 1.25
  const padCenter = pinY(outputRow(0)) + ((outputs.length - 1) * pitch) / 2
  const padY = (index: number) => padCenter + (index - (outputs.length - 1) / 2) * padPitch
  const cx = (x0 + x1) / 2
  const cy = (top + y1) / 2

  const shapes: string[] = []
  const labels: Array<{ color: string; end?: boolean; text: string; x: number; y: number }> = []

  for (let row = 0; row < rows; row++) {
    const y = pinY(row)
    shapes.push(
      `<rect x="${x0 - 18}" y="${y - 5}" width="18" height="10" fill="#fff" stroke="${INK}" stroke-width="1.5"/>`,
    )
    labels.push({
      color: inputs[row] ? INK : FAINT,
      end: true,
      text: inputs[row] ?? 'NC',
      x: labelEnd,
      y,
    })

    const index = row - outputRow(0)
    const output = outputs[index]
    if (!output) {
      shapes.push(
        `<rect x="${x1}" y="${y - 5}" width="18" height="10" fill="#fff" stroke="${INK}" stroke-width="1.5"/>`,
      )
      labels.push({ color: FAINT, text: 'NC', x: x1 + 26, y })
      continue
    }
    const pad = padY(index)
    const rise = pad - y
    const jog = x1 + 18 + 18
    const path =
      Math.abs(rise) < 0.5
        ? `M${x1 + 18} ${y}H${padX}`
        : `M${x1 + 18} ${y}H${jog}L${jog + Math.abs(rise)} ${pad}H${padX}`
    shapes.push(
      `<path d="${path}" fill="none" stroke="${TRACE}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`,
    )
    shapes.push(
      `<rect x="${x1}" y="${y - 5}" width="18" height="10" fill="${TRACE}" stroke="${INK}" stroke-width="1.5"/>`,
    )
    shapes.push(
      index === 0
        ? `<rect x="${padX - 8}" y="${pad - 8}" width="16" height="16" rx="1.5" fill="${TRACE}"/>`
        : `<circle cx="${padX}" cy="${pad}" r="8" fill="${TRACE}"/>`,
    )
    shapes.push(`<circle cx="${padX}" cy="${pad}" r="3" fill="#fff"/>`)
    labels.push({ color: INK, text: output, x: padX + 20, y: pad })
  }

  const silkTop = padY(0) - 24
  const silkBottom = padY(outputs.length - 1) + 24
  const notch = `M${x0 + 4} ${top}H${cx - 12}A12 12 0 0 0 ${cx + 12} ${top}H${x1 - 4}A4 4 0 0 1 ${x1} ${top + 4}V${y1 - 4}A4 4 0 0 1 ${x1 - 4} ${y1}H${x0 + 4}A4 4 0 0 1 ${x0} ${y1 - 4}V${top + 4}A4 4 0 0 1 ${x0 + 4} ${top}Z`
  /* The mark's two keyed blocks as the die marking, centred on the chip. */
  const markScale = 2.2
  const block = (offset: number) =>
    `<rect x="${cx + (offset - 12) * markScale}" y="${cy + (offset - 12) * markScale}" width="${8.4 * markScale}" height="${8.4 * markScale}" rx="${1.9 * markScale}" fill="none" stroke="${INK}" stroke-width="1.75"/>`
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `<rect x="${padX - 20}" y="${silkTop}" width="40" height="${silkBottom - silkTop}" rx="3" fill="none" stroke="${WIRE}" stroke-width="1.25"/>`,
    ...shapes,
    `<path d="${notch}" fill="#fff" stroke="${INK}" stroke-width="2"/>`,
    `<circle cx="${x0 + 15}" cy="${top + 15}" r="4.5" fill="${INK}"/>`,
    block(4.8),
    block(10.8),
    '</svg>',
  ].join('')

  const text = (label: (typeof labels)[number], key: string) => (
    <div
      key={key}
      style={{
        alignItems: 'center',
        color: label.color,
        display: 'flex',
        fontFamily: 'Azeret Mono',
        fontSize: font,
        height: font * 1.4,
        lineHeight: 1,
        position: 'absolute',
        top: label.y - font * 0.7,
        ...(label.end ? { right: width - label.x } : { left: label.x }),
      }}
    >
      {label.text}
    </div>
  )

  return (
    <div style={{ display: 'flex', height, position: 'relative', width }}>
      <img
        alt=""
        height={height}
        src={svgUri(svg)}
        style={{ left: 0, position: 'absolute', top: 0 }}
        width={width}
      />
      {text(
        {
          color: MUTED,
          end: true,
          text: datasheet.inputKind.toUpperCase(),
          x: labelEnd,
          y: top - 2,
        },
        'head-in',
      )}
      {text({ color: MUTED, text: 'J1 · YOUR PROJECT', x: padX - 20, y: silkTop - 18 }, 'head-out')}
      {text({ color: MUTED, text: 'U1', x: x0, y: top - 18 }, 'ref')}
      {labels.map((label, index) => text(label, `label-${index}`))}
    </div>
  )
}
