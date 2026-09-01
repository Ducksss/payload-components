import Link from 'next/link'

import { footerLinkGroups } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200">
      <div className="container flex flex-col justify-between gap-10 py-14 sm:flex-row">
        <div className="max-w-xs">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight text-zinc-950">
            <span className="size-2 bg-zinc-950" aria-hidden="true" />
            Payload Kits
          </Link>
          <p className="mt-3 text-xs leading-5 text-zinc-500">
            Open registry and CLI for typed Payload CMS block kits. MIT licensed — source, issues,
            and install feedback stay public.
          </p>
        </div>
        <div className="flex gap-16 sm:gap-20">
          {footerLinkGroups.map((group) => (
            <div key={group.title}>
              <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-zinc-400">
                {group.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      {...('external' in link && link.external
                        ? { rel: 'noreferrer', target: '_blank' }
                        : {})}
                      className="text-sm text-zinc-600 transition-colors hover:text-zinc-950"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
