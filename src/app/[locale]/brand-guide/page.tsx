import type { Metadata } from 'next'

import { getTranslations } from 'next-intl/server'

import { JsonLd } from '@/components/seo/JsonLd'
import { HeadingAccent, Section, SectionHeading } from '@/components/site/section'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { TranslationNotice } from '@/components/site/TranslationNotice'
import { Wordmark } from '@/components/site/Wordmark'
import { localeDetails, localizeHref } from '@/i18n/config'
import { getPublication, publicationContentAttributes, publicationRobots } from '@/i18n/publication'
import { getSiteLocale } from '@/lib/i18n'
import { feedMetadataAlternates, siteOpenGraphDefaults } from '@/lib/site'
import { breadcrumbNode, graph } from '@/lib/structured-data'
import { cn } from '@/utilities/ui'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getSiteLocale()
  const publication = getPublication('/brand-guide', locale)
  const t = await getTranslations({
    locale: publication.contentLocale,
    namespace: 'PageMetadata.brandGuide',
  })

  return {
    alternates: {
      canonical: publication.canonical,
      languages: publication.alternates,
      ...feedMetadataAlternates,
    },
    title: t('title'),
    description: t('description'),
    openGraph: {
      ...siteOpenGraphDefaults,
      description: t('description'),
      locale: localeDetails[publication.contentLocale].openGraphLocale,
      title: t('openGraphTitle'),
      type: 'website',
      url: publication.canonical,
    },
    robots: publicationRobots(publication),
    twitter: {
      card: 'summary_large_image',
      description: t('description'),
      title: t('openGraphTitle'),
    },
  }
}

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

/* The site chrome's accent. Inside [data-brand] the --brand ramp resolves to
   these, so the chrome's existing brand utilities draw in trace. */
const traceSwatches: readonly Swatch[] = [
  { className: 'bg-trace', name: 'Trace', token: '--trace', dark: true },
  { className: 'bg-trace-600', name: 'Trace 600', token: '--trace-600', dark: true },
  { className: 'bg-trace-200', name: 'Trace 200', token: '--trace-200' },
  { className: 'bg-trace-100', name: 'Trace 100', token: '--trace-100' },
  { className: 'bg-wire', name: 'Wire', token: '--wire' },
]

/* The component tokens. Rendered inside .preview-scope, so --brand shows the
   emerald the blocks install with rather than the chrome's trace. */
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
  {
    className: 'bg-terminal-chrome',
    name: 'Terminal chrome',
    token: '--terminal-chrome',
    dark: true,
  },
]

function SwatchGrid({ swatches }: { swatches: readonly Swatch[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {swatches.map((swatch) => (
        <div
          key={swatch.token}
          className="overflow-hidden rounded-inset border border-border bg-card shadow-[var(--shadow-card)]"
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
  {
    className: 'tracking-display',
    name: 'Display',
    token: '--tracking-display',
    sample: 'Wired, not pasted',
  },
  {
    className: 'tracking-title',
    name: 'Title',
    token: '--tracking-title',
    sample: 'Install Payload blocks',
  },
  {
    className: 'tracking-snug',
    name: 'Snug',
    token: '--tracking-snug',
    sample: 'One reviewable git diff',
  },
  {
    className: 'tracking-heading',
    name: 'Heading',
    token: '--tracking-heading',
    sample: 'From catalog to commit',
  },
  {
    className: 'tracking-micro',
    name: 'Micro',
    token: '--tracking-micro',
    sample: 'Read the contract first',
  },
  {
    className: 'tracking-eyebrow',
    name: 'Eyebrow',
    token: '--tracking-eyebrow',
    sample: 'THE GRUNT-WORK TAX',
  },
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

export default async function BrandGuidePage() {
  const locale = await getSiteLocale()
  const publication = getPublication('/brand-guide', locale)
  const commonT = await getTranslations({ locale, namespace: 'Common' })
  const brandStructuredData = graph(
    breadcrumbNode([
      { name: commonT('home'), path: localizeHref('/', locale) },
      {
        name: commonT('brandGuide'),
        path: localizeHref('/brand-guide', locale),
      },
    ]),
  )

  return (
    <>
      <JsonLd data={brandStructuredData} />
      <SiteHeader />
      <TranslationNotice pathname="/brand-guide" />

      {/* data-brand: the brand guide wears the Datasheet brand it documents
          (globals.css section 4); its component-token specimens sit in
          .preview-scope so they show what the blocks actually install. */}
      <main
        {...publicationContentAttributes(publication)}
        data-brand="datasheet"
        id="main"
        className="flex-1"
      >
        <section className="hero-shell overflow-hidden border-b border-border/60">
          <div aria-hidden="true" className="hero-atmosphere" />

          <div className="container relative py-16 sm:py-20 lg:py-24">
            <div className="flex max-w-3xl flex-col items-start">
              <span
                className="hero-rise ds-label flex items-center gap-2 text-muted-foreground"
                style={{ animationDelay: '0ms' }}
              >
                <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
                Brand
              </span>

              <h1
                className="hero-rise ds-display mt-6 text-balance text-[clamp(2.75rem,7.5vw,5rem)] text-foreground"
                style={{ animationDelay: '60ms' }}
              >
                The Payload Components <HeadingAccent>brand</HeadingAccent>
              </h1>

              <p
                className="hero-rise mt-5 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg"
                style={{ animationDelay: '110ms' }}
              >
                Two layers, one light page. The site is drawn like a datasheet — Archivo, Azeret
                Mono, and one trace green. The blocks it shows keep their own component tokens —
                Geist and emerald — because that is what installs. Everything here is a living
                reference for the tokens that ship in the codebase.
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
            intro="The logo is two blocks keyed together in an emerald square, set beside the wordmark in Archivo. It reads as what the CLI does — separate blocks fitted into one page, wired rather than pasted."
          />

          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="flex flex-col items-start justify-center gap-6 rounded-card border border-border bg-muted/30 p-8">
              <Wordmark withBadge />
              <p className="text-sm leading-6 text-muted-foreground">
                The full lockup: the two-block mark, the wordmark, and the MIT badge. The blocks
                overlap by a quarter of their width — enough that the join survives a 16px browser
                tab.
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-card border border-border bg-card p-8">
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-muted-foreground">
                Usage
              </p>
              <ul className="flex flex-col gap-3 text-sm leading-6 text-foreground/80">
                <li className="flex items-start gap-2.5">
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-brand"
                  />
                  {/* One flex item, or each text run around the code becomes
                      its own column once the line wraps. */}
                  <span>
                    Keep the mark emerald (
                    <code className="whitespace-nowrap font-mono text-[12px]">--mark</code>) on a
                    light surface; never recolor or gradient it. It is two blocks, so it keeps the
                    blocks&apos; green wherever it sits.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-brand"
                  />
                  One green per layer: trace for the site, emerald for the blocks. Never a third.
                </li>
                <li className="flex items-start gap-2.5">
                  <span
                    aria-hidden="true"
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-brand"
                  />
                  The wordmark is set in Archivo at weight 650, at text width.
                </li>
              </ul>
            </div>
          </div>
        </Section>

        {/* Color */}
        <Section className="bg-muted/40">
          <SectionHeading
            accentWord="green"
            eyebrow="Color"
            heading="Monochrome, with one green per layer"
            intro="A neutral shadcn scale carries the interface. The site draws its accents in trace green — traces, pads, links, the primary action. The blocks keep emerald, the green they install with, and every preview shows it. The terminal product-frame keeps its own dark surface regardless of page theme."
          />

          <div className="mt-10 flex flex-col gap-10">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-muted-foreground">
                Base &amp; monochrome
              </p>
              <div className="mt-4">
                <SwatchGrid swatches={baseSwatches} />
              </div>
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-muted-foreground">
                Trace · the site chrome
              </p>
              <div className="mt-4">
                <SwatchGrid swatches={traceSwatches} />
              </div>
            </div>

            <div>
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-muted-foreground">
                Emerald · the component tokens
              </p>
              <div className="preview-scope mt-4">
                <SwatchGrid swatches={brandSwatches} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-eyebrow text-muted-foreground">
                  Status
                </p>
                <div className="mt-4">
                  <SwatchGrid swatches={statusSwatches} />
                </div>
              </div>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-eyebrow text-muted-foreground">
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
            accentWord="Archivo"
            eyebrow="Typography"
            heading="Archivo for the site, Geist for the blocks"
            intro="Archivo sets the site, display and text alike: the headings run condensed through its width axis, so both are one file. Azeret Mono carries commands, part numbers, and labels. The blocks keep Geist Sans, Geist Mono, and an Instrument Serif italic accent — previews render them as they install."
          />

          <div className="mt-10 flex flex-col gap-4">
            <div className="rounded-card border border-border bg-card p-6 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-muted-foreground">
                Archivo, condensed · --font-display
              </p>
              <p className="ds-display mt-4 text-5xl text-foreground">
                Install Payload blocks wired, not pasted.
              </p>
            </div>

            <div className="rounded-card border border-border bg-card p-6 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-muted-foreground">
                Azeret Mono · --font-spec
              </p>
              <p className="mt-4 font-spec text-xl text-foreground/85">
                npx payload-components add hero-basic
              </p>
            </div>

            {/* The component faces, shown on the component tokens. */}
            <div className="preview-scope grid grid-cols-1 gap-4 lg:grid-cols-3">
              <div className="rounded-card border border-border bg-card p-6 sm:p-8">
                <p className="font-mono text-[11px] uppercase tracking-eyebrow text-muted-foreground">
                  Blocks · Geist Sans · --font-sans
                </p>
                <p className="mt-4 font-sans text-3xl font-medium tracking-[-0.04em] text-foreground">
                  Ship customer dashboards
                </p>
              </div>

              <div className="rounded-card border border-border bg-card p-6 sm:p-8">
                <p className="font-mono text-[11px] uppercase tracking-eyebrow text-muted-foreground">
                  Blocks · Instrument Serif · --font-serif
                </p>
                <p className="mt-4 font-serif text-3xl font-normal italic tracking-[-0.015em] text-foreground">
                  The one warm note
                </p>
              </div>

              <div className="rounded-card border border-border bg-card p-6 sm:p-8">
                <p className="font-mono text-[11px] uppercase tracking-eyebrow text-muted-foreground">
                  Blocks · Geist Mono · --font-mono
                </p>
                <p className="mt-4 font-mono text-lg text-foreground/85">add hero-basic</p>
              </div>
            </div>
          </div>
        </Section>

        {/* Scales */}
        <Section className="bg-muted/40">
          <SectionHeading
            accentWord="scales"
            eyebrow="Tokens"
            heading="Tracking, radius, and shadow scales"
            intro="Named utilities replace one-off arbitraries across the blocks. The samples here are rendered by the live tokens in globals.css, on the component tokens the blocks use."
          />

          <div className="preview-scope mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            {/* Tracking */}
            <div className="rounded-card border border-border bg-card p-6 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-muted-foreground">
                Letter-spacing
              </p>
              <ul className="mt-5 flex flex-col divide-y divide-border">
                {trackingScale.map((item) => (
                  <li
                    key={item.token}
                    className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                  >
                    <span className={cn('text-lg font-medium text-foreground', item.className)}>
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
              <div className="rounded-card border border-border bg-card p-6 sm:p-8">
                <p className="font-mono text-[11px] uppercase tracking-eyebrow text-muted-foreground">
                  Radius
                </p>
                <ul className="mt-5 flex flex-col gap-3">
                  {radiusScale.map((item) => (
                    <li key={item.token} className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className={cn(
                          'size-9 shrink-0 border border-border bg-brand-100',
                          item.className,
                        )}
                      />
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {item.token} · {item.className}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shadow */}
              <div className="rounded-card border border-border bg-card p-6 sm:p-8">
                <p className="font-mono text-[11px] uppercase tracking-eyebrow text-muted-foreground">
                  Shadow
                </p>
                <div className="mt-5 flex flex-wrap gap-5">
                  {shadowScale.map((item) => (
                    <div key={item.token} className="flex flex-col items-center gap-2.5">
                      <span
                        aria-hidden="true"
                        className={cn('size-16 rounded-inset bg-card', item.className)}
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
                receipts: link to the source, the manifest, the test, the diff. When something is in
                development, say so plainly rather than dressing it up.
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
