'use client'

import { useState } from 'react'

import { DynamicCodeBlock } from 'fumadocs-ui/components/dynamic-codeblock'
import { FileCode } from 'lucide-react'

import { cn } from '@/utilities/ui'

/* Dark, editor-style code viewer for the component docs "Code" tab: a file-tree
 * sidebar (left) + the active file's source (right), styled with the site's
 * existing dark terminal-surface tokens (--terminal*, matching Terminal.tsx).
 * Client component for the file switcher; every file's code is rendered up front
 * and toggled by visibility so switching never re-highlights. The Shiki theme is
 * forced dark (near-black, to match --terminal) regardless of the forced-light
 * site theme. */

const CODE_THEME = 'github-dark-default'

type ComponentSourceFile = { code: string; lang: string; title: string }

const fileName = (title: string) => title.slice(title.lastIndexOf('/') + 1)
const dirName = (title: string) => title.slice(0, title.lastIndexOf('/'))

export function ComponentCodeViewer({ files }: { files: ComponentSourceFile[] }) {
  const [active, setActive] = useState(0)

  if (files.length === 0) return null

  /* Group files by their directory, preserving order and each file's flat index. */
  const groups: { dir: string; items: { file: ComponentSourceFile; index: number }[] }[] = []
  files.forEach((file, index) => {
    const dir = dirName(file.title)
    const last = groups.at(-1)
    if (last && last.dir === dir) last.items.push({ file, index })
    else groups.push({ dir, items: [{ file, index }] })
  })

  return (
    <div className="not-prose my-6 overflow-hidden rounded-xl border border-terminal-border bg-terminal text-terminal-foreground shadow-card">
      {/* Mobile: a horizontal, scrollable file row (the tree collapses under md). */}
      <div className="flex gap-1 overflow-x-auto border-b border-terminal-border bg-terminal-chrome p-2 md:hidden">
        {files.map((file, index) => (
          <button
            key={file.title}
            type="button"
            onClick={() => setActive(index)}
            className={cn(
              'shrink-0 rounded-md px-2.5 py-1 font-mono text-[12px] transition-colors',
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
        <nav className="hidden border-r border-terminal-border bg-terminal-chrome p-2 md:block">
          {groups.map((group) => (
            <div key={group.dir} className="mb-2 last:mb-0">
              <div className="truncate px-2 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-terminal-muted">
                {group.dir}
              </div>
              {group.items.map(({ file, index }) => (
                <button
                  key={file.title}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-current={index === active ? 'true' : undefined}
                  className={cn(
                    'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left font-mono text-[13px] transition-colors',
                    index === active
                      ? 'bg-brand/15 text-brand'
                      : 'text-terminal-muted hover:bg-terminal-foreground/5 hover:text-terminal-foreground',
                  )}
                >
                  <FileCode className="size-3.5 shrink-0 opacity-70" aria-hidden="true" />
                  <span className="truncate">{fileName(file.title)}</span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* Code pane — all files rendered, only the active one shown. */}
        <div className="min-w-0">
          {files.map((file, index) => (
            <div key={file.title} className={index === active ? 'block' : 'hidden'}>
              <DynamicCodeBlock
                lang={file.lang}
                code={file.code}
                options={{ theme: CODE_THEME }}
                codeblock={{
                  'data-line-numbers': true,
                  keepBackground: true,
                  className: 'my-0 rounded-none border-0',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
