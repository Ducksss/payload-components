'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { WiringNodeMap } from './WiringNodeMap'

/* Lazily load React Flow only when we actually enhance — its chunk never
 * blocks first paint, and the static map below is the SSR/fallback render. */
const WiringFlowCanvas = dynamic(
  () => import('./WiringFlowCanvas').then((m) => m.WiringFlowCanvas),
  { ssr: false },
)

/* Progressive enhancement of the install-boundary diagram. SSR and the first
 * client paint render the static WiringNodeMap (boundary). On motion-enabled
 * desktop browsers we swap to the interactive React Flow canvas after mount;
 * the canvas's own reveal/flow are gated on scrolling into view. Reduced-motion
 * users and mobile keep the static map; the media query downgrades live if
 * either condition changes. */
export function WiringFlow({
  caption,
  className,
}: {
  caption?: ReactNode
  className?: string
}) {
  const [enhance, setEnhance] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)')
    const update = () => setEnhance(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  if (!enhance) {
    return <WiringNodeMap state="boundary" caption={caption} className={className} />
  }

  return <WiringFlowCanvas caption={caption} className={className} />
}
