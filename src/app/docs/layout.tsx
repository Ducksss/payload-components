import type { ReactNode } from 'react'

import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { RootProvider } from 'fumadocs-ui/provider/next'

import { SiteHeader } from '@/components/site/SiteHeader'
import { baseOptions } from '@/lib/layout.shared'
import { source } from '@/lib/source'

import './docs.css'

export default function DocsRootLayout({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{ enabled: true }}
      theme={{
        enabled: false,
      }}
    >
      <SiteHeader activePath="/docs" />
      <DocsLayout
        {...baseOptions()}
        tree={source.getPageTree()}
        themeSwitch={{ enabled: false }}
        sidebar={{
          banner: (
            <div
              key="docs-alpha-banner"
              className="rounded-lg border border-brand/25 bg-brand/10 px-3 py-2 font-mono text-[11px] font-medium text-brand"
            >
              public alpha · components v0.1.0
            </div>
          ),
          defaultOpenLevel: 1,
        }}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  )
}
