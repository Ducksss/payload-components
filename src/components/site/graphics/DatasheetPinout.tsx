import type { CSSProperties } from 'react'

import { heroDatasheet } from '@/lib/datasheet'

/* The hero's drawing: hero-basic as a ten-pin part on a datasheet. Its five
 * real fields come in on the left (pins 1–5), and pins 6–10 trace out to the
 * five files an install writes in "J1 · your project": the block source, the
 * two patched host files, and the two regenerated outputs. Labels are file and
 * field identifiers, like the terminal transcript in lib/site, so they stay
 * as data rather than message keys.
 *
 * Server-rendered static SVG — complete without JavaScript, under reduced
 * motion and in every screenshot. With motion allowed, globals.css draws each
 * trace once and lights its pad as it lands (stroke and fill only, no loop).
 * Pointing at a trace dims the others, in CSS alone.
 *
 * Decorative and aria-hidden: the headline and command beside it say the same
 * thing in text. Two drawings, not one scaled: a ten-pin part shrunk to a
 * phone is unreadable, so phones get the part turned on its side, redrawn at
 * its real size. */

const { fields, license, outputs, slug, version } = heroDatasheet
const partLabel = slug.toUpperCase()

/* Vertical pitch of the desktop pins, and of the pads on the connector. */
const PIN_PITCH = 56
const PAD_PITCH = 84

function pinStyle(index: number) {
  return { '--pin': index } as CSSProperties
}

function Pad({ index, size, x, y }: { index: number; size: number; x: number; y: number }) {
  /* Pin 1 of a connector is drawn square — the convention that orients it. */
  const pad =
    index === 0 ? (
      <rect
        className="pinout-pad"
        height={size * 2}
        rx={1.5}
        width={size * 2}
        x={x - size}
        y={y - size}
      />
    ) : (
      <circle className="pinout-pad" cx={x} cy={y} r={size} />
    )

  return (
    <>
      {pad}
      <circle className="pinout-hole" cx={x} cy={y} r={size * 0.38} />
    </>
  )
}

function DesktopPinout() {
  return (
    <svg
      aria-hidden="true"
      className="pinout pinout-desktop"
      focusable="false"
      height={486}
      viewBox="0 0 788 486"
      width={788}
    >
      <defs>
        <pattern
          height={28}
          id="pinout-dots-desktop"
          patternUnits="userSpaceOnUse"
          width={28}
          x={-10}
          y={-12}
        >
          <circle className="pinout-dot" cx={14} cy={14} r={1.1} />
        </pattern>
        <radialGradient cx="50%" cy="50%" id="pinout-fade-desktop" r="62%">
          <stop offset="0.55" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <mask id="pinout-mask-desktop">
          <rect fill="url(#pinout-fade-desktop)" height={486} width={788} />
        </mask>
      </defs>
      <rect
        fill="url(#pinout-dots-desktop)"
        height={486}
        mask="url(#pinout-mask-desktop)"
        width={788}
      />

      <text className="pinout-text pinout-head" textAnchor="end" x={120} y={120}>
        FIELDS
      </text>
      <text className="pinout-text pinout-head" x={586} y={60}>
        J1 · YOUR PROJECT
      </text>
      <text className="pinout-text pinout-ref" x={156} y={82}>
        U1
      </text>

      {fields.map((field, index) => {
        const y = 152 + index * PIN_PITCH
        return (
          <g key={field}>
            <rect className="pinout-leg" height={10} width={24} x={132} y={y - 5} />
            <text className="pinout-text pinout-label" textAnchor="end" x={120} y={y + 4.5}>
              {field}
            </text>
          </g>
        )
      })}

      <rect className="pinout-silk" height={380} rx={3} width={36} x={586} y={74} />

      {outputs.map((output, index) => {
        const pinY = 152 + index * PIN_PITCH
        const padY = 96 + index * PAD_PITCH
        const rise = Math.abs(padY - pinY)
        const path = rise === 0 ? `M360 ${pinY}H604` : `M360 ${pinY}H392L${392 + rise} ${padY}H604`

        return (
          <g className="pinout-net" key={output} style={pinStyle(index)}>
            <path className="pinout-net-base" d={path} />
            <path className="pinout-wire" d={path} pathLength={100} />
            <path className="pinout-pulse" d={path} pathLength={100} />
            <Pad index={index} size={8.5} x={604} y={padY} />
            <text className="pinout-text pinout-label pinout-out" x={638} y={padY + 4.5}>
              {output}
            </text>
          </g>
        )
      })}

      {outputs.map((output, index) => (
        <rect
          className="pinout-leg pinout-leg-out"
          height={10}
          key={output}
          style={pinStyle(index)}
          width={24}
          x={336}
          y={147 + index * PIN_PITCH}
        />
      ))}

      <path
        className="pinout-chip"
        d="M160 96H233A13 13 0 0 0 259 96H332A4 4 0 0 1 336 100V428A4 4 0 0 1 332 432H160A4 4 0 0 1 156 428V100A4 4 0 0 1 160 96Z"
      />
      <circle className="pinout-chip-dot" cx={173} cy={113} r={4.5} />
      {fields.map((field, index) => (
        <text className="pinout-text pinout-pin" key={field} x={166} y={155.5 + index * PIN_PITCH}>
          {index + 1}
        </text>
      ))}
      {outputs.map((output, index) => (
        <text
          className="pinout-text pinout-pin"
          key={output}
          textAnchor="end"
          x={326}
          y={155.5 + index * PIN_PITCH}
        >
          {10 - index}
        </text>
      ))}
      {/* The two keyed blocks of the mark, as the part's die marking. */}
      <g className="pinout-marking" transform="translate(229 200) scale(1.42)">
        <rect height={8.4} rx={1.9} width={8.4} x={4.8} y={4.8} />
        <rect height={8.4} rx={1.9} width={8.4} x={10.8} y={10.8} />
      </g>
      <text className="pinout-text pinout-part" textAnchor="middle" x={246} y={278}>
        {partLabel}
      </text>
      <text className="pinout-text pinout-maker" textAnchor="middle" x={246} y={300}>
        payload-components
      </text>
      <text className="pinout-text pinout-rev" textAnchor="middle" x={246} y={318}>
        v{version} · {license}
      </text>
    </svg>
  )
}

function PhonePinout() {
  /* Pins run right to left along the top edge, so pin 1 sits by the notch. */
  const pinX = (index: number) => 262 - index * 48

  return (
    <svg
      aria-hidden="true"
      className="pinout pinout-phone"
      focusable="false"
      height={424}
      viewBox="0 0 358 424"
      width={358}
    >
      <defs>
        <pattern height={24} id="pinout-dots-phone" patternUnits="userSpaceOnUse" width={24} x={-2}>
          <circle className="pinout-dot" cx={12} cy={12} r={1} />
        </pattern>
        <radialGradient cx="50%" cy="50%" id="pinout-fade-phone" r="64%">
          <stop offset="0.5" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </radialGradient>
        <mask id="pinout-mask-phone">
          <rect fill="url(#pinout-fade-phone)" height={424} width={358} />
        </mask>
      </defs>
      <rect
        fill="url(#pinout-dots-phone)"
        height={424}
        mask="url(#pinout-mask-phone)"
        width={358}
      />

      <text className="pinout-text pinout-head" textAnchor="end" x={352} y={18.2}>
        FIELDS
      </text>
      <text className="pinout-text pinout-head" textAnchor="end" x={352} y={406.2}>
        YOUR PROJECT
      </text>

      {fields.map((field, index) => {
        const x = pinX(index)
        const top = 110 - index * 24
        return (
          <g key={field}>
            <path className="pinout-lead" d={`M${x} 134V${top + 2.5}`} />
            <circle className="pinout-lead-end" cx={x} cy={top} r={2.5} />
            <text className="pinout-text pinout-label pinout-label-phone" x={x + 9} y={top + 4.2}>
              {field}
            </text>
            <rect className="pinout-leg" height={18} width={10} x={x - 5} y={134} />
          </g>
        )
      })}

      {outputs.map((output, index) => {
        const x = pinX(index)
        const padY = 290 + index * 28
        const path = `M${x} 262V${padY}`
        return (
          <g className="pinout-net" key={output} style={pinStyle(index)}>
            <path className="pinout-net-base" d={path} />
            <path className="pinout-wire" d={path} pathLength={100} />
            <path className="pinout-pulse" d={path} pathLength={100} />
            <Pad index={index} size={6.5} x={x} y={padY} />
            <text
              className="pinout-text pinout-label pinout-label-phone pinout-out"
              x={x + 14}
              y={padY + 4.2}
            >
              {output}
            </text>
          </g>
        )
      })}

      {outputs.map((output, index) => (
        <rect
          className="pinout-leg pinout-leg-out"
          height={18}
          key={output}
          style={pinStyle(index)}
          width={10}
          x={pinX(index) - 5}
          y={244}
        />
      ))}

      <path
        className="pinout-chip"
        d="M50 152H282A4 4 0 0 1 286 156V188A10 10 0 0 0 286 208V240A4 4 0 0 1 282 244H50A4 4 0 0 1 46 240V156A4 4 0 0 1 50 152Z"
      />
      <circle className="pinout-chip-dot" cx={272} cy={166} r={3.5} />
      <text
        className="pinout-text pinout-part pinout-part-phone"
        textAnchor="middle"
        x={166}
        y={198}
      >
        {partLabel}
      </text>
      <text className="pinout-text pinout-rev" textAnchor="middle" x={166} y={216}>
        payload-components · v{version}
      </text>
    </svg>
  )
}

export function DatasheetPinout({ className }: { className?: string }) {
  return (
    <div className={className}>
      <PhonePinout />
      <DesktopPinout />
    </div>
  )
}
