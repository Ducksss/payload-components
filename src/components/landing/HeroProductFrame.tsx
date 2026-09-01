import type { CSSProperties } from 'react'

import { cn } from '@/utilities/ui'
import { CheckCircle2, FilePlus2 } from 'lucide-react'

import styles from './landing.module.css'

const installLog = [
  'Detected Payload v3 project',
  'Installed kit files',
  'Registered block config and renderer',
  'Generated types, updated import map',
]

const generatedFiles = [
  { path: 'src/blocks/FeatureGridBasic/config.ts', status: 'added' },
  { path: 'src/blocks/FeatureGridBasic/Component.tsx', status: 'added' },
  { path: 'src/blocks/RenderBlocks.tsx', status: 'updated' },
  { path: 'src/collections/Pages/index.ts', status: 'updated' },
]

const commandLines = [
  {
    animation: 'type',
    duration: 540,
    kind: 'command',
    text: '$ npx payload-kit add feature-grid-basic',
    width: '40ch',
  },
  {
    animation: 'reveal',
    duration: 150,
    kind: 'output',
    text: 'payload-kit: generating types',
    width: '29ch',
  },
  {
    animation: 'reveal',
    duration: 150,
    kind: 'output',
    text: 'payload-kit: updating import map',
    width: '32ch',
  },
  {
    animation: 'reveal',
    duration: 150,
    kind: 'success',
    text: '✓ install complete',
    width: '19ch',
  },
] as const

const lineBaseDelay = 760
const lineGap = 70

type MotionStyle = CSSProperties & {
  '--line-delay'?: string
  '--line-duration'?: string
  '--line-width'?: string
  '--spawn-delay'?: string
}

const terminalLineStyle = (delay: number, duration: number, width: string): MotionStyle => ({
  '--line-delay': `${delay}ms`,
  '--line-duration': `${duration}ms`,
  '--line-width': width,
})

const spawnStyle = (delay: number): MotionStyle => ({
  '--spawn-delay': `${delay}ms`,
})

const typingTimeline = commandLines.reduce<number[]>((acc, line, index) => {
  if (index === 0) {
    acc.push(lineBaseDelay)
    return acc
  }

  const previousDelay = acc[index - 1] ?? lineBaseDelay
  const previousDuration = commandLines[index - 1]?.duration ?? 0
  acc.push(previousDelay + previousDuration + lineGap)
  return acc
}, [])

const typingCompleteAt =
  (typingTimeline[typingTimeline.length - 1] ?? lineBaseDelay) +
  (commandLines[commandLines.length - 1]?.duration ?? 0)

const logRevealStart = typingCompleteAt + 140
const filesRevealStart = logRevealStart + 120
const previewRevealStart = filesRevealStart + 160

export const HeroProductFrame = () => {
  return (
    <div
      className={cn(
        styles.productFrame,
        'relative mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-background shadow-[0_1px_2px_rgba(15,23,42,0.06),0_24px_80px_-32px_rgba(15,23,42,0.28)]',
      )}
    >
      {/* Browser chrome */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-border bg-card px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-[#ff5f57]" />
          <span className="size-3 rounded-full bg-[#febc2e]" />
          <span className="size-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1 font-mono text-xs text-muted-foreground">
          payload-components.xyz
        </div>
        <div />
      </div>

      <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
        {/* Terminal pane */}
        <div className="flex min-w-0 flex-col bg-zinc-950 text-zinc-100">
          <div className="flex items-center justify-between border-b border-white/8 px-5 py-3">
            <p className="font-mono text-xs text-zinc-500">payload-kit — zsh</p>
            <p className="font-mono text-xs text-zinc-600">~/client-site</p>
          </div>
          <div className="flex flex-1 flex-col justify-between gap-6 p-5 sm:p-6">
            <code className={cn(styles.terminalBlock, 'text-sm leading-7')}>
              {commandLines.map((line, index) => (
                <span key={line.text} className={styles.terminalRow}>
                  <span
                    className={cn(
                      styles.terminalLine,
                      line.animation === 'type' ? styles.terminalTyped : styles.terminalReveal,
                      line.kind === 'command'
                        ? styles.terminalCommand
                        : line.kind === 'success'
                          ? styles.terminalSuccess
                          : styles.terminalOutput,
                    )}
                    style={terminalLineStyle(
                      typingTimeline[index] ?? lineBaseDelay,
                      line.duration,
                      line.width,
                    )}
                  >
                    {line.text}
                  </span>
                </span>
              ))}
            </code>

            <div className="grid gap-2">
              {installLog.map((item, index) => (
                <div
                  key={item}
                  className={cn(styles.spawnItem, 'flex items-center gap-2.5 text-sm text-zinc-400')}
                  style={spawnStyle(logRevealStart + index * 110)}
                >
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-400" aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Result pane */}
        <div className="flex min-w-0 flex-col gap-5 border-t border-border bg-background p-5 sm:p-6 lg:border-t-0 lg:border-l">
          <div className={styles.spawnSection} style={spawnStyle(filesRevealStart)}>
            <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
              Added to your repo
            </p>
            <div className="mt-3 flex flex-col overflow-hidden rounded-xl border border-border">
              {generatedFiles.map((file) => (
                <div
                  key={file.path}
                  className="flex items-center justify-between gap-3 border-b border-border bg-card/50 px-3.5 py-2.5 text-sm last:border-b-0"
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <FilePlus2 className="size-4 shrink-0 text-brand" aria-hidden="true" />
                    <span className="truncate font-mono text-[0.8rem] text-foreground/85">
                      {file.path}
                    </span>
                  </span>
                  <span
                    className={cn(
                      'shrink-0 font-mono text-[0.68rem] tracking-wide uppercase',
                      file.status === 'added' ? 'text-emerald-600' : 'text-muted-foreground',
                    )}
                  >
                    {file.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            className={cn(styles.spawnSection, 'flex flex-1 flex-col')}
            style={spawnStyle(previewRevealStart)}
          >
            <p className="font-mono text-xs tracking-[0.14em] text-muted-foreground uppercase">
              Rendered block
            </p>
            <div className="mt-3 flex-1 rounded-xl border border-border bg-background">
              <div className="border-b border-border px-4 py-3">
                <p className="text-sm font-medium">Feature Grid Basic</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Registered in the admin panel, typed end to end.
                </p>
              </div>
              <div className="grid gap-2.5 px-4 py-4">
                <div className="h-2.5 w-16 rounded-full bg-brand/30" />
                <div className="h-5 w-4/5 rounded-full bg-foreground/80" />
                <div className="h-5 w-3/5 rounded-full bg-foreground/15" />
                <div className="mt-1 grid grid-cols-3 gap-2.5">
                  {[0, 1, 2].map((cell) => (
                    <div key={cell} className="grid gap-1.5 rounded-lg border border-border p-2.5">
                      <div className="size-5 rounded-md bg-brand/15" />
                      <div className="h-2 w-full rounded-full bg-foreground/20" />
                      <div className="h-2 w-2/3 rounded-full bg-foreground/10" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
