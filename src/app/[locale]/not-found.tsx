import Link from '@/i18n/Link'

import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

import { SiteHeader } from '@/components/site/SiteHeader'
import { Terminal } from '@/components/site/Terminal'
import { localizeHref } from '@/i18n/config'
import { getSiteLocale } from '@/lib/i18n'
import { componentEntries } from '@/lib/site'

const notFoundLines = [
  { kind: 'command', text: 'payload-components add this-page' },
  { kind: 'info', text: 'payload-components: Unknown component "this-page".' },
  {
    kind: 'info',
    text: `Known components: ${componentEntries.map((component) => component.slug).join(', ')}.`,
  },
] as const

export default async function NotFoundPage() {
  const locale = await getSiteLocale()
  const t = await getTranslations({ locale, namespace: 'NotFound' })

  return (
    <>
      <SiteHeader />
      <main id="main" className="relative flex flex-1 items-center overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-dots [mask-image:radial-gradient(34rem_24rem_at_50%_40%,black,transparent)]"
        />
        <div className="container relative max-w-xl py-20 text-center">
          <p className="font-mono text-xs uppercase tracking-eyebrow text-muted-foreground">
            {t('eyebrow')}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">{t('description')}</p>

          <Terminal className="mt-8 text-left" lines={notFoundLines} title={t('terminalTitle')} />

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={localizeHref('/', locale)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t('home')}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <Link
              href={localizeHref('/docs', locale)}
              className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              {t('docs')}
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
