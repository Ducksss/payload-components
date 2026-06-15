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
  reactStrictMode: true,
  turbopack: {
    root: process.cwd(),
  },
}

const withMDX = createMDX()

export default withMDX(nextConfig)
