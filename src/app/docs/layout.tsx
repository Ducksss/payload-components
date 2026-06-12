import type { ReactNode } from 'react'

import { DocsLayout } from 'fumadocs-ui/layouts/docs'

import { SiteHeader } from '@/components/site/SiteHeader'
import { baseOptions } from '@/lib/layout.shared'
import { source } from '@/lib/source'

export default function DocsRootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <DocsLayout
        {...baseOptions()}
        tree={source.getPageTree()}
        themeSwitch={{ enabled: false }}
        sidebar={{
          banner: (
            <div className="rounded-lg border border-brand/25 bg-brand/10 px-3 py-2 font-mono text-[11px] font-medium text-brand">
              public alpha · kits v0.1.0
            </div>
          ),
          defaultOpenLevel: 1,
        }}
      >
        {children}
      </DocsLayout>
    </>
  )
}
