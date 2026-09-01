import Link from 'next/link'

import { componentsGalleryRoute, kitGalleryEntries } from '@/content/kitGallery'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight } from 'lucide-react'

export const KitGalleryTeaser = () => {
  return (
    <div className="grid gap-8">
      <div className="grid gap-5 lg:grid-cols-2">
        {kitGalleryEntries.map((entry) => (
          <Card
            key={entry.slug}
            className="min-w-0 rounded-2xl border-border bg-background shadow-none transition-shadow duration-200 hover:shadow-[0_16px_50px_-28px_rgba(15,23,42,0.35)]"
          >
            <CardHeader className="gap-4">
              <div className="flex flex-wrap items-center gap-2 font-mono text-[0.68rem] font-semibold tracking-[0.12em] uppercase">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-700 dark:text-emerald-400">
                  {entry.statusLabel}
                </span>
                <span className="rounded-full border border-border px-3 py-1 text-muted-foreground normal-case">
                  {entry.slug}
                </span>
              </div>

              <div className="space-y-2">
                <CardTitle className="font-display text-2xl font-semibold tracking-[-0.02em]">
                  {entry.title}
                </CardTitle>
                <CardDescription className="text-base leading-7">{entry.summary}</CardDescription>
              </div>
            </CardHeader>

            <CardContent className="flex h-full flex-col gap-5">
              <code className="block overflow-x-auto rounded-xl bg-zinc-950 px-4 py-3 font-mono text-[0.82rem] whitespace-nowrap text-zinc-100">
                <span aria-hidden="true" className="select-none text-zinc-500">
                  ${' '}
                </span>
                {entry.installCommand}
              </code>

              <Button
                asChild
                variant="ghost"
                className="mt-auto justify-start px-0 text-brand hover:bg-transparent hover:text-brand/80"
              >
                <Link href={`${componentsGalleryRoute}#${entry.slug}`}>
                  Open {entry.title} live preview
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button asChild size="lg" variant="brand" className="rounded-full px-7">
          <Link href={componentsGalleryRoute}>
            Browse the live components gallery
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
