import Link from 'next/link'

import { ArrowRight, ArrowUpRight, Terminal } from 'lucide-react'

import { CommandCopyButton } from '@/components/site/CommandCopyButton'
import { SiteHeader } from '@/components/site/SiteHeader'
import {
  communityLinks,
  docsHighlights,
  kitEntries,
  primaryInstallCommand,
  proofItems,
} from '@/lib/site'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <SiteHeader />

      <section className="border-b border-zinc-200 bg-[linear-gradient(180deg,#f4f4f5_0%,#fff_52%)]">
        <div className="container py-14 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
            <div>
              <h1 className="max-w-4xl text-4xl font-semibold leading-[1.02] text-zinc-950 sm:text-6xl sm:leading-[0.98] lg:text-7xl">
                Fumadocs-first docs for installable Payload kits.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
                The app is now a docs-native Fumadocs site. Payload stays where it belongs: inside
                the target projects that install kits through the registry and CLI.
              </p>

              <div className="mt-8 max-w-2xl rounded-xl border border-zinc-200 bg-white p-3 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-mono text-xs uppercase tracking-[0.14em] text-zinc-500">
                      install command
                    </p>
                    <code className="mt-2 block overflow-x-auto whitespace-nowrap font-mono text-sm text-zinc-950 sm:text-base">
                      {primaryInstallCommand}
                    </code>
                  </div>
                  <CommandCopyButton command={primaryInstallCommand} />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
                <Link
                  href="/docs"
                  className="inline-flex items-center gap-2 font-medium text-emerald-700 hover:text-emerald-900"
                >
                  Read the docs
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/components"
                  className="inline-flex items-center gap-2 text-zinc-600 hover:text-zinc-950"
                >
                  Browse kits
                  <ArrowUpRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3 shadow-[0_28px_90px_-56px_rgba(15,23,42,0.45)]">
              <div className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-7">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-emerald-700">
                  <Terminal className="size-4" aria-hidden="true" />
                  Fumadocs start
                </div>
                <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-tight text-zinc-950 sm:text-4xl">
                  Docs, registry, and CLI are the product surface now.
                </h2>
                <p className="mt-4 max-w-lg text-sm leading-6 text-zinc-600 sm:text-base">
                  No Payload admin, no CMS globals, no database requirement for the site. The
                  documentation compiles from MDX and the public registry ships from static files.
                </p>

                <div className="mt-8 grid gap-2 sm:grid-cols-3">
                  {proofItems.map((item) => (
                    <div
                      key={item.title}
                      className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 text-xs text-zinc-600"
                    >
                      <item.icon className="size-4 text-emerald-700" aria-hidden="true" />
                      <p className="mt-3 font-medium text-zinc-950">{item.title}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 overflow-hidden rounded-lg border border-zinc-200">
                  <div className="grid grid-cols-3 border-b border-zinc-200 bg-zinc-50 text-xs text-zinc-500">
                    <div className="border-r border-zinc-200 px-3 py-2">surface</div>
                    <div className="border-r border-zinc-200 px-3 py-2">source</div>
                    <div className="px-3 py-2">runtime</div>
                  </div>
                  <div className="grid bg-white sm:grid-cols-3">
                    {[
                      ['Docs', 'Fumadocs MDX'],
                      ['Registry', 'Static JSON'],
                      ['Target', 'Payload project'],
                    ].map(([label, value], index) => (
                      <div
                        key={label}
                        className={[
                          'px-3 py-3 text-xs',
                          index > 0 ? 'border-t border-zinc-200 sm:border-l sm:border-t-0' : '',
                        ].join(' ')}
                      >
                        <p className="font-mono text-zinc-950">{label}</p>
                        <p className="mt-1 text-zinc-500">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-200">
        <div className="container py-14 lg:py-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">What changed in v2</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600 sm:text-base sm:leading-7">
              The repo is no longer a Payload CMS website. It is a Fumadocs documentation app that
              happens to document and distribute Payload kit installs.
            </p>
          </div>

          <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-zinc-200 bg-zinc-200 lg:grid-cols-3">
            {docsHighlights.map((item) => (
              <article key={item.title} className="bg-white p-5 sm:p-6">
                <item.icon className="size-5 text-emerald-700" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-semibold text-zinc-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="kits" className="border-b border-zinc-200 bg-zinc-50">
        <div className="container py-14 lg:py-16">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold leading-tight sm:text-4xl">The catalog</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600 sm:text-base sm:leading-7">
                Two alpha kits are documented and installable. More kits should land through docs
                and manifests first.
              </p>
            </div>
            <Link
              href="/components"
              className="inline-flex h-10 w-fit items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 text-sm font-medium text-zinc-950 hover:border-emerald-700 hover:text-emerald-700"
            >
              See all kits
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            {kitEntries.map((kit) => (
              <article
                key={kit.slug}
                className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <code className="font-mono text-sm text-zinc-950">{kit.slug}</code>
                  <span className="rounded-md border border-emerald-700/25 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                    {kit.status}
                  </span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold text-zinc-950">{kit.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{kit.description}</p>
                <code className="mt-5 block overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-3 font-mono text-xs text-zinc-700">
                  {kit.command}
                </code>
                <Link
                  href={kit.href}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-900"
                >
                  Read kit docs
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="community" className="border-b border-zinc-200">
        <div className="container py-14 lg:py-16">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-7">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <div className="flex max-w-full -space-x-2 overflow-hidden">
                  {'ABCDEFGHIJKLMNOP'.split('').map((letter) => (
                    <span
                      key={letter}
                      className="grid size-7 shrink-0 place-items-center rounded-full border border-white bg-zinc-200 text-[0.65rem] font-medium text-zinc-600 sm:size-8"
                    >
                      {letter}
                    </span>
                  ))}
                </div>
                <h2 className="mt-6 text-3xl font-semibold leading-tight sm:text-4xl">
                  Built in public, documented first.
                </h2>
                <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600">
                  A Fumadocs foundation makes the project easier to inspect, fork, contribute to,
                  and index before any paid/private registry ideas.
                </p>
              </div>

              <div className="grid gap-3">
                {communityLinks.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group grid gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 transition-colors hover:border-emerald-700"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="inline-flex items-center gap-3 font-medium text-zinc-950">
                        <item.icon className="size-4 text-emerald-700" aria-hidden="true" />
                        {item.label}
                      </span>
                      <ArrowUpRight
                        className="size-4 text-zinc-500 transition-colors group-hover:text-emerald-700"
                        aria-hidden="true"
                      />
                    </div>
                    <p className="text-sm leading-6 text-zinc-600">{item.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
