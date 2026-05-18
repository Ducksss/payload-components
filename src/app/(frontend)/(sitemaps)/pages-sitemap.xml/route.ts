import { getServerSideSitemap } from 'next-sitemap'
import { getPayload } from 'payload'
import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getSiteUrl, getStaticSitemapEntries } from '@/seo/geo'

const getPagesSitemap = unstable_cache(
  async () => {
    const payload = await getPayload({ config })
    const results = await payload.find({
      collection: 'pages',
      overrideAccess: false,
      draft: false,
      depth: 0,
      limit: 1000,
      pagination: false,
      where: {
        _status: {
          equals: 'published',
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    const dateFallback = new Date().toISOString()

    const staticSitemap = getStaticSitemapEntries().map((entry) => ({
      changefreq: entry.changeFrequency,
      loc: getSiteUrl(entry.path),
      priority: entry.priority,
      lastmod: dateFallback,
    }))

    const sitemap = results.docs
      ? results.docs
          .filter((page) => Boolean(page?.slug))
          .map((page) => {
            return {
              loc: page?.slug === 'home' ? getSiteUrl() : getSiteUrl(`/${page?.slug}`),
              lastmod: page.updatedAt || dateFallback,
            }
          })
      : []

    const payloadSitemap = sitemap.filter(
      (entry) => !staticSitemap.some((staticEntry) => staticEntry.loc === entry.loc),
    )

    return [...staticSitemap, ...payloadSitemap]
  },
  ['pages-sitemap'],
  {
    tags: ['pages-sitemap'],
  },
)

export async function GET() {
  const sitemap = await getPagesSitemap()

  return getServerSideSitemap(sitemap)
}
