import type { Datasheet } from '@/lib/datasheet'

/* Any component as a part on its datasheet: a dual-in-line chip whose left
 * pins are its inputs (the block's fields, or a file-only component's props)
 * and whose right pins trace out to "J1 · your project", one pad per artifact
 * the install writes. Pins run 1…R down the left and back up the right, the DIP
 * convention; a side with fewer signals than the other is filled with NC
 * (no-connect) pins, as a real part would be.
 *
 * The landing hero keeps its own hand-tuned ten-pin drawing
 * (DatasheetPinout); this one is laid out from data, so every component page
 * gets one. Static, decorative and aria-hidden: the figure caption and the
 * sections around it carry the same facts in text. Two drawings, as on the
 * landing — phones get the part turned on its side rather than shrunk. */

/* Azeret Mono advances 0.65em per character; Archivo at wght 800, wdth 68
   averages under 0.48em. Labels are monospace, so these widths are exact. */
const MONO_ADVANCE = 0.65
const CONDENSED_ADVANCE = 0.48

const LABEL_SIZE = 12
const PHONE_LABEL_SIZE = 11
const PART_SIZE = 20

const labelWidth = (text: string, size = LABEL_SIZE) => text.length * size * MONO_ADVANCE

function chipOutline(x0: number, y0: number, x1: number, y1: number) {
  const cx = (x0 + x1) / 2
  return [
    `M${x0 + 4} ${y0}H${cx - 13}A13 13 0 0 0 ${cx + 13} ${y0}H${x1 - 4}`,
    `A4 4 0 0 1 ${x1} ${y0 + 4}V${y1 - 4}A4 4 0 0 1 ${x1 - 4} ${y1}H${x0 + 4}`,
    `A4 4 0 0 1 ${x0} ${y1 - 4}V${y0 + 4}A4 4 0 0 1 ${x0 + 4} ${y0}Z`,
  ].join('')
}

/* The mark's two keyed blocks, as the part's die marking. */
function Marking({ scale, x, y }: { scale: number; x: number; y: number }) {
  return (
    <g className="pinout-marking" transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect height={8.4} rx={1.9} width={8.4} x={4.8} y={4.8} />
      <rect height={8.4} rx={1.9} width={8.4} x={10.8} y={10.8} />
    </g>
  )
}

function Pad({ first, size, x, y }: { first: boolean; size: number; x: number; y: number }) {
  /* Pin 1 of a connector is drawn square — the convention that orients it. */
  return (
    <>
      {first ? (
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
      )}
      <circle className="pinout-hole" cx={x} cy={y} r={size * 0.38} />
    </>
  )
}

function DesktopPinout({ datasheet }: { datasheet: Datasheet }) {
  const inputs = datasheet.inputs.map((pin) => pin.label)
  const { outputs } = datasheet
  const rows = Math.max(inputs.length, outputs.length)
  const pitch = 32
  const leg = 22

  const leftLabels = Math.max(
    ...[...inputs, 'NC', datasheet.inputKind].map((label) => labelWidth(label)),
  )
  const labelEnd = 8 + Math.ceil(leftLabels)
  const x0 = labelEnd + 10 + leg
  const part = datasheet.slug.toUpperCase()
  const chipWidth = Math.max(176, Math.ceil(part.length * PART_SIZE * CONDENSED_ADVANCE) + 72)
  const x1 = x0 + chipWidth
  const padX = x1 + leg + 132
  const width = Math.ceil(padX + 18 + Math.max(...outputs.map((label) => labelWidth(label))) + 8)

  const y0 = 40
  const pinY = (row: number) => y0 + 32 + row * pitch
  const y1 = pinY(rows - 1) + 32
  const height = y1 + 28

  /* Outputs sit in the middle rows of the right side, so the connector is
     centred on the part; the pads fan out a little wider than the pins. */
  const outputRow = (index: number) => Math.floor((rows - outputs.length) / 2) + index
  const padPitch = pitch + 12
  const padCenter = pinY(outputRow(0)) + ((outputs.length - 1) * pitch) / 2
  const padY = (index: number) => padCenter + (index - (outputs.length - 1) / 2) * padPitch
  const cy = (y0 + y1) / 2
  const cx = (x0 + x1) / 2

  return (
    <svg
      aria-hidden="true"
      className="pinout pinout-desktop"
      focusable="false"
      height={height}
      style={{ maxWidth: width }}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
    >
      <text className="pinout-text pinout-head" textAnchor="end" x={labelEnd} y={y0 + 8}>
        {datasheet.inputKind.toUpperCase()}
      </text>
      <text className="pinout-text pinout-ref" x={x0} y={y0 - 12}>
        U1
      </text>
      <text className="pinout-text pinout-head" x={padX - 18} y={padY(0) - 30}>
        J1 · YOUR PROJECT
      </text>

      {Array.from({ length: rows }, (_, row) => {
        const y = pinY(row)
        const label = inputs[row]
        return (
          <g key={`in-${row}`}>
            <rect className="pinout-leg" height={9} width={leg} x={x0 - leg} y={y - 4.5} />
            <text
              className={`pinout-text pinout-label${label ? '' : ' pinout-nc'}`}
              textAnchor="end"
              x={labelEnd}
              y={y + 4}
            >
              {label ?? 'NC'}
            </text>
          </g>
        )
      })}

      <rect
        className="pinout-silk"
        height={padY(outputs.length - 1) - padY(0) + 44}
        rx={3}
        width={36}
        x={padX - 18}
        y={padY(0) - 22}
      />

      {Array.from({ length: rows }, (_, row) => {
        const index = row - outputRow(0)
        const output = outputs[index]
        const y = pinY(row)
        if (!output) {
          return (
            <g key={`out-${row}`}>
              <rect className="pinout-leg" height={9} width={leg} x={x1} y={y - 4.5} />
              <text className="pinout-text pinout-label pinout-nc" x={x1 + leg + 8} y={y + 4}>
                NC
              </text>
            </g>
          )
        }
        const pad = padY(index)
        const rise = pad - y
        const jog = x1 + leg + 28
        const path =
          rise === 0
            ? `M${x1 + leg} ${y}H${padX}`
            : `M${x1 + leg} ${y}H${jog}L${jog + Math.abs(rise)} ${pad}H${padX}`
        return (
          <g className="pinout-net" key={`out-${row}`}>
            <path className="pinout-net-base" d={path} />
            <path className="pinout-wire" d={path} pathLength={100} />
            <rect className="pinout-leg pinout-leg-out" height={9} width={leg} x={x1} y={y - 4.5} />
            <Pad first={index === 0} size={7.5} x={padX} y={pad} />
            <text className="pinout-text pinout-label pinout-out" x={padX + 18} y={pad + 4}>
              {output}
            </text>
          </g>
        )
      })}

      <path className="pinout-chip" d={chipOutline(x0, y0, x1, y1)} />
      <circle className="pinout-chip-dot" cx={x0 + 14} cy={y0 + 14} r={4} />
      {Array.from({ length: rows }, (_, row) => (
        <g key={`num-${row}`}>
          <text className="pinout-text pinout-pin" x={x0 + 8} y={pinY(row) + 3.5}>
            {row + 1}
          </text>
          <text className="pinout-text pinout-pin" textAnchor="end" x={x1 - 8} y={pinY(row) + 3.5}>
            {rows * 2 - row}
          </text>
        </g>
      ))}
      <Marking scale={1.15} x={cx - 13.8} y={cy - 52} />
      <text className="pinout-text pinout-part" textAnchor="middle" x={cx} y={cy + 6}>
        {part}
      </text>
      <text className="pinout-text pinout-maker" textAnchor="middle" x={cx} y={cy + 25}>
        payload-components
      </text>
      <text className="pinout-text pinout-rev" textAnchor="middle" x={cx} y={cy + 41}>
        v{datasheet.version} · {datasheet.license}
      </text>
    </svg>
  )
}

function PhonePinout({ datasheet }: { datasheet: Datasheet }) {
  const inputs = datasheet.inputs.map((pin) => pin.label)
  const { outputs } = datasheet
  const width = 358
  const size = PHONE_LABEL_SIZE
  const chipX0 = 20
  const chipX1 = width - 20

  /* Pins run right to left along each long edge, so pin 1 sits by the notch;
     each label reads to the right of its own lead, stepping up (inputs) or
     down (outputs) so no label crosses another lead. The first pin is placed
     as far right as the longest label still allows. */
  const place = (labels: string[], pitch: number, offset: number) => {
    const first = Math.min(
      chipX1 - 24,
      ...labels.map((label, index) => width - 6 - offset - labelWidth(label, size) + index * pitch),
    )
    return (index: number) => first - index * pitch
  }
  const inPitch = Math.min(26, (chipX1 - chipX0 - 40) / Math.max(1, inputs.length - 1))
  const inX = place(inputs, inPitch, 8)
  const outX = place(outputs, 26, 13)

  const head = 24
  const step = 20
  const leadTop = (index: number) => head + 12 + (inputs.length - 1 - index) * step
  const y0 = leadTop(0) + 26
  const y1 = y0 + 76
  const padY = (index: number) => y1 + 40 + index * 24
  const height = padY(outputs.length - 1) + 34

  return (
    <svg
      aria-hidden="true"
      className="pinout pinout-phone"
      focusable="false"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      width={width}
    >
      <text className="pinout-text pinout-head" textAnchor="end" x={width - 6} y={14}>
        {datasheet.inputKind.toUpperCase()}
      </text>
      <text className="pinout-text pinout-head" textAnchor="end" x={width - 6} y={height - 8}>
        YOUR PROJECT
      </text>

      {inputs.map((label, index) => {
        const x = inX(index)
        const top = leadTop(index)
        return (
          <g key={label}>
            <path className="pinout-lead" d={`M${x} ${y0 - 14}V${top + 2.5}`} />
            <circle className="pinout-lead-end" cx={x} cy={top} r={2.5} />
            <text className="pinout-text pinout-label pinout-label-phone" x={x + 8} y={top + 4}>
              {label}
            </text>
            <rect className="pinout-leg" height={14} width={9} x={x - 4.5} y={y0 - 14} />
          </g>
        )
      })}

      {outputs.map((output, index) => {
        const x = outX(index)
        const pad = padY(index)
        const path = `M${x} ${y1 + 14}V${pad}`
        return (
          <g className="pinout-net" key={output}>
            <path className="pinout-net-base" d={path} />
            <path className="pinout-wire" d={path} pathLength={100} />
            <rect className="pinout-leg pinout-leg-out" height={14} width={9} x={x - 4.5} y={y1} />
            <Pad first={index === 0} size={6} x={x} y={pad} />
            <text
              className="pinout-text pinout-label pinout-label-phone pinout-out"
              x={x + 13}
              y={pad + 4}
            >
              {output}
            </text>
          </g>
        )
      })}

      <path
        className="pinout-chip"
        d={`M${chipX0 + 4} ${y0}H${chipX1 - 4}A4 4 0 0 1 ${chipX1} ${y0 + 4}V${y0 + 28}A10 10 0 0 0 ${chipX1} ${y0 + 48}V${y1 - 4}A4 4 0 0 1 ${chipX1 - 4} ${y1}H${chipX0 + 4}A4 4 0 0 1 ${chipX0} ${y1 - 4}V${y0 + 4}A4 4 0 0 1 ${chipX0 + 4} ${y0}Z`}
      />
      <circle className="pinout-chip-dot" cx={chipX1 - 13} cy={y0 + 13} r={3.5} />
      <Marking scale={0.9} x={chipX0 + 12} y={y0 + 27} />
      <text className="pinout-text pinout-part pinout-part-phone" x={chipX0 + 48} y={y0 + 42}>
        {datasheet.slug.toUpperCase()}
      </text>
      <text className="pinout-text pinout-rev" x={chipX0 + 48} y={y0 + 58}>
        payload-components · v{datasheet.version}
      </text>
    </svg>
  )
}

export function PartPinout({ datasheet }: { datasheet: Datasheet }) {
  return (
    <div className="pinout-sheet">
      <PhonePinout datasheet={datasheet} />
      <DesktopPinout datasheet={datasheet} />
    </div>
  )
}
