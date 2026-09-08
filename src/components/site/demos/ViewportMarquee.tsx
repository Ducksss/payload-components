'use client'

import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

export function ViewportMarquee({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    if (typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting))
    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <div className={className} data-marquee-active={isVisible ? 'true' : 'false'} ref={ref}>
      {children}
    </div>
  )
}
