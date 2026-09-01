import Link from '@/i18n/Link'
import { useLocale, useTranslations } from 'next-intl'

import { ArrowRight } from 'lucide-react'

import { CatalogFamilyTeaser } from '@/components/site/CatalogFamilyTeaser'
import { ComponentSpecimen } from '@/components/site/ComponentSpecimen'
import { Reveal } from '@/components/site/motion/Reveal'
import { Section, SectionHeading } from '@/components/site/section'
import { localizeHref, normalizeSiteLocale } from '@/i18n/config'
import { landingSections } from '@/lib/site'

/* The catalog — the real components rendered live (specimen first, dense
 * index second), no screenshots. */
export function CatalogSection() {
  const locale = normalizeSiteLocale(useLocale())
  const t = useTranslations('Landing.catalog')

  return (
    <Section id={landingSections.components.id} className="bg-muted/40">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <SectionHeading
          accentWord="live"
          eyebrow={t('eyebrow')}
          heading={t('heading')}
          intro={t('intro')}
        />
        <Link
          href={localizeHref('/components', locale)}
          className="inline-flex h-10 w-fit shrink-0 items-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          {t('browse')}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <Reveal className="mt-12">
        <ComponentSpecimen />
      </Reveal>

      <Reveal className="mt-12">
        <CatalogFamilyTeaser />
      </Reveal>
    </Section>
  )
}
