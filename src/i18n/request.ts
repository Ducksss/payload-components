import { headers } from 'next/headers'
import { getRequestConfig } from 'next-intl/server'

import { localeRequestHeader, normalizeSiteLocale } from '@/i18n/config'

export default getRequestConfig(async () => {
  const requestHeaders = await headers()
  const locale = normalizeSiteLocale(requestHeaders.get(localeRequestHeader))
  const messages = (await import(`../../messages/${locale}.json`)).default

  return { locale, messages }
})
