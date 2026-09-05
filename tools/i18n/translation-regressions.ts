import type { FlatMessages } from './catalog'

/** Existing translated text must never silently become an English export. */
export function translationRegressions({
  english,
  previousEnglish,
  previous,
  next,
  locale,
}: {
  english: FlatMessages
  previousEnglish: FlatMessages
  previous: FlatMessages
  next: FlatMessages
  locale: string
}): string[] {
  return Object.entries(previous).flatMap(([key, value]) => {
    if (!(key in english) || value === previousEnglish[key]) return []
    if (next[key] === undefined) return [`${locale}:${key} lost an existing translation`]
    if (next[key].trim() === english[key].trim()) {
      return [`${locale}:${key} replaced an existing translation with English`]
    }
    return []
  })
}
