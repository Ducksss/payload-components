import type { MetadataRoute } from 'next'

import { siteUrl } from '@/lib/site'
import { source } from '@/lib/source'

/* Static marketing routes. The /docs index and every component/guide page come
   from the Fumadocs source below, so they are intentionally absent here. */
const staticRoutes = [
  { changeFrequency: 'weekly', path: '/', priority: 1 },
  { changeFrequency: 'weekly', path: '/components', priority: 0.9 },
  { changeFrequency: 'weekly', path: '/payload-custom-components', priority: 0.8 },
  { changeFrequency: 'monthly', path: '/about', priority: 0.5 },
  { changeFrequency: 'monthly', path: '/brand-guide', priority: 0.5 },
] as const satisfies ReadonlyArray<{
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  path: string
  priority: number
}>

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  const marketing: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    changeFrequency: route.changeFrequency,
    lastModified,
    priority: route.priority,
    url: `${siteUrl}${route.path}`,
  }))

  const docs: MetadataRoute.Sitemap = source.getPages().map((page) => ({
    changeFrequency: 'weekly',
    lastModified,
    // The docs landing carries more weight than an individual guide.
    priority: page.url === '/docs' ? 0.8 : 0.7,
    url: `${siteUrl}${page.url}`,
  }))

  return [...marketing, ...docs]
}
