import type { ReactNode } from 'react'

import { ArrowUpRight } from 'lucide-react'

import { Accent, CaseHeading, Chapter } from '@/components/site/case-study/parts'
import { primaryInstallCommand } from '@/lib/site'

/* Chapter 08: details, shot like jewellery — three circular loupes, each
 * magnifying one small decision. The loupes are illustrations of real surfaces
 * (the second-ink token, the terminal frame, a decision receipt), so their text
 * is decorative and aria-hidden; each caption says what it shows. */

function Loupe({
  caption,
  children,
  dark = false,
}: {
  caption: string
  children: ReactNode
  dark?: boolean
}) {
  return (
    <figure className="flex flex-col items-center gap-6 text-center">
      <div
        aria-hidden="true"
        className={
          dark
            ? 'flex aspect-square w-full max-w-[22rem] items-center justify-center overflow-hidden rounded-full bg-terminal p-10 shadow-frame ring-8 ring-muted'
            : 'bg-dots flex aspect-square w-full max-w-[22rem] items-center justify-center overflow-hidden rounded-full border border-border bg-background p-10 shadow-frame ring-8 ring-muted'
        }
      >
        {children}
      </div>
      <figcaption className="max-w-xs font-mono text-[11px] leading-5 text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  )
}

export function CaseDetails() {
  const [binary, component] = primaryInstallCommand.split(' add ')

  return (
    <section className="relative overflow-x-clip border-b border-border">
      <div className="container py-24 lg:py-36">
        <Chapter index="08">Details</Chapter>
        <CaseHeading className="mt-8 max-w-5xl">
          The craft is in the <Accent>small</Accent> print.
        </CaseHeading>

        <div className="mt-16 grid gap-16 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3 lg:gap-10">
          <Loupe caption="Second ink. --muted-foreground sits at 46% lightness, about 7.1:1 on white — muted, and still well past AA's 4.5.">
            <div className="flex flex-col items-center gap-3">
              <span className="text-7xl font-medium tracking-title text-muted-foreground">Aa</span>
              <span className="font-mono text-sm text-foreground">7.1 : 1</span>
            </div>
          </Loupe>

          <Loupe
            caption="The one dark surface. The terminal frame keeps its own tokens on every page: it is the product, not a second theme."
            dark
          >
            <div className="flex w-full flex-col gap-2 text-start font-mono text-[13px] leading-6 text-terminal-foreground">
              {/* Broken at the verb so the command never wraps mid-slug. */}
              <span>
                <span className="text-success">$</span> {binary}
                <span className="block ps-4">add {component}</span>
              </span>
              <span className="text-terminal-muted">registered · mapped · typed</span>
              <span>
                <span className="text-success">✓</span> wired into Payload
              </span>
            </div>
          </Loupe>

          <Loupe caption="A receipt. Every decision in the design philosophy names what it replaced and links the file that enforces it.">
            <div className="flex w-full flex-col gap-4 text-start">
              <p className="text-sm leading-6 text-muted-foreground">
                <span className="me-2 font-mono text-[10px] font-medium uppercase tracking-eyebrow text-foreground">
                  Instead of
                </span>
                <s className="decoration-brand/70">an interactive variant prompt</s>
              </p>
              <p className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                <span className="text-[10px] font-medium uppercase tracking-eyebrow text-foreground">
                  Receipt
                </span>
                <span className="underline decoration-border underline-offset-4">
                  registry.json
                </span>
                <ArrowUpRight className="size-3" />
              </p>
            </div>
          </Loupe>
        </div>
      </div>
    </section>
  )
}
