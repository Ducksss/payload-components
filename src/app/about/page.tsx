import type { Metadata } from 'next'

import Link from 'next/link'

import { ArrowRight, Square } from 'lucide-react'

import { JsonLd } from '@/components/seo/JsonLd'
import { siteIcons } from '@/components/site/icons'
import { MaintainerNote } from '@/components/site/MaintainerNote'
import { HeadingAccent, Section, SectionHeading } from '@/components/site/section'
import { ClientShowcase } from '@/components/site/sections/ClientShowcase'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { githubIssuesUrl, receipts, wiringLedger } from '@/lib/site'
import { breadcrumbNode, graph } from '@/lib/structured-data'

const description =
  'Why Payload Components exists: stop rebuilding the same Payload blocks, rewiring them by hand, and re-proving every install across freelance projects.'

export const metadata: Metadata = {
  alternates: { canonical: '/about' },
  title: 'About',
  description,
  openGraph: {
    description,
    title: 'About Payload Components',
    type: 'website',
    url: '/about',
  },
  twitter: {
    card: 'summary_large_image',
    description,
    title: 'About Payload Components',
  },
}

const aboutStructuredData = graph(
  breadcrumbNode([
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ]),
)

/* The grunt-work loop, deliberately unchecked — the landing's wiring
   ledger shows the same items checked off by the installer. */
const pasteChecklist = [
  'register the block in src/collections/Pages/index.ts',
  'map it in src/blocks/RenderBlocks.tsx',
  'run payload generate:types',
  'run payload generate:importmap',
  'prove it still works — integration tests, e2e, click through the admin',
] as const

/* The install pipeline, in the order `payload-components add` runs it —
   mirrors terminalDemoLines in lib/site; the section closes by noting all
   five land as one reviewable diff. */
const pipelineStages = [
  {
    detail: 'The block config, component, and shared fields land in src/blocks/.',
    title: 'Copy the source',
  },
  {
    detail: 'Added to your Pages collection in src/collections/Pages/index.ts.',
    title: 'Register the block',
  },
  {
    detail: 'Wired into src/blocks/RenderBlocks.tsx so the page renders it.',
    title: 'Map the renderer',
  },
  {
    detail: 'payload generate:types updates src/payload-types.ts.',
    title: 'Regenerate types',
  },
  {
    detail: 'payload generate:importmap updates the admin import map.',
    title: 'Regenerate the import map',
  },
] as const

export default function AboutPage() {
  return (
    <>
      <JsonLd data={aboutStructuredData} />
      <SiteHeader activePath="/about" />

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
                About
              </span>

              <h1
                className="hero-reveal mt-6 text-balance text-[clamp(2.4rem,6vw,4.25rem)] font-medium leading-[0.98] tracking-[-0.05em] text-foreground"
                style={{ animationDelay: '180ms' }}
              >
                Why Payload Components <HeadingAccent>exists</HeadingAccent>
              </h1>

              <p
                className="hero-reveal mt-5 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg"
                style={{ animationDelay: '340ms' }}
              >
                Payload Components comes out of years of freelance Payload work — and the tax every one of
                those projects paid: rebuilding the same blocks, rewiring them by hand, and
                re-proving they worked.
              </p>
            </div>
          </div>
        </section>

        <Section>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,17rem)] lg:gap-16">
            {/* Prose — left-anchored to the hero's edge, held to a readable measure. */}
            <div className="flex max-w-[60ch] flex-col gap-7 text-base leading-7 text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">
                Payload Components is an open-source registry and CLI that installs typed Payload
                CMS blocks into Payload v3 + Next.js projects — wired, not pasted.
              </span>{' '}
              One command copies a block’s source and does the wiring a hand-paste leaves you to
              finish: it registers the block in your Pages collection, maps the renderer, and
              regenerates your types and the admin import map. The rest of this page is why it
              exists.
            </p>

            <p>
              Freelancing on Payload sites means a new repo every few weeks, and every one of them
              needs roughly the same surfaces — a hero, a feature grid, post cards, an archive.
              None of that is the work a client actually hires you for. It is the work that stands
              between you and that work.
            </p>

            <p>
              <span className="font-medium text-foreground">shadcn changed the expectation</span>{' '}
              for plain UI: run one command and a real component lands in your repo, in your
              style, yours to edit. Payload had no shelf like that. And building{' '}
              <Link
                href="/payload-custom-components"
                className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
              >
                Payload custom components
              </Link>{' '}
              is harder than UI components, because copying the files is the easy part. A pasted block is
              not live until your collection schema knows it, your renderer maps it, your types
              include it, and the admin import map sees it.
            </p>

            <figure className="rounded-[1.25rem] border border-border bg-muted/40 p-5 sm:p-6">
              <figcaption className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                After every paste, on every project
              </figcaption>
              <ul className="mt-4 flex flex-col gap-2.5">
                {pasteChecklist.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 font-mono text-[13px] leading-6 text-foreground/75"
                  >
                    <Square
                      className="mt-1 size-3.5 shrink-0 text-muted-foreground/60"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </figure>

            <p className="text-xl font-medium leading-8 tracking-[-0.01em] text-foreground">
              The paste was never the problem. The edits after it were — and proving them, every
              single time, was worse.
            </p>

            <p>
              That last checkbox is where freelance weeks actually went. Wiring a block by hand
              means verifying it by hand: integration tests, e2e runs, clicking through the admin
              to make sure nothing half-works in a way the client finds first. Multiply that by
              every block, every repo, every project, and the job stops being the content model,
              the design, the launch — the things that really matter — and becomes grunt work.
            </p>

            <p>
              <span className="font-medium text-foreground">
                Payload Components is the registry I kept wishing existed.
              </span>{' '}
              Blocks that install like shadcn components but finish the job:{' '}
              <code className="rounded-md border border-border bg-muted/60 px-1.5 py-0.5 font-mono text-[13px] text-foreground/80">
                npx payload-components add hero-basic
              </code>{' '}
              copies the source and does the four edits itself, landing as one reviewable git
              diff. And the proving moved into the registry: installer tests and a nightly
              fresh-repo smoke run gate every component centrally, once — instead of being redone by
              every freelancer on every install.
            </p>

            <p>
              It is MIT-licensed end to end — the registry, the CLI, every component, and this site
              are one repository. No pricing, no license keys, no gated tier. An installer that
              edits your repo earns trust the only honest way: by letting you read it. The catalog
              grows from real installs and pull requests, not roadmap theater — if you ship client
              sites on Payload,{' '}
              <a
                href={githubIssuesUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
              >
                tell me which blocks you rebuild every time
              </a>
              .
            </p>
            </div>

            {/* Receipts rail — the proof behind the story, filling the
                right column instead of leaving it empty. */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-[1.25rem] border border-border bg-muted/30 p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  The receipts
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Not a pitch — every line is something you can check in the repository.
                </p>
                <ul className="mt-5 flex flex-col gap-3.5 border-t border-border pt-5">
                  {receipts.map((receipt) => {
                    const Icon = siteIcons[receipt.icon]

                    return (
                      <li
                        key={receipt.label}
                        className="flex items-start gap-2.5 text-sm leading-6 text-foreground/80"
                      >
                        <Icon className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true" />
                        {receipt.label}
                      </li>
                    )
                  })}
                </ul>
              </div>
            </aside>
          </div>
        </Section>

        <Section className="bg-muted/40">
          <SectionHeading
            accentWord="Finished"
            eyebrow="The extension"
            heading="Built on shadcn. Finished for Payload."
            intro="Payload Components is built on the shadcn registry — not a rival to it. payload-components add wraps the same registry delivery, then does the Payload wiring shadcn add leaves to you. A layout block is live only once five artifacts exist; a plain copy lands the first and hands you the other four."
          />

          {/* The framing as numbers — reusing the landing ledger's columns so the
              commands and tallies never drift from what the installer actually does. */}
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex min-w-0 flex-col gap-3 rounded-[1.25rem] border border-border bg-background p-6">
              <code className="block max-w-full overflow-x-auto whitespace-nowrap rounded-md border border-border bg-muted/50 px-3 py-2 font-mono text-xs text-foreground/80">
                {wiringLedger.columns.baseline.command}
              </code>
              <p className="font-mono text-4xl font-semibold tracking-tight text-muted-foreground">
                1 <span className="text-muted-foreground/40">/ 5</span>
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                {wiringLedger.columns.baseline.summary}
              </p>
            </div>

            <div className="flex min-w-0 flex-col gap-3 rounded-[1.25rem] border border-border bg-background p-6">
              <code className="block max-w-full overflow-x-auto whitespace-nowrap rounded-md border border-border bg-muted/50 px-3 py-2 font-mono text-xs text-foreground/80">
                {wiringLedger.columns.component.command}
              </code>
              <p className="font-mono text-4xl font-semibold tracking-tight text-brand">
                5 <span className="text-brand/40">/ 5</span>
              </p>
              <p className="text-sm leading-6 text-muted-foreground">
                {wiringLedger.columns.component.summary}
              </p>
            </div>
          </div>

          {/* The five artifacts as a pipeline — one numbered pass, mirroring
              terminalDemoLines without re-rendering the landing's full ledger. */}
          <ol className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-6 lg:border-t lg:border-border">
            {pipelineStages.map((stage, index) => (
              <li key={stage.title} className="relative flex min-w-0 flex-col gap-2 lg:pt-7">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 hidden h-3 w-px bg-brand lg:block"
                />
                <span className="font-mono text-sm font-semibold text-brand">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  {stage.title}
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">{stage.detail}</p>
              </li>
            ))}
          </ol>

          <p className="mt-8 max-w-2xl text-base leading-7 text-foreground">
            All five land in one pass — as one git diff you review like any PR.
          </p>
        </Section>

        <ClientShowcase />

        <Section className="bg-muted/40">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
            <div className="flex flex-col items-start">
              <SectionHeading
                accentWord="matters"
                eyebrow="From here"
                heading="Spend your week on the work that matters."
                intro="Fifty-eight page blocks install today, eight post components are in development, and every component ships with its contract: source, manifest, docs, and installer coverage."
              />
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/components"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-[0_18px_40px_-22px_rgba(15,23,42,0.55)] transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-[0_22px_50px_-22px_rgba(15,23,42,0.6)]"
                >
                  Browse the catalog
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/docs"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border/70 bg-background/80 px-5 text-sm font-medium text-foreground backdrop-blur-sm transition-[transform,background-color] duration-200 hover:-translate-y-px hover:bg-background"
                >
                  Read the docs
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
