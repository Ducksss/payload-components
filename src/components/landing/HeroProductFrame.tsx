import type { CSSProperties } from 'react'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'
import { CheckCircle2, FileCode2, FolderTree, Sparkles } from 'lucide-react'

import styles from './landing.module.css'

const installLog = [
  'Detected supported Payload v3 target',
  'Installed feature-grid-basic kit files',
  'Registered block config and renderer',
  'Generated types and updated import map',
]

const generatedFiles = [
  'src/blocks/FeatureGridBasic/config.ts',
  'src/blocks/FeatureGridBasic/Component.tsx',
  'src/blocks/RenderBlocks.tsx',
  'src/collections/Pages/index.ts',
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
    text: 'payload-kit: install complete',
    width: '29ch',
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
const installedSurfaceRevealStart = filesRevealStart + 100

export const HeroProductFrame = () => {
  return (
    <div
      className={cn(
        styles.productFrame,
        styles.scan,
        'relative mx-auto w-full max-w-6xl overflow-hidden rounded-[1.85rem] border border-foreground/10 bg-foreground text-background shadow-[0_40px_120px_-56px_rgba(15,23,42,0.5)]',
      )}
    >
      <div className="flex items-center justify-between gap-4 border-b border-background/10 px-4 py-3.5 sm:px-5">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-background/40" />
          <span className="size-2.5 rounded-full bg-background/25" />
          <span className="size-2.5 rounded-full bg-background/15" />
        </div>
        <Badge
          variant="secondary"
          className="rounded-full border-0 bg-background/12 px-3 py-1 font-medium text-background/80"
        >
          Product proof
        </Badge>
      </div>

      <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="border-b border-background/10 p-5 lg:border-r lg:border-b-0 lg:p-7">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3 text-sm text-background/70">
              <span className="inline-flex items-center gap-2 rounded-full border border-background/10 px-3 py-1">
                <Sparkles className="size-4" />
                Curated kit install
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-background/10 px-3 py-1">
                <FolderTree className="size-4" />
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
                    Install one of the shipped alpha kits and keep moving
                  </p>
                </div>
                <SquareCommand />
              </div>

              <div className="overflow-hidden rounded-2xl border border-background/10 bg-black/30">
                <div className="px-4 py-4 text-sm leading-7 text-background/82">
                  <code className={styles.terminalBlock}>
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
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {installLog.map((item, index) => (
                <div
                  key={item}
                  className={cn(
                    styles.spawnItem,
                    'flex items-start gap-3 rounded-2xl border border-background/10 bg-background/6 px-4 py-3.5 text-sm text-background/76',
                  )}
                  style={spawnStyle(logRevealStart + index * 120)}
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-background" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-0 sm:grid-cols-2 lg:grid-cols-1">
          <div
            className={cn(
              styles.spawnSection,
              'border-b border-background/10 p-5 lg:p-7',
            )}
            style={spawnStyle(filesRevealStart)}
          >
            <p className="text-xs uppercase tracking-[0.22em] text-background/55">
              Installed and updated files
            </p>
            <div className="mt-4 flex flex-col gap-3 rounded-[1.5rem] border border-background/10 bg-background/6 p-4 sm:p-5">
              {generatedFiles.map((filePath) => (
                <div key={filePath} className="flex items-center gap-3 text-sm text-background/78">
                  <FileCode2 className="size-4 shrink-0 text-background" />
                  <span className="truncate">{filePath}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            className={cn(styles.spawnSection, 'p-5 lg:p-7')}
            style={spawnStyle(installedSurfaceRevealStart)}
          >
            <p className="text-xs uppercase tracking-[0.22em] text-background/55">
              Installed surface
            </p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-[1.5rem] border border-background/10 bg-background text-foreground">
                <div className="border-b border-border/80 px-5 py-4">
                  <p className="text-sm font-medium">Hero Basic</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Headline, CTA, proof ribbon, and Payload-safe defaults.
                  </p>
                </div>
                <div className="grid gap-3 px-5 py-5">
                  <div className="h-3 w-20 rounded-full bg-foreground/15" />
                  <div className="h-7 w-4/5 rounded-full bg-foreground/75" />
                  <div className="h-7 w-3/5 rounded-full bg-foreground/20" />
                  <div className="flex gap-3 pt-2">
                    <div className="h-10 w-28 rounded-full bg-foreground" />
                    <div className="h-10 w-28 rounded-full border border-border" />
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2">
                {[
                  {
                    copy: 'Text-first feature grid with clean layout registration and an optional CTA row.',
                    name: 'Feature Grid Basic',
                  },
                  {
                    copy: 'Two real public kits shipped today while init and doctor remain the next steps.',
                    name: 'Alpha boundary',
                  },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="rounded-[1.5rem] border border-background/10 bg-background/6 p-4"
                  >
                    <p className="text-sm font-medium text-background">{item.name}</p>
                    <p className="mt-2 text-sm text-background/68">
                      {item.copy}
                    </p>
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

const SquareCommand = () => {
  return (
    <div className="grid size-12 place-items-center rounded-2xl border border-background/10 bg-background/6">
      <div className="text-lg font-semibold tracking-[-0.08em] text-background/88">&gt;_</div>
    </div>
  )
}
