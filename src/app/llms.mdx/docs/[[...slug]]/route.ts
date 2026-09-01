import { notFound } from 'next/navigation'

import { getSiteLocale } from '@/lib/i18n'
import { getLLMText, getPageMarkdownUrl, source } from '@/lib/source'

type PageMarkdownRouteProps = {
  params: Promise<{
    slug?: string[]
  }>
}

export const revalidate = false

export async function GET(_request: Request, { params }: PageMarkdownRouteProps) {
  const { slug } = await params
  const locale = await getSiteLocale()
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
