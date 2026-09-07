import { notFound } from 'next/navigation'

import { normalizeSiteLocale } from '@/i18n/config'
import { getTemplateLLMText } from '@/lib/template-markdown'
import { getTemplateShowcase, templateShowcases } from '@/lib/templates/registry'

export const revalidate = false

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: localeParam, slug } = await params
  const template = getTemplateShowcase(slug)
  if (!template || !Object.hasOwn(template, 'slug')) notFound()

  return new Response(getTemplateLLMText(template, normalizeSiteLocale(localeParam)), {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'x-robots-tag': 'noindex',
    },
  })
}

export function generateStaticParams() {
  return templateShowcases.map(({ slug }) => ({ slug }))
}
