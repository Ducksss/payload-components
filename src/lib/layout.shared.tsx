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
      title: 'Payload Kits',
      url: '/',
    },
  }
}
