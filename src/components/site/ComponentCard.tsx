import Link from 'next/link'

import { ArrowUpRight } from 'lucide-react'

import { CommandCopyButton } from '@/components/site/CommandCopyButton'
import { ComponentPreviewThumb } from '@/components/site/ComponentPreviewThumb'
import type { componentEntries } from '@/lib/site'
import { cn } from '@/utilities/ui'

type Component = (typeof componentEntries)[number]

export function ComponentCard({ className, component }: { className?: string; component: Component }) {
  return (
    <article
      id={component.slug}
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-frame',
        className,
      )}
    >
      <ComponentPreviewThumb slug={component.slug} />

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <code className="font-mono text-sm font-medium text-brand">{component.slug}</code>
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              v{component.version}
            </span>
            <span className="rounded-full border border-brand/30 bg-brand/10 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-brand">
              {component.status}
            </span>
          </div>
        </div>

        <h3 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">{component.title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{component.description}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {component.fields.map((field) => (
            <span
              key={field}
              className="rounded border border-border bg-secondary/60 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground"
            >
              {field}
            </span>
          ))}
        </div>

        {/* minmax(0,1fr): the nowrap command must scroll inside the card, not
            inflate the card's intrinsic width on narrow viewports. */}
        <div className="mt-6 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-muted/60 px-3 py-2">
          <code className="overflow-x-auto whitespace-nowrap font-mono text-xs text-foreground/90">
            {component.command}
          </code>
          <CommandCopyButton command={component.command} />
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {component.target}
          </span>
          <Link
            href={component.href}
            className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-brand"
          >
            View contract
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}
