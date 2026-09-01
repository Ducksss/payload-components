import Link from 'next/link'

import { componentsGalleryRoute, kitGalleryEntries } from '@/content/kitGallery'

import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

import { KitPreviewSurface } from './KitPreviewSurface'

export const KitGalleryPage = () => {
  return (
    <main className="border-t border-border">
      <section className="container py-16 lg:py-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <p className="text-[0.7rem] font-mono font-medium uppercase tracking-[0.28em] text-muted-foreground">
            Components gallery
          </p>
          <h1 className="text-4xl font-medium tracking-[-0.06em] text-balance sm:text-5xl">
            Production Payload blocks, live and ready to install.
          </h1>
          <p className="text-base leading-7 text-muted-foreground sm:text-lg">
            Every kit renders here with real typed data. Preview the blocks, copy the install
            command, and wire it into your Payload v3 repo in seconds.
          </p>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button asChild size="lg" className="rounded-full px-6">
              <Link href="#hero-basic">
                Start with Hero Basic
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-6">
              <Link href="/">
                Back to landing
                <ArrowRight data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-12 grid gap-8">
          {kitGalleryEntries.map((entry) => (
            <section
              key={entry.slug}
              id={entry.slug}
              className="rounded-[2rem] border border-border bg-background px-6 py-8 shadow-none sm:px-8 lg:px-10 lg:py-10"
            >
              <div className="grid gap-8 xl:grid-cols-[0.34fr_0.66fr] xl:items-start">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                      {entry.statusLabel}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground">
                      {entry.slug}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-3xl font-medium tracking-[-0.05em] sm:text-4xl">
                      {entry.title}
                    </h2>
                    <p className="text-base leading-7 text-muted-foreground">{entry.summary}</p>
                  </div>

                  <div className="rounded-[1.5rem] border border-border bg-card p-4">
                    <p className="text-[0.65rem] font-mono uppercase tracking-[0.22em] text-muted-foreground">
                      Install command
                    </p>
                    <div className="mt-3 overflow-hidden rounded-xl bg-zinc-950">
                      <code className="block overflow-x-auto px-4 py-3 font-mono text-sm text-white/90">
                        {entry.installCommand}
                      </code>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="rounded-[1.5rem] border border-border bg-card p-4">
                    <p className="text-sm font-medium">{entry.preview.label}</p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {entry.preview.description}
                    </p>
                  </div>

                  <div className="overflow-hidden rounded-[1.75rem] border border-border bg-card p-4 sm:p-5">
                    <KitPreviewSurface entry={entry} />
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-[1.75rem] border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-[0.7rem] font-mono font-medium uppercase tracking-[0.28em] text-muted-foreground">
                What ships today
              </p>
              <h2 className="text-3xl font-medium tracking-[-0.05em]">
                `payload-kit add` wires schema, types, and import-map in one command.
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                Two production kits ship fully wired. Schema, render components, types, and
                import-map updates all land at once — as if written by hand.
              </p>
            </div>

            <div className="overflow-hidden rounded-[1.5rem] bg-zinc-950 px-4 py-3">
              <code className="font-mono text-sm text-white/90">{componentsGalleryRoute}</code>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
