'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { ExternalLink, Monitor, Smartphone, Tablet } from 'lucide-react'

import { cn } from '@/utilities/ui'

/* Responsive preview frame for the component doc pages. The demo twin is
 * loaded in an <iframe> (src = /components/preview/<slug>, or a per-state
 * example route) so it owns its own viewport — that is the only way the
 * twin's Tailwind sm:/lg: breakpoints actually reflow (a CSS-scaled <div>
 * resizes the box but never re-fires media queries). The iframe is measured
 * same-origin and its height tracks the rendered content via a ResizeObserver.
 *
 * Two variants share that measuring logic:
 *   default — the page's main preview: browser-chrome toolbar (traffic
 *     lights, live width, Desktop/Tablet/Mobile presets, "Open") + stage.
 *   example — the Examples section: stage only, no toolbar. Keeping the
 *     preset buttons out of example frames matters — the e2e suite addresses
 *     the main frame's "Mobile"/"Desktop" buttons by exact name, and
 *     Playwright's getByRole is strict about duplicates. */

type Preset = 'desktop' | 'mobile' | 'tablet'

/* Widths chosen to straddle the twin breakpoints: mobile sits below sm (640),
   tablet below lg (1024), desktop is the full panel. */
const PRESETS: { icon: typeof Monitor; label: string; value: Preset; width: number | null }[] = [
  { icon: Monitor, label: 'Desktop', value: 'desktop', width: null },
  { icon: Tablet, label: 'Tablet', value: 'tablet', width: 768 },
  { icon: Smartphone, label: 'Mobile', value: 'mobile', width: 390 },
]

export function ComponentPreviewFrame({
  frameTitle,
  slug,
  src: srcProp,
  title,
  variant = 'default',
}: {
  /* Accessible name of the iframe. Defaults to "<title> preview" (pinned by
     the e2e suite for the main frame); examples pass their own. */
  frameTitle?: string
  slug: string
  /* Defaults to the component's base preview route. */
  src?: string
  title: string
  variant?: 'default' | 'example'
}) {
  const [preset, setPreset] = useState<Preset>('desktop')
  const [height, setHeight] = useState(160)
  const [width, setWidth] = useState<number | null>(null)

  const frameRef = useRef<HTMLIFrameElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentObserverRef = useRef<ResizeObserver | null>(null)

  const src = srcProp ?? `/components/preview/${slug}`
  const hasToolbar = variant === 'default'

  /* Same-origin: read the rendered document height directly. Guarded because the
     contentDocument is briefly null around navigation. */
  const syncHeight = useCallback(() => {
    const doc = frameRef.current?.contentDocument
    const root = doc?.documentElement
    if (!doc || !root) return
    const main = doc.querySelector('main')
    const next = main
      ? Math.max(main.scrollHeight, main.getBoundingClientRect().height)
      : root.scrollHeight
    setHeight(Math.max(120, Math.ceil(next)))
  }, [])

  /* Track the rendered iframe width for the toolbar label (desktop has no fixed
     preset width, so the number comes from the live element). */
  useEffect(() => {
    const el = wrapperRef.current
    if (!hasToolbar || !el || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() =>
      setWidth(Math.round(el.getBoundingClientRect().width)),
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasToolbar])

  const handleLoad = useCallback(() => {
    syncHeight()
    /* Re-sync as the iframe content reflows (web fonts, breakpoint changes from
       the preset buttons, etc.). Replace any observer from a prior load. */
    contentObserverRef.current?.disconnect()
    const doc = frameRef.current?.contentDocument
    if (!doc || typeof ResizeObserver === 'undefined') return
    const target = doc.querySelector('main') ?? doc.documentElement

    if (!target) return

    const observer = new ResizeObserver(syncHeight)
    observer.observe(target)
    contentObserverRef.current = observer
  }, [syncHeight])

  useEffect(() => () => contentObserverRef.current?.disconnect(), [])

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const raf = requestAnimationFrame(syncHeight)
    const timer = window.setTimeout(syncHeight, 50)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(timer)
    }
  }, [preset, syncHeight])

  /* No window border/background of our own: the server parent draws the one
     rounded-xl window around preview + code, so the toolbar is that window's
     top bar and the stage its canvas. */
  return (
    <div className="overflow-hidden">
      {hasToolbar ? (
        <div className="flex items-center gap-4 border-b border-border bg-muted/60 px-4 py-2.5">
          <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-preview-close" />
            <span className="size-2.5 rounded-full bg-preview-minimize" />
            <span className="size-2.5 rounded-full bg-preview-zoom" />
          </div>

          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {width ? `${width}px` : ''}
          </span>

          <div
            role="group"
            aria-label="Preview viewport size"
            className="ml-auto flex items-center gap-1"
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
                  'inline-flex size-9 items-center justify-center rounded-md transition-colors duration-150 ease-out motion-reduce:transition-none',
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
            /* The text label is hidden below sm and the icon is aria-hidden, so
               without this the link has no accessible name on mobile. */
            aria-label="Open preview in a new tab"
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md border border-border bg-background px-4 text-xs font-medium text-muted-foreground transition-colors duration-150 ease-out hover:border-foreground/30 hover:text-foreground motion-reduce:transition-none"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Open</span>
          </a>
        </div>
      ) : null}

      {/* Stage: the wrapper's max-width is the viewport; the iframe fills it and
          owns its own breakpoints. */}
      <div className="flex justify-center bg-muted/30 p-6 sm:p-8">
        <div
          ref={wrapperRef}
          className="w-full transition-[max-width] duration-200 ease-out motion-reduce:transition-none"
          style={{ maxWidth: PRESETS.find((p) => p.value === preset)?.width ?? undefined }}
        >
          <iframe
            ref={frameRef}
            src={src}
            title={frameTitle ?? `${title} preview`}
            /* Example frames sit below the fold and there can be several per
               page; the main preview is the page's first thing. */
            loading={hasToolbar ? 'eager' : 'lazy'}
            onLoad={handleLoad}
            className="block w-full bg-background"
            style={{ height }}
          />
        </div>
      </div>
    </div>
  )
}
