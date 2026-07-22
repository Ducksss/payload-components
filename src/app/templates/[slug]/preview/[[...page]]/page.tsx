import type { Metadata } from 'next'

import { notFound } from 'next/navigation'

import { TemplatePageRenderer } from '@/components/site/templates/TemplateRenderer'
import { TemplateVisualCanvas } from '@/components/site/templates/TemplateVisualCanvas'
import { TemplatePreviewExit } from '@/components/site/templates/shared/TemplatePreviewExit'
import { templateShellsBySlug } from '@/components/site/templates/shells'
import {
  getTemplatePage,
  getTemplateShowcase,
  templateShowcases,
} from '@/lib/templates/registry'
import { TEMPLATE_CONCEPT_STATUS_LABEL } from '@/lib/templates/types'

/* Raw full-site preview: the fictional template's own shell (header, internal
 * navigation, footer, scoped theme) around the composed block recipe. No
 * SiteHeader/SiteFooter — this route inherits only the root layout. Shareable
 * via direct URL but never indexed, never in the sitemap or LLM surfaces. The
 * AnalyticsShell also skips its general pageview stream for these routes so a
 * detail-page iframe cannot double-count. */

export function generateStaticParams() {
  return templateShowcases.flatMap((template) =>
    template.pages.map((page) => ({
      page: page.path === '' ? [] : [page.path],
      slug: template.slug,
    })),
  )
}

type PreviewParams = Promise<{ page?: string[]; slug: string }>

function resolvePreview(slug: string, segments: string[] | undefined) {
  const template = getTemplateShowcase(slug)
  if (!template) return null
  if (segments && segments.length > 1) return null

  const path = segments?.[0] ?? ''
  const page = getTemplatePage(template, path)
  if (!page) return null

  return { page, template }
}

export async function generateMetadata({
  params,
}: {
  params: PreviewParams
}): Promise<Metadata> {
  const { page: segments, slug } = await params
  const resolved = resolvePreview(slug, segments)
  if (!resolved) return { robots: { follow: false, index: false } }

  return {
    description: resolved.page.description,
    robots: { follow: false, index: false },
    title: `${resolved.page.title} · ${TEMPLATE_CONCEPT_STATUS_LABEL}`,
  }
}

export default async function TemplatePreviewPage({ params }: { params: PreviewParams }) {
  const { page: segments, slug } = await params
  const resolved = resolvePreview(slug, segments)
  if (!resolved) notFound()

  const { page, template } = resolved
  const Shell = templateShellsBySlug[template.slug]
  if (!Shell) notFound()

  return (
    <>
      <Shell activePath={page.path} template={template}>
        <h1 className="sr-only">{page.title}</h1>
        <TemplateVisualCanvas
          summary={`Visual concept preview of the ${template.title} template's ${page.label} page: ${page.description} The sections below are a non-interactive composition of open-registry blocks.`}
        >
          <TemplatePageRenderer page={page} />
        </TemplateVisualCanvas>
      </Shell>
      <TemplatePreviewExit slug={template.slug} title={template.title} />
    </>
  )
}
