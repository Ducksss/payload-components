import { getRequestConfig } from 'next-intl/server'
import { locale as rootLocale } from 'next/root-params'

import { normalizeSiteLocale } from '@/i18n/config'
import { getSiteMessages } from '@/i18n/message-catalog'

export default getRequestConfig(async ({ locale: configuredLocale }) => {
  const locale = normalizeSiteLocale(configuredLocale ?? (await rootLocale()))

  return { locale, messages: await getSiteMessages(locale) }
})
