import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation'

import { localeRequestHeader, splitLocalePathname } from '@/i18n/config'
import { docsContentRoute, docsRoute } from '@/lib/site'

const { rewrite: rewriteDocs } = rewritePath(
  `${docsRoute}{/*path}`,
  `${docsContentRoute}{/*path}/content.md`,
)
const { rewrite: rewriteSuffix } = rewritePath(
  `${docsRoute}{/*path}.md`,
  `${docsContentRoute}{/*path}/content.md`,
)

const markdownSurfaces = ['blog', 'templates'].map((surface) => ({
  page: rewritePath(`/${surface}/:slug`, `/llms.mdx/${surface}/:slug/content.md`).rewrite,
  suffix: rewritePath(`/${surface}/:slug.md`, `/llms.mdx/${surface}/:slug/content.md`).rewrite,
}))

export default function proxy(request: NextRequest) {
  const { locale, pathname } = splitLocalePathname(request.nextUrl.pathname)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(localeRequestHeader, locale)
  const withMarkdownVary = (response: NextResponse) => {
    if (/^\/(?:docs|blog|templates)(?:\/|$)/.test(pathname)) {
      const vary = response.headers.get('vary')
      response.headers.set('vary', vary ? `${vary}, Accept` : 'Accept')
    }
    return response
  }

  const rewrite = (destination: string) => {
    const url = new URL(destination, request.nextUrl)
    url.search = request.nextUrl.search

    return withMarkdownVary(
      NextResponse.rewrite(url, {
        request: { headers: requestHeaders },
      }),
    )
  }

  const suffixResult =
    rewriteSuffix(pathname) || markdownSurfaces.map(({ suffix }) => suffix(pathname)).find(Boolean)

  if (suffixResult) {
    return rewrite(suffixResult)
  }

  if (isMarkdownPreferred(request)) {
    const docsResult =
      rewriteDocs(pathname) || markdownSurfaces.map(({ page }) => page(pathname)).find(Boolean)

    if (docsResult) {
      return rewrite(docsResult)
    }
  }

  if (locale === 'zh') return rewrite(pathname)

  return withMarkdownVary(NextResponse.next({ request: { headers: requestHeaders } }))
}
