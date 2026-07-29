'use client'

import { useState } from 'react'

import { ExternalLink, Monitor, Smartphone, Tablet } from 'lucide-react'

import type { TemplateShowcase, TemplateViewportPreset } from '@/lib/templates/types'

import { trackTemplateEvent } from '@/lib/analytics'
import { templatePreviewHref } from '@/lib/templates/registry'
import { cn } from '@/utilities/ui'

/* Detail-page preview: one same-origin iframe onto the raw full-preview route,
 * with a page switcher and real-width viewport presets. Like the docs
 * ComponentPreviewFrame, the presets change the iframe's actual width so the
 * template's Tailwind breakpoints genuinely reflow — never CSS-scale a desktop
 * render to fake mobile. The frame keeps a fixed visible height and lets the
 * document inside scroll naturally. Only this one iframe exists per detail
 * page; the gallery mounts none.
 *
 * Interaction events (page switch, viewport switch, open full preview) are
 * reported here with the approved anonymous properties only. */

const PRESETS: {
  icon: typeof Monitor
  label: string
  value: TemplateViewportPreset
  width: number | null
}[] = [
  { icon: Monitor, label: 'Desktop', value: 'desktop', width: null },
  { icon: Tablet, label: 'Tablet', value: 'tablet', width: 768 },
  { icon: Smartphone, label: 'Mobile', value: 'mobile', width: 390 },
]

export function TemplateDetailPreview({
  onPageChange,
  onViewportChange,
  template,
}: {
  onPageChange?: (path: string) => void
  onViewportChange?: (preset: TemplateViewportPreset) => void
  template: TemplateShowcase
}) {
  const [activePath, setActivePath] = useState('')
  const [preset, setPreset] = useState<TemplateViewportPreset>('desktop')

  const activePage = template.pages.find((page) => page.path === activePath) ?? template.pages[0]
  const src = templatePreviewHref(template.slug, activePage.path)

  return (
    <div className="overflow-hidden rounded-frame border border-border bg-card shadow-card">
      <div className="flex flex-wrap items-center gap-3 border-b border-border bg-muted/60 px-3 py-2">
        <div
          role="group"
          aria-label={`${template.title} preview page`}
          className="flex flex-wrap items-center gap-0.5"
        >
          {template.pages.map((page) => (
            <button
              key={page.path}
              type="button"
              aria-pressed={page.path === activePage.path}
              onClick={() => {
                setActivePath(page.path)
                onPageChange?.(page.path)
                trackTemplateEvent('template_preview_page_change', {
                  page: page.path,
                  revision: template.revision,
                  source: 'detail',
                  template: template.slug,
                })
              }}
              className={cn(
                'rounded-md px-2.5 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                page.path === activePage.path
                  ? // brand-600 (not brand) — 14px text on the brand/15 tint over the
                    // muted toolbar needs the darker step to clear WCAG AA 4.5:1.
                    'bg-brand/15 font-medium text-brand-600'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              )}
            >
              {page.label}
            </button>
          ))}
        </div>

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
              onClick={() => {
                setPreset(value)
                onViewportChange?.(value)
                trackTemplateEvent('template_preview_viewport_change', {
                  page: activePage.path,
                  revision: template.revision,
                  source: 'detail',
                  template: template.slug,
                  viewport: value,
                })
              }}
              className={cn(
                'inline-flex size-7 items-center justify-center rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                preset === value
                  ? 'bg-brand/15 text-brand-600'
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
          onClick={() =>
            trackTemplateEvent('template_preview_open', {
              page: activePage.path,
              revision: template.revision,
              source: 'detail',
              template: template.slug,
              viewport: preset,
            })
          }
          className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 font-mono text-[11px] font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ExternalLink className="size-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Open full preview</span>
          <span className="sr-only sm:hidden">Open full preview</span>
        </a>
      </div>

      <div className="flex justify-center bg-dots bg-muted/30 p-3 sm:p-4">
        <div
          className={cn(
            'w-full transition-[max-width] duration-300 ease-out',
            preset !== 'desktop' && 'rounded-lg border border-border shadow-card',
          )}
          style={{ maxWidth: PRESETS.find((p) => p.value === preset)?.width ?? undefined }}
        >
          <iframe
            src={src}
            title={`${template.title} template preview — ${activePage.label} page`}
            loading="lazy"
            className="block w-full bg-background"
            style={{ height: 'min(75vh, 900px)' }}
          />
        </div>
      </div>
    </div>
  )
}
