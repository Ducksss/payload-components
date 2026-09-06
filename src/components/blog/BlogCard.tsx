import Image from 'next/image'
import Link from '@/i18n/Link'
import { useLocale, useTranslations } from 'next-intl'

import type { BlogPage } from '@/lib/blog'
import { localeDetails, normalizeSiteLocale } from '@/i18n/config'

type BlogCardProps = {
  compact?: boolean
  headingLevel?: 2 | 3
  page: BlogPage
  priority?: boolean
}

export function BlogCard({
  compact = false,
  headingLevel = 2,
  page,
  priority = false,
}: BlogCardProps) {
  const locale = useLocale()
  const t = useTranslations('Blog')
  const Heading = headingLevel === 2 ? 'h2' : 'h3'

  return (
    <Link
      href={page.url}
      data-blog-card
      data-blog-series={page.data.series}
      className="group flex min-w-0 flex-col overflow-hidden rounded-card border border-border bg-card shadow-[var(--shadow-card)] transition duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-[var(--shadow-frame)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
    >
      <div className="relative aspect-[40/21] overflow-hidden border-b border-border bg-muted">
        <Image
          alt=""
          className="object-cover transition duration-300 group-hover:scale-[1.015]"
          fill
          priority={priority}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 100vw"
          src={page.data.cover.src}
        />
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium uppercase tracking-micro text-muted-foreground">
          <span className="rounded-full border border-brand/20 bg-brand-50 px-2.5 py-1 text-brand-600">
            {t(`series.${page.data.series}`)}
          </span>
          <time dateTime={new Date(page.data.date).toISOString()}>
            {new Date(page.data.date).toLocaleDateString(
              localeDetails[normalizeSiteLocale(locale)].htmlLang,
              {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              },
            )}
          </time>
        </div>

        <Heading className="mt-4 text-xl font-semibold leading-tight tracking-heading text-foreground transition-colors group-hover:text-brand-600">
          {page.data.title}
        </Heading>
        {!compact && page.data.description ? (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {page.data.description}
          </p>
        ) : null}

        {!compact ? (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-5" aria-label={t('tags')}>
            {page.data.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-muted px-2 py-1 font-mono text-[10px] text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  )
}
