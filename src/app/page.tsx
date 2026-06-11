import Link from 'next/link'

import { ArrowRight, ArrowUpRight, Check, Terminal } from 'lucide-react'

import { CommandCopyButton } from '@/components/site/CommandCopyButton'
import { SiteHeader } from '@/components/site/SiteHeader'
import {
  communityLinks,
  kitEntries,
  primaryInstallCommand,
  surfaceLinks,
  targetPrinciples,
  workflowSteps,
} from '@/lib/site'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <SiteHeader />

      <section className="border-b border-zinc-200">
        <div className="container pt-14 pb-12 sm:pt-16 sm:pb-14 lg:pt-20 lg:pb-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,30rem)] lg:items-end">
            <div className="max-w-5xl">
              <h1 className="text-4xl font-semibold leading-[1.02] text-zinc-950 sm:text-6xl sm:leading-[0.98]">
                Install Payload blocks without rebuilding the wiring.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
                Payload Kits is a docs-first registry and CLI for adding typed Payload CMS blocks to
                supported Next.js projects.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/docs"
                  className="inline-flex h-10 w-fit items-center justify-center rounded-md bg-zinc-950 px-4 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                >
                  Start with docs
                  <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/components"
                  className="inline-flex h-10 w-fit items-center justify-center rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-950 transition-colors hover:border-emerald-700 hover:text-emerald-700"
                >
                  Browse kits
                  <ArrowUpRight className="ml-2 size-4" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-4 border-b border-zinc-200 bg-zinc-50 px-4 py-3">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-zinc-500">
                  <Terminal className="size-4 text-emerald-700" aria-hidden="true" />
                  install command
                </div>
                <CommandCopyButton command={primaryInstallCommand} />
              </div>
              <code className="block overflow-x-auto whitespace-nowrap px-4 py-4 font-mono text-sm text-zinc-950">
                {primaryInstallCommand}
              </code>
            </div>
          </div>

          <div className="mt-10 grid overflow-hidden rounded-lg border border-zinc-200 bg-white md:grid-cols-3">
            {surfaceLinks.map((item, index) => (
              <Link
                key={item.title}
                href={item.href}
                className={[
                  'group p-4 transition-colors hover:bg-zinc-50 sm:p-5',
                  index > 0 ? 'border-t border-zinc-200 md:border-l md:border-t-0' : '',
                ].join(' ')}
              >
                <item.icon className="size-5 text-emerald-700" aria-hidden="true" />
                <h2 className="mt-4 text-lg font-semibold text-zinc-950">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{item.description}</p>
                <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-zinc-950 group-hover:text-emerald-700">
                  Open
                  <ArrowRight className="size-4" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200">
        <div className="container grid gap-10 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:py-16">
          <div>
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">How it works</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-600 sm:text-base sm:leading-7">
              The public registry delivers files. The wrapper CLI handles the Payload-specific
              wiring that a direct shadcn install cannot know about.
            </p>
          </div>
          <div className="divide-y divide-zinc-200 border-y border-zinc-200">
            {workflowSteps.map((item, index) => (
              <article key={item.title} className="grid gap-4 py-6 sm:grid-cols-[5rem_1fr]">
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs text-zinc-500">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <item.icon className="size-5 text-emerald-700" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zinc-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="kits" className="border-b border-zinc-200 bg-zinc-50">
        <div className="container py-14 lg:py-16">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">Current kits</h2>
              <p className="mt-4 text-sm leading-6 text-zinc-600 sm:text-base sm:leading-7">
                The catalog is intentionally small while the install contract proves itself against
                real Payload project shapes.
              </p>
            </div>
            <Link
              href="/components"
              className="inline-flex h-10 w-fit items-center gap-2 rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-950 hover:border-emerald-700 hover:text-emerald-700"
            >
              See all kits
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 overflow-hidden rounded-lg border border-zinc-200 bg-white">
            {kitEntries.map((kit) => (
              <article
                key={kit.slug}
                className="grid gap-5 border-b border-zinc-200 p-5 last:border-b-0 lg:grid-cols-[0.7fr_1fr_auto] lg:items-center"
              >
                <div>
                  <p className="font-mono text-sm text-zinc-950">{kit.slug}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.14em] text-zinc-500">
                    {kit.status} / {kit.target}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-zinc-950">{kit.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">{kit.description}</p>
                  <code className="mt-4 block overflow-x-auto whitespace-nowrap rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xs text-zinc-700">
                    {kit.command}
                  </code>
                </div>
                <Link
                  href={kit.href}
                  className="inline-flex h-9 w-fit items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-950 hover:border-emerald-700 hover:text-emerald-700"
                >
                  Docs
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200">
        <div className="container grid gap-10 py-14 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
          <div>
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">
              Built for Payload projects
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-600 sm:text-base sm:leading-7">
              The site stays focused on documentation and registry delivery. Payload runtime
              assumptions are tested in generated target projects where they belong.
            </p>
          </div>

          <div className="divide-y divide-zinc-200 border-y border-zinc-200">
            {targetPrinciples.map((principle) => (
              <div key={principle} className="flex gap-3 py-4">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-700" aria-hidden="true" />
                <p className="text-sm leading-6 text-zinc-700">{principle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="community">
        <div className="container py-14 lg:py-16">
          <div className="flex flex-col justify-between gap-6 border-y border-zinc-200 py-8 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-2xl font-semibold leading-tight text-zinc-950">Open source</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">
                Source, issues, and install feedback stay public while the registry contract
                matures.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {communityLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-950 hover:border-emerald-700 hover:text-emerald-700"
                >
                  <item.icon className="size-4" aria-hidden="true" />
                  {item.label}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
