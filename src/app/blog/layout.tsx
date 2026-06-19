import type { ReactNode } from 'react'

import { RootProvider } from 'fumadocs-ui/provider/next'

import { SiteHeader } from '@/components/site/SiteHeader'

import './blog.css'

export default function BlogRootLayout({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{ enabled: false }}
      theme={{
        enabled: false,
      }}
    >
      <SiteHeader activePath="/blog" />
      {children}
    </RootProvider>
  )
}
