import type { Metadata } from 'next'
import type { ComponentType } from 'react'

import { notFound } from 'next/navigation'

import { demosBySlug } from '@/components/site/demos/registry'
import { exampleStateParams, getExampleState } from '@/components/site/demos/states'

/* Iframe target for the docs-page "Examples" section (<ComponentExample slug
 * state />): the same chrome-free, full-bleed render as the base
 * /components/preview/<slug> route, but with the demo twin's `content` replaced
 * by one named example state from src/components/site/demos/states.ts. The
 * base route is the visually snapshotted one and stays untouched; this route
 * is generated statically per slug/state pair and 404s for unknown pairs.
 * Not indexed. */

/* demosBySlug is typed prop-less because most twins only default their own
   content. Every slug in exampleStatesBySlug has a twin that accepts `content`
   (tests/int/component-examples.int.spec.ts pins that), so the cast is safe. */
type ContentDemo = ComponentType<{ content?: unknown }>

export function generateStaticParams() {
  return exampleStateParams()
}

export const metadata: Metadata = {
  robots: { follow: false, index: false },
}

export default async function ComponentExamplePreviewPage({
  params,
}: {
  params: Promise<{ slug: string; state: string }>
}) {
  const { slug, state } = await params
  const example = getExampleState(slug, state)
  const Demo = demosBySlug[slug] as ContentDemo | undefined

  if (!example || !Demo) notFound()

  /* Mirrors the base route exactly (no min-h-screen so the docs frame can
     measure the content height; preview-scope pins the component tokens). */
  return (
    <main className="preview-scope bg-background px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-5xl">
        <Demo content={example.content} />
      </div>
    </main>
  )
}
