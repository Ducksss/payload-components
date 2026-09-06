import { notFound } from 'next/navigation'

import { getSiteLocale } from '@/lib/i18n'
import { getTemplateLLMText } from '@/lib/template-markdown'
import { getTemplateShowcase, templateShowcases } from '@/lib/templates/registry'

export const revalidate = false

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const template = getTemplateShowcase(slug)
  if (!template || !Object.hasOwn(template, 'slug')) notFound()

  return new Response(getTemplateLLMText(template, await getSiteLocale()), {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'x-robots-tag': 'noindex',
    },
  })
}

export function generateStaticParams() {
  return templateShowcases.map(({ slug }) => ({ slug }))
}
