import type { CSSProperties } from 'react'

import { CheckCircle2, FileCode2, FolderTree, Sparkles } from 'lucide-react'

import {
  frameHighlights,
  frameInstalledFiles,
  kitEntries,
  terminalDemoLines,
} from '@/lib/site'
import { cn } from '@/utilities/ui'

/* Terminal shows command → resolve/copy → final success; the wiring steps
   in between become the ✓ outcome cards below it. All strings come from
   terminalDemoLines so the docs, tests, and frame never drift apart. */
const commandLine = terminalDemoLines[0]
const revealLines = [...terminalDemoLines.slice(1, 4), terminalDemoLines[9]]
const wiringOutcomes = terminalDemoLines.slice(4, 8)

const TYPE_DURATION_MS = 540
const REVEAL_DURATION_MS = 150
const LINE_BASE_DELAY_MS = 760
const LINE_GAP_MS = 70

type MotionStyle = CSSProperties & {
  '--line-delay'?: string
  '--line-duration'?: string
  '--line-width'?: string
  '--spawn-delay'?: string
}

const lineStyle = (delay: number, duration: number, width: string): MotionStyle => ({
  '--line-delay': `${delay}ms`,
  '--line-duration': `${duration}ms`,
  '--line-width': width,
})

const spawnStyle = (delay: number): MotionStyle => ({
  '--spawn-delay': `${delay}ms`,
})

const revealDelay = (index: number) =>
  LINE_BASE_DELAY_MS + TYPE_DURATION_MS + LINE_GAP_MS + index * (REVEAL_DURATION_MS + LINE_GAP_MS)

const typingCompleteAt = revealDelay(revealLines.length)
const outcomesRevealStart = typingCompleteAt + 140
const filesRevealStart = outcomesRevealStart + 120
const surfaceRevealStart = filesRevealStart + 100

export function HeroProductFrame() {
  const heroKit = kitEntries[0]

  return (
    <div
      className={cn(
        'product-frame scan-sheen relative mx-auto w-full max-w-6xl overflow-hidden rounded-[1.85rem] border border-foreground/10 bg-foreground text-background',
        'shadow-[0_40px_120px_-56px_rgba(15,23,42,0.5)]',
      )}
    >
      <div className="flex items-center justify-between gap-4 border-b border-background/10 px-4 py-3.5 sm:px-5">
        <div aria-hidden="true" className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-background/40" />
          <span className="size-2.5 rounded-full bg-background/25" />
          <span className="size-2.5 rounded-full bg-background/15" />
        </div>
        <span className="rounded-full bg-background/12 px-3 py-1 text-xs font-medium text-background/80">
          Product proof
        </span>
      </div>

      <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1.08fr_0.92fr]">
        {/* Command line panel */}
        <div className="min-w-0 border-b border-background/10 p-5 lg:border-b-0 lg:border-r lg:p-7">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3 text-sm text-background/70">
              <span className="inline-flex items-center gap-2 rounded-full border border-background/10 px-3 py-1">
                <Sparkles className="size-4" aria-hidden="true" />
                payload-kit install
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-background/10 px-3 py-1">
                <FolderTree className="size-4" aria-hidden="true" />
                Payload-aware wiring
              </span>
            </div>

            <div className="rounded-[1.5rem] border border-background/10 bg-background/6 p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-background/55">
                    Command line
                  </p>
                  <p className="mt-2 text-xl font-semibold tracking-[-0.04em] text-background">
                    Install {heroKit.slug} with its wiring
                  </p>
                </div>
                <div
                  aria-hidden="true"
                  className="grid size-12 shrink-0 place-items-center rounded-2xl border border-background/10 bg-background/6"
                >
                  <span className="text-lg font-semibold tracking-[-0.08em] text-background/88">
                    &gt;_
                  </span>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-background/10 bg-black/30">
                <code className="block px-4 py-4 font-mono text-[13px] leading-7">
                  <span className="terminal-row">
                    <span
                      className="terminal-line terminal-typed font-medium text-background/95"
                      style={lineStyle(
                        LINE_BASE_DELAY_MS,
                        TYPE_DURATION_MS,
                        `${commandLine.text.length + 2}ch`,
                      )}
                    >
                      $ {commandLine.text}
                    </span>
                  </span>
                  {revealLines.map((line, index) => (
                    <span key={line.text} className="terminal-row">
                      <span
                        className={cn(
                          'terminal-line terminal-reveal',
                          line.kind === 'success'
                            ? 'font-medium text-success'
                            : 'text-background/65',
                        )}
                        style={lineStyle(
                          revealDelay(index),
                          REVEAL_DURATION_MS,
                          `${line.text.length + 1}ch`,
                        )}
                      >
                        {line.text}
                      </span>
                    </span>
                  ))}
                </code>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {wiringOutcomes.map((outcome, index) => (
                <div
                  key={outcome.text}
                  className="spawn-in flex items-start gap-3 rounded-2xl border border-background/10 bg-background/6 px-4 py-3.5 text-sm text-background/76"
                  style={spawnStyle(outcomesRevealStart + index * 120)}
                >
                  <CheckCircle2
                    className="mt-0.5 size-4 shrink-0 text-success"
                    aria-hidden="true"
                  />
                  <span>{outcome.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Installed files + surface */}
        <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-1">
          <div
            className="spawn-in border-b border-background/10 p-5 lg:p-7"
            style={spawnStyle(filesRevealStart)}
          >
            <p className="text-xs uppercase tracking-[0.22em] text-background/55">
              Installed files
            </p>
            <div className="mt-4 flex flex-col gap-3 rounded-[1.5rem] border border-background/10 bg-background/6 p-4 sm:p-5">
              {frameInstalledFiles.map((filePath) => (
                <div key={filePath} className="flex items-center gap-3 text-sm text-background/78">
                  <FileCode2 className="size-4 shrink-0 text-background" aria-hidden="true" />
                  <span className="truncate font-mono text-[13px]">{filePath}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="spawn-in p-5 lg:p-7" style={spawnStyle(surfaceRevealStart)}>
            <p className="text-xs uppercase tracking-[0.22em] text-background/55">
              Installed surface
            </p>
            <div className="mt-4 grid gap-3">
              {/* Skeleton preview mirroring the hero-basic field contract:
                  eyebrow, title, description, CTA links. */}
              <div className="rounded-[1.5rem] border border-background/10 bg-background text-foreground">
                <div className="border-b border-border px-5 py-4">
                  <p className="text-sm font-medium">{heroKit.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{heroKit.target} · typed</p>
                </div>
                <div aria-hidden="true" className="grid gap-3 px-5 py-5">
                  <div className="h-3 w-20 rounded-full bg-foreground/15" />
                  <div className="h-7 w-4/5 rounded-full bg-foreground/75" />
                  <div className="h-7 w-3/5 rounded-full bg-foreground/20" />
                  <div className="flex gap-3 pt-2">
                    <div className="h-10 w-28 rounded-full bg-foreground" />
                    <div className="h-10 w-28 rounded-full border border-border" />
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {frameHighlights.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-[1.5rem] border border-background/10 bg-background/6 p-4"
                  >
                    <p className="text-sm font-medium text-background">{item.name}</p>
                    <p className="mt-2 text-sm text-background/68">{item.copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
