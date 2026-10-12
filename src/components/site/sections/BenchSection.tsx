import type { CSSProperties } from 'react'

import Link from '@/i18n/Link'
import { getLocale, getTranslations } from 'next-intl/server'

import { ArrowRight, Sparkles } from 'lucide-react'

import { BenchScroll } from '@/components/site/BenchScroll'
import { GitHubMark } from '@/components/site/GitHubMark'
import { InstallCommand } from '@/components/site/InstallCommand'
import { DemoFitFrame } from '@/components/site/demos/DemoFitFrame'
import { demosBySlug } from '@/components/site/demos/registry'
import { PartPinout } from '@/components/site/graphics/PartPinout'
import { localizeHref, normalizeSiteLocale } from '@/i18n/config'
import { getBenchLedger, getBenchParts } from '@/lib/bench'
import {
  benchSteps,
  componentEntries,
  githubRepoUrl,
  heroGuideLink,
  heroTertiaryLinks,
  primaryInstallCommand,
} from '@/lib/site'

/* The landing is one scene: a part on the bench. Scrolling installs it —
 * hero-basic's fields light up, its five traces wire one at a time while the
 * ledger fills in, the block renders, and then the part on the bench changes,
 * part after part. One idea, told once, by doing it.
 *
 * Everything here is server-rendered. BenchScroll only turns the scroll
 * position into progress values; CSS ("The bench" in globals.css) pins the
 * scene where it can be read that way (wide, tall, motion allowed) and lays
 * every step out stacked and fully wired everywhere else — phones, reduced
 * motion, and no JavaScript (the pinned layout requires `scripting: enabled`).
 *
 * The headline and command are the first screen in every layout, rise without
 * fading (.hero-rise), and never move when the page hydrates. Drawings and
 * rendered twins are decorative (aria-hidden); the words and the ledger carry
 * the same facts as text. Every twin renders on the component tokens
 * (DemoFitFrame's .preview-scope), not the brand's. */
export async function BenchSection() {
  const locale = normalizeSiteLocale(await getLocale())
  const t = await getTranslations({ locale, namespace: 'Landing.hero' })
  const parts = await getBenchParts()
  const [hero] = parts
  const ledger = await getBenchLedger(hero)
  const [browseLink] = heroTertiaryLinks

  return (
    <BenchScroll className="hero-shell bench" id="bench" labelledBy="hero-title">
      <div className="bench-stage">
        <div className="bench-grid container">
          <div className="bench-intro">
            <h1
              className="hero-headline hero-rise ds-display bench-headline text-balance text-foreground"
              id="hero-title"
              style={{ animationDelay: '0ms' }}
            >
              {t('primary')} {t('accent')}
            </h1>

            <p
              className="hero-rise mt-6 max-w-[30em] text-pretty text-[1.0625rem] leading-relaxed text-muted-foreground sm:text-lg"
              style={{ animationDelay: '60ms' }}
            >
              {t('subheadline')}
            </p>

            {/* The landing's first <code> and first Copy button (frontend e2e
                pins both). Rises rather than fades: a fading filled button
                fails contrast mid-animation. */}
            <InstallCommand
              className="hero-rise mt-7 max-w-[37rem]"
              command={primaryInstallCommand}
              label={t('copy')}
              style={{ animationDelay: '110ms' }}
            />

            <div
              className="hero-rise mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.9375rem]"
              style={{ animationDelay: '150ms' }}
            >
              <Link
                className="group inline-flex items-center gap-2 font-semibold text-foreground transition-colors hover:text-brand"
                data-cta-level="tertiary"
                href={localizeHref(heroGuideLink.href, locale)}
              >
                {t('guide')}
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none rtl:rotate-180"
                />
              </Link>
              <a
                className="inline-flex items-center gap-2 font-medium text-muted-foreground transition-colors hover:text-foreground"
                data-cta-level="tertiary"
                href={githubRepoUrl}
                rel="noreferrer"
                target="_blank"
              >
                <GitHubMark aria-hidden="true" className="size-4" />
                {t('github')}
              </a>
              <Link
                className="inline-flex items-center gap-2 font-medium text-muted-foreground transition-colors hover:text-foreground"
                data-cta-level="tertiary"
                href={localizeHref(browseLink.href, locale)}
              >
                <Sparkles aria-hidden="true" className="size-4" />
                {t('browse')}
              </Link>
            </div>

            <p className="ds-label mt-7 flex flex-wrap gap-x-5 gap-y-1 text-muted-foreground">
              <span>{componentEntries.length} blocks</span>
              <span>MIT licensed</span>
              <span>Listed in the shadcn directory</span>
            </p>

            <p aria-hidden="true" className="bench-hint ds-label text-muted-foreground">
              <i />
              Scroll to install one
            </p>
          </div>

          {benchSteps.map((step, index) => (
            <div className={`bench-step bench-step-${index + 1}`} key={step.kicker}>
              <p className="ds-label flex items-center gap-3 text-muted-foreground">
                <b className="font-semibold text-brand">{String(index + 1).padStart(2, '0')}</b>
                {step.kicker}
              </p>
              <h2 className="ds-display bench-step-title mt-4 text-balance text-foreground">
                {step.title[0]}
                <span className="text-brand">{step.title[1]}</span>
                {step.title[2]}
              </h2>
              <p className="mt-4 max-w-[26em] text-pretty text-[1.0625rem] leading-relaxed text-muted-foreground">
                {step.body}
              </p>
              {index === 0 ? (
                <ul aria-label="hero-basic fields" className="mt-5 flex flex-wrap gap-1.5">
                  {hero.inputs.map((pin) => (
                    <li
                      className={`bench-field font-mono text-xs ${pin.required ? 'is-required' : ''}`}
                      key={pin.name}
                    >
                      {pin.label}
                      <span className="sr-only">
                        {pin.required ? ' (required)' : ' (optional)'}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {index === benchSteps.length - 1 ? (
                <Link
                  className="group mt-6 inline-flex items-center gap-2 font-semibold text-foreground transition-colors hover:text-brand"
                  href={localizeHref('/components', locale)}
                >
                  Browse {componentEntries.length} blocks
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none rtl:rotate-180"
                  />
                </Link>
              ) : null}
            </div>
          ))}

          <div className="bench-board">
            {parts.map((part, index) => (
              <div
                className="bench-part"
                data-active={index === 0 ? '' : undefined}
                data-bench-part={index}
                key={part.slug}
              >
                <p
                  aria-hidden="true"
                  className="ds-label flex justify-between gap-4 text-muted-foreground"
                >
                  <span>
                    Part {part.part} · Rev {part.version}
                  </span>
                  <span className="hidden sm:inline">Pin configuration</span>
                </p>
                <PartPinout datasheet={part} />
              </div>
            ))}
          </div>

          <ol aria-label={`What ${primaryInstallCommand} writes`} className="bench-ledger">
            {ledger.map((row, index) => (
              <li key={row.label} style={{ '--i': index, '--n': ledger.length } as CSSProperties}>
                <span className="ds-label text-muted-foreground">{row.action}</span>
                <code className="font-mono text-xs text-foreground">{row.label}</code>
                <span className="bench-ledger-detail font-mono text-[11px]">{row.detail}</span>
              </li>
            ))}
          </ol>

          <div className="bench-page">
            {parts.map((part, index) => {
              const Demo = demosBySlug[part.slug]
              return (
                <figure
                  className="bench-part"
                  data-active={index === 0 ? '' : undefined}
                  data-bench-part={index}
                  key={part.slug}
                >
                  <figcaption className="ds-label mb-2 flex justify-between gap-4 text-muted-foreground">
                    <span>Output · {part.slug} on your page</span>
                    {index > 0 ? (
                      <span aria-hidden="true">One of {componentEntries.length}</span>
                    ) : null}
                  </figcaption>
                  {Demo ? (
                    <DemoFitFrame className="bench-twin">
                      <Demo />
                    </DemoFitFrame>
                  ) : null}
                </figure>
              )
            })}
          </div>
        </div>
        <div aria-hidden="true" className="bench-progress">
          <i />
        </div>
      </div>
    </BenchScroll>
  )
}
