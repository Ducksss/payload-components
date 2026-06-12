import Link from 'next/link'

import { ArrowRight, ArrowUpRight } from 'lucide-react'

import { CommandCopyButton } from '@/components/site/CommandCopyButton'
import {
  githubIssuesUrl,
  kitEntries,
  upcomingKits,
  type KitEntry,
  type UpcomingKit,
} from '@/lib/site'
import { cn } from '@/utilities/ui'

/* ------------------------------------------------------------------ */
/* Skeleton thumbnails — one abstract composition per kit shape.      */
/* Pure shapes, aria-hidden; emerald appears at most once per thumb.  */
/* ------------------------------------------------------------------ */

function ThumbShapes({ slug }: { slug: string }) {
  switch (slug) {
    case 'hero-basic':
      return (
        <div className="flex w-full flex-col items-center gap-2">
          <span className="h-2 w-12 rounded-full bg-foreground/10" />
          <span className="h-3 w-3/4 rounded-full bg-foreground/70" />
          <span className="h-2 w-1/2 rounded-full bg-foreground/15" />
          <span className="flex gap-2 pt-1">
            <span className="h-5 w-12 rounded-full bg-foreground/85" />
            <span className="h-5 w-12 rounded-full border border-foreground/20 bg-background" />
          </span>
        </div>
      )
    case 'feature-grid-basic':
      return (
        <div className="flex w-full flex-col gap-2">
          <span className="mx-auto h-2.5 w-1/2 rounded-full bg-foreground/60" />
          <span className="grid grid-cols-3 gap-1.5 pt-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="flex flex-col gap-1 rounded-md border border-foreground/10 bg-background p-1.5"
              >
                <span className="h-1.5 w-2/3 rounded-full bg-foreground/50" />
                <span className="h-1 w-full rounded-full bg-foreground/12" />
                <span className="h-1 w-5/6 rounded-full bg-foreground/12" />
              </span>
            ))}
          </span>
        </div>
      )
    case 'post-card':
      return (
        <div className="mx-auto flex w-3/4 flex-col gap-1.5 rounded-md border border-foreground/10 bg-background p-2">
          <span className="h-10 w-full rounded bg-foreground/12" />
          <span className="flex items-center gap-1.5 pt-0.5">
            <span className="h-1.5 w-7 rounded-full bg-brand/50" />
            <span className="h-1.5 w-9 rounded-full bg-foreground/12" />
          </span>
          <span className="h-2 w-5/6 rounded-full bg-foreground/60" />
        </div>
      )
    case 'post-archive':
      return (
        <div className="grid w-full grid-cols-3 gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="flex flex-col gap-1 rounded-md border border-foreground/10 bg-background p-1.5"
            >
              <span className="h-8 w-full rounded bg-foreground/12" />
              <span className="h-1.5 w-5/6 rounded-full bg-foreground/50" />
              <span className="h-1 w-2/3 rounded-full bg-foreground/12" />
            </span>
          ))}
        </div>
      )
    case 'post-hero':
      return (
        <div className="flex w-full flex-col gap-2">
          <span className="h-12 w-full rounded-md bg-foreground/12" />
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-8 rounded-full bg-foreground/20" />
            <span className="h-1.5 w-10 rounded-full bg-foreground/12" />
          </span>
          <span className="h-2.5 w-2/3 rounded-full bg-foreground/65" />
        </div>
      )
    case 'featured-post':
      return (
        <div className="grid w-full grid-cols-[1.2fr_1fr] items-center gap-2.5">
          <span className="h-16 rounded-md bg-foreground/12" />
          <span className="flex flex-col gap-1.5">
            <span className="h-1.5 w-8 rounded-full bg-brand/50" />
            <span className="h-2 w-full rounded-full bg-foreground/60" />
            <span className="h-2 w-4/5 rounded-full bg-foreground/60" />
            <span className="h-1.5 w-full rounded-full bg-foreground/12" />
          </span>
        </div>
      )
    case 'post-list':
      return (
        <div className="flex w-full flex-col divide-y divide-foreground/8">
          {['w-3/4', 'w-5/6', 'w-2/3'].map((width) => (
            <span key={width} className="flex items-center gap-2 py-2">
              <span className="h-1.5 w-8 shrink-0 rounded-full bg-foreground/15" />
              <span className={cn('h-2 rounded-full bg-foreground/45', width)} />
            </span>
          ))}
        </div>
      )
    case 'author-card':
      return (
        <div className="mx-auto flex w-3/4 flex-col gap-2 rounded-md border border-foreground/10 bg-background p-2.5">
          <span className="flex items-center gap-2">
            <span className="size-7 shrink-0 rounded-full bg-foreground/15" />
            <span className="flex flex-col gap-1">
              <span className="h-2 w-16 rounded-full bg-foreground/60" />
              <span className="h-1.5 w-12 rounded-full bg-foreground/15" />
            </span>
          </span>
          <span className="h-1.5 w-full rounded-full bg-foreground/12" />
          <span className="h-1.5 w-5/6 rounded-full bg-foreground/12" />
        </div>
      )
    case 'newsletter-callout':
      return (
        <div className="flex w-full flex-col items-center gap-2">
          <span className="h-2.5 w-1/2 rounded-full bg-foreground/60" />
          <span className="h-1.5 w-2/3 rounded-full bg-foreground/15" />
          <span className="flex w-full items-center gap-1.5 pt-1">
            <span className="h-6 flex-1 rounded-full border border-foreground/15 bg-background" />
            <span className="h-6 w-14 rounded-full bg-foreground/85" />
          </span>
        </div>
      )
    case 'related-posts':
      return (
        <div className="flex w-full flex-col gap-2">
          <span className="h-2 w-1/3 rounded-full bg-foreground/60" />
          <span className="grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="flex flex-col gap-1 rounded-md border border-foreground/10 bg-background p-1.5"
              >
                <span className="h-6 w-full rounded bg-foreground/10" />
                <span className="h-1.5 w-3/4 rounded-full bg-foreground/45" />
              </span>
            ))}
          </span>
        </div>
      )
    default:
      return null
  }
}

function KitThumb({ muted = false, slug }: { muted?: boolean; slug: string }) {
  return (
    <div
      aria-hidden="true"
      className="flex h-36 items-center justify-center border-b border-border bg-muted/40 px-6"
    >
      <div className={cn('w-full max-w-[16rem]', muted && 'opacity-55')}>
        <ThumbShapes slug={slug} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Cards                                                               */
/* ------------------------------------------------------------------ */

export function InstallableKitCard({ kit }: { kit: KitEntry }) {
  return (
    <article
      id={kit.slug}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-frame"
    >
      <KitThumb slug={kit.slug} />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <code className="font-mono text-[13px] font-medium text-brand">{kit.slug}</code>
          <span className="rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-brand">
            {kit.status}
          </span>
        </div>
        <div>
          <h3 className="text-base font-semibold tracking-tight text-foreground">{kit.title}</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{kit.description}</p>
        </div>
        <div className="mt-auto grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-border bg-muted/60 py-1 pl-2.5 pr-1">
          <code className="overflow-x-auto whitespace-nowrap font-mono text-[11px] text-foreground/90">
            {kit.command}
          </code>
          <CommandCopyButton command={kit.command} />
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {kit.target} · v{kit.version}
          </span>
          <Link
            href={kit.href}
            className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-brand"
          >
            Docs
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export function UpcomingKitCard({ kit }: { kit: UpcomingKit }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-dashed border-border bg-card/60">
      <KitThumb muted slug={kit.slug} />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <code className="font-mono text-[13px] text-muted-foreground">{kit.slug}</code>
          <span className="rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Coming soon
          </span>
        </div>
        <div>
          <h3 className="text-base font-semibold tracking-tight text-foreground/80">
            {kit.title}
          </h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{kit.description}</p>
        </div>
        <div className="mt-auto border-t border-border pt-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {kit.target} · in development
          </span>
        </div>
      </div>
    </article>
  )
}

/* ------------------------------------------------------------------ */
/* Grid                                                                */
/* ------------------------------------------------------------------ */

export function KitGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {kitEntries.map((kit) => (
        <InstallableKitCard key={kit.slug} kit={kit} />
      ))}

      {upcomingKits.map((kit) => (
        <UpcomingKitCard key={kit.slug} kit={kit} />
      ))}

      <a
        href={githubIssuesUrl}
        target="_blank"
        rel="noreferrer"
        className="group flex min-h-48 flex-col items-start justify-center gap-3 rounded-2xl border border-dashed border-border p-6 transition-colors hover:border-foreground/25"
      >
        <span className="font-mono text-sm text-muted-foreground">your-kit-here</span>
        <p className="text-sm leading-6 text-muted-foreground">
          The catalog grows deliberately — source, manifest, docs, and installer coverage ship
          together. Propose the next kit.
        </p>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors group-hover:text-brand">
          Open an issue
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </span>
      </a>
    </div>
  )
}
