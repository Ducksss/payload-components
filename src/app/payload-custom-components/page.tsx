import type { Metadata } from 'next'

import Link from 'next/link'

import { ArrowRight, Braces, FileCode2, GitBranch, ListChecks, Sparkles } from 'lucide-react'

import { JsonLd } from '@/components/seo/JsonLd'
import { CommandCopyButton } from '@/components/site/CommandCopyButton'
import { Eyebrow, HeadingAccent, Section, SectionHeading } from '@/components/site/section'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { Terminal } from '@/components/site/Terminal'
import { WiringLedger } from '@/components/site/WiringLedger'
import {
  componentEntries,
  payloadCustomComponentsDescription,
  payloadCustomComponentsRoute,
  payloadCustomComponentsTitle,
  primaryInstallCommand,
  siteUrl,
  terminalDemoLines,
} from '@/lib/site'
import { breadcrumbNode, graph, softwareId, websiteId } from '@/lib/structured-data'

export const metadata: Metadata = {
  alternates: { canonical: payloadCustomComponentsRoute },
  title: payloadCustomComponentsTitle,
  description: payloadCustomComponentsDescription,
  openGraph: {
    description: payloadCustomComponentsDescription,
    title: payloadCustomComponentsTitle,
    type: 'website',
    url: payloadCustomComponentsRoute,
  },
  twitter: {
    card: 'summary_large_image',
    description: payloadCustomComponentsDescription,
    title: payloadCustomComponentsTitle,
  },
}

const featuredSlugs = [
  'hero-basic',
  'feature-grid-basic',
  'content-showcase',
  'call-to-action-centered',
] as const

const featuredComponents = featuredSlugs
  .map((slug) => componentEntries.find((component) => component.slug === slug))
  .filter((component): component is (typeof componentEntries)[number] => Boolean(component))

const customComponentSteps = [
  {
    description: 'The block config defines the slug, labels, fields, and editor-facing shape.',
    icon: FileCode2,
    title: 'Register the config',
  },
  {
    description: 'The Pages collection is patched so editors can actually choose the block.',
    icon: ListChecks,
    title: 'Attach it to Pages',
  },
  {
    description: 'The frontend render map knows which React component handles the block.',
    icon: Braces,
    title: 'Map the renderer',
  },
  {
    description: 'Payload types and the admin import map are regenerated after the install.',
    icon: GitBranch,
    title: 'Refresh types and import map',
  },
] as const

const customComponentsStructuredData = graph(
  breadcrumbNode([
    { name: 'Home', path: '/' },
    { name: 'Payload custom components', path: payloadCustomComponentsRoute },
  ]),
  {
    '@id': `${siteUrl}${payloadCustomComponentsRoute}#page`,
    '@type': 'WebPage',
    about: { '@id': softwareId },
    description: payloadCustomComponentsDescription,
    inLanguage: 'en',
    isPartOf: { '@id': websiteId },
    name: payloadCustomComponentsTitle,
    url: `${siteUrl}${payloadCustomComponentsRoute}`,
  },
)

export default function PayloadCustomComponentsPage() {
  return (
    <>
      <JsonLd data={customComponentsStructuredData} />
      <SiteHeader activePath="/components" />

      <main className="flex-1">
        <section className="hero-shell overflow-hidden border-b border-border/60">
          <div aria-hidden="true" className="hero-atmosphere" />
          <div className="container relative grid gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-center lg:gap-14 lg:py-24">
            <div className="flex max-w-3xl flex-col items-start">
              <span className="flex items-center gap-2 rounded-full border border-border/70 bg-background/90 px-4 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-sm">
                <span aria-hidden="true" className="hero-eyebrow-dot" />
                Payload custom components
              </span>
              <h1 className="mt-6 text-balance text-[clamp(2.4rem,6vw,4.65rem)] font-medium leading-[0.98] tracking-[-0.05em] text-foreground">
                Payload custom components, without the <HeadingAccent>wiring tax</HeadingAccent>.
              </h1>
              <p className="mt-5 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                Build reusable Payload CMS blocks without leaving collection config, renderer maps,
                generated types, and the admin import map as a manual checklist. Payload Components
                installs each block as source code and finishes the Payload-specific wiring in the
                same diff.
              </p>

              <div className="mt-8 grid w-full max-w-xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-full border border-border bg-background py-1.5 pl-5 pr-1.5 shadow-card">
                <code className="overflow-x-auto whitespace-nowrap font-mono text-xs text-foreground/90 sm:text-[13px]">
                  {primaryInstallCommand}
                </code>
                <CommandCopyButton command={primaryInstallCommand} />
              </div>

              <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Link
                  href="/components"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-[0_18px_40px_-22px_rgba(15,23,42,0.55)] transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-[0_22px_50px_-22px_rgba(15,23,42,0.6)]"
                >
                  Browse custom-ready blocks
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/docs/installation"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border/70 bg-background/80 px-5 text-sm font-medium text-foreground backdrop-blur-sm transition-[transform,background-color] duration-200 hover:-translate-y-px hover:bg-background"
                >
                  Read install docs
                </Link>
              </div>
            </div>

            <Terminal
              className="shadow-frame"
              lines={terminalDemoLines}
              title="payload-components add hero-basic"
            />
          </div>
        </section>

        <Section>
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:items-start lg:gap-14">
            <SectionHeading
              accentWord="expensive"
              eyebrow="Why it matters"
              heading="Custom Payload components get expensive after the paste."
              intro="A Payload block is only useful after Payload can edit it, render it, type it, and load it in the admin. The registry is built around that boundary."
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {customComponentSteps.map((step) => {
                const Icon = step.icon

                return (
                  <article
                    key={step.title}
                    className="rounded-xl border border-border bg-card p-5 shadow-card"
                  >
                    <Icon className="size-5 text-brand" aria-hidden="true" />
                    <h2 className="mt-4 text-base font-semibold tracking-tight text-foreground">
                      {step.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {step.description}
                    </p>
                  </article>
                )
              })}
            </div>
          </div>
        </Section>

        <Section className="bg-muted/40">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:gap-14">
            <div>
              <SectionHeading
                accentWord="reviewable"
                eyebrow="Install path"
                heading="One command, one reviewable diff."
                intro="The CLI checks the project shape, copies the block files, applies scoped patches, and runs the Payload generation steps. You keep ownership because the output is plain source in your repo."
              />
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/docs/installation"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Installation guide
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/docs/architecture"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  Architecture notes
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background p-5 shadow-card">
              <Eyebrow>What lands</Eyebrow>
              <ul className="mt-5 grid grid-cols-1 gap-3 text-sm leading-6 text-muted-foreground">
                {[
                  'Block source files for config, React rendering, and shared fields.',
                  'A Pages collection patch that makes the block available to editors.',
                  'A RenderBlocks patch that maps saved content to the right component.',
                  'Regenerated Payload types and admin import map output.',
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <Sparkles className="mt-1 size-4 shrink-0 text-brand" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              accentWord="docs"
              eyebrow="Start points"
              heading="Relevant component docs, with install commands."
              intro="These are real catalog entries. Each page shows the fields, files, patched targets, and command before you add anything."
            />
            <Link
              href="/components"
              className="inline-flex h-10 w-fit shrink-0 items-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Browse all components
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            {featuredComponents.map((component) => (
              <article key={component.slug} className="rounded-xl border border-border bg-card p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {component.target}
                </p>
                <h2 className="mt-3 text-lg font-semibold tracking-tight text-foreground">
                  {component.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {component.description}
                </p>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <code className="min-w-0 overflow-x-auto whitespace-nowrap rounded-md border border-border bg-background px-3 py-2 font-mono text-xs text-foreground/80">
                    {component.command}
                  </code>
                  <CommandCopyButton command={component.command} />
                </div>
                <Link
                  href={component.href}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-opacity hover:opacity-75"
                >
                  Read the contract
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </Section>

        <Section className="bg-muted/40">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              accentWord="wires"
              eyebrow="Wiring proof"
              heading="The difference is what the installer wires."
              intro="Payload Components uses the same registry idea as shadcn, but the add command keeps going until the block is live inside a Payload project."
            />
            <code className="hidden shrink-0 pb-1 font-mono text-[11px] text-muted-foreground lg:block">
              source: payload-components/manifests/hero-basic.json
            </code>
          </div>

          <div className="mt-10">
            <WiringLedger />
          </div>
        </Section>
      </main>

      <SiteFooter />
    </>
  )
}
