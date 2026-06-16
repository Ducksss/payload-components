import Link from 'next/link'

import { ArrowRight, ArrowUpRight } from 'lucide-react'

import { CommandCopyButton } from '@/components/site/CommandCopyButton'
import { ComponentFamilyHeader } from '@/components/site/ComponentGrid'
import {
  githubIssuesUrl,
  componentEntries,
  componentFamilies,
  upcomingComponents,
  type ComponentEntry,
  type UpcomingComponent,
} from '@/lib/site'

/* The landing catalog: two generous rows for the installable components and a
 * dense hairline table for the in-development posts suite — an index,
 * not another card wall. The components themselves are rendered live in the
 * hero install replay and the specimen above this index. */

function InstallableComponentRow({ component }: { component: ComponentEntry }) {
  return (
    <article
      id={component.slug}
      className="grid grid-cols-1 gap-x-10 gap-y-4 px-5 py-6 sm:px-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center"
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <code className="font-mono text-[13px] font-medium text-brand">{component.slug}</code>
          <span className="rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-brand">
            {component.status}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            {component.target} · v{component.version}
          </span>
        </div>
        <h3 className="text-lg font-semibold tracking-tight text-foreground">{component.title}</h3>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">{component.description}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {component.fields.map((field) => (
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
            {component.command}
          </code>
          <CommandCopyButton command={component.command} />
        </div>
        <Link
          href={component.href}
          className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-brand"
        >
          Read the component contract
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}

function UpcomingComponentRow({ component }: { component: UpcomingComponent }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-1 px-5 py-3.5 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)_auto] sm:items-baseline sm:px-6">
      <code className="font-mono text-[13px] text-muted-foreground">{component.slug}</code>
      <p className="text-sm leading-6 text-muted-foreground">
        <span className="font-medium text-foreground/75">{component.title}.</span> {component.description}
      </p>
      <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground sm:block">
        {component.target} · in development
      </span>
    </div>
  )
}

export function CatalogIndex() {
  return (
    <div className="flex flex-col gap-12">
      {/* Page blocks — installable today, full payload-components wiring. */}
      <div>
        <ComponentFamilyHeader
          countLabel={componentFamilies.pages.countLabel}
          description={componentFamilies.pages.description}
          name={componentFamilies.pages.name}
        />
        <div className="mt-6 divide-y divide-border overflow-hidden rounded-[1.25rem] border border-border bg-background shadow-card">
          {componentEntries.map((component) => (
            <InstallableComponentRow key={component.slug} component={component} />
          ))}
        </div>
      </div>

      {/* Post components — the in-development suite as a dense index. */}
      <div>
        <ComponentFamilyHeader
          countLabel={componentFamilies.posts.countLabel}
          description={componentFamilies.posts.description}
          name={componentFamilies.posts.name}
        />
        <div className="mt-6 divide-y divide-border overflow-hidden rounded-[1.25rem] border border-dashed border-border bg-background/60">
          {upcomingComponents.map((component) => (
            <UpcomingComponentRow key={component.slug} component={component} />
          ))}
          <a
            href={githubIssuesUrl}
            target="_blank"
            rel="noreferrer"
            className="group grid grid-cols-1 gap-x-6 gap-y-1 px-5 py-3.5 transition-colors hover:bg-muted/40 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)_auto] sm:items-baseline sm:px-6"
          >
            <code className="font-mono text-[13px] text-muted-foreground">your-component-here</code>
            <p className="text-sm leading-6 text-muted-foreground">
              The catalog grows deliberately — source, manifest, docs, and installer coverage ship
              together. Propose the next component.
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
