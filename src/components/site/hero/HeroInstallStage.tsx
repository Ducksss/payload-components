import { CommandCopyButton } from '@/components/site/CommandCopyButton'
import { heroStage, primaryInstallCommand, terminalDemoLines } from '@/lib/site'

import { HeroAdminPanel } from './HeroAdminPanel'
import { HeroDiffPanel } from './HeroDiffPanel'
import { HeroPagePanel } from './HeroPagePanel'
import { HeroStageWires } from './HeroStageWires'
import { heroTimeline, tickStyle } from './motion'

/* The install stage: a dark command rail (the page's first <code> element
 * and first Copy button — both pinned by e2e) narrating a real `add` run
 * through its status ticker, emerald wires fanning the command out, and the
 * three surfaces it lands on. Panels render Page → Admin → Diff in the DOM
 * so mobile leads with the payoff; the lg grid re-seats them 01/02/03. */
const tickerLines = heroStage.tickerLineIndices.map((index) => terminalDemoLines[index])
const successLine = terminalDemoLines[terminalDemoLines.length - 1]

export function HeroInstallStage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2.5 rounded-2xl border border-terminal-border bg-terminal py-2.5 pl-4 pr-2.5 shadow-[0_28px_70px_-36px_rgba(15,23,42,0.65)] sm:gap-3 sm:pl-5">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-4">
          <span
            aria-hidden="true"
            className="hidden select-none font-mono text-sm font-semibold text-success sm:block"
          >
            $
          </span>
          <code
            tabIndex={0}
            className="whitespace-normal break-words py-1 font-mono text-xs font-medium text-terminal-foreground sm:overflow-x-auto sm:whitespace-nowrap sm:text-sm"
          >
            {primaryInstallCommand}
          </code>
          <span aria-hidden="true" className="hidden h-4 w-px shrink-0 bg-terminal-border sm:block" />
          {/* Status ticker: one line at a time from the real transcript,
              resting on the success line (the reduced-motion e2e asserts
              that exact text is visible). */}
          <div aria-hidden="true" className="relative hidden h-5 min-w-0 flex-1 sm:block">
            {tickerLines.map((line, index) => (
              <span
                key={line.text}
                className="rail-tick absolute inset-0 truncate font-mono text-xs leading-5 text-terminal-muted"
                style={tickStyle(heroTimeline.tickerStart + index * heroTimeline.tickerGap)}
              >
                {line.text}
              </span>
            ))}
            <span
              className="rail-tick-final absolute inset-0 truncate font-mono text-xs font-medium leading-5 text-success"
              style={tickStyle(heroTimeline.tickerFinal)}
            >
              {successLine.text}
            </span>
          </div>
        </div>
        <CommandCopyButton command={primaryInstallCommand} />
      </div>

      <HeroStageWires />

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.2fr_0.95fr] lg:gap-5">
        <HeroPagePanel className="lg:col-start-2 lg:row-start-1 lg:-mt-4" />
        <HeroAdminPanel className="lg:col-start-1 lg:row-start-1 lg:mt-4" />
        <HeroDiffPanel className="lg:col-start-3 lg:row-start-1 lg:mt-4" />
      </div>
    </div>
  )
}
