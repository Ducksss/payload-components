import type { MetadataRoute } from 'next'

import { localeAlternates, localizeHref } from '@/i18n/config'
import { siteUrl } from '@/lib/site'
import { source } from '@/lib/source'
import { blogSource } from '@/lib/blog-source'
import { sortBlogPages } from '@/lib/blog'
import { templateDetailHref, templateShowcases } from '@/lib/templates/registry'

function localizedEntry(path: string) {
  return {
    alternates: {
      languages: Object.fromEntries(
        Object.entries(localeAlternates(path)).map(([locale, href]) => [
          locale,
          `${siteUrl}${href}`,
        ]),
      ),
    },
    url: `${siteUrl}${localizeHref(path, 'en')}`,
  }
}

/* Static marketing routes. The /docs index and every component/guide page come
   from the Fumadocs source below, so they are intentionally absent here. */
const staticRoutes = [
  { changeFrequency: 'weekly', path: '/', priority: 1 },
  { changeFrequency: 'weekly', path: '/components', priority: 0.9 },
  { changeFrequency: 'weekly', path: '/templates', priority: 0.8 },
  { changeFrequency: 'monthly', path: '/about', priority: 0.5 },
  { changeFrequency: 'monthly', path: '/brand-guide', priority: 0.5 },
  { changeFrequency: 'yearly', path: '/privacy', priority: 0.3 },
] as const satisfies ReadonlyArray<{
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  path: string
  priority: number
}>

export default function sitemap(): MetadataRoute.Sitemap {
  const marketing: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    changeFrequency: route.changeFrequency,
    priority: route.priority,
    ...localizedEntry(route.path),
  }))

  const docs: MetadataRoute.Sitemap = source.getPages('en').map((page) => ({
    changeFrequency: 'weekly',
    // The docs landing carries more weight than an individual guide.
    priority: page.url === '/docs' ? 0.8 : 0.7,
    ...localizedEntry(page.url),
  }))

  /* Template detail pages are indexable; raw /templates/<slug>/preview routes
     are deliberately absent (noindex iframe targets). Freshness comes from a
     real source date only, so these static-showcase entries omit lastModified. */
  const templates: MetadataRoute.Sitemap = templateShowcases.map((template) => ({
    changeFrequency: 'weekly',
    priority: 0.7,
    ...localizedEntry(templateDetailHref(template.slug)),
  }))

  const blogPages = sortBlogPages(blogSource.getPages('en'))
  const blog: MetadataRoute.Sitemap = blogPages.map((page) => ({
    changeFrequency: 'monthly',
    lastModified: new Date(page.data.date),
    priority: 0.6,
    ...localizedEntry(page.url),
  }))
  const latestBlogDate = blogPages.reduce<Date | undefined>((latest, page) => {
    const published = new Date(page.data.date)
    return !latest || published > latest ? published : latest
  }, undefined)

  return [
    ...marketing,
    ...templates,
    ...docs,
    {
      changeFrequency: 'weekly',
      ...(latestBlogDate ? { lastModified: latestBlogDate } : {}),
      priority: 0.7,
      ...localizedEntry('/blog'),
    },
    ...blog,
  ]
}
