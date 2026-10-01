import type { ReactNode } from 'react'

import { FumadocsRootProvider } from '@/components/site/FumadocsRootProvider'
import { SiteHeader } from '@/components/site/SiteHeader'
import { SiteFooter } from '@/components/site/SiteFooter'
import { TranslationNotice } from '@/components/site/TranslationNotice'
import { fumadocsI18nUI, getSiteLocale } from '@/lib/i18n'

import './blog.css'

export default async function BlogRootLayout({ children }: { children: ReactNode }) {
  const locale = await getSiteLocale()

  return (
    <FumadocsRootProvider
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
    </FumadocsRootProvider>
  )
}
