import type { Metadata } from 'next'
import Link from 'next/link'

import { ArrowRight } from 'lucide-react'

import { SiteHeader } from '@/components/site/SiteHeader'
import { kitEntries } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Kit Catalog',
  description: 'The current alpha catalog of installable Payload Kits.',
}

export default function ComponentsPage() {
  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <SiteHeader />
      <section className="border-b border-zinc-200 bg-zinc-50">
        <div className="container py-14 lg:py-16">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-emerald-700">
            public catalog
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            Installable kits documented before they grow.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600">
            The catalog stays intentionally small while the registry contract, install wrapper, and
            docs prove themselves in real Payload v3 projects.
          </p>
        </div>
      </section>

      <section>
        <div className="container grid gap-4 py-12 lg:grid-cols-2">
          {kitEntries.map((kit) => (
            <article
              id={kit.slug}
              key={kit.slug}
              className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <code className="font-mono text-sm text-zinc-950">{kit.slug}</code>
                <span className="rounded-md border border-emerald-700/25 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                  {kit.status}
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold text-zinc-950">{kit.title}</h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{kit.description}</p>
              <code className="mt-5 block overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-3 font-mono text-xs text-zinc-700">
                {kit.command}
              </code>
              <Link
                href={kit.href}
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-900"
              >
                Read docs
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
