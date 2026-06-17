import { createMDX } from 'fumadocs-mdx/next'

const deployFreshHeaders = [
  {
    key: 'Cache-Control',
    value: 'public, max-age=0, stale-while-revalidate=30',
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  async headers() {
    return [
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

export default withMDX(nextConfig)
