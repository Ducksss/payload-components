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

/* Swatch values are copied verbatim from src/app/globals.css — that file is the
   single source of truth. This page documents the tokens, it does not redefine
   them: each swatch paints with the live utility class (bg-*) and labels it with
   the OKLCH string from :root. `dark` marks tiles that need light text. */
type Swatch = {
  className: string
  name: string
  value: string
  token: string
  dark?: boolean
}

const baseSwatches: readonly Swatch[] = [
  { className: 'bg-background', name: 'Background', token: '--background', value: 'oklch(100% 0 0deg)' },
  { className: 'bg-foreground', name: 'Foreground', token: '--foreground', value: 'oklch(14.1% 0.005 285.8deg)', dark: true },
  { className: 'bg-primary', name: 'Primary', token: '--primary', value: 'oklch(21% 0.006 285.9deg)', dark: true },
  { className: 'bg-secondary', name: 'Secondary', token: '--secondary', value: 'oklch(96.7% 0.001 286.4deg)' },
  { className: 'bg-muted', name: 'Muted', token: '--muted', value: 'oklch(96.7% 0.001 286.4deg)' },
  { className: 'bg-border', name: 'Border', token: '--border', value: 'oklch(92% 0.004 286.3deg)' },
]

const brandSwatches: readonly Swatch[] = [
  { className: 'bg-brand', name: 'Brand', token: '--brand', value: 'oklch(50.8% 0.118 165.6deg)', dark: true },
  { className: 'bg-brand-600', name: 'Brand 600', token: '--brand-600', value: 'oklch(44% 0.112 165.6deg)', dark: true },
  { className: 'bg-brand-200', name: 'Brand 200', token: '--brand-200', value: 'oklch(89% 0.072 165.6deg)' },
  { className: 'bg-brand-100', name: 'Brand 100', token: '--brand-100', value: 'oklch(94.6% 0.044 165.6deg)' },
  { className: 'bg-brand-50', name: 'Brand 50', token: '--brand-50', value: 'oklch(97.6% 0.018 165.6deg)' },
]

const statusSwatches: readonly Swatch[] = [
  { className: 'bg-destructive', name: 'Destructive', token: '--destructive', value: 'oklch(57.7% 0.245 27.3deg)', dark: true },
  { className: 'bg-success', name: 'Success', token: '--success', value: 'oklch(79.2% 0.157 162.5deg)' },
]

const terminalSwatches: readonly Swatch[] = [
  { className: 'bg-terminal', name: 'Terminal', token: '--terminal', value: 'oklch(16.5% 0.008 285.8deg)', dark: true },
  { className: 'bg-terminal-chrome', name: 'Terminal chrome', token: '--terminal-chrome', value: 'oklch(21% 0.008 285.8deg)', dark: true },
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
              {swatch.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

const trackingScale = [
  { name: 'Display', token: '--tracking-display', value: '-0.06em', sample: 'Wired, not pasted' },
  { name: 'Title', token: '--tracking-title', value: '-0.04em', sample: 'Install Payload blocks' },
  { name: 'Snug', token: '--tracking-snug', value: '-0.03em', sample: 'One reviewable git diff' },
  { name: 'Heading', token: '--tracking-heading', value: '-0.02em', sample: 'From catalog to commit' },
  { name: 'Micro', token: '--tracking-micro', value: '-0.01em', sample: 'Read the contract first' },
  { name: 'Eyebrow', token: '--tracking-eyebrow', value: '0.18em', sample: 'THE GRUNT-WORK TAX' },
] as const

const radiusScale = [
  { name: 'Base', token: '--radius', value: '0.625rem' },
  { name: 'Inset', token: '--radius-inset', value: '1rem' },
  { name: 'Card', token: '--radius-card', value: '1.25rem' },
  { name: 'Panel', token: '--radius-panel', value: '1.5rem' },
  { name: 'Frame', token: '--radius-frame', value: '2rem' },
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
            intro="Named tokens replace one-off arbitraries across the blocks. The values here match globals.css exactly."
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
                      className="text-lg font-medium text-foreground"
                      style={{ letterSpacing: item.value }}
                    >
                      {item.sample}
                    </span>
                    <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                      {item.token} · {item.value}
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
                        className="size-9 shrink-0 border border-border bg-brand-100"
                        style={{ borderRadius: item.value }}
                      />
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {item.token} · {item.value}
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
