import type { Metadata } from 'next'

import Link from 'next/link'

import { ArrowRight, ArrowUpRight, Check } from 'lucide-react'

import { JsonLd } from '@/components/seo/JsonLd'
import { CommandCopyButton } from '@/components/site/CommandCopyButton'
import { ComponentPreviewThumb } from '@/components/site/ComponentPreviewThumb'
import { siteIcons } from '@/components/site/icons'
import { MaintainerNote } from '@/components/site/MaintainerNote'
import { HeadingAccent, Section, SectionHeading } from '@/components/site/section'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { Terminal } from '@/components/site/Terminal'
import { WiringLedger } from '@/components/site/WiringLedger'
import {
  componentEntries,
  primaryInstallCommand,
  receipts,
  terminalDemoLines,
  wiringLedger,
} from '@/lib/site'
import { breadcrumbNode, graph, techArticleNode } from '@/lib/structured-data'

const title = 'Payload Custom Components'
const description =
  '“Custom components” in Payload means two things — admin UI components and content blocks. This is the fast path for the second: install a typed Payload block with its config, renderer, types, and admin import map already wired.'

export const metadata: Metadata = {
  alternates: { canonical: '/payload-custom-components' },
  title,
  description,
  openGraph: {
    description,
    title: `${title} for Payload CMS`,
    type: 'website',
    url: '/payload-custom-components',
  },
  twitter: {
    card: 'summary_large_image',
    description,
    title: `${title} for Payload CMS`,
  },
}

/* Page-specific FAQ — written for the "payload custom components" query, distinct
   from the homepage FAQ. Disambiguates the term and scopes the tool honestly. */
const faqItems = [
  {
    question: 'What counts as a custom component in Payload?',
    answer:
      'Two different things share the name. The first is admin UI components — React components you inject into the Payload admin panel to replace a field input, add a dashboard view, or swap a list cell; Payload’s own Custom Components API covers those. The second is content blocks — reusable layout sections (a hero, a feature grid, a CTA) editors stack to build a page. Payload Components installs the second kind.',
  },
  {
    question: 'Is a Payload block the same as a custom component?',
    answer:
      'A block is the most common kind of custom layout component: a named group of fields, plus a React component that renders it on the front end. Payload Components ships pre-built blocks and the wiring that makes them live — registered in your Pages collection, mapped in your renderer, typed, and added to the admin import map.',
  },
  {
    question: 'Can Payload Components build custom admin UI components?',
    answer:
      'No — and it does not touch your admin UI. If you need a custom field input, view, or cell in the Payload admin, that is Payload’s Custom Components API, not this. Payload Components is scoped to content blocks for the front end and the four edits that wire them in.',
  },
  {
    question: 'Do I have to write the block config and types myself?',
    answer:
      'No. The install copies the block source and does the wiring for you: it patches your Pages collection and RenderBlocks switch, then runs payload generate:types and payload generate:importmap. You review the result as one git diff.',
  },
  {
    question: 'Which files does installing a custom component change?',
    answer:
      'Source files are copied in (block config, component, shared utilities), exactly two files are patched (your Pages collection and RenderBlocks.tsx), and Payload regenerates its own output (payload-types.ts and the admin import map). Every change shows up as an ordinary git diff.',
  },
] as const

/* The four edits a pasted block needs before it is live — the wiring tax. The
   verb mirrors the ledger below (patched vs regenerated). */
const wiredEdits = [
  {
    label: 'The block config',
    path: 'src/collections/Pages/index.ts',
    verb: 'patched',
    detail:
      'Registered in your Pages collection, so editors can pick it from the layout builder in the admin.',
  },
  {
    label: 'The renderer',
    path: 'src/blocks/RenderBlocks.tsx',
    verb: 'patched',
    detail:
      'Mapped in your render switch, so a block saved in the admin renders on the front end instead of dropping out.',
  },
  {
    label: 'The types',
    path: 'src/payload-types.ts',
    verb: 'regenerated',
    detail:
      'payload generate:types reruns, so the new block is fully typed everywhere it is read — no any, no drift.',
  },
  {
    label: 'The admin import map',
    path: 'admin importMap.js',
    verb: 'regenerated',
    detail:
      'payload generate:importmap reruns, so Payload can resolve the block’s React component inside the editor.',
  },
] as const

/* One representative component per major family — the relevant docs and install
   commands a reader lands here to find. Order follows the catalog. */
const featuredSlugs = new Set([
  'hero-basic',
  'feature-grid-basic',
  'content-columns',
  'call-to-action-centered',
  'integration-grid',
  'team-grid',
])
const featuredComponents = componentEntries.filter((component) => featuredSlugs.has(component.slug))

/* TechArticle + breadcrumb + a page-scoped FAQPage (the homepage FAQPage lives on
   "/" and reads different questions; this one is unique to this route). */
const structuredData = graph(
  breadcrumbNode([
    { name: 'Home', path: '/' },
    { name: 'Payload custom components', path: '/payload-custom-components' },
  ]),
  techArticleNode({ description, title: `${title} for Payload CMS`, url: '/payload-custom-components' }),
  {
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
      name: item.question,
    })),
  },
)

export default function PayloadCustomComponentsPage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <SiteHeader />

      <main className="flex-1">
        {/* Hero — editorial copy beside the signature install terminal. */}
        <section className="hero-shell overflow-hidden border-b border-border/60">
          <div aria-hidden="true" className="hero-atmosphere" />

          <div className="container relative py-16 sm:py-20 lg:py-24">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:items-center lg:gap-16">
              <div className="flex max-w-2xl flex-col items-start">
                <span
                  className="hero-reveal flex items-center gap-2 rounded-full border border-border/70 bg-background/90 px-4 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-sm"
                  style={{ animationDelay: '80ms' }}
                >
                  <span aria-hidden="true" className="hero-eyebrow-dot" />
                  Payload custom components
                </span>

                {/* H1 renders statically — it is the LCP element, so no opacity fade. */}
                <h1 className="mt-6 text-balance text-[clamp(2.4rem,6vw,4.25rem)] font-medium leading-[0.98] tracking-display text-foreground">
                  Payload custom components, <HeadingAccent>wired not pasted.</HeadingAccent>
                </h1>

                <p
                  className="hero-reveal mt-5 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg"
                  style={{ animationDelay: '320ms' }}
                >
                  In Payload the phrase means two things: React components for the admin UI, or
                  content blocks for your pages. This is the fast path for the second — a block isn’t
                  live when its files land, so <span className="text-foreground">payload-components</span>{' '}
                  registers, renders, types, and import-maps it in one command, then hands you a
                  reviewable git diff.
                </p>

                <div
                  className="hero-reveal mt-8 flex w-full flex-col items-start gap-3 sm:flex-row sm:items-center"
                  style={{ animationDelay: '440ms' }}
                >
                  <div className="grid w-full max-w-md grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-full border border-border bg-background py-1.5 pl-5 pr-1.5 shadow-card">
                    <code className="overflow-x-auto whitespace-nowrap font-mono text-xs text-foreground/90 sm:text-[13px]">
                      {primaryInstallCommand}
                    </code>
                    <CommandCopyButton command={primaryInstallCommand} />
                  </div>

                  <Link
                    href="/components"
                    className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Browse the catalog
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>

              {/* The signature device: a real `add` run, replayed in the terminal. */}
              <div className="hero-reveal w-full min-w-0" style={{ animationDelay: '240ms' }}>
                <Terminal animated lines={terminalDemoLines} title="acme-site" />
                <p className="mt-3 px-1 font-mono text-[11px] leading-5 text-muted-foreground">
                  One command: copy the source, register the block, map the renderer, regenerate
                  types and the import map.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Disambiguation — the unique, query-matching angle the homepage lacks. */}
        <Section>
          <SectionHeading
            accentWord="two"
            eyebrow="What you’re searching for"
            heading="“Custom components” means two things in Payload."
            intro="The phrase is overloaded, and the two meanings need completely different tools. Here is the split — so you land on the right one."
          />

          <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Admin UI components — explicitly NOT what this tool does. */}
            <div className="flex flex-col rounded-card border border-border bg-muted/30 p-6 sm:p-7">
              <p className="font-mono text-[11px] uppercase tracking-eyebrow text-muted-foreground">
                1 · Admin UI components
              </p>
              <h3 className="mt-3 text-lg font-semibold tracking-title text-foreground">
                React components inside the Payload admin
              </h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
                Replacing a field’s input, adding a dashboard view, swapping a list cell. This is
                Payload’s own <span className="font-medium text-foreground">Custom Components</span>{' '}
                API — config overrides that change how the admin panel looks and behaves. Payload
                Components does not touch this.
              </p>
              <a
                href="https://payloadcms.com/docs/admin/components"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                See Payload’s admin component docs
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            </div>

            {/* Content blocks — what this tool installs. */}
            <div className="flex flex-col rounded-card border border-brand/40 bg-brand/[0.04] p-6 shadow-card sm:p-7">
              <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-eyebrow text-brand">
                <Check className="size-3.5" aria-hidden="true" />2 · Content blocks — this is us
              </p>
              <h3 className="mt-3 text-lg font-semibold tracking-title text-foreground">
                Reusable layout sections for your pages
              </h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">
                A hero, a feature grid, a CTA — the named blocks editors stack in the layout builder.
                Each is a group of fields plus a React component that renders it. Payload Components
                installs these <span className="font-medium text-foreground">with their wiring</span>,
                so a copied block is actually live, not dead code.
              </p>
              <Link
                href="/components"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-brand"
              >
                Browse installable blocks
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Section>

        {/* The wiring tax — the four edits as a designed manifest. */}
        <Section className="bg-muted/40">
          <SectionHeading
            accentWord="land"
            eyebrow="Why a copied block isn’t enough"
            heading="Dead files until four edits land."
            intro="Copying a block’s files is the easy part. Until these four surfaces know about it, it is dead code in your repo — and doing them by hand, on every block, is where the week goes. payload-components owns exactly these edits."
          />

          <ol className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-panel border border-border bg-border sm:grid-cols-2">
            {wiredEdits.map((edit, index) => (
              <li key={edit.label} className="flex flex-col gap-3 bg-background p-6 sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-sm font-semibold text-brand">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="rounded-full border border-brand/30 bg-brand/[0.06] px-2.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-eyebrow text-brand">
                    {edit.verb}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-semibold tracking-title text-foreground">
                    {edit.label}
                  </h3>
                  <code className="mt-1 block w-fit max-w-full overflow-x-auto whitespace-nowrap font-mono text-[11px] text-muted-foreground">
                    {edit.path}
                  </code>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{edit.detail}</p>
              </li>
            ))}
          </ol>
        </Section>

        {/* The differentiator as a verifiable artifact ledger + receipts. */}
        <Section>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              accentWord="hand"
              eyebrow="shadcn add vs payload-components add"
              heading="Five artifacts, not one left by hand."
              intro="A plain shadcn add copies files and stops — one of five artifacts, the rest left to you. payload-components add lands all five and shows them as a single diff. Every row below is checkable in the component’s manifest."
            />
            <code className="hidden shrink-0 pb-1 font-mono text-[11px] text-muted-foreground lg:block">
              source: {wiringLedger.source}
            </code>
          </div>

          <div className="mt-12">
            <WiringLedger />
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border pt-8">
            {receipts.map((receipt) => {
              const Icon = siteIcons[receipt.icon]

              return (
                <span
                  key={receipt.label}
                  className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
                >
                  <Icon className="size-3.5 text-brand" aria-hidden="true" />
                  {receipt.label}
                </span>
              )
            })}
          </div>
        </Section>

        {/* Live specimens — the real component, not a screenshot. */}
        <Section className="bg-muted/40">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              accentWord="live"
              eyebrow="Start from the catalog"
              heading="Custom components, rendered live."
              intro="No screenshots — each tile is the real component rendered with sample content. Read its contract, then add it with one command."
            />
            <Link
              href="/components"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              All {componentEntries.length} components
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredComponents.map((component) => (
              <li key={component.slug} className="min-w-0">
                <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-frame">
                  <ComponentPreviewThumb slug={component.slug} />

                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="text-base font-semibold tracking-title text-foreground">
                        <Link href={component.href} className="transition-colors hover:text-brand">
                          {component.title}
                        </Link>
                      </h3>
                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-eyebrow text-muted-foreground">
                        {component.target}
                      </span>
                    </div>

                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-border bg-muted/40 py-1.5 pl-3 pr-1.5">
                      <code className="overflow-x-auto whitespace-nowrap font-mono text-[11px] text-foreground/80">
                        {component.command}
                      </code>
                      <CommandCopyButton command={component.command} />
                    </div>

                    <Link
                      href={component.href}
                      className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-brand"
                    >
                      Read the docs
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </Section>

        {/* Page-specific FAQ — mirrors the FAQPage JSON-LD above. */}
        <Section>
          <SectionHeading
            accentWord="questions"
            eyebrow="Custom components, answered"
            heading="The questions that bring people here."
            intro="Short answers to what developers searching for Payload custom components usually want to know."
          />

          <dl className="mt-12 grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-2">
            {faqItems.map((item) => (
              <div key={item.question} className="flex flex-col gap-2">
                <dt className="text-base font-semibold tracking-title text-foreground">
                  {item.question}
                </dt>
                <dd className="text-sm leading-6 text-muted-foreground">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </Section>

        {/* Close — the honest CTA beside the one real voice. */}
        <Section className="bg-muted/40">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
            <div className="flex flex-col items-start">
              <SectionHeading
                accentWord="matters"
                eyebrow="From here"
                heading="Spend your week on the work that matters."
                intro="Read the installer source before you trust it — it is MIT, end to end. Then add a block and review the diff like any other PR."
              />
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/docs"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-[0_18px_40px_-22px_rgba(15,23,42,0.55)] transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-[0_22px_50px_-22px_rgba(15,23,42,0.6)]"
                >
                  Read the docs
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/docs/installation"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border/70 bg-background/80 px-5 text-sm font-medium text-foreground backdrop-blur-sm transition-[transform,background-color] duration-200 hover:-translate-y-px hover:bg-background"
                >
                  See the install workflow
                </Link>
              </div>
            </div>

            <MaintainerNote />
          </div>
        </Section>
      </main>

      <SiteFooter />
    </>
  )
}
