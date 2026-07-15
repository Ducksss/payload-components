import type { Metadata } from 'next'

import Link from 'next/link'

import { ArrowRight, Check, CircleDashed, Copy, ExternalLink } from 'lucide-react'

import { JsonLd } from '@/components/seo/JsonLd'
import { HeadingAccent, Section, SectionHeading } from '@/components/site/section'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { primaryInstallCommand, wiringLedger } from '@/lib/site'
import { breadcrumbNode, graph } from '@/lib/structured-data'

const route = '/compare/shadcn-vs-payload-components'
const description =
  'Compare raw shadcn registry delivery with the Payload-aware installer that also registers the block, maps its renderer, and regenerates types and the admin import map.'

export const metadata: Metadata = {
  alternates: { canonical: route },
  description,
  title: 'shadcn add vs payload-components add',
  openGraph: {
    description,
    title: 'shadcn add vs payload-components add',
    type: 'website',
    url: route,
  },
  twitter: {
    card: 'summary_large_image',
    description,
    title: 'shadcn add vs payload-components add',
  },
}

const structuredData = graph(
  breadcrumbNode([
    { name: 'Home', path: '/' },
    { name: 'shadcn vs Payload Components', path: route },
  ]),
)

const rawInstallCommand =
  'npx shadcn@latest add https://www.payload-components.xyz/r/hero-basic.json'

const diffLines = [
  { kind: 'file', text: 'src/blocks/HeroBasic/Component.tsx' },
  { kind: 'file', text: 'src/blocks/HeroBasic/config.ts' },
  { kind: 'file', text: 'src/blocks/shared/heroFields.ts' },
  { kind: 'patch', text: 'src/collections/Pages/index.ts       + HeroBasic' },
  { kind: 'patch', text: 'src/blocks/RenderBlocks.tsx          + heroBasic mapping' },
  { kind: 'generated', text: 'src/payload-types.ts                  regenerated' },
  { kind: 'generated', text: 'admin importMap.js                    regenerated' },
] as const

function InstallButton({ className = '' }: { className?: string }) {
  return (
    <button
      type="button"
      data-copy-command={primaryInstallCommand}
      className={`copy-button group inline-flex min-h-12 max-w-full items-center justify-center gap-3 rounded-full bg-primary px-5 py-3 font-mono text-sm font-medium text-primary-foreground shadow-[0_18px_40px_-22px_rgba(15,23,42,0.55)] transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-[0_22px_50px_-22px_rgba(15,23,42,0.6)] data-[copied=true]:bg-brand data-[copied=true]:text-brand-foreground ${className}`}
    >
      <code className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
        {primaryInstallCommand}
      </code>
      <span className="flex shrink-0 items-center gap-1.5 border-l border-current/25 pl-3">
        <Copy className="copy-icon-idle size-3.5" aria-hidden="true" />
        <Check className="copy-icon-done size-3.5" aria-hidden="true" />
        <span data-copy-label>Copy</span>
      </span>
    </button>
  )
}

function Verdict({ children, complete }: { children: string; complete: boolean }) {
  return (
    <span
      className={
        complete
          ? 'inline-flex items-center gap-2 font-medium text-foreground'
          : 'inline-flex items-center gap-2 text-muted-foreground'
      }
    >
      {complete ? (
        <Check className="size-4 shrink-0 text-brand" aria-hidden="true" />
      ) : (
        <CircleDashed className="size-4 shrink-0" aria-hidden="true" />
      )}
      {children}
    </span>
  )
}

export default function ShadcnComparisonPage() {
  return (
    <>
      <JsonLd data={structuredData} />
      <SiteHeader />

      <main className="flex-1">
        <section className="hero-shell overflow-hidden border-b border-border/60">
          <div aria-hidden="true" className="hero-atmosphere" />

          <div className="container relative grid gap-12 py-16 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.78fr)] lg:items-center lg:gap-16 lg:py-24">
            <div className="flex min-w-0 flex-col items-start">
              <span className="hero-reveal flex items-center gap-2 rounded-full border border-border/70 bg-background/90 px-4 py-1.5 font-mono text-[0.68rem] font-medium uppercase tracking-[0.18em] text-muted-foreground backdrop-blur-sm">
                <span aria-hidden="true" className="hero-eyebrow-dot" />
                shadcn add vs payload-components add
              </span>

              <h1
                className="hero-reveal mt-6 max-w-3xl text-balance text-[clamp(2.6rem,6vw,4.75rem)] font-medium leading-[0.96] tracking-[-0.055em] text-foreground"
                style={{ animationDelay: '120ms' }}
              >
                Same registry delivery.{' '}
                <HeadingAccent>Four Payload edits finished.</HeadingAccent>
              </h1>

              <p
                className="hero-reveal mt-6 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg"
                style={{ animationDelay: '240ms' }}
              >
                Payload Components builds on the shadcn registry. Use the raw registry URL when
                you only want the declared source files. Use the wrapper when you also want the
                block registered, rendered, typed, and visible in Payload admin.
              </p>

              <div className="hero-reveal mt-8 w-full max-w-xl" style={{ animationDelay: '340ms' }}>
                <InstallButton />
                <p className="mt-3 font-mono text-[11px] leading-5 text-muted-foreground">
                  MIT licensed · source stays in your repo · review the result as a normal git diff
                </p>
              </div>
            </div>

            <figure className="hero-reveal min-w-0 overflow-hidden rounded-[1.5rem] border border-border bg-background shadow-card" style={{ animationDelay: '280ms' }}>
              <figcaption className="flex items-center justify-between border-b border-border bg-muted/45 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                <span>hero-basic install receipt</span>
                <span className="text-brand">5 / 5</span>
              </figcaption>
              <div className="p-5 sm:p-6">
                <code className="block overflow-x-auto whitespace-nowrap font-mono text-xs text-foreground/80">
                  <span className="select-none text-brand">$ </span>
                  {primaryInstallCommand}
                </code>
                <div className="mt-5 border-t border-border pt-4">
                  {diffLines.map((line) => (
                    <div
                      key={line.text}
                      className="grid min-w-max grid-cols-[1rem_minmax(0,1fr)] gap-2 py-1 font-mono text-[11px] leading-5 sm:text-xs"
                    >
                      <span
                        aria-hidden="true"
                        className={line.kind === 'file' ? 'text-muted-foreground' : 'text-brand'}
                      >
                        {line.kind === 'file' ? 'A' : 'M'}
                      </span>
                      <span className="whitespace-pre text-foreground/75">{line.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </figure>
          </div>
        </section>

        <Section>
          <SectionHeading
            accentWord="short"
            eyebrow="The install boundary"
            heading="The short answer, artifact by artifact."
            intro="This comparison is scoped to installing a Payload Components layout block through its raw shadcn registry item. shadcn can distribute any files an item declares. The Payload Components wrapper adds project-aware patches and post-install generation on top."
          />

          <div className="mt-12 overflow-hidden rounded-[1.5rem] border border-border bg-background shadow-card">
            <p
              id="verified-install-items"
              className="border-b border-border bg-muted/20 px-5 py-3 text-sm leading-6 text-muted-foreground sm:px-6"
            >
              Verified install items: the raw shadcn command completes 1 of 5; Payload Components
              completes all 5: block source, collection registration, renderer mapping, generated
              types, and the admin import map.
            </p>
            <div className="overflow-x-auto">
            <table
              aria-describedby="verified-install-items"
              className="w-full min-w-[46rem] border-collapse text-left"
            >
              <caption className="sr-only">
                Files and Payload wiring completed by raw shadcn add and payload-components add
              </caption>
              <thead>
                <tr className="border-b border-border bg-muted/35">
                  <th scope="col" className="px-5 py-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground sm:px-6">
                    Artifact
                  </th>
                  <th scope="col" className="border-l border-border px-5 py-4 sm:px-6">
                    <code className="font-mono text-xs font-medium text-foreground/75">shadcn add</code>
                  </th>
                  <th scope="col" className="border-l border-border bg-brand/[0.055] px-5 py-4 sm:px-6">
                    <code className="font-mono text-xs font-semibold text-foreground">payload-components add</code>
                  </th>
                </tr>
              </thead>
              <tbody>
                {wiringLedger.rows.map((row) => (
                  <tr key={row.artifact} className="border-b border-border last:border-b-0">
                    <th scope="row" className="px-5 py-4 align-top sm:px-6">
                      <span className="block text-sm font-medium text-foreground">{row.artifact}</span>
                      <code className="mt-1 block max-w-[26rem] whitespace-normal font-mono text-[11px] leading-5 text-muted-foreground">
                        {row.path}
                      </code>
                    </th>
                    <td className="border-l border-border px-5 py-4 align-top text-sm sm:px-6">
                      <Verdict complete={row.baseline !== null}>
                        {row.baseline ?? 'left to you'}
                      </Verdict>
                    </td>
                    <td className="border-l border-border bg-brand/[0.055] px-5 py-4 align-top text-sm sm:px-6">
                      <Verdict complete>{row.component}</Verdict>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-border">
                  <th scope="row" className="px-5 py-4 text-sm font-medium text-foreground sm:px-6">Completed in one command</th>
                  <td className="border-l border-border px-5 py-4 font-mono text-lg text-muted-foreground sm:px-6">1 / 5</td>
                  <td className="border-l border-border bg-brand/[0.055] px-5 py-4 font-mono text-lg font-semibold text-brand sm:px-6">5 / 5</td>
                </tr>
              </tfoot>
            </table>
            </div>
          </div>

          <p className="mt-5 max-w-3xl text-sm leading-6 text-muted-foreground">
            The raw command for the same registry item is{' '}
            <code className="rounded-md border border-border bg-muted/50 px-1.5 py-0.5 font-mono text-[12px] text-foreground/80">
              {rawInstallCommand}
            </code>
            . It is a valid choice when source delivery is exactly what you need.
          </p>
        </Section>

        <Section className="bg-muted/35">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)] lg:items-start lg:gap-16">
            <SectionHeading
              accentWord="diff"
              eyebrow="What the wrapper changes"
              heading="One command. One reviewable diff."
              intro="The wrapper does not hide the work. It applies two narrow source patches, runs Payload's own generators, and records install state so a retry can converge instead of duplicating wiring."
            />

            <div className="overflow-hidden rounded-[1.5rem] border border-border bg-[#111714] text-[#d7e0da] shadow-[0_28px_70px_-38px_rgba(15,23,42,0.7)]">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white/50">
                <span>illustrative git diff</span>
                <span>2 scoped patches</span>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-[11px] leading-6 sm:p-6 sm:text-xs">
                <code>{`diff --git a/src/collections/Pages/index.ts
@@
+ import { HeroBasic } from '../../blocks/HeroBasic/config'
  blocks: [
+   HeroBasic,
  ]

diff --git a/src/blocks/RenderBlocks.tsx
@@
+ import { HeroBasicBlock } from '@/blocks/HeroBasic/Component'
  const blockComponents = {
+   heroBasic: HeroBasicBlock,
  }

$ payload generate:types
$ payload generate:importmap`}</code>
              </pre>
            </div>
          </div>
        </Section>

        <Section>
          <SectionHeading
            accentWord="which"
            eyebrow="Choose the boundary"
            heading="Use the command that owns the work you want."
            intro="Both paths leave source in your repository. The difference is whether you want to own the Payload-specific wiring by hand or let a project-aware installer finish it."
          />

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <article className="rounded-[1.5rem] border border-border bg-background p-6 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Use raw shadcn when</p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground">You want source delivery only.</h3>
              <ul className="mt-6 space-y-3 text-sm leading-6 text-muted-foreground">
                <li>You have custom collection and renderer conventions.</li>
                <li>You prefer to make every Payload edit yourself.</li>
                <li>You are using the registry item outside its supported starter shape.</li>
              </ul>
              <a
                href="https://ui.shadcn.com/docs/registry/getting-started"
                target="_blank"
                rel="noreferrer"
                className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
              >
                Read the shadcn registry docs
                <ExternalLink className="size-3.5" aria-hidden="true" />
              </a>
            </article>

            <article className="rounded-[1.5rem] border border-brand/30 bg-brand/[0.055] p-6 sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-brand">Use Payload Components when</p>
              <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground">You want a working Payload block.</h3>
              <ul className="mt-6 space-y-3 text-sm leading-6 text-muted-foreground">
                <li>You run Payload v3 with Next.js 15 or 16.</li>
                <li>Your project has the supported Pages and RenderBlocks anchors.</li>
                <li>You want repeatable installs with visible recovery state.</li>
              </ul>
              <Link
                href="/docs/installation"
                className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline decoration-brand/50 underline-offset-4 transition-colors hover:decoration-brand"
              >
                Check project compatibility
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </article>
          </div>
        </Section>

        <Section className="bg-muted/35">
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-brand">Finish the install</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold leading-tight tracking-[-0.045em] text-foreground sm:text-5xl">
              Copy the block. Wire the block.{' '}
              <HeadingAccent>Review the diff.</HeadingAccent>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
              Start with Hero Basic. The source and every installer step are open in the same MIT repository.
            </p>
            <InstallButton className="mt-8" />
          </div>
        </Section>
      </main>

      <SiteFooter />
    </>
  )
}
