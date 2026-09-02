import translationStatus from '../../messages/status.json'

import {
  defaultSiteLocale,
  localeAlternates,
  localizeHref,
  siteLocales,
  splitLocalePathname,
  type SiteLocale,
} from '@/i18n/config'

export type TranslationStatus = 'source' | 'machine' | 'reviewed' | 'fallback'

type Publication = {
  alternates: Record<string, string>
  canonical: string
  contentLocale: SiteLocale
  index: boolean
  status: TranslationStatus
}

const machineTranslatedRoutes = new Set(['/', '/components', '/templates', '/privacy'])
const reviewed = translationStatus.reviewed as Partial<Record<SiteLocale, string[]>>

function normalizedPath(pathname: string) {
  const path = splitLocalePathname(pathname).pathname
  return path !== '/' ? path.replace(/\/$/, '') : path
}

export function reviewedLocalesFor(pathname: string): SiteLocale[] {
  const path = normalizedPath(pathname)
  return siteLocales.filter(
    (locale) => locale === defaultSiteLocale || reviewed[locale]?.includes(path),
  )
}

/**
 * Publication is a per-resource decision. A route may exist for navigation
 * without claiming that its body is translated or indexable.
 */
export function getPublication(pathname: string, locale: SiteLocale): Publication {
  const path = normalizedPath(pathname)
  const alternates = localeAlternates(path, reviewedLocalesFor(path))

  if (locale === defaultSiteLocale) {
    return {
      alternates,
      canonical: localizeHref(path, locale),
      contentLocale: locale,
      index: true,
      status: 'source',
    }
  }

  if (reviewed[locale]?.includes(path)) {
    return {
      alternates,
      canonical: localizeHref(path, locale),
      contentLocale: locale,
      index: true,
      status: 'reviewed',
    }
  }

  if (machineTranslatedRoutes.has(path)) {
    return {
      alternates,
      canonical: localizeHref(path, locale),
      contentLocale: locale,
      index: false,
      status: 'machine',
    }
  }

  return {
    alternates,
    canonical: localizeHref(path, defaultSiteLocale),
    contentLocale: defaultSiteLocale,
    index: false,
    status: 'fallback',
  }
}

export function publicationRobots(publication: Publication) {
  return {
    follow: true,
    googleBot: {
      follow: true,
      index: publication.index,
      'max-image-preview': 'large' as const,
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    index: publication.index,
  }
}
