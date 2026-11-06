'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock'
import { Check, Copy, FileCode } from 'lucide-react'

import { groupComponentSourceFiles } from '@/lib/component-source-groups'
import { cn } from '@/utilities/ui'

/* Client pieces of the component docs' code surfaces, all on the site's dark
 * terminal tokens (--terminal*, matching Terminal.tsx):
 *
 *   ComponentCodeViewer — editor-style viewer: a file-tree sidebar (left) and
 *     the active file's source (right) with a path bar + copy button. Every
 *     file's code is rendered up front and toggled by visibility so switching
 *     never re-highlights.
 *   ComponentCodePeek — the collapsed "View code" band: a clipped, faded peek
 *     of the code with a centred disclosure button; expanding swaps it for the
 *     full content in place (nothing above moves) with a "Collapse" band below.
 *   CopyCodeButton — the confirm-on-click copy control the bars share.
 *
 * None of these own a window border: the server parent (ComponentDocPreview /
 * ComponentExample) draws the one rounded-xl window around preview + code.
 * The Shiki theme is forced dark regardless of the forced-light site theme;
 * it must match CODE_THEME in ComponentDocPreview.tsx, where the server-side
 * peeks are highlighted. */

const CODE_THEME = 'github-dark-default'

/* Both Shiki "modes" point at the dark theme and defaultColor is off, so the
   output carries CSS variables (no inline background) and the block's surface
   is our bg-terminal everywhere — the pre, its padding, and the peek fade all
   share one colour. */
const codeOptions = {
  defaultColor: false as const,
  themes: { dark: CODE_THEME, light: CODE_THEME },
}

type ComponentSourceFile = { code: string; lang: string; title: string }

const fileName = (title: string) => title.slice(title.lastIndexOf('/') + 1)

/* The one button style on the dark surface. Hover is a border/colour change
   only — no lift. */
const darkButtonClass =
  'inline-flex h-9 items-center gap-2 rounded-md border px-4 text-sm font-medium transition-colors duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand motion-reduce:transition-none'

const darkButtonRest =
  'border-terminal-border bg-terminal-chrome text-terminal-foreground hover:border-terminal-foreground/30 hover:text-terminal-foreground'

export function CopyCodeButton({ code, className }: { className?: string; code: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      // Clipboard writes can be denied in locked-down browsers; the visible state still confirms the action.
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1100)
  }

  return (
    <button
      type="button"
      onClick={copy}
      /* "Copy code" contains the visible "Copy", so the name stays
         label-in-name compliant while saying what gets copied. */
      aria-label={copied ? 'Copied' : 'Copy code'}
      className={cn(
        darkButtonClass,
        'shrink-0 font-mono text-xs',
        copied ? 'border-brand/40 bg-brand/15 text-brand' : darkButtonRest,
        className,
      )}
    >
      {copied ? (
        <Check className="size-4" aria-hidden="true" />
      ) : (
        <Copy className="size-4" aria-hidden="true" />
      )}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

export function ComponentCodeViewer({ files }: { files: ComponentSourceFile[] }) {
  const [active, setActive] = useState(0)

  if (files.length === 0) return null

  /* Group files by directory even when source ranking interleaves shared files. */
  const groups = groupComponentSourceFiles(files)
  const current = files[active]

  return (
    <div className="bg-terminal text-terminal-foreground">
      {/* Mobile: a horizontal, scrollable file row (the tree collapses under md). */}
      <div className="flex gap-1 overflow-x-auto border-b border-terminal-border bg-terminal-chrome p-3 md:hidden">
        {files.map((file, index) => (
          <button
            key={file.title}
            type="button"
            onClick={() => setActive(index)}
            aria-current={index === active ? 'true' : undefined}
            className={cn(
              'h-9 shrink-0 rounded-md px-4 font-mono text-xs transition-colors duration-150 ease-out motion-reduce:transition-none',
              index === active
                ? 'bg-brand/15 text-brand'
                : 'text-terminal-muted hover:text-terminal-foreground',
            )}
          >
            {fileName(file.title)}
          </button>
        ))}
      </div>

      <div className="md:grid md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
        {/* File tree (md+). */}
        <nav
          aria-label="Installed files"
          className="hidden border-r border-terminal-border bg-terminal-chrome p-3 md:block"
        >
          {groups.map((group) => (
            <div key={group.dir} className="mb-3 last:mb-0">
              {/* A path, not a label: keep its case and letter-spacing so
                  src/blocks/HeroBasic still reads (and fits) as a path. */}
              <div className="truncate px-3 py-2 font-mono text-xs text-terminal-muted">
                {group.dir}
              </div>
              {group.items.map(({ file, index }) => (
                <button
                  key={file.title}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-current={index === active ? 'true' : undefined}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left font-mono text-[13px] transition-colors duration-150 ease-out motion-reduce:transition-none',
                    index === active
                      ? 'bg-brand/15 text-brand'
                      : 'text-terminal-muted hover:bg-terminal-foreground/5 hover:text-terminal-foreground',
                  )}
                >
                  <FileCode className="size-4 shrink-0 opacity-70" aria-hidden="true" />
                  <span className="truncate">{fileName(file.title)}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Code pane: a path bar (with the copy control) above the active file.
            All files are rendered, only the active one is shown. */}
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-3 border-b border-terminal-border px-4 py-2.5">
            <span className="truncate font-mono text-xs text-terminal-muted">{current.title}</span>
            <CopyCodeButton code={current.code} />
          </div>
          {files.map((file, index) => (
            <div key={file.title} className={index === active ? 'block' : 'hidden'}>
              <DynamicCodeBlock
                lang={file.lang}
                code={file.code}
                options={codeOptions}
                codeblock={{
                  allowCopy: false,
                  'data-line-numbers': true,
                  className: 'my-0 rounded-none border-0 bg-terminal text-terminal-foreground',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* Collapsed-by-default disclosure for a code surface. `peek` is the clipped
 * teaser (server-highlighted first lines); `children` is the full content.
 * The teaser band and the expanded content occupy the same slot, so toggling
 * never moves anything above it. Focus follows the toggle: expanding moves it
 * to the revealed region, collapsing returns it to the "View …" button. */
export function ComponentCodePeek({
  children,
  id,
  label = 'View code',
  peek,
}: {
  children: ReactNode
  id: string
  label?: string
  peek: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const expandRef = useRef<HTMLButtonElement>(null)
  const regionRef = useRef<HTMLDivElement>(null)
  const pendingFocus = useRef<'expand' | 'region' | null>(null)

  useEffect(() => {
    const target = pendingFocus.current
    pendingFocus.current = null
    if (target === 'region') regionRef.current?.focus({ preventScroll: true })
    if (target === 'expand') expandRef.current?.focus()
  }, [open])

  const expand = () => {
    pendingFocus.current = 'region'
    setOpen(true)
  }

  const collapse = () => {
    pendingFocus.current = 'expand'
    setOpen(false)
  }

  return (
    <div className="border-t border-border bg-terminal text-terminal-foreground">
      {/* Collapsed: the teaser, clipped to ~9rem and faded into the band, with
          the disclosure centred over it. `inert` keeps the clipped code out of
          the tab order and the accessibility tree — the full copy is one click
          away — without hiding it from sighted readers. */}
      <div hidden={open} className="relative">
        <div inert className="max-h-36 overflow-hidden">
          {peek}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-terminal/10 via-terminal/70 to-terminal px-6 py-5">
          <button
            ref={expandRef}
            type="button"
            aria-expanded={open}
            aria-controls={id}
            onClick={expand}
            className={cn(darkButtonClass, darkButtonRest)}
          >
            {label}
          </button>
        </div>
      </div>

      {/* Expanded: the full content, then the collapse band. */}
      <div id={id} ref={regionRef} tabIndex={-1} hidden={!open} className="outline-none">
        {children}
        <div className="flex justify-center border-t border-terminal-border px-6 py-5">
          <button
            type="button"
            aria-expanded={open}
            aria-controls={id}
            onClick={collapse}
            className={cn(darkButtonClass, darkButtonRest)}
          >
            Collapse
          </button>
        </div>
      </div>
    </div>
  )
}
