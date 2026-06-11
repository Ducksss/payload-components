import Link from 'next/link'

import { Github } from 'lucide-react'

import { githubRepoUrl } from '@/lib/site'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="container flex h-14 items-center justify-between">
        <Link href="/" className="text-sm font-semibold text-zinc-950">
          Payload Kits
        </Link>
        <nav className="flex items-center gap-4 text-sm text-zinc-600 sm:gap-5">
          <Link className="hover:text-zinc-950" href="/docs">
            Docs
          </Link>
          <Link className="hover:text-zinc-950" href="/components">
            Kits
          </Link>
          <Link className="hidden hover:text-zinc-950 md:inline" href="/docs/architecture">
            Architecture
          </Link>
          <Link
            className="inline-flex h-8 items-center gap-2 rounded-md border border-zinc-300 px-3 text-xs font-medium text-zinc-950 hover:border-emerald-700 hover:text-emerald-700"
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
