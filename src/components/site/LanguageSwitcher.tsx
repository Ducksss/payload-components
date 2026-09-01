'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { Languages } from 'lucide-react'

import {
  localeDetails,
  localizeHref,
  normalizeSiteLocale,
  siteLocales,
  type SiteLocale,
} from '@/i18n/config'
import { cn } from '@/utilities/ui'

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = normalizeSiteLocale(useLocale())
  const pathname = usePathname()
  const t = useTranslations('Header')

  const changeLocale = (nextLocale: SiteLocale) => {
    const destination = localizeHref(pathname || '/', nextLocale)
    const suffix =
      typeof window === 'undefined' ? '' : `${window.location.search}${window.location.hash}`

    window.location.assign(new URL(`${destination}${suffix}`, window.location.origin))
  }

  return (
    <label
      className={cn(
        'flex h-8 items-center gap-1.5 rounded-md border border-border bg-background pl-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
        className,
      )}
    >
      <Languages className="size-3.5 shrink-0" aria-hidden="true" />
      <span className="sr-only">{t('language')}</span>
      <select
        aria-label={t('language')}
        className="h-full min-w-0 cursor-pointer appearance-none bg-transparent py-0 pl-0 pr-2 text-xs font-medium text-foreground outline-none"
        onChange={(event) => changeLocale(event.target.value as SiteLocale)}
        value={locale}
      >
        {siteLocales.map((item) => (
          <option key={item} value={item}>
            {localeDetails[item].label}
          </option>
        ))}
      </select>
    </label>
  )
}
