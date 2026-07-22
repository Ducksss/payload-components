'use client'

import React, { useEffect, useRef, useState } from 'react'

import type { Transition } from 'motion/react'
import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'

import type { HeroAuroraBlock as HeroAuroraBlockData } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

/* Hero Aurora — a motion-first product hero.
 *
 * Everything luminous is derived from the theme tokens (--brand, --brand-200,
 * --primary, --border, --background) via color-mix, so the same component
 * re-tints itself under any theme scope without a single hardcoded hue.
 * Motion (via the `motion` package) is presentation only: transform/opacity,
 * one spring set for the pointer parallax, and a scoped
 * prefers-reduced-motion net that forces the finished frame — before
 * hydration, without JavaScript, and in screenshot captures. */

type Props = HeroAuroraBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

const EASE_OUT: Transition['ease'] = [0.16, 1, 0.3, 1]
const WORD_SPRING: Transition = { damping: 26, mass: 0.8, stiffness: 340, type: 'spring' }
const PANEL_SPRING: Transition = { damping: 26, mass: 1.1, stiffness: 150, type: 'spring' }
const CHIP_SPRING: Transition = { damping: 22, mass: 0.7, stiffness: 380, type: 'spring' }
const POINTER_SPRING = { damping: 20, mass: 0.4, stiffness: 160 }

/* Aurora drift + the reduced-motion net. Scoped to this block's data
 * attributes and shipped inside the component so consumer repos inherit the
 * safety net with the file. Transform-only keyframes on pre-blurred
 * (gradient-falloff) layers — no animated filters, no background repaints. */
const auroraCss = `
@keyframes pc-aurora-drift-a{0%,100%{transform:translate3d(-3%,-2%,0) scale(1)}50%{transform:translate3d(4%,3%,0) scale(1.08)}}
@keyframes pc-aurora-drift-b{0%,100%{transform:translate3d(3%,3%,0) scale(1.06)}50%{transform:translate3d(-4%,-2%,0) scale(1)}}
@keyframes pc-aurora-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.045)}}
@keyframes pc-aurora-rays{0%,100%{transform:translate3d(-1.4%,0,0)}50%{transform:translate3d(1.4%,0,0)}}
.pc-aurora-drift-a{animation:pc-aurora-drift-a 26s ease-in-out infinite}
.pc-aurora-drift-b{animation:pc-aurora-drift-b 34s ease-in-out infinite}
.pc-aurora-breathe{animation:pc-aurora-breathe 30s ease-in-out infinite}
.pc-aurora-rays{animation:pc-aurora-rays 42s ease-in-out infinite}
@media (prefers-reduced-motion: reduce){
.pc-aurora-drift-a,.pc-aurora-drift-b,.pc-aurora-breathe,.pc-aurora-rays{animation:none}
[data-aurora-root] *{animation-duration:.001s!important;animation-delay:0s!important;animation-iteration-count:1!important;transition-duration:.001s!important}
[data-aurora-root] [data-aurora-reveal]{opacity:1!important;transform:none!important;stroke-dasharray:none!important}
}
`

/* Server and client render identical initial markup (no hydration drift);
 * reduced motion zeroes the transition instead, and the scoped CSS net keeps
 * the frame final even before any JavaScript runs. */
const entrance = (reduceMotion: boolean, delay: number, distance = 18) => ({
  animate: { opacity: 1, y: 0 },
  initial: { opacity: 0, y: distance },
  transition: reduceMotion ? { duration: 0 } : { delay, duration: 0.65, ease: EASE_OUT },
})

const springEntrance = (
  reduceMotion: boolean,
  delay: number,
  spring: Transition,
  distance: number,
  scale?: number,
) => ({
  animate: { opacity: 1, scale: 1, y: 0 },
  initial: { opacity: 0, scale: scale ?? 1, y: distance },
  transition: reduceMotion ? { duration: 0 } : { ...spring, delay },
})

/* ------------------------------------------------------------------ */
/* Metric ticker                                                       */
/* ------------------------------------------------------------------ */

type ParsedMetric = {
  decimals: number
  grouped: boolean
  prefix: string
  suffix: string
  target: number
}

const parseMetricValue = (raw: string): ParsedMetric | null => {
  const match = /^([^0-9]*)([0-9][0-9,]*(?:\.[0-9]+)?)([\s\S]*)$/.exec(raw.trim())
  if (!match) return null
  const [, prefix, numeric, suffix] = match
  const target = Number.parseFloat(numeric.replace(/,/g, ''))
  if (!Number.isFinite(target)) return null
  const decimals = numeric.includes('.') ? numeric.split('.')[1].length : 0
  return { decimals, grouped: numeric.includes(','), prefix, suffix, target }
}

const formatMetricValue = (parsed: ParsedMetric, value: number): string => {
  const text = parsed.grouped
    ? value.toLocaleString('en-US', {
        maximumFractionDigits: parsed.decimals,
        minimumFractionDigits: parsed.decimals,
      })
    : value.toFixed(parsed.decimals)
  return `${parsed.prefix}${text}${parsed.suffix}`
}

/* Server-renders the final value (captures and no-JS read the finished
 * number), then counts up through the same rAF motion runs on. The count
 * writes textContent directly — zero re-renders. Unparsable values simply
 * keep the parent fade. A ghost span reserves the final width so the ticker
 * never causes layout shift. */
function MetricTicker({
  delay,
  reduceMotion,
  value,
}: {
  delay: number
  reduceMotion: boolean
  value: string
}) {
  const nodeRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const node = nodeRef.current
    const parsed = parseMetricValue(value)
    if (reduceMotion || !node || !parsed) return

    const controls = animate(0, parsed.target, {
      delay,
      duration: 1.3,
      ease: EASE_OUT,
      onComplete: () => {
        node.textContent = value
      },
      onUpdate: (latest) => {
        node.textContent = formatMetricValue(parsed, latest)
      },
    })

    return () => {
      controls.stop()
      node.textContent = value
    }
  }, [delay, reduceMotion, value])

  return (
    <span className="relative inline-flex justify-center">
      <span aria-hidden="true" className="invisible">
        {value}
      </span>
      <span className="absolute inset-0 text-center" ref={nodeRef}>
        {value}
      </span>
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Aurora field — the layered light atmosphere behind the content      */
/* ------------------------------------------------------------------ */

function AuroraField() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10" data-aurora-field>
      {/* Base wash pooling under the headline. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(100% 54% at 50% -4%, color-mix(in oklab, var(--brand) 8%, transparent), transparent 60%)',
        }}
      />
      {/* Aurora arch — the top rim of a huge ring rising behind the
          headline, breathing slowly. */}
      <div className="absolute left-1/2 top-0 h-[34rem] w-[165%] -translate-x-1/2 sm:w-full">
        <div
          className="pc-aurora-breathe h-full w-full"
          style={{
            background:
              'radial-gradient(85% 180% at 50% 165%, transparent 71%, color-mix(in oklab, var(--brand) 26%, transparent) 74.5%, color-mix(in oklab, var(--brand-100) 88%, transparent) 77.5%, color-mix(in oklab, var(--brand) 20%, transparent) 80%, transparent 83.5%)',
            transformOrigin: '50% 165%',
          }}
        />
      </div>
      {/* Curtain rays hanging from the arch, shimmering sideways. */}
      <div className="absolute left-1/2 top-0 h-[68%] w-[112%] -translate-x-1/2 opacity-70 sm:opacity-100">
        <div
          className="pc-aurora-rays h-full w-full"
          style={{
            background:
              'linear-gradient(96deg, transparent 6%, color-mix(in oklab, var(--brand) 7%, transparent) 11%, transparent 15%, color-mix(in oklab, var(--brand-200) 28%, transparent) 21%, transparent 26%, color-mix(in oklab, var(--brand) 12%, transparent) 33%, transparent 38%, color-mix(in oklab, var(--brand-100) 42%, transparent) 45%, transparent 51%, color-mix(in oklab, var(--brand) 9%, transparent) 58%, transparent 63%, color-mix(in oklab, var(--brand-200) 24%, transparent) 70%, transparent 75%, color-mix(in oklab, var(--brand) 7%, transparent) 82%, transparent 87%)',
            maskImage: 'linear-gradient(180deg, black 10%, transparent 88%)',
          }}
        />
      </div>
      {/* Drifting corner glows — soft gradient falloff stands in for blur,
          so the drift is pure compositor transform. */}
      <div
        className="pc-aurora-drift-a absolute -left-[14%] -top-[8%] h-[22rem] w-[36rem] max-w-none"
        style={{
          background:
            'radial-gradient(46% 44% at 50% 50%, color-mix(in oklab, var(--brand-200) 40%, transparent), transparent 70%)',
        }}
      />
      <div
        className="pc-aurora-drift-b absolute -right-[12%] -top-[6%] h-[20rem] w-[34rem] max-w-none"
        style={{
          background:
            'radial-gradient(46% 42% at 50% 50%, color-mix(in oklab, var(--brand-100) 52%, transparent), transparent 70%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'radial-gradient(color-mix(in oklab, var(--foreground) 9%, transparent) 1px, transparent 1.5px)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(105% 72% at 50% 0%, black 36%, transparent 76%)',
        }}
      />
      {/* Ink floor grounds the composition. */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/3"
        style={{
          background:
            'radial-gradient(90% 90% at 50% 120%, color-mix(in oklab, var(--primary) 7%, transparent), transparent 62%)',
        }}
      />
      {/* Veil keeps the headline zone airy and AA-clean on any tint. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 44% at 50% 30%, color-mix(in oklab, var(--background) 68%, transparent), transparent 78%)',
        }}
      />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Dashboard glow — the token-derived scene shown without an image     */
/* ------------------------------------------------------------------ */

const CHART_LINE =
  'M0 300 C84 292 128 250 196 246 C258 242 300 210 356 196 C418 180 458 150 516 128 C572 106 634 92 720 72'
const CHART_GHOST =
  'M0 326 C96 320 160 296 232 290 C320 282 380 260 452 246 C540 228 632 210 720 198'

function DashboardGlow({ reduceMotion }: { reduceMotion: boolean }) {
  const gradientId = React.useId()

  return (
    <div className="absolute inset-0" data-aurora-scene>
      {/* Tinted glass base. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, color-mix(in oklab, var(--brand) 10%, var(--background)), var(--background) 58%)',
        }}
      />
      {/* Graph grid. */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(color-mix(in oklab, var(--border) 80%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklab, var(--border) 80%, transparent) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage: 'linear-gradient(180deg, black 26%, transparent 96%)',
        }}
      />
      {/* Bloom behind the chart's climb. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(42% 52% at 72% 30%, color-mix(in oklab, var(--brand) 13%, transparent), transparent 72%)',
        }}
      />
      {/* Signal line, drawing itself on arrival. */}
      <svg
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[72%] w-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 720 360"
      >
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id={gradientId} x1="0" x2="0" y1="60" y2="360">
            <stop offset="0" stopColor="var(--brand)" stopOpacity="0.25" />
            <stop offset="1" stopColor="var(--brand)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={CHART_GHOST}
          stroke="color-mix(in oklab, var(--foreground) 16%, transparent)"
          strokeDasharray="3 7"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        <motion.path
          animate={{ opacity: 1 }}
          d={`${CHART_LINE} L720 360 L0 360 Z`}
          data-aurora-reveal
          fill={`url(#${gradientId})`}
          initial={{ opacity: 0 }}
          transition={reduceMotion ? { duration: 0 } : { delay: 1.9, duration: 0.9, ease: 'easeOut' }}
        />
        <motion.path
          animate={{ opacity: 1, pathLength: 1 }}
          d={CHART_LINE}
          data-aurora-reveal
          initial={{ opacity: 0, pathLength: 0 }}
          stroke="var(--brand)"
          strokeLinecap="round"
          strokeWidth="2.5"
          transition={reduceMotion ? { duration: 0 } : { delay: 1.0, duration: 1.5, ease: 'easeInOut' }}
          vectorEffect="non-scaling-stroke"
        />
        <motion.g
          animate={{ opacity: 1 }}
          data-aurora-reveal
          initial={{ opacity: 0 }}
          transition={reduceMotion ? { duration: 0 } : { delay: 2.3, duration: 0.5, ease: EASE_OUT }}
        >
          <circle cx="664" cy="80" fill="color-mix(in oklab, var(--brand) 22%, transparent)" r="14" />
          <circle cx="664" cy="80" fill="var(--brand)" r="4.5" />
        </motion.g>
      </svg>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Block                                                               */
/* ------------------------------------------------------------------ */

export const HeroAuroraBlock: React.FC<Props> = ({
  className,
  description,
  disableInnerContainer,
  eyebrow,
  id,
  imageCaption,
  links,
  metrics,
  productImage,
  proofItems,
  title,
}) => {
  const reduceMotion = useReducedMotion() ?? false

  /* Pointer parallax — one springed value set, active only on hover-capable
     pointers. Touch and reduced-motion keep the panel perfectly still. */
  const [pointerFine, setPointerFine] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setPointerFine(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  const interactive = pointerFine && !reduceMotion

  const pointerX = useMotionValue(0.5)
  const pointerY = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(pointerY, [0, 1], [4.5, -4.5]), POINTER_SPRING)
  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-6.5, 6.5]), POINTER_SPRING)
  const panelX = useSpring(useTransform(pointerX, [0, 1], [-6, 6]), POINTER_SPRING)
  const panelY = useSpring(useTransform(pointerY, [0, 1], [-4, 4]), POINTER_SPRING)
  const sheenX = useSpring(useTransform(pointerX, [0, 1], [-70, 70]), POINTER_SPRING)
  const shadowX = useTransform(rotateY, [-6.5, 6.5], [16, -16])

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!interactive || event.pointerType === 'touch') return
    const rect = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - rect.left) / rect.width)
    pointerY.set((event.clientY - rect.top) / rect.height)
  }
  const handlePointerLeave = () => {
    pointerX.set(0.5)
    pointerY.set(0.5)
  }

  const words = (title ?? '').trim().split(/\s+/).filter(Boolean)

  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <style>{auroraCss}</style>
      <div
        className="relative isolate overflow-hidden rounded-frame border border-border/70 bg-background px-6 py-14 sm:px-10 sm:py-16 lg:px-14 lg:py-20"
        data-aurora-root
      >
        <AuroraField />
        <div
          className={cn('relative flex flex-col items-center gap-12 lg:gap-14', {
            'mx-auto max-w-6xl': !disableInnerContainer,
          })}
        >
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            {eyebrow ? (
              <motion.div data-aurora-reveal {...entrance(reduceMotion, 0.05, 14)}>
                <Badge
                  className="gap-2 rounded-full border-border/80 bg-background/80 px-3 py-1 uppercase tracking-eyebrow text-muted-foreground"
                  variant="outline"
                >
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
                  {eyebrow}
                </Badge>
              </motion.div>
            ) : null}

            <div className="flex flex-col gap-5">
              <h2 className="text-4xl font-medium leading-[1.06] tracking-display text-balance text-foreground sm:text-6xl">
                <span className="sr-only">{title}</span>
                <span aria-hidden="true">
                  {words.map((word, index) => {
                    const isLast = index === words.length - 1
                    return (
                      <React.Fragment key={`${word}-${index}`}>
                        <motion.span
                          className={cn(
                            'inline-block',
                            isLast && 'font-serif italic tracking-title text-brand-600',
                          )}
                          data-aurora-reveal
                          {...springEntrance(reduceMotion, 0.16 + index * 0.055, WORD_SPRING, 34)}
                        >
                          {word}
                        </motion.span>
                        {isLast ? null : ' '}
                      </React.Fragment>
                    )
                  })}
                </span>
              </h2>
              <motion.p
                className="mx-auto max-w-xl text-base leading-7 text-muted-foreground sm:text-lg"
                data-aurora-reveal
                {...entrance(reduceMotion, 0.42, 16)}
              >
                {description}
              </motion.p>
            </div>

            {links && links.length > 0 ? (
              <motion.div
                className="flex flex-col justify-center gap-3 pt-1 sm:flex-row"
                data-aurora-reveal
                {...entrance(reduceMotion, 0.54, 16)}
              >
                {links.map(({ link }, index) => (
                  <CMSLink
                    key={index}
                    appearance={link.appearance === 'outline' ? 'outline' : 'default'}
                    {...link}
                  />
                ))}
              </motion.div>
            ) : null}

            {metrics && metrics.length > 0 ? (
              <motion.dl
                className="flex flex-wrap items-start justify-center gap-x-10 gap-y-4 pt-2"
                data-aurora-reveal
                {...entrance(reduceMotion, 0.7, 18)}
              >
                {metrics.map(({ label, value }, index) => (
                  <div
                    key={`${label}-${index}`}
                    className={cn(
                      'flex flex-col items-center gap-1',
                      index > 0 && 'sm:border-l sm:border-border/70 sm:pl-10',
                    )}
                  >
                    <dd className="text-3xl font-medium tracking-display tabular-nums text-foreground sm:text-4xl">
                      <MetricTicker delay={0.95 + index * 0.12} reduceMotion={reduceMotion} value={value} />
                    </dd>
                    <dt className="text-xs uppercase tracking-eyebrow text-muted-foreground">
                      {label}
                    </dt>
                  </div>
                ))}
              </motion.dl>
            ) : null}

            {proofItems && proofItems.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-2.5">
                {proofItems.map(({ label }, index) => (
                  <motion.div
                    key={`${label}-${index}`}
                    data-aurora-reveal
                    {...entrance(reduceMotion, 0.84 + index * 0.05, 12)}
                  >
                    <Badge
                      className="gap-1.5 rounded-full border-border/80 bg-background/70 px-3 py-1 text-xs font-normal text-muted-foreground sm:text-sm"
                      variant="outline"
                    >
                      <span aria-hidden="true" className="size-1 rounded-full bg-brand" />
                      {label}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            ) : null}
          </div>

          <motion.figure
            className="group/panel relative w-full max-w-4xl"
            data-aurora-reveal
            onPointerLeave={handlePointerLeave}
            onPointerMove={handlePointerMove}
            {...springEntrance(reduceMotion, 0.5, PANEL_SPRING, 44, 0.96)}
          >
            {/* Ground shadow leans against the tilt. */}
            <motion.div
              aria-hidden="true"
              className="absolute -bottom-9 left-[10%] -z-10 h-16 w-[80%] rounded-full opacity-70"
              style={{
                background:
                  'radial-gradient(50% 50% at 50% 50%, color-mix(in oklab, var(--primary) 24%, transparent), transparent 72%)',
                x: shadowX,
              }}
            />
            <motion.div
              className="relative aspect-video rounded-panel border border-border/70 bg-card shadow-xl"
              style={{
                rotateX,
                rotateY,
                transformPerspective: 1200,
                transformStyle: 'preserve-3d',
                x: panelX,
                y: panelY,
              }}
            >
              {/* Clipped scene layer (image or the token-derived glow). */}
              <div className="absolute inset-0 overflow-hidden rounded-panel">
                {productImage ? (
                  <Media imgClassName="h-full w-full object-cover" resource={productImage} />
                ) : (
                  <DashboardGlow reduceMotion={reduceMotion} />
                )}
                {/* Pointer sheen, gliding across the glass. */}
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-x-16 inset-y-0 opacity-0 transition-opacity duration-700 group-hover/panel:opacity-100"
                  style={{
                    background:
                      'radial-gradient(38% 60% at 50% 28%, color-mix(in oklab, var(--background) 55%, transparent), transparent 72%)',
                    x: sheenX,
                  }}
                />
              </div>

              {productImage ? null : (
                <>
                  {/* KPI chips float above the panel plane — they detach in Z
                      as the panel tilts toward the pointer. */}
                  <motion.div
                    aria-hidden="true"
                    className="absolute left-[5%] top-[10%] w-[24%] min-w-28 rounded-card border border-border/80 bg-background/90 p-3 shadow-lg"
                    data-aurora-reveal
                    style={{ z: 44 }}
                    {...springEntrance(reduceMotion, 1.1, CHIP_SPRING, 18, 0.94)}
                  >
                    <div className="h-1.5 w-12 rounded-full bg-muted-foreground/25" />
                    <div className="mt-3 flex items-end gap-1">
                      <div className="h-2.5 w-1.5 rounded-full bg-brand/25" />
                      <div className="h-4 w-1.5 rounded-full bg-brand/30" />
                      <div className="h-3 w-1.5 rounded-full bg-brand/35" />
                      <div className="h-5 w-1.5 rounded-full bg-brand/45" />
                      <div className="h-4 w-1.5 rounded-full bg-brand/55" />
                      <div className="h-6 w-1.5 rounded-full bg-brand/70" />
                      <div className="h-7 w-1.5 rounded-full bg-brand" />
                    </div>
                  </motion.div>
                  <motion.div
                    aria-hidden="true"
                    className="absolute right-[5%] top-[26%] hidden items-center gap-3 rounded-card border border-border/80 bg-background/90 p-3 shadow-lg sm:flex"
                    data-aurora-reveal
                    style={{ z: 30 }}
                    {...springEntrance(reduceMotion, 1.25, CHIP_SPRING, 18, 0.94)}
                  >
                    <div
                      className="relative size-10 rounded-full"
                      style={{
                        background:
                          'conic-gradient(var(--brand) 0 74%, color-mix(in oklab, var(--muted-foreground) 24%, transparent) 74% 100%)',
                      }}
                    >
                      <div className="absolute inset-1.5 rounded-full bg-background/95" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <div className="h-1.5 w-10 rounded-full bg-muted-foreground/25" />
                      <div className="h-1.5 w-7 rounded-full bg-muted-foreground/15" />
                    </div>
                  </motion.div>
                  <motion.div
                    aria-hidden="true"
                    className="absolute bottom-[9%] left-[5%] inline-flex items-center gap-2 rounded-full border border-border/80 bg-background/90 px-3 py-1.5 shadow-md"
                    data-aurora-reveal
                    style={{ z: 36 }}
                    {...springEntrance(reduceMotion, 1.4, CHIP_SPRING, 14, 0.94)}
                  >
                    <span className="relative flex size-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
                      <span className="relative inline-flex size-2 rounded-full bg-brand" />
                    </span>
                    <span className="h-1.5 w-12 rounded-full bg-muted-foreground/30" />
                  </motion.div>
                </>
              )}

              {/* Glass edge highlight. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-panel"
                style={{
                  boxShadow:
                    'inset 0 1px 0 color-mix(in oklab, var(--background) 85%, transparent), inset 0 0 0 1px color-mix(in oklab, var(--background) 35%, transparent)',
                }}
              />
            </motion.div>
            {imageCaption ? (
              <motion.figcaption
                className="mt-5 text-center text-sm text-muted-foreground"
                data-aurora-reveal
                {...entrance(reduceMotion, 1.15, 10)}
              >
                {imageCaption}
              </motion.figcaption>
            ) : null}
          </motion.figure>
        </div>
      </div>
    </section>
  )
}
