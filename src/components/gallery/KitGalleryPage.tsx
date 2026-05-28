import Link from 'next/link'

import { componentsGalleryRoute, kitGalleryEntries } from '@/content/kitGallery'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

import { KitPreviewSurface } from './KitPreviewSurface'

export const KitGalleryPage = () => {
  return (
    <main className="border-t border-border/60">
      <section className="container py-16 lg:py-24">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <Badge
            variant="outline"
            className="rounded-full px-3.5 py-1 text-[0.72rem] uppercase tracking-[0.18em]"
          >
            Live components gallery
          </Badge>
          <h1 className="text-4xl font-medium tracking-[-0.06em] text-balance sm:text-5xl">
            Browse the real kits that ship in the current registry.
          </h1>
          <p className="text-base leading-7 text-muted-foreground sm:text-lg">
            This route renders the actual shipped blocks and shadcn-native components with typed
            preset data. Use it to inspect what each install path delivers before touching a repo.
          </p>
          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button asChild size="lg" className="rounded-full px-6">
              <Link href="#post-card">
                Start with Post Card
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
              className="rounded-[2rem] border border-border/70 bg-background/82 px-6 py-8 shadow-none sm:px-8 lg:px-10 lg:py-10"
            >
              <div className="grid gap-8 xl:grid-cols-[0.34fr_0.66fr] xl:items-start">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge variant="secondary" className="rounded-full px-3 py-1">
                      {entry.statusLabel}
                    </Badge>
                    <Badge variant="outline" className="rounded-full px-3 py-1">
                      {entry.slug}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-3xl font-medium tracking-[-0.05em] sm:text-4xl">
                      {entry.title}
                    </h2>
                    <p className="text-base leading-7 text-muted-foreground">{entry.summary}</p>
                  </div>

                  <div className="rounded-[1.5rem] border border-border/70 bg-card/40 p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Install command
                    </p>
                    <code className="mt-3 block overflow-x-auto rounded-xl border border-border/70 bg-background px-3 py-3 text-sm">
                      {entry.installCommand}
                    </code>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="rounded-[1.5rem] border border-border/70 bg-card/30 p-4">
                    <p className="text-sm font-medium">{entry.preview.label}</p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {entry.preview.description}
                    </p>
                  </div>

                  <div className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-card/20 p-4 sm:p-5">
                    <KitPreviewSurface entry={entry} />
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-[1.75rem] border border-border/70 bg-card/35 p-6 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <Badge variant="outline" className="rounded-full px-3 py-1 uppercase tracking-[0.18em]">
                Current alpha boundary
              </Badge>
              <h2 className="text-3xl font-medium tracking-[-0.05em]">
                Direct shadcn for UI. `payload-kit` for Payload-aware wiring.
              </h2>
              <p className="text-base leading-7 text-muted-foreground">
                Pages blocks use `payload-kit add`; Posts presentation components use
                `npx shadcn add @payload-kits/...`; `payload-kit doctor` verifies the manifests,
                rendered files, and generated registry stay aligned.
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-border/70 bg-background px-4 py-3">
              <code className="text-sm">{componentsGalleryRoute}</code>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
