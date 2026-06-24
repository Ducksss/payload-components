'use client'

import { useEffect } from 'react'

/* Lightweight scroll parallax for decorative layers.
 *
 * CSS `view()` timelines can't drive these layers: they sit inside
 * overflow-hidden sections that become scroll containers, which makes the
 * timeline degenerate (it never progresses). So a single passive,
 * rAF-throttled scroll handler nudges every `[data-parallax]` element by a
 * clamped fraction of its distance from the viewport centre.
 *
 * Perf-safe by construction: transform-only (composited via translate3d),
 * one shared listener, work coalesced to one rAF per frame, idle when the
 * page isn't scrolling, and disabled entirely under prefers-reduced-motion.
 * The drift is clamped so the (oversized/ masked) decorative layers never
 * expose an edge. */
const MAX_DRIFT_PX = 48

export function ParallaxController() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'))
    if (els.length === 0) return

    let frame = 0

    const update = () => {
      frame = 0
      const viewport = window.innerHeight || document.documentElement.clientHeight
      if (!viewport) return
      const mid = viewport / 2
      for (const el of els) {
        const speed = Number(el.dataset.parallax) || 0.12
        const rect = el.getBoundingClientRect()
        const raw = (mid - (rect.top + rect.height / 2)) * speed
        const drift = Math.max(-MAX_DRIFT_PX, Math.min(MAX_DRIFT_PX, raw))
        el.style.transform = `translate3d(0, ${drift.toFixed(1)}px, 0)`
      }
    }

    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return null
}
