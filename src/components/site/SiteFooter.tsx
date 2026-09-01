import Link from '@/i18n/Link'
import { useTranslations } from 'next-intl'

import { ArrowUpRight } from 'lucide-react'

import { GitHubMark } from '@/components/site/GitHubMark'
import { Wordmark } from '@/components/site/Wordmark'
import { componentEntries, footerColumns, githubRepoUrl, primaryInstallCommand } from '@/lib/site'

export function SiteFooter() {
  const t = useTranslations('Footer')
  const categoryT = useTranslations('CatalogBrowser.categories')
  const productLabels: Record<string, string> = {
    '/components': t('componentCatalog'),
    '/templates': t('templateConcepts'),
    '/docs': t('documentation'),
    '/docs/installation': t('installWorkflow'),
    '/docs/architecture': t('architecture'),
    '/docs/ai-discovery': t('aiDiscovery'),
  }
  const projectLabels: Record<string, string> = {
    About: t('about'),
    'Brand Guide': t('brandGuide'),
    'Open an issue': t('openIssue'),
    Releases: t('releases'),
    'Updates feed': t('updates'),
    Contributing: t('contributing'),
    Privacy: t('privacy'),
    'Registry JSON': t('registry'),
  }

  return (
    <footer className="border-t border-border bg-muted/40">
      {/* Quiet emerald hairline tying the footer to the brand accent. */}
      <div
        aria-hidden="true"
        className="h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent"
      />
      <div className="container py-14 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2.4fr]">
          <div>
            <Link href="/" aria-label={t('home')} className="inline-block">
              <Wordmark withBadge />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">{t('intro')}</p>
            <div className="mt-6 flex w-fit items-center gap-2.5 rounded-md border border-border bg-background px-3 py-2 font-mono text-xs">
              <span aria-hidden="true" className="font-semibold text-brand">
                &gt;
              </span>
              <code className="text-muted-foreground">{primaryInstallCommand}</code>
            </div>
            <Link
              href={githubRepoUrl}
              rel="noreferrer"
              target="_blank"
              className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <GitHubMark className="size-4" aria-hidden="true" />
              GitHub
              <ArrowUpRight className="size-3 text-muted-foreground/70" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerColumns.map((column, columnIndex) => (
              <div key={column.title}>
                <h3 className="font-mono text-[11px] font-medium uppercase tracking-eyebrow text-muted-foreground">
                  {columnIndex === 0
                    ? t('product')
                    : columnIndex === 1
                      ? t('components')
                      : t('project')}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => {
                    const external = 'external' in link && link.external
                    const accent = 'accent' in link && link.accent
                    const className = accent
                      ? 'group inline-flex items-center gap-1 text-sm font-medium text-brand transition-colors hover:text-brand/80'
                      : 'inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground'
                    const category = new URL(
                      link.href,
                      'https://payload-components.invalid',
                    ).searchParams.get('category')
                    const label =
                      columnIndex === 0
                        ? (productLabels[link.href] ?? link.label)
                        : columnIndex === 1
                          ? category
                            ? categoryT(category)
                            : t('allComponents', { count: componentEntries.length })
                          : (projectLabels[link.label] ?? link.label)
                    const content = (
                      <>
                        {label}
                        {external ? (
                          <ArrowUpRight
                            className="size-3 text-muted-foreground/70"
                            aria-hidden="true"
                          />
                        ) : null}
                        {accent ? (
                          <ArrowUpRight
                            className="size-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            aria-hidden="true"
                          />
                        ) : null}
                      </>
                    )

                    return (
                      <li key={link.label}>
                        {external ? (
                          <a
                            href={link.href}
                            rel="noreferrer"
                            target="_blank"
                            className={className}
                          >
                            {content}
                          </a>
                        ) : (
                          <Link href={link.href} className={className}>
                            {content}
                          </Link>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">{t('license')}</p>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {t('stack')}
          </p>
        </div>
      </div>
    </footer>
  )
}
