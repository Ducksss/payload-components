import Link from 'next/link'

import { Github } from 'lucide-react'

import { githubRepoUrl } from '@/lib/site'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-zinc-950">
          <span className="size-2 bg-zinc-950" aria-hidden="true" />
          Payload Kits
        </Link>
        <nav className="flex items-center gap-5 text-[0.8125rem] text-zinc-600 sm:gap-6">
          <Link className="transition-colors hover:text-zinc-950" href="/docs">
            Docs
          </Link>
          <Link className="transition-colors hover:text-zinc-950" href="/components">
            Kits
          </Link>
          <Link
            className="hidden transition-colors hover:text-zinc-950 md:inline"
            href="/docs/architecture"
          >
            Architecture
          </Link>
          <Link
            className="inline-flex h-8 items-center gap-2 rounded-md border border-zinc-300 px-3 text-xs font-medium text-zinc-950 transition-colors hover:border-zinc-950 hover:bg-zinc-950 hover:text-white"
            href={githubRepoUrl}
            rel="noreferrer"
            target="_blank"
          >
            <Github className="size-4" aria-hidden="true" />
            GitHub
          </Link>
        </nav>
      </div>
    </header>
  )
}
