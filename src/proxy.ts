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

export default function proxy(request: NextRequest) {
  const { locale, pathname } = splitLocalePathname(request.nextUrl.pathname)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(localeRequestHeader, locale)

  const rewrite = (destination: string) => {
    const url = new URL(destination, request.nextUrl)
    url.search = request.nextUrl.search

    return NextResponse.rewrite(url, {
      request: { headers: requestHeaders },
    })
  }

  const suffixResult = rewriteSuffix(pathname)

  if (suffixResult) {
    return rewrite(suffixResult)
  }

  if (isMarkdownPreferred(request)) {
    const docsResult = rewriteDocs(pathname)

    if (docsResult) {
      return rewrite(docsResult)
    }
  }

  if (locale === 'zh') return rewrite(pathname)

  return NextResponse.next({ request: { headers: requestHeaders } })
}
