import type { Metadata } from 'next'

import Link from 'next/link'

import {
  ArrowRight,
  BadgeCheck,
  FileCode2,
  GitMerge,
  LayoutDashboard,
  ListChecks,
  PanelsTopLeft,
  SquareTerminal,
} from 'lucide-react'

import { JsonLd } from '@/components/seo/JsonLd'
import { CommandCopyButton } from '@/components/site/CommandCopyButton'
import { Eyebrow, HeadingAccent, Section, SectionHeading } from '@/components/site/section'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import {
  adminComponentsDescription,
  adminComponentsRoute,
  adminComponentsTitle,
  componentEntries,
  githubIssuesUrl,
  primaryInstallCommand,
} from '@/lib/site'
import { breadcrumbNode, graph, techArticleNode } from '@/lib/structured-data'

export const metadata: Metadata = {
  alternates: { canonical: adminComponentsRoute },
  title: adminComponentsTitle,
  description: adminComponentsDescription,
  openGraph: {
    description: adminComponentsDescription,
    title: adminComponentsTitle,
    type: 'article',
    url: adminComponentsRoute,
  },
  twitter: {
    card: 'summary_large_image',
    description: adminComponentsDescription,
    title: adminComponentsTitle,
  },
}

const adminComponentsStructuredData = graph(
  breadcrumbNode([
    { name: 'Home', path: '/' },
    { name: adminComponentsTitle, path: adminComponentsRoute },
  ]),
  techArticleNode({
    description: adminComponentsDescription,
    title: adminComponentsTitle,
    url: adminComponentsRoute,
  }),
)

function getExampleBlock() {
  const block = componentEntries.find((component) => component.slug === 'hero-basic')

  if (!block) {
    throw new Error('Missing hero-basic component entry')
  }

  return block
}

const exampleBlock = getExampleBlock()

const adminWiringArtifacts = [
  {
    detail:
      'React, block config, shared fields, and editor labels need to move as one source unit.',
    icon: FileCode2,
    label: 'Component source',
    path: 'src/blocks/<BlockName>/*',
  },
  {
    detail:
      'The block must appear in a collection slot before editors can choose it in the Payload admin panel.',
    icon: PanelsTopLeft,
    label: 'Collection slot',
    path: 'src/collections/Pages/index.ts',
  },
  {
    detail:
      'Custom views, fields, and dashboard surfaces need the same explicit host-file edits as page blocks.',
    icon: LayoutDashboard,
    label: 'Custom view or field',
    path: 'Payload admin config',
  },
  {
    detail:
      'Saved layout data has to resolve to a frontend renderer, not just a compiled component file.',
    icon: GitMerge,
    label: 'Render map',
    path: 'src/blocks/RenderBlocks.tsx',
  },
  {
    detail:
      'Payload types and the admin import map must be regenerated after the component is registered.',
    icon: BadgeCheck,
    label: 'Generated outputs',
    path: 'payload-types.ts, importMap.js',
  },
] as const

const installSteps = [
  {
    body:
      'Run the CLI in a supported Payload v3 and Next.js project. The command below uses a shipped block as the concrete example because it proves the full Payload admin component wiring path today.',
    icon: SquareTerminal,
    title: 'Install a wired block',
  },
  {
    body:
      'Review the copied source, collection patch, render-map patch, generated types, and admin import-map update in one normal git diff.',
    icon: ListChecks,
    title: 'Inspect the admin-facing diff',
  },
  {
    body:
      'Use that pattern for Payload admin panel customization: keep custom dashboard cards, fields, and views tied to the host files they need.',
    icon: LayoutDashboard,
    title: 'Apply the same contract',
  },
] as const

const boundaryRows = [
  {
    label: 'What exists today',
    text:
      'Payload Components ships installable page blocks with the wiring model admin work needs: collection slots, render maps, generated types, and the admin import map.',
  },
  {
    label: 'What is not promised',
    text:
      'This is not a generic Payload CMS admin UI kit, dashboard template library, or form-builder replacement.',
  },
  {
    label: 'What to request next',
    text:
      'If your project needs a custom dashboard card, admin field, or view registered by the CLI, open the concrete component request in GitHub.',
  },
] as const

export default function AdminComponentsPage() {
  return (
    <>
      <JsonLd data={adminComponentsStructuredData} />
      <SiteHeader />

      <main className="flex-1">
        <section className="hero-shell overflow-hidden border-b border-border/60">
          <div aria-hidden="true" className="hero-atmosphere" />

          <div className="container relative grid gap-10 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.78fr)] lg:items-end lg:gap-16 lg:py-24">
            <div className="max-w-3xl">
              <span
                className="hero-reveal flex w-fit items-center gap-2 rounded-full border border-border/70 bg-background/90 px-4 py-1.5 text-[0.72rem] font-medium uppercase tracking-eyebrow text-muted-foreground backdrop-blur-sm"
                style={{ animationDelay: '80ms' }}
              >
                <span aria-hidden="true" className="hero-eyebrow-dot" />
                Payload admin components
              </span>

              <h1
                className="hero-reveal mt-6 text-balance text-[clamp(2.35rem,5.6vw,4.15rem)] font-medium leading-[1] text-foreground"
                style={{ animationDelay: '180ms' }}
              >
                Payload admin components need <HeadingAccent>wiring.</HeadingAccent>
              </h1>

              <p
                className="hero-reveal mt-5 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg"
                style={{ animationDelay: '320ms' }}
              >
                A custom Payload CMS admin UI surface is not finished when a React file lands.
                Payload admin panel customization still needs collection slots, custom views or
                fields, render maps, generated types, and admin import-map work that move together.
              </p>

              <div
                className="hero-reveal mt-7 flex flex-col gap-3 sm:flex-row"
                style={{ animationDelay: '430ms' }}
              >
                <Link
                  href="#admin-wiring"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground shadow-[0_18px_40px_-22px_rgba(15,23,42,0.55)] transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-[0_22px_50px_-22px_rgba(15,23,42,0.6)]"
                >
                  See the wiring contract
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/components"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-border/70 bg-background/80 px-5 text-sm font-medium text-foreground backdrop-blur-sm transition-[transform,background-color] duration-200 hover:-translate-y-px hover:bg-background"
                >
                  Browse installable blocks
                </Link>
              </div>
            </div>

            <aside
              className="hero-reveal rounded-md border border-border bg-background/90 p-4 shadow-card backdrop-blur-sm sm:p-5"
              style={{ animationDelay: '520ms' }}
            >
              <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
                <p className="font-mono text-[11px] uppercase tracking-eyebrow text-muted-foreground">
                  Example install
                </p>
                <span className="rounded-full bg-brand/10 px-2 py-1 font-mono text-[11px] text-brand">
                  {exampleBlock.version}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-md border border-border bg-muted/40 p-2.5">
                <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs text-foreground">
                  {primaryInstallCommand}
                </code>
                <CommandCopyButton command={primaryInstallCommand} />
              </div>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Hero Basic is a shipped block, not an admin dashboard kit. It is the smallest live
                proof that the CLI can copy source, patch Payload files, and regenerate admin
                outputs in one pass.
              </p>
            </aside>
          </div>
        </section>

        <Section id="admin-wiring">
          <SectionHeading
            accentWord="five"
            eyebrow="Admin component wiring"
            heading="A useful admin component has five artifacts."
            intro="Whether the surface is a page block, custom dashboard, admin field, or custom view, the work is bigger than UI. The contract below is what makes the component live in a Payload project."
          />

          <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            {adminWiringArtifacts.map((item) => {
              const Icon = item.icon

              return (
                <article key={item.label} className="rounded-md border border-border bg-card p-5">
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-brand/10 text-brand">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-base font-semibold text-foreground">{item.label}</h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.detail}</p>
                      <code className="mt-3 block max-w-full overflow-x-auto whitespace-nowrap rounded-md border border-border bg-muted/40 px-2.5 py-1.5 font-mono text-xs text-foreground/80">
                        {item.path}
                      </code>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </Section>

        <Section className="bg-muted/35">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:items-start lg:gap-16">
            <SectionHeading
              accentWord="Payload"
              eyebrow="Install path"
              heading="Use the block contract for Payload admin work."
              intro="Payload Components does not ask developers to trust a black box. The install lands as source and patches you can inspect, which is the right model for admin component wiring."
            />

            <div className="grid gap-4">
              {installSteps.map((step, index) => {
                const Icon = step.icon

                return (
                  <article key={step.title} className="rounded-md border border-border bg-background p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex size-10 items-center justify-center rounded-md bg-brand/10 text-brand">
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        Step {index + 1}
                      </span>
                    </div>
                    <h2 className="mt-5 text-lg font-semibold text-foreground">{step.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.body}</p>
                    {index === 0 ? (
                      <div className="mt-5 flex items-center justify-between gap-3 rounded-md border border-border bg-muted/45 p-3">
                        <code className="min-w-0 overflow-x-auto whitespace-nowrap font-mono text-xs text-foreground">
                          {primaryInstallCommand}
                        </code>
                        <CommandCopyButton command={primaryInstallCommand} />
                      </div>
                    ) : null}
                  </article>
                )
              })}
            </div>
          </div>
        </Section>

        <Section>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <SectionHeading
              eyebrow="Honest boundary"
              heading="This is the admin path Payload Components can support now."
              intro="The page stays narrow on purpose. It captures admin-components intent and points developers to the installable block contract that actually ships today."
            />

            <div className="grid gap-4">
              {boundaryRows.map((row) => (
                <div key={row.label} className="rounded-md border border-border bg-muted/30 p-5">
                  <h2 className="font-mono text-[11px] font-medium uppercase tracking-eyebrow text-muted-foreground">
                    {row.label}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-foreground">{row.text}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section className="bg-foreground text-background">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <Eyebrow className="text-background/70">Start from the shipped contract</Eyebrow>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-[1.08] sm:text-4xl">
                Install a real block, then request the admin surface you need.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-background/70">
                The fastest proof is still the command: copy source, patch Payload, regenerate
                types, update the admin import map, and review the diff before adapting the pattern
                to your admin UI.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/docs/installation"
                className="inline-flex h-11 items-center justify-center rounded-full bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-background/90"
              >
                Read install docs
              </Link>
              <Link
                href={githubIssuesUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-background/25 px-5 text-sm font-medium text-background transition-colors hover:bg-background/10"
              >
                Request an admin component
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </Section>
      </main>

      <SiteFooter />
    </>
  )
}
