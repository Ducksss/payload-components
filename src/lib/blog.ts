import { blogSource } from '@/lib/blog-source'

export const blogSeries = {
  'project-notes': { label: 'Project notes' },
  foundations: { label: 'Foundations' },
  'installer-internals': { label: 'Installer internals' },
  'component-design': { label: 'Component design' },
  'production-guides': { label: 'Production guides' },
  'open-source': { label: 'Quality & community' },
} as const

export type BlogPage = (typeof blogSource)['$inferPage']
export type BlogSeries = keyof typeof blogSeries

function timestamp(value: Date | string) {
  return new Date(value).getTime()
}

export function sortBlogPages(pages: readonly BlogPage[] = blogSource.getPages('en')) {
  return [...pages].sort((a, b) => {
    const dateDifference = timestamp(b.data.date) - timestamp(a.data.date)
    return dateDifference || a.data.publicationOrder - b.data.publicationOrder
  })
}

export function getRelatedPosts(current: BlogPage, locale = 'en', limit = 3) {
  const pages = blogSource
    .getPages(locale)
    .filter((page) => page.slugs.join('/') !== current.slugs.join('/'))
  const byDistance = (a: BlogPage, b: BlogPage) => {
    const aDistance = Math.abs(a.data.publicationOrder - current.data.publicationOrder)
    const bDistance = Math.abs(b.data.publicationOrder - current.data.publicationOrder)
    return aDistance - bDistance || a.data.publicationOrder - b.data.publicationOrder
  }
  const sameSeries = pages
    .filter((page) => page.data.series === current.data.series)
    .sort(byDistance)
  const fallback = pages.filter((page) => page.data.series !== current.data.series).sort(byDistance)

  // Project notes is an intentional two-post prologue. Every larger series
  // supplies all three results; the prologue fills its remaining cards with
  // the nearest editorial chapters so the article chrome never collapses.
  return [...sameSeries, ...fallback].slice(0, limit)
}
