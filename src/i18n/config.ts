export const siteLocales = ['en', 'zh'] as const

export type SiteLocale = (typeof siteLocales)[number]

export const defaultSiteLocale: SiteLocale = 'en'
export const localeRequestHeader = 'x-payload-components-locale'

export const localeDetails: Record<
  SiteLocale,
  { htmlLang: string; label: string; openGraphLocale: string }
> = {
  en: { htmlLang: 'en', label: 'English', openGraphLocale: 'en_US' },
  zh: { htmlLang: 'zh-CN', label: '简体中文', openGraphLocale: 'zh_CN' },
}

export function isSiteLocale(value: string | null | undefined): value is SiteLocale {
  return siteLocales.includes(value as SiteLocale)
}

export function normalizeSiteLocale(value: string | null | undefined): SiteLocale {
  return isSiteLocale(value) ? value : defaultSiteLocale
}

export function splitLocalePathname(pathname: string): {
  locale: SiteLocale
  pathname: string
} {
  if (pathname === '/zh') return { locale: 'zh', pathname: '/' }
  if (pathname.startsWith('/zh/')) return { locale: 'zh', pathname: pathname.slice(3) || '/' }

  return { locale: defaultSiteLocale, pathname }
}

const localeNeutralPrefixes = [
  '/api/',
  '/r/',
  '/_next/',
  '/favicon.',
  '/manifest.webmanifest',
  '/robots.txt',
  '/sitemap.xml',
] as const

function isLocaleNeutralPath(pathname: string) {
  return localeNeutralPrefixes.some(
    (prefix) => pathname === prefix.slice(0, -1) || pathname.startsWith(prefix),
  )
}

/** Add or remove the public locale prefix without touching external URLs. */
export function localizeHref(href: string, locale: SiteLocale): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href

  const match = href.match(/^([^?#]*)(.*)$/)
  const pathname = match?.[1] || '/'
  const suffix = match?.[2] || ''
  const unlocalized = splitLocalePathname(pathname).pathname

  if (isLocaleNeutralPath(unlocalized)) return `${unlocalized}${suffix}`
  if (locale === defaultSiteLocale) return `${unlocalized}${suffix}`
  if (unlocalized === '/') return `/zh${suffix}`

  return `/zh${unlocalized}${suffix}`
}

export function localeAlternates(href: string) {
  return {
    en: localizeHref(href, 'en'),
    'zh-CN': localizeHref(href, 'zh'),
    'x-default': localizeHref(href, 'en'),
  }
}
