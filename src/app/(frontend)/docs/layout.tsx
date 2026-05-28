import type { ReactNode } from 'react'

import { DocsLayout } from 'fumadocs-ui/layouts/docs'

import { baseOptions } from '@/lib/layout.shared'
import { source } from '@/lib/source'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      {...baseOptions()}
      sidebar={{
        defaultOpenLevel: 1,
        prefetch: false,
      }}
      tree={source.getPageTree()}
    >
      {children}
    </DocsLayout>
  )
}
