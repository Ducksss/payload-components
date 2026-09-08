import translationStatus from '../../messages/status.json' with { type: 'json' }

import type { SiteLocale } from './config'

// Preserve the staged catalog-import rules for saved drafts. Public languages
// are selected separately by publishedSiteLocales; this does not publish a locale.
export function allowsCatalogFallback(locale: SiteLocale, key: string): boolean {
  const reviewed = translationStatus.reviewed as Partial<Record<SiteLocale, string[]>>
  const catalogReviewed = reviewed[locale]?.some(
    (route) => route === '/' || route === '/components',
  )
  return !catalogReviewed && locale !== 'en' && locale !== 'zh' && key.startsWith('Components.')
}
