'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { ArrowRight, Languages } from 'lucide-react'
import { useRef } from 'react'

import { localeDetails, normalizeSiteLocale, siteLocales } from '@/i18n/config'
import { cn } from '@/utilities/ui'

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = normalizeSiteLocale(useLocale())
  const pathname = usePathname()
  const t = useTranslations('Header')
  const returnTo = useRef<HTMLInputElement>(null)

  const preserveLocationSuffix = () => {
    if (returnTo.current) {
      returnTo.current.value = `${pathname || '/'}${window.location.search}${window.location.hash}`
    }
  }

  return (
    <form
      action="/locale"
      className={cn(
        'flex h-8 min-w-0 items-stretch overflow-hidden rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background',
        className,
      )}
      method="get"
      noValidate
      onSubmit={preserveLocationSuffix}
    >
      <input ref={returnTo} type="hidden" name="returnTo" value={pathname || '/'} readOnly />
      <label className="flex min-w-0 items-center gap-1.5 ps-2">
        <Languages className="size-3.5 shrink-0" aria-hidden="true" />
        <span className="sr-only">{t('language')}</span>
        {/* Select/Listbox ownership is intentionally native: the OS popup, keyboard
            model, zoom behavior, and per-option language direction are preferable
            to duplicating a 22-language listbox in site JavaScript. */}
        <select
          aria-label={t('language')}
          className="h-full min-w-0 max-w-28 cursor-pointer appearance-none bg-transparent py-0 pe-2 ps-0 text-xs font-medium text-foreground outline-none"
          name="locale"
          onChange={(event) => {
            preserveLocationSuffix()
            event.currentTarget.form?.requestSubmit()
          }}
          value={locale}
        >
          {siteLocales.map((item) => (
            <option
              key={item}
              value={item}
              dir={localeDetails[item].direction}
              lang={localeDetails[item].htmlLang}
            >
              {localeDetails[item].label}
            </option>
          ))}
        </select>
      </label>
      <button
        aria-label={t('language')}
        className="grid w-8 shrink-0 place-items-center border-s border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        type="submit"
      >
        <ArrowRight className="size-3.5 rtl:rotate-180" aria-hidden="true" />
      </button>
    </form>
  )
}
