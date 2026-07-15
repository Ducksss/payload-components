'use client'

import { useEffect, useRef, useState, type ComponentType } from 'react'

type CatalogFamilyTeaserComponent = ComponentType

/* The family wall sits several screens below the hero. Loading it only when it
 * approaches the viewport keeps its eleven live previews out of the critical
 * homepage render while preserving the same catalog experience on scroll. */
export function DeferredCatalogFamilyTeaser() {
  const boundaryRef = useRef<HTMLDivElement>(null)
  const [Teaser, setTeaser] = useState<CatalogFamilyTeaserComponent | null>(null)

  useEffect(() => {
    const boundary = boundaryRef.current
    if (!boundary) return

    let cancelled = false
    let observer: IntersectionObserver | null = null

    const loadTeaser = async () => {
      observer?.disconnect()
      const teaserModule = await import('@/components/site/CatalogFamilyTeaser')
      if (!cancelled) setTeaser(() => teaserModule.CatalogFamilyTeaser)
    }

    if (!('IntersectionObserver' in window)) {
      void loadTeaser()
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) void loadTeaser()
        },
        { rootMargin: '1200px 0px' },
      )
      observer.observe(boundary)
    }

    return () => {
      cancelled = true
      observer?.disconnect()
    }
  }, [])

  if (Teaser) return <Teaser />

  return (
    <div
      ref={boundaryRef}
      aria-busy="true"
      aria-label="Loading component family previews"
      className="min-h-96 rounded-2xl border border-border bg-background/70"
    >
      <span className="sr-only">Loading component family previews</span>
    </div>
  )
}
