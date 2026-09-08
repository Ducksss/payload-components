import { createMDX } from 'fumadocs-mdx/next'
import createNextIntlPlugin from 'next-intl/plugin'

const deployFreshHeaders = [
  {
    key: 'Cache-Control',
    value: 'public, max-age=0, must-revalidate',
  },
  {
    key: 'CDN-Cache-Control',
    value: 'public, s-maxage=300, stale-while-revalidate=86400, stale-if-error=604800',
  },
  {
    key: 'Vercel-CDN-Cache-Control',
    value: 'public, s-maxage=300, stale-while-revalidate=86400, stale-if-error=604800',
  },
]

const publicAssetHeaders = [
  {
    key: 'Cache-Control',
    value: 'public, max-age=3600, stale-while-revalidate=86400',
  },
]

const crawlMetadataHeaders = [
  {
    key: 'Cache-Control',
    value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
  },
]

const isDevelopment = process.env.NODE_ENV === 'development'

const postHogOrigin = (() => {
  try {
    const origin = new URL(process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com')
      .origin

    return origin.startsWith('https://') ? origin : null
  } catch {
    return null
  }
})()

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval' https://va.vercel-scripts.com" : ''} https://www.googletagmanager.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://www.google-analytics.com https://*.google-analytics.com https://*.googletagmanager.com",
  "font-src 'self' data:",
  `connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com${postHogOrigin ? ` ${postHogOrigin}` : ''}`,
  "frame-src 'self' https://*.airtable.com https://*.google.com https://*.typeform.com https://*.vimeo.com https://*.youtube.com https://*.youtube-nocookie.com",
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "manifest-src 'self'",
].join('; ')

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: contentSecurityPolicy,
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), geolocation=(), microphone=(), payment=(), usb=()',
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      // ponytail: serve stale documents/RSC quickly, then refresh them in the background.
      {
        source: '/:path*',
        has: [{ type: 'header', key: 'accept', value: '.*text/html.*' }],
        headers: deployFreshHeaders,
      },
      {
        source: '/:path*',
        has: [{ type: 'header', key: 'rsc', value: '1' }],
        headers: deployFreshHeaders,
      },
      {
        source: '/robots.txt',
        headers: crawlMetadataHeaders,
      },
      {
        source: '/sitemap.xml',
        headers: crawlMetadataHeaders,
      },
      {
        source: '/feed.xml',
        headers: crawlMetadataHeaders,
      },
      {
        source: '/blog/rss.xml',
        headers: crawlMetadataHeaders,
      },
      // The llms surfaces compile every doc (llms-full walks the whole tree),
      // so they are the most expensive text routes on the site — cache them
      // like the other crawl metadata.
      {
        source: '/llms.txt',
        headers: crawlMetadataHeaders,
      },
      {
        source: '/llms-full.txt',
        headers: crawlMetadataHeaders,
      },
      {
        source: '/favicon.svg',
        headers: publicAssetHeaders,
      },
      {
        source: '/favicon.ico',
        headers: publicAssetHeaders,
      },
      {
        source: '/manifest.webmanifest',
        headers: publicAssetHeaders,
      },
    ]
  },
  async redirects() {
    return [
      { source: '/docs/kits', destination: '/components', permanent: true },
      { source: '/docs/kits/:slug', destination: '/docs/components/:slug', permanent: true },
      {
        source: '/docs/what-is-a-payload-kit',
        destination: '/docs/what-is-a-payload-component',
        permanent: true,
      },
      {
        source: '/docs/shadcn-vs-payload-kit',
        destination: '/docs/shadcn-vs-payload-components',
        permanent: true,
      },
    ]
  },
  reactStrictMode: true,
  turbopack: {
    root: process.cwd(),
  },
}

const withMDX = createMDX()
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

export default withNextIntl(withMDX(nextConfig))
