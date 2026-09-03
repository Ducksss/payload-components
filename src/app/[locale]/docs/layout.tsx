import type { ReactNode } from 'react'

import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { RootProvider } from 'fumadocs-ui/provider/next'
import { ArrowUpRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { GitHubMark } from '@/components/site/GitHubMark'
import { DocsSearchDialog, DocsSearchFocusCapture } from '@/components/site/DocsSearchDialog'
import { SiteHeader } from '@/components/site/SiteHeader'
import { TranslationNotice } from '@/components/site/TranslationNotice'
import { baseOptions } from '@/lib/layout.shared'
import { fumadocsI18nUI, getSiteLocale } from '@/lib/i18n'
import { githubRepoUrl, cliVersion } from '@/lib/site'
import { getLocalizedPageTree } from '@/lib/source'

import './docs.css'

export default async function DocsRootLayout({ children }: { children: ReactNode }) {
  const locale = await getSiteLocale()
  const t = await getTranslations({ locale, namespace: 'Docs' })

  return (
    <RootProvider
      i18n={fumadocsI18nUI.provider(locale)}
      search={{ enabled: true, SearchDialog: DocsSearchDialog }}
      theme={{
        enabled: false,
      }}
    >
      <DocsSearchFocusCapture />
      <SiteHeader activePath="/docs" />
      <TranslationNotice pathname="/docs" />
      <DocsLayout
        {...baseOptions(locale, t('title'))}
        // Drop fumadocs' auto GitHub icon. Its footer row reserves space for the
        // theme toggle, which we disable — so the lone icon renders as an empty
        // bordered box that reads as broken. We render an explicit CTA below.
        githubUrl={undefined}
        tree={getLocalizedPageTree(locale)}
        themeSwitch={{ enabled: false }}
        sidebar={{
          banner: (
            <div
              key="docs-version-banner"
              className="rounded-lg border border-brand/25 bg-brand/10 px-3 py-2 font-mono text-[11px] font-medium text-brand"
            >
              {t('versionBanner', { version: cliVersion })}
            </div>
          ),
          defaultOpenLevel: 1,
          footer: (
            <a
              key="docs-github-cta"
              href={githubRepoUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2.5 rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand/40 hover:bg-brand/5"
            >
              <GitHubMark
                className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-brand"
                aria-hidden="true"
              />
              <span className="flex-1">{t('github')}</span>
              <ArrowUpRight
                className="size-3.5 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand"
                aria-hidden="true"
              />
            </a>
          ),
        }}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  )
}
