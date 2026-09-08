import { notFound } from 'next/navigation'

import { normalizeSiteLocale } from '@/i18n/config'
import { getLLMText, getPageMarkdownUrl, source } from '@/lib/source'

type PageMarkdownRouteProps = {
  params: Promise<{
    locale: string
    slug?: string[]
  }>
}

export const revalidate = false

export async function GET(_request: Request, { params }: PageMarkdownRouteProps) {
  const { locale: localeParam, slug } = await params
  const locale = normalizeSiteLocale(localeParam)
  const page = source.getPage(slug?.slice(0, -1), locale)

  if (!page) {
    notFound()
  }

  return new Response(await getLLMText(page, locale), {
    headers: {
      'content-type': 'text/markdown; charset=utf-8',
      /* The markdown twins are AI surfaces, not search targets. Without this
         they are indexable duplicates of the HTML pages (they're discoverable
         from every page's Copy Markdown control) and split ranking signals.
         The proxy rewrites /docs/<slug>.md and Accept: text/markdown here, so
         one header covers all three access paths. */
      'x-robots-tag': 'noindex',
    },
  })
}

export function generateStaticParams() {
  return source.getPages('en').map((page) => ({
    slug: getPageMarkdownUrl(page).segments,
  }))
}
