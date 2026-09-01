import type { Metadata } from 'next'
import Link from 'next/link'

import { ArrowUpRight } from 'lucide-react'

import { KitPreviewCard } from '@/components/landing/KitPreviewCard'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { githubRepoUrl, kitEntries } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Kit Catalog',
  description: 'The current alpha catalog of installable Payload Kits.',
}

export default function ComponentsPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white text-zinc-950">
      <SiteHeader />
      <div className="flex-1">
        <section className="border-b border-zinc-200">
          <div className="container pt-16 pb-14 sm:pt-20 sm:pb-16">
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-zinc-400">
              Kit catalog
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.02] tracking-[-0.03em] sm:text-6xl">
              Installable blocks with documented contracts.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-600">
              Each kit ships docs, registry metadata, and wrapper CLI support. Read the contract
              before you add it to a project — fields, Payload target, and install path are all
              public.
            </p>
          </div>
        </section>

        <section>
          <div className="container py-14 sm:py-16">
            <div className="grid gap-6 sm:grid-cols-2">
              {kitEntries.map((kit) => (
                <KitPreviewCard key={kit.slug} kit={kit} />
              ))}
            </div>
            <div className="mt-6 flex flex-col justify-between gap-4 rounded-lg border border-dashed border-zinc-300 px-6 py-5 sm:flex-row sm:items-center">
              <p className="text-sm leading-6 text-zinc-600">
                The catalog stays small while the install contract proves itself. Have a kit in
                mind?
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
      </div>
      <SiteFooter />
    </main>
  )
}
