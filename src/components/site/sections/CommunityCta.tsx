import Link from '@/i18n/Link'
import { useLocale, useTranslations } from 'next-intl'

import { ArrowUpRight } from 'lucide-react'

import { CommandCopyButton } from '@/components/site/CommandCopyButton'
import { GitHubMark } from '@/components/site/GitHubMark'
import { MaintainerNote } from '@/components/site/MaintainerNote'
import { Reveal } from '@/components/site/motion/Reveal'
import { Eyebrow, HeadingAccent, Section } from '@/components/site/section'
import { localizeHref, normalizeSiteLocale } from '@/i18n/config'
import { communityInvite, communityLinks, landingSections, primaryInstallCommand } from '@/lib/site'

/* Open-source close — asymmetric: the pitch beside the one real voice. The
 * honest CTA in place of a waitlist: read it, run it, open an issue. */
export function CommunityCta() {
  const locale = normalizeSiteLocale(useLocale())
  const t = useTranslations('Landing.community')

  return (
    <Section id={landingSections.community.id} className="relative overflow-hidden">
      <div
        aria-hidden="true"
        data-parallax="0.1"
        className="absolute inset-0 bg-dots [mask-image:radial-gradient(38rem_22rem_at_40%_45%,black,transparent)]"
      />
      <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <div className="flex flex-col items-start">
          <Eyebrow>{t('eyebrow')}</Eyebrow>
          <h2 className="mt-4 text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.045em] text-foreground sm:text-[2.6rem]">
            {t('heading')} <HeadingAccent>{t('accent')}</HeadingAccent>.
          </h2>
          <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">{t('intro')}</p>

          <div className="mt-7 grid w-full max-w-xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-full border border-border bg-background py-1 pl-5 pr-1 shadow-card">
            <code
              tabIndex={0}
              className="overflow-x-auto whitespace-nowrap font-mono text-xs text-foreground/90 sm:text-[13px]"
            >
              {primaryInstallCommand}
            </code>
            <CommandCopyButton
              command={primaryInstallCommand}
              emphasis="primary"
              label={t('copy')}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm">
            <Link
              href={communityLinks[0].href}
              target="_blank"
              rel="noreferrer"
              data-cta-level="secondary"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background px-4 font-medium text-foreground transition-colors hover:bg-secondary"
            >
              <GitHubMark className="size-4" aria-hidden="true" />
              {t('repository')}
            </Link>
            <Link
              href={communityLinks[1].href}
              target="_blank"
              rel="noreferrer"
              data-cta-level="tertiary"
              className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              {t('issue')}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>
          </div>

          <a
            href={localizeHref(communityInvite.href, locale)}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {t('invite')}
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </div>

        <Reveal delay={0.06}>
          <MaintainerNote />
        </Reveal>
      </div>
    </Section>
  )
}
