import type { CSSProperties, ReactNode } from 'react'

import Link from 'next/link'

import { ArrowRight, ArrowUpRight, Check, X } from 'lucide-react'

import { HeroTerminal } from '@/components/landing/HeroTerminal'
import { KitPreviewCard } from '@/components/landing/KitPreviewCard'
import { CommandCopyButton } from '@/components/site/CommandCopyButton'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import {
  featureCells,
  generatedTypeSnippet,
  githubRepoUrl,
  heroBadge,
  heroSubheadline,
  installComparison,
  kitEntries,
  primaryInstallCommand,
  proofPoints,
} from '@/lib/site'

function stagger(seconds: number): CSSProperties {
  return { '--stagger': `${seconds}s` } as CSSProperties
}

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-zinc-400">
      {children}
    </p>
  )
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-zinc-200">
        <div
          className="hero-grid-bg absolute inset-0 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
          aria-hidden="true"
        />
        <div className="container relative pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
            <div>
              <span
                className="animate-fade-up inline-flex items-center rounded-full border border-zinc-200 bg-white px-3.5 py-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-zinc-500"
                style={stagger(0)}
              >
                {heroBadge}
              </span>
              <h1
                className="animate-fade-up mt-6 text-5xl font-semibold leading-[0.98] tracking-[-0.035em] text-zinc-950 sm:text-6xl lg:text-7xl"
                style={stagger(0.1)}
              >
                Install Payload blocks without rebuilding the wiring.
              </h1>
              <p
                className="animate-fade-up mt-6 max-w-xl text-base leading-7 text-zinc-600"
                style={stagger(0.2)}
              >
                {heroSubheadline}
              </p>
              <div className="animate-fade-up mt-8 flex flex-col gap-3 sm:flex-row" style={stagger(0.3)}>
                <Link
                  href="/docs/installation"
                  className="group inline-flex h-11 w-fit items-center justify-center gap-2 rounded-md bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
                >
                  Get started
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
                <Link
                  href="/components"
                  className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-md border border-zinc-300 bg-white px-5 text-sm font-medium text-zinc-950 transition-colors hover:border-zinc-950"
                >
                  Browse kits
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
            <div className="animate-fade-up" style={stagger(0.35)}>
              <HeroTerminal />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200">
        <div className="container grid grid-cols-2 divide-x divide-zinc-200 sm:grid-cols-4">
          {proofPoints.map((point) => (
            <p
              key={point}
              className="px-2 py-4 text-center font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-zinc-500"
            >
              {point}
            </p>
          ))}
        </div>
      </section>

      <section className="border-b border-zinc-200">
        <div className="container py-20 sm:py-24">
          <SectionEyebrow>01 — The problem</SectionEyebrow>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-4xl">
            A registry alone copies files. Payload blocks need wiring.
          </h2>
          <div className="mt-12 grid divide-y divide-zinc-200 border border-zinc-200 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="bg-zinc-50 p-6 sm:p-8">
              <code className="font-mono text-sm text-zinc-500">
                {installComparison.manual.command}
              </code>
              <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-zinc-400">
                {installComparison.manual.label}
              </p>
              <ul className="mt-6 space-y-3.5">
                {installComparison.manual.steps.map((step) => (
                  <li key={step.text} className="flex items-start gap-2.5 text-sm text-zinc-400">
                    {step.done ? (
                      <Check className="mt-0.5 size-4 shrink-0 text-zinc-400" aria-hidden="true" />
                    ) : (
                      <X className="mt-0.5 size-4 shrink-0 text-zinc-300" aria-hidden="true" />
                    )}
                    {step.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-6 sm:p-8">
              <code className="font-mono text-sm text-zinc-950">
                {installComparison.wired.command}
              </code>
              <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-emerald-700">
                {installComparison.wired.label}
              </p>
              <ul className="mt-6 space-y-3.5">
                {installComparison.wired.steps.map((step) => (
                  <li key={step.text} className="flex items-start gap-2.5 text-sm text-zinc-700">
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-600" aria-hidden="true" />
                    {step.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200">
        <div className="container py-20 sm:py-24">
          <SectionEyebrow>02 — What the CLI owns</SectionEyebrow>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-4xl">
            The work you stop doing by hand.
          </h2>
          <div className="mt-12 grid border-l border-t border-zinc-200 sm:grid-cols-2 lg:grid-cols-3">
            {featureCells.map((cell, index) => (
              <div
                key={cell.title}
                className="group border-b border-r border-zinc-200 p-6 transition-colors hover:bg-zinc-50 sm:p-7"
              >
                <span className="inline-block px-1 font-mono text-[0.6875rem] text-zinc-400 transition-colors group-hover:bg-zinc-950 group-hover:text-white">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 text-base font-semibold tracking-tight text-zinc-950">
                  {cell.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{cell.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200">
        <div className="container py-20 sm:py-24">
          <SectionEyebrow>03 — How it works</SectionEyebrow>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-4xl">
            Three steps from catalog to rendered block.
          </h2>
          <div className="mt-12 grid gap-10 lg:grid-cols-3 lg:gap-8">
            <div>
              <p className="font-mono text-[0.6875rem] text-zinc-400">01</p>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">Pick a kit</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Start from the kit contract — every kit documents its fields, Payload target, and
                install path before you commit.
              </p>
              <div className="mt-5 rounded-lg border border-zinc-200">
                <p className="border-b border-zinc-200 px-4 py-2.5 font-mono text-xs text-zinc-950">
                  docs/kits/hero-basic
                </p>
                <ul className="px-4 py-3 text-xs leading-6 text-zinc-500">
                  <li>Content model · fields and limits</li>
                  <li>Payload target · Pages layout</li>
                  <li>Install path · files and fragments</li>
                </ul>
              </div>
            </div>
            <div>
              <p className="font-mono text-[0.6875rem] text-zinc-400">02</p>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">Run one command</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                The CLI validates your project shape, copies files, and applies every Payload
                fragment in one pass.
              </p>
              <div className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-4 pr-2">
                <code className="overflow-x-auto whitespace-nowrap font-mono text-xs text-zinc-700">
                  <span className="text-zinc-400">$ </span>
                  {primaryInstallCommand}
                </code>
                <CommandCopyButton command={primaryInstallCommand} />
              </div>
            </div>
            <div>
              <p className="font-mono text-[0.6875rem] text-zinc-400">03</p>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">Ship typed blocks</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Types and import maps regenerate automatically, so the block is typed from admin
                panel to rendered page.
              </p>
              <pre className="mt-5 overflow-x-auto rounded-lg border border-zinc-200 px-4 py-3 font-mono text-xs leading-6 text-zinc-700">
                {generatedTypeSnippet}
              </pre>
            </div>
          </div>
        </div>
      </section>

      <section id="kits" className="border-b border-zinc-200">
        <div className="container py-20 sm:py-24">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <SectionEyebrow>04 — Current kits</SectionEyebrow>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-4xl">
                A small catalog, proven end to end.
              </h2>
            </div>
            <Link
              href="/components"
              className="inline-flex h-10 w-fit items-center gap-2 rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-950 transition-colors hover:border-zinc-950"
            >
              See all kits
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {kitEntries.map((kit) => (
              <KitPreviewCard key={kit.slug} kit={kit} />
            ))}
          </div>
          <div className="mt-6 flex flex-col justify-between gap-4 rounded-lg border border-dashed border-zinc-300 px-6 py-5 sm:flex-row sm:items-center">
            <p className="text-sm leading-6 text-zinc-600">
              The catalog stays small while the install contract proves itself against real Payload
              project shapes. Have a kit in mind?
            </p>
            <Link
              href={`${githubRepoUrl}/issues`}
              rel="noreferrer"
              target="_blank"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-zinc-950 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-950"
            >
              Suggest a kit
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 text-white">
        <div className="container py-20 text-center sm:py-24">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-5xl">
            Wire your first block in under a minute.
          </h2>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="flex items-center gap-3 rounded-md border border-zinc-700 py-1.5 pl-4 pr-1.5">
              <code className="overflow-x-auto whitespace-nowrap font-mono text-sm text-zinc-200">
                <span className="text-zinc-500">$ </span>
                {primaryInstallCommand}
              </code>
              <CommandCopyButton command={primaryInstallCommand} variant="dark" />
            </div>
            <Link
              href="/docs"
              className="group inline-flex h-11 items-center gap-2 rounded-md bg-white px-5 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
            >
              Read the docs
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
