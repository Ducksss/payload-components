import type { Metadata } from 'next'

import Link from '@/i18n/Link'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'

import { ArrowLeft } from 'lucide-react'

import { JsonLd } from '@/components/seo/JsonLd'
import { RunnableCommand } from '@/components/site/RunnableCommand'
import { Section, SectionHeading } from '@/components/site/section'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { TranslationNotice } from '@/components/site/TranslationNotice'
import { TemplateDetailView } from '@/components/site/templates/TemplateAnalytics'
import { TemplateContribution } from '@/components/site/templates/TemplateContribution'
import { TemplateDetailPreview } from '@/components/site/templates/TemplateDetailPreview'
import { TemplatePagesGrid } from '@/components/site/templates/TemplatePagesGrid'
import { TemplateRecipe } from '@/components/site/templates/TemplateRecipe'
import { TemplateReveal } from '@/components/site/templates/TemplateReveal'
import { TemplateVisualSystem } from '@/components/site/templates/TemplateVisualSystem'
import { localeDetails, localizeHref } from '@/i18n/config'
import { getPublication, publicationRobots } from '@/i18n/publication'
import { getSiteLocale } from '@/lib/i18n'
import {
  siteUrl,
  templatesContribution,
  templatesRecipeIntro,
  siteOpenGraphDefaults,
} from '@/lib/site'
import {
  getTemplateShowcase,
  templateDetailHref,
  templateShowcases,
  templateStarterBlockSlug,
  templateStarterInstallCommand,
  uniqueTemplateBlockSlugs,
} from '@/lib/templates/registry'
import { breadcrumbNode, graph } from '@/lib/structured-data'

/* /templates/[slug] detail — the indexable editorial page for one full-site
 * concept. Contract: canonical, one H1, concept status + disclosure impossible
 * to miss, exactly one iframe (TemplateDetailPreview), pages-included posters,
 * the ordered block recipe linking every chip to /docs/components/<slug>, the
 * visual-system summary, one recipe-derived block install action, public
 * contribution links, 404 on unknown slugs.
 *
 * Motion here is deliberately quieter than the gallery: below-fold section
 * CONTENT rises once via TemplateReveal (never the <Section> itself — a
 * translated full-bleed band would slide its own background), the hero and the
 * live preview never animate because they are the page's first frame, and the
 * concept disclosure never animates at all — an honesty notice must not be
 * gated behind a scroll position or a hydrated animation. */

export function generateStaticParams() {
  return templateShowcases.map((template) => ({ slug: template.slug }))
}

type DetailParams = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: DetailParams }): Promise<Metadata> {
  const { slug } = await params
  const locale = await getSiteLocale()
  const template = getTemplateShowcase(slug)
  if (!template) return {}
  const publication = getPublication(templateDetailHref(template.slug), locale)
  const t = await getTranslations({
    locale: publication.contentLocale,
    namespace: 'Templates',
  })

  const title = t('detailTitle', { title: template.title })

  return {
    alternates: {
      canonical: publication.canonical,
      languages: publication.alternates,
    },
    description: template.summary,
    openGraph: {
      ...siteOpenGraphDefaults,
      description: template.summary,
      locale: localeDetails[publication.contentLocale].openGraphLocale,
      title,
      type: 'website',
      url: publication.canonical,
    },
    robots: publicationRobots(publication),
    title,
    twitter: {
      card: 'summary_large_image',
      description: template.summary,
      title,
    },
  }
}

export default async function TemplateDetailPage({ params }: { params: DetailParams }) {
  const { slug } = await params
  const locale = await getSiteLocale()
  const t = await getTranslations({ locale, namespace: 'Templates' })
  const commonT = await getTranslations({ locale, namespace: 'Common' })
  const template = getTemplateShowcase(slug)
  if (!template) notFound()
  const publication = getPublication(templateDetailHref(template.slug), locale)

  const blockCount = uniqueTemplateBlockSlugs(template).length
  const starterBlockSlug = templateStarterBlockSlug(template)
  const starterInstallCommand = templateStarterInstallCommand(template)
  const structuredData = graph(
    breadcrumbNode([
      { name: commonT('home'), path: localizeHref('/', locale) },
      { name: t('back'), path: localizeHref('/templates', locale) },
      {
        name: template.title,
        path: publication.canonical,
      },
    ]),
    {
      '@id': `${siteUrl}${publication.canonical}#template`,
      '@type': 'WebPage',
      description: template.summary,
      inLanguage: localeDetails[publication.contentLocale].htmlLang,
      name: t('detailTitle', { title: template.title }),
      url: `${siteUrl}${publication.canonical}`,
    },
  )

  return (
    <>
      <JsonLd data={structuredData} />
      <SiteHeader activePath="/templates" />
      <TranslationNotice pathname={templateDetailHref(template.slug)} />
      <TemplateDetailView revision={template.revision} template={template.slug} />

      <main id="main" className="flex-1">
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-dots [mask-image:linear-gradient(to_bottom,black,transparent_92%)]"
          />
          <div className="container relative flex flex-col gap-5 py-10 sm:py-14">
            <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-eyebrow">
              <Link
                href="/templates"
                className="inline-flex items-center gap-1.5 rounded-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
              >
                <ArrowLeft className="size-3.5" aria-hidden="true" />
                {t('back')}
              </Link>
              <span aria-hidden="true" className="text-muted-foreground/50">
                /
              </span>
              <span className="text-brand">{t(`categories.${template.category}`)}</span>
              <span className="ml-1 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-brand">
                {t('status')}
              </span>
            </div>

            <div className="max-w-3xl">
              <h1 className="text-balance text-4xl font-medium tracking-display text-foreground sm:text-5xl">
                {template.title}
              </h1>
              <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                {template.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <ul className="flex flex-wrap items-center gap-1.5" aria-label="Visual tone">
                {template.visualTone.map((tone) => (
                  <li
                    key={tone}
                    className="rounded-full border border-border bg-background/85 px-2.5 py-0.5 text-xs text-muted-foreground"
                  >
                    {tone}
                  </li>
                ))}
              </ul>
              <p className="font-mono text-xs text-muted-foreground sm:ml-2">
                {template.pages.length} pages · {blockCount} unique blocks
              </p>
            </div>

            <div className="mt-2 max-w-3xl rounded-card border border-border bg-background/90 p-4 shadow-card sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-5">
              <div className="max-w-lg">
                <p className="font-mono text-[11px] font-medium uppercase tracking-eyebrow text-brand">
                  Try one real block
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  This installs only{' '}
                  <code className="font-mono text-foreground">{starterBlockSlug}</code>, the first
                  block in the Home recipe. The full-site concept remains a browsable reference.
                </p>
              </div>
              <div className="mt-4 shrink-0 sm:mt-0">
                <RunnableCommand
                  command={starterInstallCommand}
                  emphasis="primary"
                  label={`Copy the ${starterBlockSlug} install command`}
                  trackInstall
                />
              </div>
            </div>
          </div>
        </section>

        <section aria-label={`${template.title} live preview`}>
          <div className="container py-10 sm:py-12">
            <TemplateDetailPreview template={template} />
          </div>
        </section>

        <Section containerClassName="py-12 sm:py-14 lg:py-16">
          <TemplateReveal>
            <SectionHeading
              eyebrow="Pages"
              heading="Every page in the concept"
              accentWord="concept"
              intro={`${template.title} spans ${template.pages.length} pages. Each poster opens that page in the raw full preview — the same route the live frame above renders.`}
            />
          </TemplateReveal>
          <TemplateReveal className="mt-10" delay={0.06}>
            <TemplatePagesGrid template={template} />
          </TemplateReveal>
        </Section>

        <Section className="bg-muted/40" containerClassName="py-12 sm:py-14 lg:py-16">
          <TemplateReveal>
            <SectionHeading
              eyebrow="Recipe"
              heading="The block recipe, page by page"
              accentWord="recipe"
              intro={templatesRecipeIntro}
            />
          </TemplateReveal>
          <TemplateReveal className="mt-10" delay={0.06}>
            <TemplateRecipe template={template} />
          </TemplateReveal>
        </Section>

        <Section containerClassName="py-12 sm:py-14 lg:py-16">
          <TemplateReveal>
            <SectionHeading
              eyebrow="Visual system"
              heading="One theme, carried across every block"
              accentWord="theme"
            />
          </TemplateReveal>
          <div className="mt-10">
            <TemplateVisualSystem template={template} />
          </div>
        </Section>

        <Section className="bg-muted/40" containerClassName="py-12 sm:py-14 lg:py-16">
          <div className="mb-10 flex max-w-2xl flex-col gap-3 rounded-card border border-border bg-background/85 p-4 sm:flex-row sm:items-start sm:gap-4">
            <span className="w-fit shrink-0 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-eyebrow text-brand">
              {t('status')}
            </span>
            <p className="text-sm leading-6 text-muted-foreground">{t('disclosure')}</p>
          </div>

          <TemplateReveal>
            <SectionHeading
              accentWord="open"
              eyebrow="Community"
              heading={templatesContribution.heading}
              intro={templatesContribution.intro}
            />
          </TemplateReveal>
          <TemplateReveal className="mt-10" delay={0.06}>
            <TemplateContribution
              revision={template.revision}
              source="detail"
              template={template.slug}
            />
          </TemplateReveal>
        </Section>
      </main>

      <SiteFooter />
    </>
  )
}
