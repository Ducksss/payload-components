import Link from '@/i18n/Link'
import { useTranslations } from 'next-intl'

import { ArrowUpRight, ChevronDown } from 'lucide-react'

import { componentEntries } from '@/lib/site'

/** CSS-only accordion: native <details>, no client JS. */
export function Faq() {
  const t = useTranslations('FaqContent')
  const entries = [
    {
      answer: t('entries.one.answer', { count: componentEntries.length }),
      question: t('entries.one.question'),
    },
    {
      answer: t('entries.two.answer'),
      href: '/docs/payload-blocks',
      linkLabel: t('entries.two.link'),
      question: t('entries.two.question'),
    },
    { answer: t('entries.three.answer'), question: t('entries.three.question') },
    {
      answer: t('entries.four.answer'),
      href: '/docs/installation',
      linkLabel: t('entries.four.link'),
      question: t('entries.four.question'),
    },
    { answer: t('entries.five.answer'), question: t('entries.five.question') },
    { answer: t('entries.six.answer'), question: t('entries.six.question') },
    {
      answer: t('entries.seven.answer'),
      href: '/docs/shadcn-vs-payload-components',
      linkLabel: t('entries.seven.link'),
      question: t('entries.seven.question'),
    },
    { answer: t('entries.eight.answer'), question: t('entries.eight.question') },
  ]

  return (
    <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      {entries.map((entry) => (
        <details key={entry.question} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-base font-medium text-foreground transition-colors hover:bg-muted/40 [&::-webkit-details-marker]:hidden">
            {entry.question}
            <ChevronDown
              className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <p className="max-w-3xl px-6 pb-5 text-sm leading-7 text-muted-foreground">
            <span className="block">{entry.answer}</span>
            {entry.href ? (
              <Link
                href={entry.href}
                className="group mt-2 inline-flex items-center gap-1 font-medium text-foreground transition-colors hover:text-brand"
              >
                {entry.linkLabel}
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            ) : null}
          </p>
        </details>
      ))}
    </div>
  )
}
