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

/* Enforced rather than report-only: the site is backend-free, so a report-to
 * collector has nowhere to live, and reports that only reach a visitor's console
 * cannot inform a rollout. tests/e2e/content-security-policy.e2e.spec.ts is the
 * feedback loop instead: it fails on any violation across the site's surfaces,
 * with analytics consent declined and accepted.
 *
 * Script elements keep 'unsafe-inline' because Next streams build-specific
 * inline RSC payload scripts into every static page. Hashes would have to be
 * listed per route and would change on every deploy, and nonces would force
 * dynamic rendering. JSON-LD blocks are data, not script, so they need no
 * allowance. script-src-attr 'none' still refuses inline event-handler
 * attributes, which React never renders.
 *
 * Frames are same-origin only: the component and template previews. The Embed
 * Basic catalog demo is a faux player, so no third-party frame ever loads. The
 * third-party origins are the consent-gated GA4 tag and PostHog capture; Vercel
 * Analytics and Speed Insights are same-origin outside development. */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval' https://va.vercel-scripts.com" : ''} https://www.googletagmanager.com`,
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.google-analytics.com https://*.googletagmanager.com",
  "font-src 'self' data:",
  `connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com${postHogOrigin ? ` ${postHogOrigin}` : ''}`,
  "frame-src 'self'",
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
    // CSP2+ browsers ignore this in favour of frame-ancestors 'self'; it gives
    // older ones the same same-origin rule, so the previews frame in both.
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
