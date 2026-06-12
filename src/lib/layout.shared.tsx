import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'

import { githubRepoUrl } from '@/lib/site'

export function baseOptions(): BaseLayoutProps {
  return {
    githubUrl: githubRepoUrl,
    links: [
      {
        active: 'nested-url',
        text: 'Docs',
        url: '/docs',
      },
      {
        active: 'url',
        text: 'Kits',
        url: '/components',
      },
    ],
    nav: {
      // The brand header is the shared SiteHeader rendered above the docs
      // layout; the sidebar slot just labels the surface.
      title: (
        <span className="text-sm font-semibold tracking-tight text-foreground">Documentation</span>
      ),
      url: '/docs',
    },
  }
}
