import Link from '@/i18n/Link'
import { useLocale, useTranslations } from 'next-intl'

import { ArrowRight, Sparkles } from 'lucide-react'

import { GitHubMark } from '@/components/site/GitHubMark'
import { ComponentWall } from '@/components/site/graphics/ComponentWall'
import { DatasheetPinout } from '@/components/site/graphics/DatasheetPinout'
import { InstallCommand } from '@/components/site/InstallCommand'
import { localizeHref, normalizeSiteLocale } from '@/i18n/config'
import { heroDatasheet } from '@/lib/datasheet'
import {
  componentEntries,
  githubRepoUrl,
  heroGuideLink,
  heroTertiaryLinks,
  primaryInstallCommand,
} from '@/lib/site'

/* Hero — the first page of a datasheet. A document strip names the part; the
 * claim is set in condensed Archivo beside the drawing it makes: hero-basic as
 * a ten-pin part, its real fields in and the five files an install writes out.
 * The install command sits above the fold, and the catalog itself follows as
 * proof: three drifting rows of backend-free component specimens, rendered on
 * the component tokens rather than the site's (see .preview-scope).
 *
 * The headline, lead and command are LCP candidates on some viewport, so they
 * rise without fading (.hero-rise): text painted at opacity 0 is never
 * counted, and a fade only repaints on a late font swap.
 *
 * Stays a server component; only the copy button and the wall's drift are
 * client-side. */
export function HeroSection() {
  const locale = normalizeSiteLocale(useLocale())
  const t = useTranslations('Landing.hero')
  const [browseLink] = heroTertiaryLinks

  return (
    <section className="hero-shell overflow-hidden border-b border-border/60">
      {/* The document strip: what this sheet is, and which part it draws. The
          part line is identifiers only (number, version, licence), and names
          the drawing below, which is decorative — so it is hidden with it. */}
      <div className="border-b border-border">
        <div className="ds-label container flex h-9 items-center justify-between gap-6 text-muted-foreground">
          <span className="truncate">{t('eyebrow')}</span>
          <span aria-hidden="true" className="hidden shrink-0 sm:inline">
            {heroDatasheet.part} · Rev {heroDatasheet.version} · {heroDatasheet.license}
          </span>
        </div>
      </div>

      <div className="container relative pt-10 sm:pt-14 lg:pt-16">
        <div className="grid items-center gap-10 sm:gap-12 xl:grid-cols-[minmax(0,36rem)_minmax(0,1fr)] xl:gap-14">
          <div className="relative z-10 flex flex-col items-start">
            <h1
              className="hero-headline hero-rise ds-display text-balance text-[clamp(3.25rem,14.6vw,5.5rem)] text-foreground"
              style={{ animationDelay: '0ms' }}
            >
              {t('primary')} {t('accent')}
            </h1>

            <p
              className="hero-rise mt-6 max-w-[31em] text-pretty text-[1.0625rem] leading-relaxed text-muted-foreground sm:text-lg"
              style={{ animationDelay: '60ms' }}
            >
              {t('subheadline')}
            </p>

            {/* The command itself, above the fold — first Copy button on the
                page (the e2e copy assertion targets it). Rises rather than
                fades: an opacity ramp would composite the filled button toward
                the page and fail contrast mid-animation. */}
            <InstallCommand
              className="hero-rise mt-8 max-w-[36rem]"
              command={primaryInstallCommand}
              label={t('copy')}
              style={{ animationDelay: '110ms' }}
            />

            {/* Rises without fading too: axe samples the page mid-entrance,
                and a fading row reads as low-contrast text. */}
            <div
              className="hero-rise mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.9375rem]"
              style={{ animationDelay: '150ms' }}
            >
              <Link
                href={localizeHref(heroGuideLink.href, locale)}
                data-cta-level="tertiary"
                className="group inline-flex items-center gap-2 font-semibold text-foreground transition-colors hover:text-brand"
              >
                {t('guide')}
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none rtl:rotate-180"
                  aria-hidden="true"
                />
              </Link>
              <a
                href={githubRepoUrl}
                target="_blank"
                rel="noreferrer"
                data-cta-level="tertiary"
                className="inline-flex items-center gap-2 font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <GitHubMark className="size-4" aria-hidden="true" />
                {t('github')}
              </a>
              <Link
                href={localizeHref(browseLink.href, locale)}
                data-cta-level="tertiary"
                className="inline-flex items-center gap-2 font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <Sparkles className="size-4" aria-hidden="true" />
                {t('browse')}
              </Link>
            </div>
          </div>

          <DatasheetPinout className="mx-auto w-full max-w-[26rem] md:max-w-[49rem] xl:-me-6 xl:max-w-none" />
        </div>
      </div>

      {/* Full-bleed: the wall runs past the container edges so the rows read as
          a surface passing behind the page. It owns its own edge mask, so no
          overlay is stacked on top of it here. */}
      <div className="relative mt-14 overflow-hidden sm:mt-16 lg:mt-20">
        <ComponentWall />
      </div>

      {/* The wall is decorative; this line carries the same fact in text, and
          is the only place the catalog size is stated on the landing page. */}
      <div className="container relative pb-16 pt-2 text-center sm:pb-20">
        <p className="text-sm text-muted-foreground">
          {t('count', { count: componentEntries.length })}
        </p>
      </div>
    </section>
  )
}
