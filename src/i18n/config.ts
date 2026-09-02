export const siteLocales = [
  'en',
  'ar',
  'zh',
  'pl',
  'th',
  'de',
  'pt',
  'id',
  'es',
  'fr',
  'he',
  'tr',
  'nl',
  'uk',
  'vi',
  'it',
  'ja',
  'ko',
  'sr',
  'hu',
  'et',
  'fi',
] as const

export type SiteLocale = (typeof siteLocales)[number]
export type SiteDirection = 'ltr' | 'rtl'
export type SiteScript = 'arabic' | 'cjk' | 'cyrillic' | 'hebrew' | 'latin' | 'thai'

export const defaultSiteLocale: SiteLocale = 'en'

type LocaleDetails = {
  direction: SiteDirection
  htmlLang: string
  label: string
  openGraphLocale?: string
  script: SiteScript
}

/** Native labels keep the switcher usable before any translated copy loads.
 * Order follows the audience data: broadest coverage first, then the long tail. */
export const localeDetails: Record<SiteLocale, LocaleDetails> = {
  en: {
    direction: 'ltr',
    htmlLang: 'en',
    label: 'English',
    openGraphLocale: 'en_US',
    script: 'latin',
  },
  ar: {
    direction: 'rtl',
    htmlLang: 'ar',
    label: 'العربية',
    script: 'arabic',
  },
  zh: {
    direction: 'ltr',
    htmlLang: 'zh-CN',
    label: '简体中文',
    openGraphLocale: 'zh_CN',
    script: 'cjk',
  },
  pl: {
    direction: 'ltr',
    htmlLang: 'pl',
    label: 'Polski',
    openGraphLocale: 'pl_PL',
    script: 'latin',
  },
  th: {
    direction: 'ltr',
    htmlLang: 'th',
    label: 'ไทย',
    openGraphLocale: 'th_TH',
    script: 'thai',
  },
  de: {
    direction: 'ltr',
    htmlLang: 'de',
    label: 'Deutsch',
    openGraphLocale: 'de_DE',
    script: 'latin',
  },
  pt: {
    direction: 'ltr',
    htmlLang: 'pt-BR',
    label: 'Português (Brasil)',
    openGraphLocale: 'pt_BR',
    script: 'latin',
  },
  id: {
    direction: 'ltr',
    htmlLang: 'id',
    label: 'Bahasa Indonesia',
    openGraphLocale: 'id_ID',
    script: 'latin',
  },
  es: {
    direction: 'ltr',
    htmlLang: 'es',
    label: 'Español',
    openGraphLocale: 'es_ES',
    script: 'latin',
  },
  fr: {
    direction: 'ltr',
    htmlLang: 'fr',
    label: 'Français',
    openGraphLocale: 'fr_FR',
    script: 'latin',
  },
  he: {
    direction: 'rtl',
    htmlLang: 'he',
    label: 'עברית',
    openGraphLocale: 'he_IL',
    script: 'hebrew',
  },
  tr: {
    direction: 'ltr',
    htmlLang: 'tr',
    label: 'Türkçe',
    openGraphLocale: 'tr_TR',
    script: 'latin',
  },
  nl: {
    direction: 'ltr',
    htmlLang: 'nl',
    label: 'Nederlands',
    openGraphLocale: 'nl_NL',
    script: 'latin',
  },
  uk: {
    direction: 'ltr',
    htmlLang: 'uk',
    label: 'Українська',
    openGraphLocale: 'uk_UA',
    script: 'cyrillic',
  },
  vi: {
    direction: 'ltr',
    htmlLang: 'vi',
    label: 'Tiếng Việt',
    openGraphLocale: 'vi_VN',
    script: 'latin',
  },
  it: {
    direction: 'ltr',
    htmlLang: 'it',
    label: 'Italiano',
    openGraphLocale: 'it_IT',
    script: 'latin',
  },
  ja: {
    direction: 'ltr',
    htmlLang: 'ja',
    label: '日本語',
    openGraphLocale: 'ja_JP',
    script: 'cjk',
  },
  ko: {
    direction: 'ltr',
    htmlLang: 'ko',
    label: '한국어',
    openGraphLocale: 'ko_KR',
    script: 'cjk',
  },
  sr: {
    direction: 'ltr',
    htmlLang: 'sr',
    label: 'Српски',
    openGraphLocale: 'sr_RS',
    script: 'cyrillic',
  },
  hu: {
    direction: 'ltr',
    htmlLang: 'hu',
    label: 'Magyar',
    openGraphLocale: 'hu_HU',
    script: 'latin',
  },
  et: {
    direction: 'ltr',
    htmlLang: 'et',
    label: 'Eesti',
    openGraphLocale: 'et_EE',
    script: 'latin',
  },
  fi: {
    direction: 'ltr',
    htmlLang: 'fi',
    label: 'Suomi',
    openGraphLocale: 'fi_FI',
    script: 'latin',
  },
}

export function isSiteLocale(value: string | null | undefined): value is SiteLocale {
  return siteLocales.includes(value as SiteLocale)
}

export function normalizeSiteLocale(value: string | null | undefined): SiteLocale {
  return isSiteLocale(value) ? value : defaultSiteLocale
}

export function localePathPrefix(locale: SiteLocale): string {
  return locale === defaultSiteLocale ? '' : `/${locale}`
}

export function splitLocalePathname(pathname: string): {
  locale: SiteLocale
  pathname: string
} {
  const firstSegment = pathname.split('/')[1]

  if (isSiteLocale(firstSegment) && firstSegment !== defaultSiteLocale) {
    const prefix = `/${firstSegment}`
    return {
      locale: firstSegment,
      pathname: pathname.slice(prefix.length) || '/',
    }
  }

  return { locale: defaultSiteLocale, pathname }
}

const localeNeutralPrefixes = [
  '/api/',
  '/r/',
  '/_next/',
  '/feed.xml',
  '/blog/rss.xml',
  '/llms.txt',
  '/llms-full.txt',
  '/locale',
  '/favicon.',
  '/manifest.webmanifest',
  '/opengraph-image',
  '/robots.txt',
  '/sitemap.xml',
] as const

export function isLocaleNeutralPath(pathname: string) {
  return localeNeutralPrefixes.some(
    (prefix) => pathname === prefix.slice(0, -1) || pathname.startsWith(prefix),
  )
}

/** Add or replace the public locale prefix without touching external URLs. */
export function localizeHref(href: string, locale: SiteLocale): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href

  const match = href.match(/^([^?#]*)(.*)$/)
  const pathname = match?.[1] || '/'
  const suffix = match?.[2] || ''
  const unlocalized = splitLocalePathname(pathname).pathname

  if (isLocaleNeutralPath(unlocalized)) return `${unlocalized}${suffix}`

  const prefix = localePathPrefix(locale)
  if (unlocalized === '/') return `${prefix || '/'}${suffix}`

  return `${prefix}${unlocalized}${suffix}`
}

/**
 * Only English is indexable until a locale has an explicit, native-reviewed
 * publication record. Callers may pass those reviewed locales; machine and
 * fallback routes must never be advertised as search alternates.
 */
export function localeAlternates(
  href: string,
  reviewedLocales: readonly SiteLocale[] = [defaultSiteLocale],
): Record<string, string> {
  const locales = [...new Set([defaultSiteLocale, ...reviewedLocales])]
  const languages = Object.fromEntries(
    locales.map((locale) => [localeDetails[locale].htmlLang, localizeHref(href, locale)]),
  )

  return {
    ...languages,
    'x-default': localizeHref(href, defaultSiteLocale),
  }
}
