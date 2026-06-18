import Link from 'next/link'

import { ArrowRight } from 'lucide-react'

import { SiteHeader } from '@/components/site/SiteHeader'
import { Terminal } from '@/components/site/Terminal'

const notFoundLines = [
  { kind: 'command', text: 'payload-components add this-page' },
  { kind: 'info', text: 'payload-components: Unknown component "this-page".' },
  {
    kind: 'info',
    text: 'Known components: hero-basic, feature-grid-basic, feature-split, feature-bento, feature-steps, embed-basic, logo-cloud-grid, logo-cloud-hover, logo-cloud-marquee, logo-cloud-inline, logo-cloud-inline-wrap, content-columns, content-image-lead, content-feature-media, content-feature-split, content-showcase, content-quote, content-community, integration-grid, integration-cluster, integration-split, integration-connect, integration-orbit, integration-list, integration-marquee, integration-testimonial, content-split-rows, content-rows, content-image-frame, content-stats, content-list, content-list-columns, content-list-icons, call-to-action-centered, call-to-action-boxed, call-to-action-signup.',
  },
] as const

export default function NotFoundPage() {
  return (
    <>
      <SiteHeader />
      <main className="relative flex flex-1 items-center overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-dots [mask-image:radial-gradient(34rem_24rem_at_50%_40%,black,transparent)]"
        />
        <div className="container relative max-w-xl py-20 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Error 404
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            This route is not in the registry. The components, the docs, and the catalog are.
          </p>

          <Terminal className="mt-8 text-left" lines={notFoundLines} title="payload-components — 404" />

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Go home
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href="/docs"
              className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Read the docs
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
