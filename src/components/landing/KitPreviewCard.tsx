import Link from 'next/link'

import { ArrowRight } from 'lucide-react'

import { CommandCopyButton } from '@/components/site/CommandCopyButton'
import type { kitEntries } from '@/lib/site'

function HeroWireframe() {
  return (
    <div className="flex flex-col items-center gap-2" aria-hidden="true">
      <span className="h-1.5 w-14 rounded-sm bg-zinc-200" />
      <span className="h-3 w-36 rounded-sm bg-zinc-300" />
      <span className="h-1.5 w-28 rounded-sm bg-zinc-200" />
      <span className="mt-1 flex gap-2">
        <span className="h-4 w-12 rounded-sm bg-zinc-900" />
        <span className="h-4 w-12 rounded-sm bg-zinc-200" />
      </span>
    </div>
  )
}

function FeatureGridWireframe() {
  return (
    <div className="grid w-full grid-cols-3 gap-3 px-2" aria-hidden="true">
      {[0, 1, 2].map((column) => (
        <span key={column} className="flex flex-col gap-1.5">
          <span className="size-4 rounded-sm bg-zinc-300" />
          <span className="h-1.5 w-4/5 rounded-sm bg-zinc-300" />
          <span className="h-1 w-full rounded-sm bg-zinc-200" />
          <span className="h-1 w-2/3 rounded-sm bg-zinc-200" />
        </span>
      ))}
    </div>
  )
}

const previews = {
  'feature-grid-basic': FeatureGridWireframe,
  'hero-basic': HeroWireframe,
} as const

export function KitPreviewCard({ kit }: { kit: (typeof kitEntries)[number] }) {
  const Preview = previews[kit.slug as keyof typeof previews] ?? HeroWireframe

  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-zinc-200 transition-colors hover:border-zinc-400">
      <div className="flex min-h-32 items-center justify-center border-b border-zinc-200 bg-zinc-50 px-6 py-8">
        <Preview />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-lg font-semibold tracking-tight text-zinc-950">{kit.title}</h3>
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-zinc-400">
            {kit.status}
          </span>
        </div>
        <p className="mt-2 text-sm leading-6 text-zinc-600">{kit.description}</p>
        <div className="mt-4 flex items-center justify-between gap-3 rounded-md border border-zinc-200 bg-zinc-50 py-1.5 pl-3 pr-1.5">
          <code className="overflow-x-auto whitespace-nowrap font-mono text-xs text-zinc-700">
            {kit.command}
          </code>
          <CommandCopyButton command={kit.command} />
        </div>
        <Link
          href={kit.href}
          className="mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-zinc-950 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-950"
        >
          Read the contract
          <ArrowRight
            className="size-3.5 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  )
}
