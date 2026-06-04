import Link from 'next/link'

import { Github } from 'lucide-react'

import { githubRepoUrl } from '@/lib/site'

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="font-semibold text-zinc-950">
          Payload Kits
        </Link>
        <nav className="flex items-center gap-5 text-sm text-zinc-600">
          <Link className="hidden hover:text-zinc-950 sm:inline" href="/docs">
            Docs
          </Link>
          <Link className="hidden hover:text-zinc-950 sm:inline" href="/components">
            Kits
          </Link>
          <Link className="hidden hover:text-zinc-950 md:inline" href="/docs/architecture">
            Architecture
          </Link>
          <Link
            className="inline-flex items-center gap-2 rounded-md border border-zinc-300 px-3 py-2 font-medium text-zinc-950 hover:border-emerald-700 hover:text-emerald-700"
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
