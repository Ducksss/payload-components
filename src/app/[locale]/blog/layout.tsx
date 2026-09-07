import type { ReactNode } from 'react'

import { RootProvider } from 'fumadocs-ui/provider/next'

import { SiteHeader } from '@/components/site/SiteHeader'
import { SiteFooter } from '@/components/site/SiteFooter'
import { TranslationNotice } from '@/components/site/TranslationNotice'
import { fumadocsI18nUI, getSiteLocale } from '@/lib/i18n'

import './blog.css'

export default async function BlogRootLayout({ children }: { children: ReactNode }) {
  const locale = await getSiteLocale()

  return (
    <RootProvider
      i18n={fumadocsI18nUI.provider(locale)}
      search={{ enabled: false }}
      theme={{
        enabled: false,
      }}
    >
      <SiteHeader activePath="/blog" />
      <TranslationNotice pathname="/blog" />
      {children}
      <SiteFooter />
    </RootProvider>
  )
}
