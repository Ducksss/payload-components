import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { getTranslations } from 'next-intl/server'

import { JsonLd } from '@/components/seo/JsonLd'
import { ConsentSettings } from '@/components/site/ConsentSettings'
import { Section, SectionHeading } from '@/components/site/section'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { localeAlternates, localeDetails, localizeHref } from '@/i18n/config'
import { getSiteLocale } from '@/lib/i18n'
import { feedMetadataAlternates, siteOpenGraphDefaults } from '@/lib/site'
import { breadcrumbNode, graph } from '@/lib/structured-data'

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getSiteLocale()
  const t = await getTranslations({ locale, namespace: 'PageMetadata.privacy' })
  const canonical = localizeHref('/privacy', locale)

  return {
    alternates: { canonical, languages: localeAlternates('/privacy'), ...feedMetadataAlternates },
    title: t('title'),
    description: t('description'),
    openGraph: {
      ...siteOpenGraphDefaults,
      description: t('description'),
      locale: localeDetails[locale].openGraphLocale,
      title: t('openGraphTitle'),
      type: 'website',
      url: canonical,
    },
    twitter: {
      card: 'summary_large_image',
      description: t('description'),
      title: t('openGraphTitle'),
    },
  }
}

/* Kept deliberately specific: naming the three processors and the exact event
   vocabulary is what makes the disclosure verifiable rather than boilerplate.
   The same vocabulary is pinned by tests/int/analytics-contract.int.spec.ts.
   Names and field lists are identifiers, not copy — they stay untranslated and
   identical in every locale; only the prose around them moves to messages. */
const processors = [
  { id: 'vercel', name: 'Vercel Analytics & Speed Insights', needsConsent: false },
  { id: 'ga4', name: 'Google Analytics 4', needsConsent: true },
  { id: 'posthog', name: 'PostHog (US)', needsConsent: true },
] as const

const events = [
  {
    fields: 'page_path, source_path, traffic_source, verification_run',
    id: 'pageview',
    name: '$pageview',
    delivery: null,
  },
  {
    fields: 'command, component, source_path, entry_page',
    id: 'copyInstallCommand',
    name: 'copy_install_command',
    delivery: null,
  },
  {
    fields: 'destination, href, source_path, entry_page',
    id: 'primaryLinkClick',
    name: 'primary_link_click',
    delivery: null,
  },
  {
    fields: 'component, source_path',
    id: 'premiumComponentInterest',
    name: 'premium_component_interest',
    delivery: 'vercelOnly',
  },
] as const

const inlineCode = (chunks: ReactNode) => (
  <code className="font-mono text-sm text-foreground">{chunks}</code>
)

export default async function PrivacyPage() {
  const locale = await getSiteLocale()
  const t = await getTranslations({ locale, namespace: 'Privacy' })
  const privacyStructuredData = graph(
    breadcrumbNode([
      { name: locale === 'zh' ? '首页' : 'Home', path: localizeHref('/', locale) },
      { name: locale === 'zh' ? '隐私' : 'Privacy', path: localizeHref('/privacy', locale) },
    ]),
  )

  return (
    <>
      <JsonLd data={privacyStructuredData} />
      <SiteHeader />
      <main id="main" className="flex-1">
        <Section>
          <SectionHeading
            accentWord={t('accentWord')}
            eyebrow={t('eyebrow')}
            heading={t('heading')}
            intro={t('intro')}
          />
          <div className="mt-8 max-w-3xl space-y-10">
            <div className="space-y-3">
              <p className="text-muted-foreground">{t('consent')}</p>
              <p className="text-muted-foreground">{t('alwaysOnProcessors')}</p>
              <p className="text-muted-foreground">{t('noAccounts')}</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium text-foreground">{t('processorsTitle')}</h2>
              <ul className="space-y-3">
                {processors.map((processor) => (
                  <li
                    className="rounded-card border border-border bg-card p-4 shadow-card"
                    key={processor.name}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{processor.name}</p>
                      <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                        {processor.needsConsent ? t('needsConsent') : t('alwaysOn')}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t(`processors.${processor.id}.purpose`)}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t(`processors.${processor.id}.storage`)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium text-foreground">{t('eventsTitle')}</h2>
              <p className="text-muted-foreground">{t('eventsIntro')}</p>
              <p className="text-muted-foreground">{t('trafficSource')}</p>
              <p className="text-muted-foreground">{t.rich('entryPage', { code: inlineCode })}</p>
              <ul className="space-y-3">
                {events.map((event) => (
                  <li
                    className="rounded-card border border-border bg-card p-4 shadow-card"
                    key={event.name}
                  >
                    <p className="font-mono text-sm font-medium text-foreground">{event.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {t(`events.${event.id}.when`)}
                    </p>
                    {event.delivery ? (
                      <p className="mt-1 text-sm font-medium text-foreground">
                        {t(`events.${event.id}.delivery`)}
                      </p>
                    ) : null}
                    <p className="mt-1 font-mono text-xs text-muted-foreground">{event.fields}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium text-foreground">{t('choiceTitle')}</h2>
              <p className="text-muted-foreground">{t.rich('choice', { code: inlineCode })}</p>
              <ConsentSettings />
            </div>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  )
}
