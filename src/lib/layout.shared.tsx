import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'

import { siteConfig } from '@/utilities/site'

export const baseOptions = (): BaseLayoutProps => ({
  githubUrl: siteConfig.githubUrl,
  links: [
    {
      text: 'Components',
      url: '/components',
    },
    {
      text: 'Registry',
      url: '/r/registry.json',
    },
  ],
  nav: {
    title: siteConfig.name,
    url: '/',
  },
  searchToggle: {
    enabled: false,
  },
  themeSwitch: {
    enabled: false,
  },
})
