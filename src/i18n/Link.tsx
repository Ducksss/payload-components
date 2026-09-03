import type { ComponentProps } from 'react'

import NextLink from 'next/link'
import { useLocale } from 'next-intl'

import { localizeHref, normalizeSiteLocale, type SiteLocale } from '@/i18n/config'

type LocalizedLinkProps = Omit<ComponentProps<typeof NextLink>, 'locale'> & {
  locale?: SiteLocale
}

/** Locale-aware replacement for next/link, with an explicit locale escape for
 * fallback notices that must lead to the canonical English resource. */
export default function LocalizedLink({
  href,
  locale: requestedLocale,
  ...props
}: LocalizedLinkProps) {
  const activeLocale = normalizeSiteLocale(useLocale())
  const locale = requestedLocale ?? activeLocale
  const localizedHref =
    typeof href === 'string'
      ? localizeHref(href, locale)
      : {
          ...href,
          pathname:
            typeof href.pathname === 'string' ? localizeHref(href.pathname, locale) : href.pathname,
        }

  return <NextLink href={localizedHref} {...props} />
}
