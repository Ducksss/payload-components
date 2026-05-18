const DEFAULT_SITE_URL = 'http://localhost:3000'

const normalizeSiteUrl = (url) => {
  const trimmedUrl = url?.trim()

  if (!trimmedUrl) {
    return DEFAULT_SITE_URL
  }

  const urlWithProtocol = /^https?:\/\//i.test(trimmedUrl) ? trimmedUrl : `https://${trimmedUrl}`

  try {
    return new URL(urlWithProtocol).origin
  } catch {
    return DEFAULT_SITE_URL
  }
}

const SITE_URL = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SERVER_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL,
)

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: ['/posts-sitemap.xml', '/pages-sitemap.xml', '/*', '/posts/*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: ['/api/media/file/'],
        disallow: ['/admin', '/admin/', '/admin/*', '/api/*', '/next/preview', '/next/seed'],
      },
    ],
    additionalSitemaps: [`${SITE_URL}/pages-sitemap.xml`, `${SITE_URL}/posts-sitemap.xml`],
  },
}
