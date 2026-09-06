import { notFound } from 'next/navigation'

import { blogSource, getBlogLLMText, getBlogPages } from '@/lib/blog-source'
import { normalizeSiteLocale } from '@/i18n/config'

export const revalidate = false

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: localeParam, slug } = await params
  const locale = normalizeSiteLocale(localeParam)
  const page = blogSource.getPage([slug], locale)
  if (!page) notFound()

  return new Response(await getBlogLLMText(page), {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      'x-robots-tag': 'noindex',
    },
  })
}

export function generateStaticParams() {
  return getBlogPages().map((page) => ({ slug: page.slugs[0] }))
}
