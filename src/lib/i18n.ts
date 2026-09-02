import 'server-only'

import { locale as rootLocale } from 'next/root-params'
import { defineI18n } from 'fumadocs-core/i18n'
import { defineI18nUI } from 'fumadocs-ui/i18n'
import { zhCN } from '@fumadocs/language/zh-cn'

import {
  defaultSiteLocale,
  localeDetails,
  normalizeSiteLocale,
  siteLocales,
  type SiteLocale,
} from '@/i18n/config'

export const fumadocsI18n = defineI18n({
  defaultLanguage: defaultSiteLocale,
  // Keep English URLs stable while publishing every translation under /<locale>.
  hideLocale: 'default-locale',
  languages: [...siteLocales],
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
/* Only register a docs-shell translation when it comes from an upstream or
 * native-reviewed pack. Other localized docs routes deliberately use the
 * English fallback named by their TranslationNotice instead of pretending
 * that duplicated English strings are translations. */
export const fumadocsI18nUI = defineI18nUI(fumadocsI18n, {
  zh: { displayName: localeDetails.zh.label, ...zhTranslations },
})

export async function getSiteLocale(): Promise<SiteLocale> {
  return normalizeSiteLocale(await rootLocale())
}
