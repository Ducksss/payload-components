'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { ExternalLink, Monitor, Smartphone, Tablet } from 'lucide-react'

import { cn } from '@/utilities/ui'

/* Responsive preview frame for the docs-page "Preview" tab. The demo twin is
 * loaded in an <iframe> (src = /components/preview/<slug>) so it owns its own
 * viewport — that is the only way the twin's Tailwind sm:/lg: breakpoints
 * actually reflow (a CSS-scaled <div> resizes the box but never re-fires media
 * queries). Discrete Desktop/Tablet/Mobile buttons drive the frame's max-width;
 * the iframe is measured same-origin and its height tracks the rendered content
 * via a ResizeObserver. */

type Preset = 'desktop' | 'mobile' | 'tablet'

/* Widths chosen to straddle the twin breakpoints: mobile sits below sm (640),
   tablet below lg (1024), desktop is the full panel. */
const PRESETS: { icon: typeof Monitor; label: string; value: Preset; width: number | null }[] = [
  { icon: Monitor, label: 'Desktop', value: 'desktop', width: null },
  { icon: Tablet, label: 'Tablet', value: 'tablet', width: 768 },
  { icon: Smartphone, label: 'Mobile', value: 'mobile', width: 390 },
]

export function ComponentPreviewFrame({ slug, title }: { slug: string; title: string }) {
  const [preset, setPreset] = useState<Preset>('desktop')
  const [height, setHeight] = useState(420)
  const [width, setWidth] = useState<number | null>(null)

  const frameRef = useRef<HTMLIFrameElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentObserverRef = useRef<ResizeObserver | null>(null)

  const src = `/components/preview/${slug}`

  /* Same-origin: read the rendered document height directly. Guarded because the
     contentDocument is briefly null around navigation. */
  const syncHeight = useCallback(() => {
    const doc = frameRef.current?.contentDocument
    if (!doc) return
    const next = doc.documentElement.scrollHeight
    if (next > 0) setHeight(next)
  }, [])

  /* Track the rendered iframe width for the toolbar label (desktop has no fixed
     preset width, so the number comes from the live element). */
  useEffect(() => {
    const el = wrapperRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => setWidth(Math.round(el.getBoundingClientRect().width)))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleLoad = useCallback(() => {
    syncHeight()
    /* Re-sync as the iframe content reflows (web fonts, breakpoint changes from
       the preset buttons, etc.). Replace any observer from a prior load. */
    contentObserverRef.current?.disconnect()
    const doc = frameRef.current?.contentDocument
    if (!doc || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(syncHeight)
    observer.observe(doc.documentElement)
    contentObserverRef.current = observer
  }, [syncHeight])

  useEffect(() => () => contentObserverRef.current?.disconnect(), [])

  /* No window border/background of our own: the fumadocs Tabs panel already
     frames this (see ComponentDocPreview), so the toolbar is the window's top
     bar and the stage its canvas — avoiding a frame-inside-a-frame-inside-a-frame. */
  return (
    <div className="overflow-hidden">
      {/* Browser-chrome toolbar */}
      <div className="flex items-center gap-3 border-b border-border bg-muted/60 px-3 py-2">
        <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-preview-close" />
          <span className="size-2.5 rounded-full bg-preview-minimize" />
          <span className="size-2.5 rounded-full bg-preview-zoom" />
        </div>

        <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
          {width ? `${width}px` : ''}
        </span>

        <div
          role="group"
          aria-label="Preview viewport size"
          className="ml-auto flex items-center gap-0.5 rounded-md border border-border bg-background p-0.5"
        >
          {PRESETS.map(({ icon: Icon, label, value }) => (
            <button
              key={value}
              type="button"
              aria-label={label}
              aria-pressed={preset === value}
              title={label}
              onClick={() => setPreset(value)}
              className={cn(
                'inline-flex size-7 items-center justify-center rounded transition-colors',
                preset === value
                  ? 'bg-brand/15 text-brand'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
            </button>
          ))}
        </div>

        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 font-mono text-[11px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <ExternalLink className="size-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Open</span>
        </a>
      </div>

      {/* Stage: the wrapper's max-width is the viewport; the iframe fills it and
          owns its own breakpoints. */}
      <div className="flex justify-center bg-muted/30 p-4">
        <div
          ref={wrapperRef}
          className="w-full transition-[max-width] duration-300 ease-out"
          style={{ maxWidth: PRESETS.find((p) => p.value === preset)?.width ?? undefined }}
        >
          <iframe
            ref={frameRef}
            src={src}
            title={`${title} preview`}
            loading="lazy"
            onLoad={handleLoad}
            className="block w-full bg-background"
            style={{ height }}
          />
        </div>
      </div>
    </div>
  )
}
