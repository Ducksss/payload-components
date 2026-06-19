import type { Metadata } from 'next'

import { JsonLd } from '@/components/seo/JsonLd'
import { HeadingAccent, Section, SectionHeading } from '@/components/site/section'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { Wordmark } from '@/components/site/Wordmark'
import { breadcrumbNode, graph } from '@/lib/structured-data'
import { cn } from '@/utilities/ui'

const description =
  'The Payload Components brand: a light-first shadcn monochrome palette with one emerald accent, the Geist and Instrument Serif type system, logo usage, and voice.'

export const metadata: Metadata = {
  alternates: { canonical: '/brand-guide' },
  title: 'Brand Guide',
  description,
  openGraph: {
    description,
    title: 'Payload Components Brand Guide',
    type: 'website',
    url: '/brand-guide',
  },
  twitter: {
    card: 'summary_large_image',
    description,
    title: 'Payload Components Brand Guide',
  },
}

const brandStructuredData = graph(
  breadcrumbNode([
    { name: 'Home', path: '/' },
    { name: 'Brand Guide', path: '/brand-guide' },
  ]),
)

/* globals.css is the source of truth. This page documents token names and paints
   with live utilities; it does not copy primitive CSS values into TypeScript. */
type Swatch = {
  className: string
  name: string
  token: string
  dark?: boolean
}

const baseSwatches: readonly Swatch[] = [
  { className: 'bg-background', name: 'Background', token: '--background' },
  { className: 'bg-foreground', name: 'Foreground', token: '--foreground', dark: true },
  { className: 'bg-primary', name: 'Primary', token: '--primary', dark: true },
  { className: 'bg-secondary', name: 'Secondary', token: '--secondary' },
  { className: 'bg-muted', name: 'Muted', token: '--muted' },
  { className: 'bg-border', name: 'Border', token: '--border' },
]

const brandSwatches: readonly Swatch[] = [
  { className: 'bg-brand', name: 'Brand', token: '--brand', dark: true },
  { className: 'bg-brand-600', name: 'Brand 600', token: '--brand-600', dark: true },
  { className: 'bg-brand-200', name: 'Brand 200', token: '--brand-200' },
  { className: 'bg-brand-100', name: 'Brand 100', token: '--brand-100' },
  { className: 'bg-brand-50', name: 'Brand 50', token: '--brand-50' },
]

const statusSwatches: readonly Swatch[] = [
  { className: 'bg-destructive', name: 'Destructive', token: '--destructive', dark: true },
  { className: 'bg-success', name: 'Success', token: '--success' },
]

const terminalSwatches: readonly Swatch[] = [
  { className: 'bg-terminal', name: 'Terminal', token: '--terminal', dark: true },
  { className: 'bg-terminal-chrome', name: 'Terminal chrome', token: '--terminal-chrome', dark: true },
]

function SwatchGrid({ swatches }: { swatches: readonly Swatch[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {swatches.map((swatch) => (
        <div
          key={swatch.token}
          className="overflow-hidden rounded-[1rem] border border-border bg-card shadow-[var(--shadow-card)]"
        >
          <div
            className={cn(
              'flex h-20 items-end p-3',
              swatch.className,
              swatch.dark ? 'text-background' : 'text-foreground',
            )}
          >
            <span className="font-mono text-[11px] font-medium tracking-[-0.01em] opacity-80">
              {swatch.name}
            </span>
          </div>
          <div className="border-t border-border px-3 py-2.5">
            <p className="font-mono text-[11px] text-foreground/80">{swatch.token}</p>
            <p className="mt-0.5 font-mono text-[10px] leading-4 text-muted-foreground">
              {swatch.className}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

const trackingScale = [
  { className: 'tracking-display', name: 'Display', token: '--tracking-display', sample: 'Wired, not pasted' },
  { className: 'tracking-title', name: 'Title', token: '--tracking-title', sample: 'Install Payload blocks' },
  { className: 'tracking-snug', name: 'Snug', token: '--tracking-snug', sample: 'One reviewable git diff' },
  { className: 'tracking-heading', name: 'Heading', token: '--tracking-heading', sample: 'From catalog to commit' },
  { className: 'tracking-micro', name: 'Micro', token: '--tracking-micro', sample: 'Read the contract first' },
  { className: 'tracking-eyebrow', name: 'Eyebrow', token: '--tracking-eyebrow', sample: 'THE GRUNT-WORK TAX' },
] as const

const radiusScale = [
  { className: 'rounded-lg', name: 'Base', token: '--radius' },
  { className: 'rounded-inset', name: 'Inset', token: '--radius-inset' },
  { className: 'rounded-card', name: 'Card', token: '--radius-card' },
  { className: 'rounded-panel', name: 'Panel', token: '--radius-panel' },
  { className: 'rounded-frame', name: 'Frame', token: '--radius-frame' },
] as const

const shadowScale = [
  { name: 'Card', token: '--shadow-card', className: 'shadow-[var(--shadow-card)]' },
  { name: 'Frame', token: '--shadow-frame', className: 'shadow-[var(--shadow-frame)]' },
] as const

export default function BrandGuidePage() {
  return (
    <>
      <JsonLd data={brandStructuredData} />
      <SiteHeader />

      <main className="flex-1">
        <section className="hero-shell overflow-hidden border-b border-border/60">
          <div aria-hidden="true" className="hero-atmosphere" />

          <div className="container relative py-16 sm:py-20 lg:py-24">
            <div className="flex max-w-3xl flex-col items-start">
              <span
                className="hero-reveal flex items-center gap-2 rounded-full border border-border/70 bg-background/90 px-4 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-sm"
                style={{ animationDelay: '80ms' }}
              >
                <span aria-hidden="true" className="hero-eyebrow-dot" />
                Brand
              </span>

              <h1
                className="hero-reveal mt-6 text-balance text-[clamp(2.4rem,6vw,4.25rem)] font-medium leading-[0.98] tracking-[-0.05em] text-foreground"
                style={{ animationDelay: '180ms' }}
              >
                The Payload Components <HeadingAccent>brand</HeadingAccent>
              </h1>

              <p
                className="hero-reveal mt-5 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg"
                style={{ animationDelay: '340ms' }}
              >
                A light-first, shadcn-monochrome system with exactly one accent: emerald. Geist
                does the work; an italic serif carries the single warm note. Everything here is a
                living reference for the tokens that ship in the codebase.
              </p>
            </div>
          </div>
        </section>

        {/* Logo & wordmark */}
        <Section>
          <SectionHeading
            accentWord="wordmark"
            eyebrow="Identity"
            heading="The mark and wordmark"
            intro="The logo is a monospace prompt glyph in an emerald square, set beside the wordmark in Geist. It reads as a terminal — the place the CLI lives."
          />

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="flex flex-col items-start justify-center gap-6 rounded-[1.25rem] border border-border bg-muted/30 p-8">
              <Wordmark withBadge />
              <p className="text-sm leading-6 text-muted-foreground">
                The full lockup: the{' '}
                <code className="rounded-md border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[13px] text-foreground/80">
                  &gt;
                </code>{' '}
                prompt mark, the wordmark, and the alpha status badge.
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-[1.25rem] border border-border bg-card p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Usage
              </p>
              <ul className="flex flex-col gap-3 text-sm leading-6 text-foreground/80">
                <li className="flex items-start gap-2.5">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                  Keep the mark emerald (<code className="font-mono text-[12px]">--brand</code>) on a
                  light surface; never recolor or gradient it.
                </li>
                <li className="flex items-start gap-2.5">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                  Emerald is the only accent — don&apos;t introduce a second brand color.
                </li>
                <li className="flex items-start gap-2.5">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
                  The wordmark stays in Geist at its semibold tracking-tight weight.
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Color */}
        <Section className="bg-muted/40">
          <SectionHeading
            accentWord="emerald"
            eyebrow="Color"
            heading="Monochrome, with one emerald accent"
            intro="A neutral shadcn scale carries the interface. Emerald and its tints appear sparingly — slugs, checks, active dots, the hero bloom. The terminal product-frame keeps its own dark surface regardless of page theme."
          />

          <div className="mt-10 flex flex-col gap-10">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Base &amp; monochrome
              </p>
              <div className="mt-4">
                <SwatchGrid swatches={baseSwatches} />
              </div>
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Emerald accent &amp; tints
              </p>
              <div className="mt-4">
                <SwatchGrid swatches={brandSwatches} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Status
                </p>
                <div className="mt-4">
                  <SwatchGrid swatches={statusSwatches} />
                </div>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Terminal surfaces
                </p>
                <div className="mt-4">
                  <SwatchGrid swatches={terminalSwatches} />
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Typography */}
        <Section>
          <SectionHeading
            accentWord="serif"
            eyebrow="Typography"
            heading="Geist, with an italic serif accent"
            intro="Geist Sans is the workhorse for headings and body; Geist Mono carries commands, tokens, and eyebrows. Instrument Serif italic is the single warm note — one accent word per heading, never a paragraph."
          />

          <div className="mt-10 flex flex-col gap-4">
            <div className="rounded-[1.25rem] border border-border bg-card p-6 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Geist Sans · --font-sans
              </p>
              <p className="mt-4 font-sans text-4xl font-medium tracking-[-0.04em] text-foreground">
                Install Payload blocks wired, not pasted.
              </p>
            </div>

            <div className="rounded-[1.25rem] border border-border bg-card p-6 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Instrument Serif italic · --font-serif
              </p>
              <p className="mt-4 font-serif text-4xl font-normal italic tracking-[-0.015em] text-foreground">
                The one warm typographic note
              </p>
            </div>

            <div className="rounded-[1.25rem] border border-border bg-card p-6 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Geist Mono · --font-mono
              </p>
              <p className="mt-4 font-mono text-xl text-foreground/85">
                npx payload-components add hero-basic
              </p>
            </div>
          </div>
        </Section>

        {/* Scales */}
        <Section className="bg-muted/40">
          <SectionHeading
            accentWord="scales"
            eyebrow="Tokens"
            heading="Tracking, radius, and shadow scales"
            intro="Named utilities replace one-off arbitraries across the blocks. The samples here are rendered by the live tokens in globals.css."
          />

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            {/* Tracking */}
            <div className="rounded-[1.25rem] border border-border bg-card p-6 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Letter-spacing
              </p>
              <ul className="mt-5 flex flex-col divide-y divide-border">
                {trackingScale.map((item) => (
                  <li
                    key={item.token}
                    className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                  >
                    <span
                      className={cn('text-lg font-medium text-foreground', item.className)}
                    >
                      {item.sample}
                    </span>
                    <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                      {item.token} · {item.className}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              {/* Radius */}
              <div className="rounded-[1.25rem] border border-border bg-card p-6 sm:p-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Radius
                </p>
                <ul className="mt-5 flex flex-col gap-3">
                  {radiusScale.map((item) => (
                    <li key={item.token} className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className={cn('size-9 shrink-0 border border-border bg-brand-100', item.className)}
                      />
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {item.token} · {item.className}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shadow */}
              <div className="rounded-[1.25rem] border border-border bg-card p-6 sm:p-8">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  Shadow
                </p>
                <div className="mt-5 flex flex-wrap gap-5">
                  {shadowScale.map((item) => (
                    <div key={item.token} className="flex flex-col items-center gap-2.5">
                      <span
                        aria-hidden="true"
                        className={cn('size-16 rounded-[1rem] bg-card', item.className)}
                      />
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {item.token}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Voice & tone */}
        <Section>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-16">
            <SectionHeading
              accentWord="receipts"
              eyebrow="Voice"
              heading="Plain, honest, receipts over claims"
            />

            <div className="flex max-w-[60ch] flex-col gap-6 text-base leading-7 text-muted-foreground">
              <p>
                Payload Components is community-first and MIT-licensed end to end. The copy reflects
                that: no marketing fluff, no fabricated quotes, no roadmap theater. Every claim is
                something you can verify in the repository.
              </p>
              <p>
                Write like the docs — direct, specific, and technical without being cold. Show the
                receipts: link to the source, the manifest, the test, the diff. When something is
                alpha or in development, say so plainly rather than dressing it up.
              </p>
              <p className="text-xl font-medium leading-8 tracking-[-0.01em] text-foreground">
                The product earns trust by letting you read it — the brand should too.
              </p>
            </div>
          </div>
        </Section>
      </main>

      <SiteFooter />
    </>
  )
}
