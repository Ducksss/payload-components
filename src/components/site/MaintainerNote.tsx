import Link from '@/i18n/Link'
import { useTranslations } from 'next-intl'

import { ArrowUpRight } from 'lucide-react'

import { maintainerNote } from '@/lib/site'

/* The one real voice on the site — a signed note from the maintainer,
 * kept as the single dark card in the open-source close. Real install
 * stories replace placeholder slots only when they exist. */
export function MaintainerNote() {
  const t = useTranslations('Maintainer')

  return (
    <figure className="hover-lift flex flex-col justify-between gap-6 rounded-2xl bg-foreground p-7 text-background shadow-frame">
      <blockquote className="text-[15px] leading-7 text-background/85">{t('body')}</blockquote>
      <figcaption className="flex items-center justify-between gap-3 border-t border-background/10 pt-5">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-full bg-background/10 text-sm font-semibold text-background"
          >
            {maintainerNote.name.charAt(0).toUpperCase()}
          </span>
          <span>
            <span className="block text-sm font-semibold text-background">
              {maintainerNote.name}
            </span>
            <span className="block text-xs text-background/60">{t('role')}</span>
          </span>
        </div>
        <Link
          href={maintainerNote.href}
          target="_blank"
          rel="noreferrer"
          aria-label={t('github', { name: maintainerNote.name })}
          className="text-background/60 transition-colors hover:text-background"
        >
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </figcaption>
    </figure>
  )
}
