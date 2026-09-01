import 'server-only'

import { headers } from 'next/headers'
import { defineI18n } from 'fumadocs-core/i18n'
import { defineI18nUI } from 'fumadocs-ui/i18n'
import { zhCN } from '@fumadocs/language/zh-cn'

import {
  localeDetails,
  localeRequestHeader,
  normalizeSiteLocale,
  type SiteLocale,
} from '@/i18n/config'

export const fumadocsI18n = defineI18n({
  defaultLanguage: 'en',
  // Keep English URLs stable while publishing Simplified Chinese under /zh.
  hideLocale: 'default-locale',
  languages: ['en', 'zh'],
  // Until every long-form page has a reviewed translation, the localized
  // route remains complete and falls back to the canonical English source.
  fallbackLanguage: 'en',
})

const zhPreset = zhCN()
const zhTranslations = Object.fromEntries(
  Object.entries(zhPreset.value).filter((entry): entry is [string, string] => {
    return typeof entry[1] === 'string'
  }),
)

export const fumadocsI18nUI = defineI18nUI(fumadocsI18n, {
  zh: { displayName: localeDetails.zh.label, ...zhTranslations },
})

export async function getSiteLocale(): Promise<SiteLocale> {
  const requestHeaders = await headers()
  return normalizeSiteLocale(requestHeaders.get(localeRequestHeader))
}
