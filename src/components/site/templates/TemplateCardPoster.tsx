'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'
import Link from '@/i18n/Link'

import { motion, useReducedMotion } from 'motion/react'

/* The gallery card's poster: a springed lift on hover so the card reads as one
 * clickable surface instead of a screenshot with links under it.
 *
 * Kept as its own client island so TemplateCard stays a server component — the
 * card imports @/lib/templates/registry, and pulling that into the client
 * bundle would ship every showcase definition to the browser for a hover.
 *
 * Hover is gated on a genuinely hover-capable pointer ((hover: hover) and
 * (pointer: fine)) — on touch, pointerenter fires on tap and would strand the
 * poster in its hovered state — and off entirely under reduced motion. The
 * resting state is the finished frame, so no CSS net is needed here. */
const LIFT_SPRING = { damping: 24, mass: 0.6, stiffness: 300, type: 'spring' } as const

export function TemplateCardPoster({
  alt,
  height,
  href,
  label,
  priority,
  sizes,
  src,
  width,
}: {
  alt: string
  height: number
  href: string
  label: string
  priority: boolean
  sizes: string
  src: string
  width: number
}) {
  const reduceMotion = useReducedMotion() ?? false
  const [pointerFine, setPointerFine] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setPointerFine(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  const lifts = pointerFine && !reduceMotion

  return (
    <Link
      href={href}
      aria-label={label}
      className="relative block overflow-hidden border-b border-border bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
    >
      <motion.span
        className="block"
        transition={LIFT_SPRING}
        whileHover={lifts ? { scale: 1.035 } : undefined}
      >
        <Image
          alt={alt}
          className="block h-auto w-full"
          height={height}
          priority={priority}
          sizes={sizes}
          src={src}
          width={width}
        />
      </motion.span>
    </Link>
  )
}
