import type { ReactNode } from 'react'

import { ArrowUpRight } from 'lucide-react'

import { DesignGlyph, type DesignGlyphName } from '@/components/site/design/DesignGlyphs'
import { Logomark } from '@/components/site/Logomark'
import Link from '@/i18n/Link'
import { githubContentBranch, githubRepoUrl } from '@/lib/site'

/* Structural pieces for the /docs/design essay. Every one wraps authored MDX
 * rather than holding copy, so the headings stay real markdown headings (TOC,
 * search, anchors) and the /llms surfaces serialize the prose verbatim. Numbering
 * and the section/refusal/contents typography live in docs.css under
 * [data-editorial]. */

/* Backticks in a prop string render as inline code — enough for flag names. */
function withInlineCode(text: string) {
  return text.split(/(`[^`]+`)/).map((part, index) =>
    part.startsWith('`') && part.endsWith('`') ? (
      <code key={index} className="font-mono text-[0.92em]">
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    ),
  )
}

export function DesignContents({ children }: { children: ReactNode }) {
  return (
    <nav aria-label="Contents" className="design-contents not-prose my-14">
      <p className="font-mono text-[11px] font-medium uppercase tracking-eyebrow text-muted-foreground">
        Contents
      </p>
      {children}
    </nav>
  )
}

export function DesignQuote({
  children,
  cite,
  href,
}: {
  children: ReactNode
  cite?: string
  href?: string
}) {
  return (
    <figure className="design-quote not-prose my-14 border-s-2 border-brand ps-6 @3xl:my-20 @3xl:ps-10">
      <blockquote className="max-w-4xl text-balance text-[clamp(1.6rem,3.4vw,2.6rem)] font-medium leading-[1.12] tracking-snug text-foreground">
        {children}
      </blockquote>
      {cite ? (
        <figcaption className="mt-5 font-mono text-[11px] font-medium uppercase tracking-eyebrow text-muted-foreground">
          {href ? (
            <Link
              className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
              href={href}
            >
              {cite}
            </Link>
          ) : (
            cite
          )}
        </figcaption>
      ) : null}
    </figure>
  )
}

export function DesignPrinciples({ children }: { children: ReactNode }) {
  return (
    <div className="design-principles my-12 grid gap-x-12 @3xl:grid-cols-2 @6xl:grid-cols-3">
      {children}
    </div>
  )
}

export function DesignPrinciple({
  children,
  glyph,
}: {
  children: ReactNode
  glyph: DesignGlyphName
}) {
  return (
    <div className="design-principle group border-t border-border pb-8 pt-7">
      <div className="not-prose flex items-start justify-between gap-6">
        {/* The glyph sits on a vignetted patch of the Plate I dot grid, like a thumbnail. */}
        <div className="relative">
          <span
            aria-hidden="true"
            className="bg-dots absolute -inset-6 [mask-image:radial-gradient(closest-side,black_60%,transparent)]"
          />
          <DesignGlyph className="relative size-20 @3xl:size-24" name={glyph} />
        </div>
        <span
          aria-hidden="true"
          className="design-principle-index font-mono text-xs font-medium text-muted-foreground"
        />
      </div>
      <div className="mt-6 [&>:first-child]:mt-0 [&>h3]:mb-3 [&>h3]:text-2xl [&>h3]:font-medium [&>h3]:tracking-snug [&>p]:my-0 [&>p]:leading-7 [&>p]:text-muted-foreground">
        {children}
      </div>
    </div>
  )
}

export function DesignLedger({ children }: { children: ReactNode }) {
  return (
    <div className="design-ledger relative my-12">
      {/* The wire: a hairline down the index column that fills emerald as you
          read (scroll-driven where supported, drawn in full everywhere else).
          overflow-clip, not hidden: a hidden overflow is a scroll container,
          and the fill's view() timeline would track this wrapper instead of
          the page, so it would never progress. */}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-[5px] hidden w-px overflow-clip bg-border @3xl:block"
      >
        <span className="design-ledger-progress absolute inset-0 bg-brand" />
      </span>
      {/* Stays inside prose so each entry's markdown keeps the docs typography;
          docs.css strips the list chrome. */}
      <ol>{children}</ol>
    </div>
  )
}

export function DesignDecision({
  area,
  children,
  code,
  instead,
  receipt,
}: {
  area: string
  children: ReactNode
  code: string
  instead?: string
  receipt: string
}) {
  return (
    <li className="relative grid gap-x-10 gap-y-4 border-t border-border py-9 @3xl:grid-cols-[8rem_minmax(0,1fr)]">
      <div className="not-prose flex items-center gap-3 @3xl:flex-col @3xl:items-start @3xl:gap-2.5 @3xl:ps-7">
        <span
          aria-hidden="true"
          className="absolute left-0 top-[2.6rem] hidden size-[11px] rounded-full border-2 border-brand bg-background @3xl:block"
        />
        <span className="font-mono text-sm font-semibold text-foreground">D·{code}</span>
        <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-eyebrow text-muted-foreground">
          {area}
        </span>
      </div>

      <div className="min-w-0 [&>:first-child]:mt-0 [&>h3]:mb-2.5 [&>h3]:text-xl [&>h3]:font-medium [&>h3]:tracking-heading [&>p]:my-0 [&>p]:leading-7 [&>p]:text-muted-foreground">
        {children}

        {/* The road not taken on the left, the file that enforces the choice on the right. */}
        <div className="not-prose mt-6 flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3">
          {instead ? (
            <p className="min-w-0 max-w-xl text-sm leading-6 text-muted-foreground">
              <span className="me-2.5 font-mono text-[10px] font-medium uppercase tracking-eyebrow text-foreground">
                Instead of
              </span>
              <s className="decoration-brand/70">{withInlineCode(instead)}</s>
            </p>
          ) : null}
          <a
            className="group/receipt inline-flex min-w-0 max-w-full items-baseline gap-2.5 font-mono text-[11px] leading-5 text-muted-foreground transition-colors hover:text-foreground"
            href={`${githubRepoUrl}/blob/${githubContentBranch}/${receipt}`}
            rel="noreferrer"
            target="_blank"
          >
            <span className="shrink-0 text-[10px] font-medium uppercase tracking-eyebrow text-foreground">
              Receipt
            </span>
            <span className="min-w-0 underline decoration-border underline-offset-4 [overflow-wrap:anywhere] group-hover/receipt:decoration-foreground">
              {receipt}
            </span>
            <ArrowUpRight
              aria-hidden="true"
              className="size-3 shrink-0 self-center transition-transform group-hover/receipt:-translate-y-px group-hover/receipt:translate-x-px"
            />
          </a>
        </div>
      </div>
    </li>
  )
}

export function DesignRefusals({ children }: { children: ReactNode }) {
  return <div className="design-refusals not-prose my-10">{children}</div>
}

export function DesignColophon({ children }: { children: ReactNode }) {
  return (
    <div className="design-colophon my-10 flex flex-col items-center gap-7 border-y border-border py-14 text-center">
      <Logomark className="size-10 rounded-lg" />
      <div className="max-w-xl [&>:first-child]:mt-0 [&>:last-child]:mb-0 [&>p]:leading-7 [&>p]:text-muted-foreground">
        {children}
      </div>
    </div>
  )
}
