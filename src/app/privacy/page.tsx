import type { Metadata } from 'next'

import { JsonLd } from '@/components/seo/JsonLd'
import { ConsentSettings } from '@/components/site/ConsentSettings'
import { Section, SectionHeading } from '@/components/site/section'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { feedMetadataAlternates } from '@/lib/site'
import { breadcrumbNode, graph } from '@/lib/structured-data'

const description =
  'What Payload Components measures, which third parties receive it, and how to change or withdraw your choice at any time.'

export const metadata: Metadata = {
  alternates: { canonical: '/privacy', ...feedMetadataAlternates },
  title: 'Privacy',
  description,
  openGraph: {
    description,
    title: 'Privacy — Payload Components',
    type: 'website',
    url: '/privacy',
  },
  twitter: {
    card: 'summary_large_image',
    description,
    title: 'Privacy — Payload Components',
  },
}

const privacyStructuredData = graph(
  breadcrumbNode([
    { name: 'Home', path: '/' },
    { name: 'Privacy', path: '/privacy' },
  ]),
)

/* Kept deliberately specific: naming the three processors and the exact event
   vocabulary is what makes the disclosure verifiable rather than boilerplate.
   The same vocabulary is pinned by tests/int/analytics-contract.int.spec.ts. */
const processors = [
  {
    name: 'Google Analytics 4',
    purpose: 'Aggregate page views and traffic sources.',
    storage: 'Sets its own first-party cookies (_ga, _ga_*).',
  },
  {
    name: 'Vercel Analytics & Speed Insights',
    purpose: 'Page views and Core Web Vitals for the hosted site.',
    storage: 'No cookies.',
  },
  {
    name: 'PostHog (US)',
    purpose: 'The three product events listed below.',
    storage: 'A random pc_distinct_id in localStorage, so repeat visits are one visitor.',
  },
] as const

const events = [
  {
    fields: 'page_path, source_path',
    name: '$pageview',
    when: 'A public route loads or changes.',
  },
  {
    fields: 'command, component, source_path',
    name: 'copy_install_command',
    when: 'You copy an install command.',
  },
  {
    fields: 'destination, href, source_path',
    name: 'primary_link_click',
    when: 'You follow a repository, docs, or components link.',
  },
] as const

export default function PrivacyPage() {
  return (
    <>
      <JsonLd data={privacyStructuredData} />
      <SiteHeader />
      <main className="flex-1">
        <Section>
          <SectionHeading
            accentWord="measure"
            eyebrow="Privacy"
            heading="Exactly what we measure."
            intro="Nothing loads until you accept. This page names every processor, every event, and every field — and lets you change your mind at any time."
          />
          <div className="mt-8 max-w-3xl space-y-10">
            <div className="space-y-3">
              <p className="text-muted-foreground">
                Nothing on this list loads until you accept. Decline and no analytics script
                is mounted, no cookie is set, and no identifier is stored. If your browser
                sends Global Privacy Control or Do Not Track, that is treated as a decline
                automatically and you are never shown the banner.
              </p>
              <p className="text-muted-foreground">
                There are no accounts on this site, so none of this is tied to an identity.
                We never collect form input, free text, or the contents of pages you view.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium text-foreground">Who receives data</h2>
              <ul className="space-y-3">
                {processors.map((processor) => (
                  <li
                    className="rounded-card border border-border bg-card p-4 shadow-card"
                    key={processor.name}
                  >
                    <p className="text-sm font-medium text-foreground">{processor.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{processor.purpose}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{processor.storage}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium text-foreground">The events we send</h2>
              <p className="text-muted-foreground">
                Three, and their fields are fixed. Every value comes from a committed route,
                link, or install command — never from anything you type.
              </p>
              <ul className="space-y-3">
                {events.map((event) => (
                  <li
                    className="rounded-card border border-border bg-card p-4 shadow-card"
                    key={event.name}
                  >
                    <p className="font-mono text-sm font-medium text-foreground">
                      {event.name}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">{event.when}</p>
                    <p className="mt-1 font-mono text-xs text-muted-foreground">
                      {event.fields}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium text-foreground">Your choice</h2>
              <p className="text-muted-foreground">
                Your decision is stored locally in your browser under{' '}
                <code className="font-mono text-sm text-foreground">pc_consent</code>. Change
                it here at any time — withdrawing takes effect immediately and stops further
                collection.
              </p>
              <ConsentSettings />
            </div>
          </div>
        </Section>
      </main>
      <SiteFooter />
    </>
  )
}
