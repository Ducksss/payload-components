import type { NextRequest } from 'next/server'

import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation'

import { isLocaleNeutralPath, splitLocalePathname } from '@/i18n/config'
import { routing } from '@/i18n/routing'
import { docsContentRoute, docsRoute } from '@/lib/site'

const { rewrite: rewriteDocs } = rewritePath(
  `${docsRoute}{/*path}`,
  `${docsContentRoute}{/*path}/content.md`,
)
const { rewrite: rewriteSuffix } = rewritePath(
  `${docsRoute}{/*path}.md`,
  `${docsContentRoute}{/*path}/content.md`,
)
const internationalize = createMiddleware(routing)

export default function proxy(request: NextRequest) {
  if (isLocaleNeutralPath(request.nextUrl.pathname)) return NextResponse.next()

  const { locale, pathname } = splitLocalePathname(request.nextUrl.pathname)

  const rewrite = (destination: string) => {
    const url = new URL(`/${locale}${destination}`, request.nextUrl)
    url.search = request.nextUrl.search
    return NextResponse.rewrite(url)
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

  return internationalize(request)
}

export const config = {
  matcher: [
    '/docs/:path*',
    '/:locale/docs/:path*',
    // These public content routes contain a literal dot, so the general asset
    // exclusion below cannot discover the hidden default-locale segment.
    '/llms.mdx/:path*',
    '/og/:path*',
    '/((?!api|r|_next|_vercel|.*\\..*).*)',
  ],
}
