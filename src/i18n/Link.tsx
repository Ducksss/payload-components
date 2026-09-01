import type { ComponentProps } from 'react'

import NextLink from 'next/link'
import { useLocale } from 'next-intl'

import { localizeHref, normalizeSiteLocale } from '@/i18n/config'

type LocalizedLinkProps = ComponentProps<typeof NextLink>

/**
 * Locale-aware replacement for next/link. Registry assets and external URLs
 * remain language-neutral; public site routes retain the visitor's locale.
 */
export default function LocalizedLink({ href, ...props }: LocalizedLinkProps) {
  const locale = normalizeSiteLocale(useLocale())
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
