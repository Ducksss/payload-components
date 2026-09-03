import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'

import { localizeHref, type SiteLocale } from '@/i18n/config'
import { githubRepoUrl } from '@/lib/site'

export function baseOptions(
  locale: SiteLocale = 'en',
  documentationLabel = 'Documentation',
): BaseLayoutProps {
  return {
    githubUrl: githubRepoUrl,
    nav: {
      // The brand header is the shared SiteHeader rendered above the docs
      // layout; the sidebar slot just labels the surface.
      title: (
        <span className="text-sm font-semibold tracking-tight text-foreground">
          {documentationLabel}
        </span>
      ),
      url: localizeHref('/docs', locale),
    },
  }
}
