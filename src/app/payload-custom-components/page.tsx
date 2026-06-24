import type { Metadata } from 'next'

import Link from 'next/link'

import { ArrowRight, CheckCircle2 } from 'lucide-react'

import { JsonLd } from '@/components/seo/JsonLd'
import { CommandCopyButton } from '@/components/site/CommandCopyButton'
import { Eyebrow, HeadingAccent, Section, SectionHeading } from '@/components/site/section'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import {
  componentEntries,
  customComponentBuildSteps,
  customComponentFitChecks,
  customComponentManifestSnippet,
  customComponentsDescription,
  customComponentsHero,
  customComponentsRoute,
  customComponentsTitle,
  customComponentWiringArtifacts,
  primaryInstallCommand,
} from '@/lib/site'
import { breadcrumbNode, graph, techArticleNode } from '@/lib/structured-data'

export const metadata: Metadata = {
  alternates: { canonical: customComponentsRoute },
  title: customComponentsTitle,
  description: customComponentsDescription,
  openGraph: {
    description: customComponentsDescription,
    title: customComponentsTitle,
    type: 'article',
    url: customComponentsRoute,
  },
  twitter: {
    card: 'summary_large_image',
    description: customComponentsDescription,
    title: customComponentsTitle,
  },
}

const customComponentsStructuredData = graph(
  breadcrumbNode([
    { name: 'Home', path: '/' },
    { name: customComponentsTitle, path: customComponentsRoute },
  ]),
  techArticleNode({
    description: customComponentsDescription,
    title: customComponentsTitle,
    url: customComponentsRoute,
  }),
)

const exampleComponent = componentEntries.find((component) => component.slug === 'hero-basic')!

export default function PayloadCustomComponentsPage() {
  return (
    <>
      <JsonLd data={customComponentsStructuredData} />
      <SiteHeader />

      <main className="flex-1">
        <section className="hero-shell overflow-hidden border-b border-border/60">
          <div aria-hidden="true" className="hero-atmosphere" />

          <div className="container relative py-16 sm:py-20 lg:py-24">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.78fr)] lg:items-end lg:gap-16">
              <div className="max-w-3xl">
                <span
                  className="hero-reveal flex w-fit items-center gap-2 rounded-full border border-border/70 bg-background/90 px-4 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-sm"
                  style={{ animationDelay: '80ms' }}
                >
                  <span aria-hidden="true" className="hero-eyebrow-dot" />
                  {customComponentsHero.eyebrow}
                </span>

                <h1
                  className="hero-reveal mt-6 text-balance text-[clamp(2.35rem,5.6vw,4.15rem)] font-medium leading-[1] text-foreground"
                  style={{ animationDelay: '180ms' }}
                >
                  Make a Payload custom component <HeadingAccent>installable.</HeadingAccent>
                </h1>

                <p
                  className="hero-reveal mt-5 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg"
                  style={{ animationDelay: '320ms' }}
                >
                  {customComponentsHero.intro}
                </p>

                <div
                  className="hero-reveal mt-7 flex flex-col gap-3 sm:flex-row"
                  style={{ animationDelay: '430ms' }}
                >
                  <Link
                    href="#wiring-contract"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-[0_18px_40px_-22px_rgba(15,23,42,0.55)] transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-[0_22px_50px_-22px_rgba(15,23,42,0.6)]"
                  >
                    Read the wiring model
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/docs/components/hero-basic"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-border/70 bg-background/80 px-5 text-sm font-medium text-foreground backdrop-blur-sm transition-[transform,background-color] duration-200 hover:-translate-y-px hover:bg-background"
                  >
                    Open a real component contract
                  </Link>
                </div>
              </div>

              <div
                className="hero-reveal rounded-[1.25rem] border border-border bg-background/90 p-4 shadow-[var(--shadow-card)] backdrop-blur-sm sm:p-5"
                style={{ animationDelay: '520ms' }}
              >
                <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    Example install
                  </p>
                  <span className="rounded-full bg-brand/10 px-2 py-1 font-mono text-[11px] text-brand">
                    {exampleComponent.version}
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-md border border-border bg-muted/40 p-2.5">
                  <code className="min-w-0 flex-1 truncate font-mono text-xs text-foreground">
                    {primaryInstallCommand}
                  </code>
                  <CommandCopyButton command={primaryInstallCommand} />
                </div>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  This guide uses the shipped Hero Basic manifest as the concrete example because it
                  declares every piece a custom block needs before it can move between Payload projects.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Section id="wiring-contract">
          <SectionHeading
            accentWord="five"
            eyebrow="Wiring contract"
            heading="A custom block has five moving parts."
            intro="The React component is only one part of the component. The installable unit is the full contract below."
          />

          <div className="mt-10 overflow-hidden rounded-[1.25rem] border border-border bg-card">
            <div className="hidden grid-cols-[0.9fr_1.5fr_1.4fr] border-b border-border bg-muted/40 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground md:grid">
              <span>Artifact</span>
              <span>What to check</span>
              <span>Where it lands</span>
            </div>
            <div className="divide-y divide-border">
              {customComponentWiringArtifacts.map((item) => (
                <div
                  key={item.artifact}
                  className="grid gap-3 px-5 py-5 md:grid-cols-[0.9fr_1.5fr_1.4fr] md:gap-6"
                >
                  <p className="font-medium text-foreground">{item.artifact}</p>
                  <p className="text-sm leading-6 text-muted-foreground">{item.check}</p>
                  <code className="min-w-0 overflow-x-auto whitespace-nowrap rounded-md border border-border bg-muted/40 px-2.5 py-1.5 font-mono text-xs text-foreground/80">
                    {item.path}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section className="bg-muted/40">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start lg:gap-16">
            <SectionHeading
              accentWord="registry"
              eyebrow="Build sequence"
              heading="Turn a one-off block into a registry contract."
              intro="Use this sequence when a block should travel across repos instead of living as local app code."
            />

            <div className="grid gap-4 sm:grid-cols-2">
              {customComponentBuildSteps.map((step, index) => (
                <div key={step.title} className="rounded-[1.25rem] border border-border bg-card p-5">
                  <div className="flex items-center gap-3">
                    <span className="flex size-8 items-center justify-center rounded-full border border-brand/30 bg-brand/10 font-mono text-xs text-brand">
                      {index + 1}
                    </span>
                    <h2 className="text-base font-semibold text-foreground">{step.title}</h2>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-16">
            <div>
              <Eyebrow>Manifest example</Eyebrow>
              <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.08] text-foreground sm:text-[2.6rem]">
                The manifest says what the CLI is allowed to touch.
              </h2>
              <p className="mt-5 text-base leading-7 text-muted-foreground">
                A custom component becomes installable when its manifest names the copied files,
                the two host files to patch, and the Payload generators that must run after the
                block is registered.
              </p>
              <Link
                href="/docs/registry-contract"
                className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
              >
                Read the registry contract docs
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>

            <pre className="max-h-[36rem] overflow-x-auto rounded-[1.25rem] border border-terminal-border bg-terminal p-5 text-[12px] leading-6 text-terminal-foreground shadow-[var(--shadow-frame)]">
              <code>{customComponentManifestSnippet}</code>
            </pre>
          </div>
        </Section>

        <Section className="bg-muted/40">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-start lg:gap-16">
            <SectionHeading
              accentWord="installable"
              eyebrow="Decision rule"
              heading="Not every custom component should become installable."
              intro="The registry path is worth it when the same shape should be repeated, reviewed, and recovered across projects."
            />

            <div className="grid gap-4">
              {customComponentFitChecks.map((item) => (
                <div key={item.label} className="flex gap-4 rounded-[1.25rem] border border-border bg-card p-5">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden="true" />
                  <div>
                    <h2 className="text-base font-semibold text-foreground">{item.label}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section>
          <div className="flex flex-col items-start gap-6 rounded-[1.5rem] border border-border bg-card p-6 shadow-[var(--shadow-card)] sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <Eyebrow>Next step</Eyebrow>
              <h2 className="mt-4 text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
                Start from a component that already proves the contract.
              </h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
                Hero Basic is the smallest complete example: source files, Pages collection
                registration, RenderBlocks mapping, generated types, import map, recovery files,
                and sample content.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/docs/components/hero-basic"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Open Hero Basic
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <Link
                href="/components"
                className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                Browse the catalog
              </Link>
            </div>
          </div>
        </Section>
      </main>

      <SiteFooter />
    </>
  )
}
