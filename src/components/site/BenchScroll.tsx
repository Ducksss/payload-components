'use client'

import { useEffect, useRef, type ReactNode } from 'react'

/* The bench's only client code: scroll position in, progress out. Everything
 * the scene shows is server-rendered; this sets four values on the section and
 * CSS (globals.css, "The bench") does the drawing:
 *
 * - data-step 0-4: which words show, and whether the ledger or the rendered
 *   block fills the lower panel;
 * - --f: how far the input pins have lit (step 1);
 * - --w: how far the five traces have wired (step 2), one after another;
 * - --p: the whole scroll, for the progress rule.
 * In the last step it also marks which part is on the bench (data-active).
 *
 * The scene only pins where it can be read that way: wide, tall enough, and
 * with motion allowed (the same query gates the CSS). Everywhere else the
 * section is a stacked, fully wired page and this does nothing, so the first
 * paint never changes layout when it hydrates. */
const PINNED =
  '(scripting: enabled) and (width >= 64rem) and (height >= 42rem) and (prefers-reduced-motion: no-preference)'

const clamp = (value: number) => Math.min(1, Math.max(0, value))

/* Scroll fractions where each step starts: fields, wiring, block, catalog. */
const STEPS = [0.1, 0.26, 0.6, 0.8] as const

export function BenchScroll({
  children,
  className,
  id,
  labelledBy,
}: {
  children: ReactNode
  className?: string
  id: string
  labelledBy: string
}) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = ref.current
    if (!section) return
    const query = window.matchMedia(PINNED)
    const parts = [...section.querySelectorAll<HTMLElement>('[data-bench-part]')]
    const partCount = new Set(parts.map((part) => part.dataset.benchPart)).size
    let frame = 0
    let shownPart = '0'

    const showPart = (index: string) => {
      if (index === shownPart) return
      shownPart = index
      for (const part of parts)
        part.toggleAttribute('data-active', part.dataset.benchPart === index)
    }

    const update = () => {
      frame = 0
      const stage = section.firstElementChild as HTMLElement | null
      const track = section.offsetHeight - (stage?.offsetHeight ?? window.innerHeight)
      const p = track > 0 ? clamp(-section.getBoundingClientRect().top / track) : 0
      const step = STEPS.filter((start) => p >= start).length
      const f = clamp((p - STEPS[0]) / (STEPS[1] - STEPS[0] - 0.02))
      const w = step >= 3 ? 1 : clamp((p - STEPS[1]) / (STEPS[2] - STEPS[1] - 0.02))

      section.dataset.step = String(step)
      section.style.setProperty('--p', p.toFixed(4))
      section.style.setProperty('--f', f.toFixed(4))
      section.style.setProperty('--w', w.toFixed(4))
      showPart(
        step < 4
          ? '0'
          : String(Math.min(partCount - 1, Math.floor(clamp((p - STEPS[3]) / 0.18) * partCount))),
      )
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    /* Leaving the pinned layout (a resize, or reduced motion switched on) puts
       the stacked page back exactly as it was server-rendered. */
    const reset = () => {
      section.dataset.step = '0'
      for (const name of ['--p', '--f', '--w']) section.style.removeProperty(name)
      showPart('0')
    }

    const sync = () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (query.matches) {
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll, { passive: true })
        update()
      } else {
        reset()
      }
    }

    sync()
    query.addEventListener('change', sync)
    return () => {
      query.removeEventListener('change', sync)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section aria-labelledby={labelledBy} className={className} data-step="0" id={id} ref={ref}>
      {children}
    </section>
  )
}
