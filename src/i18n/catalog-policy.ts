import translationStatus from '../../messages/status.json' with { type: 'json' }

import type { SiteLocale } from './config'

// Catalog prose is being rolled out in English and Chinese first. Existing
// shell translations remain available; absent catalog prose stays explicitly
// English until a locale contributes this namespace. All other keys are required.
export function allowsCatalogFallback(locale: SiteLocale, key: string): boolean {
  const reviewed = translationStatus.reviewed as Partial<Record<SiteLocale, string[]>>
  const catalogReviewed = reviewed[locale]?.some(
    (route) => route === '/' || route === '/components',
  )
  return !catalogReviewed && locale !== 'en' && locale !== 'zh' && key.startsWith('Components.')
}
