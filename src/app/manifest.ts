import type { MetadataRoute } from 'next'

import { siteDescription } from '@/lib/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: '#ffffff',
    categories: ['developer', 'productivity'],
    description: siteDescription,
    display: 'standalone',
    icons: [
      { sizes: 'any', src: '/favicon.svg', type: 'image/svg+xml' },
      { sizes: '48x48', src: '/favicon.ico', type: 'image/x-icon' },
    ],
    name: 'Payload Kits',
    short_name: 'Payload Kits',
    start_url: '/',
    theme_color: '#ffffff',
  }
}
