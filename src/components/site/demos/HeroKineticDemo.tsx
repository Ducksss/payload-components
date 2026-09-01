'use client'

import React, { useMemo, useRef } from 'react'

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'

import { heroKineticDemoContent, type HeroKineticDemoContent } from '@/lib/demo-content'
import { cn } from '@/utilities/ui'

import { DemoLink } from './DemoLink'

/* DEMO TWIN of payload-components/source/blocks/HeroKinetic/Component.tsx
 * (hero-kinetic@0.1.0). Class strings are copied verbatim from the component
 * source, in source order, and the motion timeline (word masks, letterbox
 * plate reveal, velocity marquee) is the same `motion` code. Deliberate
 * substitutions — nothing else may diverge:
 *   <section className="container"> → <div> root (frames own spacing; no landmark)
 *   <h2>                            → <div> (role-neutral; pages own their heading outline)
 *   CMSLink                         → <DemoLink> (@/components/Link exists only in consumer repos)
 *   CTA motion.div whileHover       → plain <div> (hover lift would add focus/gesture handlers;
 *                                      the twin stays inert)
 *   Media                           → always the token-built film still (the demo ships no upload)
 *   HeroKineticBlockData            → HeroKineticDemoContent (@/payload-types is consumer-side)
 * If the component Component.tsx changes, update this file in the same PR. */

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const balanceTitle = (title: string): string[][] => {
  const words = title.trim().split(/\s+/).filter(Boolean)
  if (words.length <= 3) return [words]

  let bestIndex = 1
  let bestScore = Number.POSITIVE_INFINITY
  for (let index = 1; index < words.length; index += 1) {
    const left = words.slice(0, index).join(' ').length
    const right = words.slice(index).join(' ').length
    const score = Math.abs(left - right) - (/[.!?:;—–-]$/.test(words[index - 1]) ? 6 : 0)
    if (score < bestScore) {
      bestScore = score
      bestIndex = index
    }
  }

  return [words.slice(0, bestIndex), words.slice(bestIndex)]
}

const wrapRange = (min: number, max: number, value: number): number => {
  const range = max - min
  return ((((value - min) % range) + range) % range) + min
}

const KineticMarquee: React.FC<{
  items: { label: string }[]
  reduce: boolean
}> = ({ items, reduce }) => {
  const { copies, speed } = useMemo(() => {
    const chars = items.reduce((total, item) => total + item.label.length, 0)
    const groupWidth = Math.max(chars * 12 + items.length * 72, 160)
    const groupCopies = Math.min(24, Math.max(2, Math.ceil(3200 / groupWidth)))
    return { copies: groupCopies, speed: (44 / (groupWidth * groupCopies)) * 100 }
  }, [items])

  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smoothVelocity, [0, 900], [0, 4], { clamp: false })
  const direction = useRef(1)
  const groupPercent = 100 / copies
  const x = useTransform(baseX, (value) => `${wrapRange(-groupPercent, 0, value)}%`)

  useAnimationFrame((_, delta) => {
    if (reduce) return
    const factor = velocityFactor.get()
    if (factor < -0.1) direction.current = -1
    else if (factor > 0.1) direction.current = 1
    const boost = 1 + Math.min(Math.abs(factor), 5)
    baseX.set(baseX.get() - direction.current * speed * boost * (Math.min(delta, 48) / 1000))
  })

  return (
    <div className="relative -mx-6 -mb-10 border-t border-border/70 sm:-mx-8 lg:-mx-12 lg:-mb-16">
      <div
        aria-hidden="true"
        className="hidden overflow-hidden py-5 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)] motion-safe:block lg:py-6"
      >
        <motion.div className="flex w-max items-center gap-x-10" style={{ x }}>
          {Array.from({ length: copies }, (_, copy) => copy).flatMap((copy) =>
            items.map((item, index) => (
              <span key={`${copy}-${index}`} className="flex shrink-0 items-center gap-x-10">
                <span className="text-lg font-medium uppercase tracking-eyebrow text-foreground/75 sm:text-xl">
                  {item.label}
                </span>
                <span className="size-1.5 rotate-45 bg-brand/70" />
              </span>
            )),
          )}
        </motion.div>
      </div>

      <ul className="flex flex-wrap gap-x-8 gap-y-2 px-6 py-5 sm:px-8 lg:px-12 lg:py-6 motion-safe:sr-only">
        {items.map((item, index) => (
          <li
            key={`${item.label}-${index}`}
            className="text-sm uppercase tracking-eyebrow text-muted-foreground"
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

const KineticStill: React.FC<{ reduce: boolean }> = ({ reduce }) => (
  <div aria-hidden="true" className="absolute inset-0">
    <div
      className="absolute inset-0"
      style={{
        background:
          'linear-gradient(to bottom, color-mix(in oklab, var(--background) 14%, transparent), transparent 44%)',
      }}
    />
    <motion.div
      className="absolute -inset-x-1/4 inset-y-0"
      style={{
        background:
          'linear-gradient(104deg, transparent 38%, color-mix(in oklab, var(--background) 13%, transparent) 50%, transparent 62%)',
      }}
      animate={reduce ? undefined : { x: ['-3%', '3%'] }}
      transition={
        reduce
          ? undefined
          : { duration: 16, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }
      }
    />
    <div
      className="absolute"
      style={{
        aspectRatio: '1 / 1',
        background:
          'radial-gradient(circle, color-mix(in oklab, var(--background) 34%, transparent) 0 46%, transparent 60%)',
        left: '72%',
        top: '14%',
        width: '8%',
      }}
    />
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(58% 44% at 50% 76%, color-mix(in oklab, var(--brand) 32%, transparent), transparent 70%)',
      }}
    />
    <div
      className="absolute inset-x-6 sm:inset-x-10"
      style={{
        background:
          'linear-gradient(to right, transparent, color-mix(in oklab, var(--brand) 80%, transparent) 18%, color-mix(in oklab, var(--brand) 80%, transparent) 82%, transparent)',
        height: '1px',
        top: '76%',
      }}
    />
    <div
      className="absolute inset-0 opacity-35"
      style={{
        background:
          'repeating-linear-gradient(0deg, transparent 0 3px, color-mix(in oklab, var(--background) 6%, transparent) 3px 4px)',
      }}
    />
  </div>
)

const KineticPlate: React.FC<{
  imageCaption?: string
  reduce: boolean
}> = ({ imageCaption, reduce }) => {
  const frameRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({ offset: ['start end', 'end start'], target: frameRef })
  const parallax = useTransform(scrollYProgress, [0, 1], ['-4%', '4%'])
  const settle = reduce ? { duration: 0 } : { delay: 0.45, duration: 1.3, ease: EASE }

  return (
    <figure className="w-full">
      <div
        ref={frameRef}
        className="relative aspect-[21/9] overflow-hidden rounded-panel border border-border/70 bg-muted shadow-xl"
      >
        <motion.div
          className="absolute inset-0 bg-foreground motion-reduce:[clip-path:none]!"
          initial={{ clipPath: 'inset(44% 6% 44% 6% round 999px)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0% round 0px)' }}
          transition={settle}
        >
          <motion.div
            className="absolute -inset-[6%] motion-reduce:transform-none!"
            style={{ y: parallax }}
            initial={{ scale: 1.14 }}
            animate={{ scale: 1 }}
            transition={settle}
          >
            <KineticStill reduce={reduce} />
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(120% 90% at 50% 30%, transparent 58%, color-mix(in oklab, var(--foreground) 30%, transparent))',
              }}
            />
          </motion.div>
        </motion.div>

        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute start-4 top-4 size-5 border-s border-t border-background/60 motion-reduce:opacity-100!"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduce ? { duration: 0 } : { delay: 1.2, duration: 0.6, ease: 'easeOut' }}
        />
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-4 end-4 size-5 border-b border-e border-background/60 motion-reduce:opacity-100!"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduce ? { duration: 0 } : { delay: 1.2, duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      {imageCaption ? (
        <motion.figcaption
          className="mt-4 flex items-center gap-3 text-sm text-muted-foreground motion-reduce:opacity-100!"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={reduce ? { duration: 0 } : { delay: 1.35, duration: 0.7, ease: 'easeOut' }}
        >
          <span aria-hidden="true" className="h-px w-8 bg-brand" />
          {imageCaption}
        </motion.figcaption>
      ) : null}
    </figure>
  )
}

export function HeroKineticDemo({
  className,
  content = heroKineticDemoContent,
}: {
  className?: string
  content?: HeroKineticDemoContent
}) {
  const { description, eyebrow, imageCaption, links, marqueeItems, proofItems, title } = content

  const reduce = useReducedMotion() ?? false
  const lines = useMemo(() => balanceTitle(title), [title])
  const lineOffsets = useMemo(
    () =>
      lines.map((_, index) =>
        lines.slice(0, index).reduce((total, line) => total + line.length, 0),
      ),
    [lines],
  )

  const enter = (delay: number, duration = 0.7) =>
    reduce ? { duration: 0 } : { delay, duration, ease: EASE }

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-16">
        <div className="flex flex-col gap-10 lg:gap-12 mx-auto max-w-6xl">
          <div className="flex flex-col gap-6 lg:gap-8">
            <div className="flex items-center gap-4 sm:gap-6">
              {eyebrow ? (
                <motion.p
                  className="flex shrink-0 items-center gap-2.5 text-sm font-medium uppercase tracking-eyebrow motion-reduce:opacity-100! motion-reduce:transform-none!"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={enter(0.05)}
                >
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
                  {eyebrow}
                </motion.p>
              ) : null}
              <motion.span
                aria-hidden="true"
                className="h-px flex-1 origin-left bg-border motion-reduce:transform-none!"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={reduce ? { duration: 0 } : { delay: 0.1, duration: 0.9, ease: EASE }}
              />
            </div>

            <div className="text-5xl font-medium tracking-display sm:text-7xl lg:text-8xl">
              {lines.map((line, lineIndex) => (
                <span key={lineIndex} className="block">
                  {line.map((word, wordIndex) => {
                    const order = lineOffsets[lineIndex] + wordIndex
                    const isClosingWord =
                      lineIndex === lines.length - 1 && wordIndex === line.length - 1
                    return (
                      <React.Fragment key={`${word}-${order}`}>
                        <span className="inline-block overflow-hidden px-2 -mx-2 py-2.5 -my-2.5">
                          <motion.span
                            className={cn(
                              'inline-block will-change-transform motion-reduce:transform-none!',
                              { 'font-serif italic tracking-title': isClosingWord },
                            )}
                            initial={{ y: '125%' }}
                            animate={{ y: '0%' }}
                            transition={enter(0.16 + order * 0.085, 0.85)}
                          >
                            {word}
                          </motion.span>
                        </span>
                        {wordIndex < line.length - 1 ? ' ' : null}
                      </React.Fragment>
                    )
                  })}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row lg:flex-wrap lg:items-end lg:justify-between lg:gap-12">
            <motion.p
              className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg lg:min-w-80 lg:flex-1 motion-reduce:opacity-100! motion-reduce:transform-none!"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={enter(0.55)}
            >
              {description}
            </motion.p>

            <div className="flex shrink-0 flex-col gap-5 lg:items-end">
              {links.length > 0 ? (
                <motion.div
                  className="flex flex-col gap-3 sm:flex-row motion-reduce:opacity-100! motion-reduce:transform-none!"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={enter(0.65)}
                >
                  {links.map(({ link }, index) => (
                    <div key={index} className="group/cta relative">
                      <DemoLink appearance={link.appearance} label={link.label} />
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-1 -bottom-1.5 h-px origin-left scale-x-0 bg-brand transition-transform duration-300 ease-out group-hover/cta:scale-x-100"
                      />
                    </div>
                  ))}
                </motion.div>
              ) : null}

              {proofItems.length > 0 ? (
                <ul className="flex flex-wrap gap-x-5 gap-y-2 lg:justify-end">
                  {proofItems.map(({ label }, index) => (
                    <motion.li
                      key={`${label}-${index}`}
                      className="flex items-center gap-2 text-xs font-medium uppercase tracking-eyebrow text-muted-foreground motion-reduce:opacity-100! motion-reduce:transform-none!"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={enter(0.75 + index * 0.06, 0.6)}
                    >
                      <span aria-hidden="true" className="font-mono text-brand">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {label}
                    </motion.li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          <KineticPlate imageCaption={imageCaption} reduce={reduce} />

          {marqueeItems.length > 0 ? <KineticMarquee items={marqueeItems} reduce={reduce} /> : null}
        </div>
      </div>
    </div>
  )
}
