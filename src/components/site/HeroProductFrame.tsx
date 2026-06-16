import type { CSSProperties } from 'react'

import { CheckCircle2, FileCode2, FolderTree, Sparkles } from 'lucide-react'

import { HeroBasicDemo } from '@/components/site/demos/HeroBasicDemo'
import { DemoScaleFrame } from '@/components/site/demos/DemoScaleFrame'
import { frameInstalledFiles, kitEntries, terminalDemoLines } from '@/lib/site'
import { cn } from '@/utilities/ui'

/* The install replay: terminal types the command, progress lines and
 * wiring outcomes land, then the skeleton "before" state yields to the
 * real hero-basic demo twin materializing part by part — command in,
 * working block out. All strings come from terminalDemoLines so the
 * docs, tests, and frame never drift apart. Pure CSS choreography
 * (custom-property delays); HeroInstallReplay remounts the subtree to
 * replay it. */
const commandLine = terminalDemoLines[0]
const progressLines = terminalDemoLines.slice(1, 4)
const successLine = terminalDemoLines[terminalDemoLines.length - 1]
const wiringOutcomes = terminalDemoLines.slice(4, 8)

const TYPE_DURATION_MS = 540
const REVEAL_DURATION_MS = 150
const LINE_BASE_DELAY_MS = 760
const LINE_GAP_MS = 70

/* Progress lines reveal at 1370 / 1590 / 1810. */
const progressDelay = (index: number) =>
  LINE_BASE_DELAY_MS +
  TYPE_DURATION_MS +
  LINE_GAP_MS +
  index * (REVEAL_DURATION_MS + LINE_GAP_MS)

const OUTCOMES_START_MS = 1940
const OUTCOME_STAGGER_MS = 120
const FILES_DELAY_MS = 2150
const SUCCESS_DELAY_MS = 2550
const SKELETON_FADE_MS = 2720
const TWIN_START_MS = 2780
const TWIN_STAGGER_MS = 120

const twinPartDelays = {
  eyebrow: TWIN_START_MS,
  title: TWIN_START_MS + TWIN_STAGGER_MS,
  description: TWIN_START_MS + 2 * TWIN_STAGGER_MS,
  links: TWIN_START_MS + 3 * TWIN_STAGGER_MS,
  proofItems: TWIN_START_MS + 4 * TWIN_STAGGER_MS,
}

/* Emerald wiring traces drawing from the command side across the divider into
 * the installed surface as outcomes land — the literal "wired, not pasted."
 * Decorative (aria-hidden); paths are normalized to pathLength 120 so the
 * shared .wire-draw dash math lands regardless of the rendered aspect. */
const WIRE_START_MS = OUTCOMES_START_MS
const WIRE_STAGGER_MS = 150
const wirePaths = [
  'M98 32 C 112 32 124 38 138 38',
  'M98 50 C 114 50 124 50 138 50',
  'M98 68 C 112 68 124 62 138 62',
]

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

export function HeroProductFrame() {
  const heroKit = kitEntries[0]

  return (
    <div
      className={cn(
        'product-frame relative mx-auto w-full max-w-6xl overflow-hidden rounded-[1.85rem] border border-foreground/10 bg-foreground text-background',
        'shadow-[0_40px_120px_-56px_rgba(15,23,42,0.5)]',
      )}
    >
      <div className="flex items-center justify-between gap-4 border-b border-background/10 px-4 py-3.5 sm:px-5">
        <div className="flex items-center gap-3">
          <div aria-hidden="true" className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-background/40" />
            <span className="size-2.5 rounded-full bg-background/25" />
            <span className="size-2.5 rounded-full bg-background/15" />
          </div>
          <span className="rounded-full bg-background/12 px-3 py-1 text-xs font-medium text-background/80">
            Install replay — real output
          </span>
        </div>
        {/* The right slot hosts the replay control, absolutely positioned
            by HeroInstallReplay so the frame itself stays a server
            component. */}
      </div>

      <div className="relative grid grid-cols-1 gap-0 lg:grid-cols-[1.08fr_0.92fr]">
        {/* Wiring traces: command side → installed surface, drawn as the
            outcomes land. Only meaningful in the side-by-side layout. */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 hidden h-full w-full lg:block"
          viewBox="0 0 200 100"
          preserveAspectRatio="none"
          fill="none"
        >
          {wirePaths.map((d, index) => (
            <path
              key={d}
              d={d}
              className="wire-draw"
              style={spawnStyle(WIRE_START_MS + index * WIRE_STAGGER_MS)}
              pathLength={120}
              stroke="var(--brand)"
              strokeWidth={1.5}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        {/* Command line panel */}
        <div className="min-w-0 border-b border-background/10 p-5 lg:border-b-0 lg:border-r lg:p-7">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3 text-sm text-background/70">
              <span className="inline-flex items-center gap-2 rounded-full border border-background/10 px-3 py-1">
                <Sparkles className="size-4" aria-hidden="true" />
                payload-components install
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
                  {progressLines.map((line, index) => (
                    <span key={line.text} className="terminal-row">
                      <span
                        className="terminal-line terminal-reveal text-background/65"
                        style={lineStyle(
                          progressDelay(index),
                          REVEAL_DURATION_MS,
                          `${line.text.length + 1}ch`,
                        )}
                      >
                        {line.text}
                      </span>
                    </span>
                  ))}
                  <span className="terminal-row">
                    <span
                      className="terminal-line terminal-reveal font-medium text-success"
                      style={lineStyle(
                        SUCCESS_DELAY_MS,
                        REVEAL_DURATION_MS,
                        `${successLine.text.length + 1}ch`,
                      )}
                    >
                      {successLine.text}
                    </span>
                  </span>
                </code>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {wiringOutcomes.map((outcome, index) => (
                <div
                  key={outcome.text}
                  className="spawn-in flex items-start gap-3 rounded-2xl border border-background/10 bg-background/6 px-4 py-3.5 text-sm text-background/76"
                  style={spawnStyle(OUTCOMES_START_MS + index * OUTCOME_STAGGER_MS)}
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

        {/* Installed surface: skeleton "before" yields to the real twin. */}
        <div className="flex min-w-0 flex-col gap-5 p-5 lg:p-7">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-background/55">
              Installed surface
            </p>
            <div className="mt-4 rounded-[1.5rem] border border-background/10 bg-background text-foreground">
              <div className="border-b border-border px-5 py-4">
                <p className="text-sm font-medium">{heroKit.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{heroKit.target} · typed</p>
              </div>
              <div aria-hidden="true" className="relative">
                {/* Layer 1: the "before" skeleton, visible from t=0,
                    fading as the install completes. */}
                <div
                  className="skeleton-fade absolute inset-0 grid content-start gap-3 px-5 py-5"
                  style={spawnStyle(SKELETON_FADE_MS)}
                >
                  <div className="h-3 w-20 rounded-full bg-foreground/15" />
                  <div className="h-7 w-4/5 rounded-full bg-foreground/75" />
                  <div className="h-7 w-3/5 rounded-full bg-foreground/20" />
                  <div className="flex gap-3 pt-2">
                    <div className="h-10 w-28 rounded-full bg-foreground" />
                    <div className="h-10 w-28 rounded-full border border-border" />
                  </div>
                </div>
                {/* Layer 2: the real hero-basic twin materializing. */}
                <DemoScaleFrame className="h-64 [mask-image:linear-gradient(to_bottom,black_82%,transparent)]">
                  <div className="px-4 py-4">
                    <HeroBasicDemo partDelays={twinPartDelays} />
                  </div>
                </DemoScaleFrame>
              </div>
            </div>
          </div>

          <div className="spawn-in" style={spawnStyle(FILES_DELAY_MS)}>
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
        </div>
      </div>
    </div>
  )
}
