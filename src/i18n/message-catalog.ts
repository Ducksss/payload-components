import englishMessages from '../../messages/en.json'

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
  return (await catalogLoaders[translatedLocale]()).default
}
