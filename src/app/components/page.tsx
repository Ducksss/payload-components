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
      <section className="border-b border-zinc-200">
        <div className="container py-14 lg:py-20">
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
            Kit catalog
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-600">
            Installable Payload blocks with docs, registry metadata, and wrapper CLI support. Each
            kit links to its contract before you add it to a project.
          </p>
        </div>
      </section>

      <section>
        <div className="container py-12">
          <div className="overflow-hidden rounded-lg border border-zinc-200">
            {kitEntries.map((kit) => (
              <article
                id={kit.slug}
                key={kit.slug}
                className="grid gap-5 border-b border-zinc-200 bg-white p-5 last:border-b-0 lg:grid-cols-[0.65fr_1fr_auto] lg:items-center"
              >
                <div>
                  <code className="font-mono text-sm text-zinc-950">{kit.slug}</code>
                  <p className="mt-2 text-xs uppercase tracking-[0.14em] text-zinc-500">
                    {kit.status} / {kit.target}
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-zinc-950">{kit.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">{kit.description}</p>
                  <code className="mt-4 block overflow-x-auto whitespace-nowrap rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 font-mono text-xs text-zinc-700">
                    {kit.command}
                  </code>
                </div>
                <Link
                  href={kit.href}
                  className="inline-flex h-9 w-fit items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-sm font-medium text-zinc-950 hover:border-emerald-700 hover:text-emerald-700"
                >
                  Read docs
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
