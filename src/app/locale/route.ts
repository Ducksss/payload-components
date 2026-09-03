import type { NextRequest } from 'next/server'

import { NextResponse } from 'next/server'

import { isSiteLocale, localizeHref } from '@/i18n/config'

function safeReturnTo(value: string | null) {
  if (!value?.startsWith('/') || value.startsWith('//')) return '/'
  const url = new URL(value, 'https://payload-components.invalid')
  return `${url.pathname}${url.search}${url.hash}`
}

/** Progressive-enhancement endpoint for the language form. */
export function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale')
  const returnTo = safeReturnTo(request.nextUrl.searchParams.get('returnTo'))
  const destination = localizeHref(returnTo, isSiteLocale(locale) ? locale : 'en')

  return NextResponse.redirect(new URL(destination, request.url), 303)
}
