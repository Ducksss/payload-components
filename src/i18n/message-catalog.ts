import englishMessages from '../../messages/en.json'

import { allowsCatalogFallback } from './catalog-policy'

import { defaultSiteLocale, type SiteLocale } from '@/i18n/config'

export type MessageTree = { [key: string]: MessageTree | string }

type CatalogLoader = () => Promise<{ default: MessageTree }>

/**
 * Keep imports explicit so Next can split every catalogue into its own chunk.
 * A request only loads the selected locale instead of an all-languages bundle.
 */
const catalogLoaders: Record<Exclude<SiteLocale, 'en'>, CatalogLoader> = {
  ar: () => import('../../messages/locales/ar.json'),
  zh: () => import('../../messages/locales/zh.json'),
  pl: () => import('../../messages/locales/pl.json'),
  th: () => import('../../messages/locales/th.json'),
  de: () => import('../../messages/locales/de.json'),
  pt: () => import('../../messages/locales/pt.json'),
  id: () => import('../../messages/locales/id.json'),
  es: () => import('../../messages/locales/es.json'),
  fr: () => import('../../messages/locales/fr.json'),
  he: () => import('../../messages/locales/he.json'),
  tr: () => import('../../messages/locales/tr.json'),
  nl: () => import('../../messages/locales/nl.json'),
  uk: () => import('../../messages/locales/uk.json'),
  vi: () => import('../../messages/locales/vi.json'),
  it: () => import('../../messages/locales/it.json'),
  ja: () => import('../../messages/locales/ja.json'),
  ko: () => import('../../messages/locales/ko.json'),
  sr: () => import('../../messages/locales/sr.json'),
  hu: () => import('../../messages/locales/hu.json'),
  et: () => import('../../messages/locales/et.json'),
  fi: () => import('../../messages/locales/fi.json'),
}

export async function getSiteMessages(locale: SiteLocale): Promise<MessageTree> {
  if (locale === defaultSiteLocale) return englishMessages as MessageTree
  const translatedLocale = locale as Exclude<SiteLocale, 'en'>
  const messages = (await catalogLoaders[translatedLocale]()).default
  return withCatalogFallback(englishMessages, messages, locale)
}

function withCatalogFallback(
  source: MessageTree,
  translated: MessageTree,
  locale: SiteLocale,
  prefix = '',
): MessageTree {
  return Object.fromEntries(
    Object.entries(source).map(([key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key
      const localized = translated[key]
      if (typeof value === 'string') {
        return [key, localized ?? (allowsCatalogFallback(locale, fullKey) ? value : localized)]
      }
      return [
        key,
        withCatalogFallback(value, typeof localized === 'object' ? localized : {}, locale, fullKey),
      ]
    }),
  ) as MessageTree
}
