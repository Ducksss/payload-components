import { useLocale, useTranslations } from 'next-intl'

import Link from '@/i18n/Link'
import { normalizeSiteLocale } from '@/i18n/config'
import { getPublication } from '@/i18n/publication'
import { cn } from '@/utilities/ui'

export function TranslationNotice({
  className,
  pathname,
}: {
  className?: string
  pathname: string
}) {
  const locale = normalizeSiteLocale(useLocale())
  const t = useTranslations('TranslationNotice')
  const publication = getPublication(pathname, locale)

  if (publication.status === 'source' || publication.status === 'reviewed') return null

  return (
    <aside
      aria-label={t('label')}
      className={cn('border-b border-brand/20 bg-brand-50 text-foreground', className)}
      data-translation-status={publication.status}
    >
      <div className="container flex min-h-11 flex-wrap items-center justify-center gap-x-3 gap-y-1 py-2 text-center text-xs leading-5 sm:text-sm">
        <span>{t(publication.status)}</span>
        {publication.status === 'fallback' ? (
          <Link
            className="font-medium underline decoration-brand/40 underline-offset-4 hover:decoration-brand"
            href={publication.canonical}
            locale="en"
          >
            {t('viewEnglish')}
          </Link>
        ) : null}
      </div>
    </aside>
  )
}
