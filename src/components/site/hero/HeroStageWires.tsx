import { heroTimeline, spawnStyle, type MotionStyle } from './motion'

/* The fan-out: three emerald wires carrying the command from the rail into
 * the three surfaces below, routed like circuit traces — a vertical drop
 * from under the command, a shared horizontal bus, then a drop into each
 * panel. Faint static tracks show the route; the bright strokes draw along
 * them as the install reaches each surface, and a port lights up where the
 * wire lands. Decorative only (aria-hidden), desktop only — on mobile the
 * panels' numbered labels carry the sequence. */
const ORIGIN_X = 150

/* Endpoints match the lg panel grid [0.95fr_1.2fr_0.95fr] with gap-5 on a
 * 1200-unit viewBox: column centers ≈ 178 / 600 / 1022. The center wire
 * lands higher because the page panel is raised (lg:-mt-4). */
const WIRES = [
  {
    d: `M${ORIGIN_X} 6 L${ORIGIN_X} 32 Q${ORIGIN_X} 40 158 40 L170 40 Q178 40 178 48 L178 84`,
    delay: heroTimeline.wireDelays.admin,
    key: 'admin',
    x: 178,
    y: 84,
  },
  {
    d: `M${ORIGIN_X} 6 L${ORIGIN_X} 32 Q${ORIGIN_X} 40 158 40 L592 40 Q600 40 600 48 L600 66`,
    delay: heroTimeline.wireDelays.page,
    key: 'page',
    x: 600,
    y: 66,
  },
  {
    d: `M${ORIGIN_X} 6 L${ORIGIN_X} 32 Q${ORIGIN_X} 40 158 40 L1014 40 Q1022 40 1022 48 L1022 84`,
    delay: heroTimeline.wireDelays.diff,
    key: 'diff',
    x: 1022,
    y: 84,
  },
] as const

const wireStyle = (delay: number): MotionStyle => ({
  ...spawnStyle(delay),
  '--wire-len': '100',
})

export function HeroStageWires() {
  return (
    <div aria-hidden="true" className="pointer-events-none -mb-1 -mt-2 hidden lg:block">
      <svg
        viewBox="0 0 1200 90"
        preserveAspectRatio="none"
        fill="none"
        className="h-[72px] w-full"
      >
        {/* Static tracks — the route exists before the current flows. */}
        {WIRES.map((wire) => (
          <path
            key={`${wire.key}-track`}
            d={wire.d}
            stroke="var(--brand)"
            strokeOpacity="0.14"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {/* The live strokes drawing outward as each surface is reached. */}
        {WIRES.map((wire) => (
          <path
            key={wire.key}
            d={wire.d}
            pathLength={100}
            className="wire-draw"
            style={wireStyle(wire.delay)}
            stroke="var(--brand)"
            strokeWidth="1.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {/* Origin port under the rail's command. */}
        <circle cx={ORIGIN_X} cy={5} r={3} fill="var(--brand)" />
        {/* Landing ports light as their wire arrives. */}
        {WIRES.map((wire) => (
          <g
            key={`${wire.key}-port`}
            className="hero-port"
            style={spawnStyle(wire.delay + heroTimeline.wirePortLag)}
          >
            <circle cx={wire.x} cy={wire.y} r={7} fill="var(--brand)" fillOpacity="0.16" />
            <circle cx={wire.x} cy={wire.y} r={3} fill="var(--brand)" />
          </g>
        ))}
      </svg>
    </div>
  )
}
