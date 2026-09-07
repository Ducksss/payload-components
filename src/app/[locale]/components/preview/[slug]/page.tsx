import type { Metadata } from 'next'

import { notFound } from 'next/navigation'

import { demosBySlug } from '@/components/site/demos/registry'

/* Full-bleed iframe target for the docs-page ComponentPreviewFrame and the
 * "Open in new tab" action. Renders a single demo twin alone — no site header
 * or footer (there is no /components/layout.tsx, so this inherits only the root
 * layout: fonts, globals, forced-light theme). Because it owns its own viewport,
 * the demo's Tailwind breakpoints (sm:/lg:) reflow against the iframe width,
 * which a CSS-scaled <div> can never do. Static per slug; not indexed. */

export function generateStaticParams() {
  return Object.keys(demosBySlug).map((slug) => ({ slug }))
}

export const metadata: Metadata = {
  robots: { follow: false, index: false },
}

export default async function ComponentPreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const Demo = demosBySlug[slug]

  if (!Demo) notFound()

  /* No min-h-screen: the docs frame measures this document's height to size its
     iframe, so the page must collapse to its content (a forced full-viewport
     height leaves dead space under short blocks like the hero). */
  return (
    <main className="bg-background px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-5xl">
        <Demo />
      </div>
    </main>
  )
}
