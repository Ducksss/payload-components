import Link from 'next/link'

import { ArrowRight, ArrowUpRight } from 'lucide-react'

import { CommandCopyButton } from '@/components/site/CommandCopyButton'
import { KitFamilyHeader } from '@/components/site/KitGrid'
import {
  githubIssuesUrl,
  kitEntries,
  kitFamilies,
  upcomingKits,
  type KitEntry,
  type UpcomingKit,
} from '@/lib/site'

/* The landing catalog: two generous rows for the installable kits and a
 * dense hairline table for the in-development posts suite — an index,
 * not another card wall. The kits themselves are rendered live in the
 * hero install replay and the specimen above this index. */

function InstallableKitRow({ kit }: { kit: KitEntry }) {
  return (
    <article
      id={kit.slug}
      className="grid grid-cols-1 gap-x-10 gap-y-4 px-5 py-6 sm:px-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center"
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <code className="font-mono text-[13px] font-medium text-brand">{kit.slug}</code>
          <span className="rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-brand">
            {kit.status}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {kit.target} · v{kit.version}
          </span>
        </div>
        <h3 className="text-lg font-semibold tracking-tight text-foreground">{kit.title}</h3>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">{kit.description}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {kit.fields.map((field) => (
            <span
              key={field}
              className="rounded-full border border-border bg-muted/50 px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
            >
              {field}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:items-end">
        <div className="grid w-full max-w-md grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-border bg-muted/60 py-1 pl-3 pr-1">
          <code className="overflow-x-auto whitespace-nowrap font-mono text-xs text-foreground/90">
            {kit.command}
          </code>
          <CommandCopyButton command={kit.command} />
        </div>
        <Link
          href={kit.href}
          className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-brand"
        >
          Read the kit contract
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}

function UpcomingKitRow({ kit }: { kit: UpcomingKit }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-1 px-5 py-3.5 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)_auto] sm:items-baseline sm:px-6">
      <code className="font-mono text-[13px] text-muted-foreground">{kit.slug}</code>
      <p className="text-sm leading-6 text-muted-foreground">
        <span className="font-medium text-foreground/75">{kit.title}.</span> {kit.description}
      </p>
      <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground sm:block">
        {kit.target} · in development
      </span>
    </div>
  )
}

export function CatalogIndex() {
  return (
    <div className="flex flex-col gap-12">
      {/* Page blocks — installable today, full payload-kit wiring. */}
      <div>
        <KitFamilyHeader
          countLabel={kitFamilies.pages.countLabel}
          description={kitFamilies.pages.description}
          name={kitFamilies.pages.name}
        />
        <div className="mt-6 divide-y divide-border overflow-hidden rounded-[1.25rem] border border-border bg-background shadow-card">
          {kitEntries.map((kit) => (
            <InstallableKitRow key={kit.slug} kit={kit} />
          ))}
        </div>
      </div>

      {/* Post components — the in-development suite as a dense index. */}
      <div>
        <KitFamilyHeader
          countLabel={kitFamilies.posts.countLabel}
          description={kitFamilies.posts.description}
          name={kitFamilies.posts.name}
        />
        <div className="mt-6 divide-y divide-border overflow-hidden rounded-[1.25rem] border border-dashed border-border bg-background/60">
          {upcomingKits.map((kit) => (
            <UpcomingKitRow key={kit.slug} kit={kit} />
          ))}
          <a
            href={githubIssuesUrl}
            target="_blank"
            rel="noreferrer"
            className="group grid grid-cols-1 gap-x-6 gap-y-1 px-5 py-3.5 transition-colors hover:bg-muted/40 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)_auto] sm:items-baseline sm:px-6"
          >
            <code className="font-mono text-[13px] text-muted-foreground">your-kit-here</code>
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
      </div>
    </div>
  )
}
