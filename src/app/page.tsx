import Link from 'next/link'

import { ArrowRight, ArrowUpRight, Bell, Github, Sparkles, Star } from 'lucide-react'

import { CatalogIndex } from '@/components/site/CatalogIndex'
import { CommandCopyButton } from '@/components/site/CommandCopyButton'
import { Faq } from '@/components/site/Faq'
import { HeroInstallReplay } from '@/components/site/HeroInstallReplay'
import { HeroProductFrame } from '@/components/site/HeroProductFrame'
import { siteIcons } from '@/components/site/icons'
import { KitSpecimen } from '@/components/site/KitSpecimen'
import { MaintainerNote } from '@/components/site/MaintainerNote'
import { Eyebrow, Section, SectionHeading } from '@/components/site/section'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { WiringLedger } from '@/components/site/WiringLedger'
import {
  communityIntro,
  communityInvite,
  communityLinks,
  faqIntro,
  githubRepoUrl,
  heroEyebrow,
  heroHeadlineAccent,
  heroHeadlinePrimary,
  heroPrimaryCta,
  heroSubheadline,
  heroTertiaryLinks,
  kitsIntro,
  landingSections,
  primaryInstallCommand,
  receipts,
  wiringIntro,
  wiringLedger,
  workflowIntro,
  workflowSteps,
} from '@/lib/site'

export default function HomePage() {
  const [browseLink, wiringLink] = heroTertiaryLinks

  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        {/* Hero — claim, command, then the install replay as proof. */}
        <section className="hero-shell overflow-hidden border-b border-border/60">
          <div aria-hidden="true" className="hero-atmosphere" />

          <div className="container relative flex flex-col gap-10 py-10 sm:py-14 lg:gap-14 lg:py-20">
            <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-5 text-center">
              <span
                className="hero-reveal flex items-center gap-2 rounded-full border border-border/70 bg-background/90 px-4 py-1 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-sm"
                style={{ animationDelay: '80ms' }}
              >
                <span aria-hidden="true" className="hero-eyebrow-dot" />
                {heroEyebrow}
              </span>

              <div className="flex flex-col gap-4">
                <h1
                  className="hero-reveal max-w-5xl text-balance text-[clamp(2.6rem,8.4vw,6rem)] font-medium leading-[0.94] tracking-[-0.085em] text-foreground"
                  style={{ animationDelay: '180ms' }}
                >
                  {heroHeadlinePrimary}{' '}
                  <span className="hero-headline-accent">{heroHeadlineAccent}</span>
                </h1>

                <p
                  className="hero-reveal mx-auto max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg"
                  style={{ animationDelay: '340ms' }}
                >
                  {heroSubheadline}
                </p>
              </div>

              {/* The command itself, above the fold — first Copy button on
                  the page (the e2e copy assertion targets it). */}
              <div
                className="hero-reveal grid w-full max-w-md grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-full border border-border bg-background py-1.5 pl-5 pr-1.5 shadow-card backdrop-blur-sm"
                style={{ animationDelay: '420ms' }}
              >
                <code className="overflow-x-auto whitespace-nowrap font-mono text-xs text-foreground/90 sm:text-[13px]">
                  {primaryInstallCommand}
                </code>
                <CommandCopyButton command={primaryInstallCommand} />
              </div>

              <div
                className="hero-reveal flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center"
                style={{ animationDelay: '500ms' }}
              >
                <Link
                  href={heroPrimaryCta.href}
                  className="cta-shine inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-[0_18px_40px_-22px_rgba(15,23,42,0.55)] transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-[0_22px_50px_-22px_rgba(15,23,42,0.6)] sm:w-auto"
                >
                  {heroPrimaryCta.label}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <a
                  href={githubRepoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border/70 bg-background/80 px-5 text-sm font-medium text-foreground backdrop-blur-sm transition-[transform,background-color] duration-200 hover:-translate-y-px hover:bg-background sm:w-auto"
                >
                  <Github className="size-4" aria-hidden="true" />
                  Star on GitHub
                  <span className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-foreground/8 px-2 py-0.5 text-[0.72rem] font-semibold text-foreground/80">
                    <Star className="size-3 fill-current" aria-hidden="true" />
                    Open source
                  </span>
                </a>
              </div>

              <div
                className="hero-reveal flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground"
                style={{ animationDelay: '580ms' }}
              >
                <Link
                  href={browseLink.href}
                  className="inline-flex items-center gap-1.5 font-medium text-foreground transition-opacity hover:opacity-75"
                >
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  {browseLink.label}
                </Link>
                <span aria-hidden="true" className="hidden text-border sm:inline">
                  /
                </span>
                <Link
                  href={wiringLink.href}
                  className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
                >
                  {wiringLink.label}
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>

            <div className="hero-proof-enter">
              <HeroInstallReplay>
                <HeroProductFrame />
              </HeroInstallReplay>
            </div>
          </div>
        </section>

        {/* Receipts — every line verifiable in the repository. */}
        <section aria-label="Project receipts" className="border-b border-border bg-muted/30">
          <div className="container flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-5">
            {receipts.map((receipt) => {
              const Icon = siteIcons[receipt.icon]

              return (
                <span
                  key={receipt.label}
                  className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
                >
                  <Icon className="size-3.5 text-brand" aria-hidden="true" />
                  {receipt.label}
                </span>
              )
            })}
          </div>
        </section>

        {/* Wiring ledger — the differentiator, promoted from FAQ to artifact table. */}
        <Section id={landingSections.wiring.id}>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="The install boundary"
              heading={landingSections.wiring.heading}
              intro={wiringIntro}
            />
            <code className="hidden shrink-0 pb-1 font-mono text-[11px] text-muted-foreground lg:block">
              source: {wiringLedger.source}
            </code>
          </div>

          <div className="reveal-on-scroll mt-12">
            <WiringLedger />
          </div>
        </Section>

        {/* Catalog — specimen first, dense index second. */}
        <Section id={landingSections.kits.id} className="bg-muted/40">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading
              eyebrow="The catalog"
              heading={landingSections.kits.heading}
              intro={kitsIntro}
            />
            <Link
              href="/components"
              className="inline-flex h-10 w-fit shrink-0 items-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Browse the catalog
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="reveal-on-scroll mt-12">
            <KitSpecimen />
          </div>

          <div className="reveal-on-scroll mt-12">
            <CatalogIndex />
          </div>
        </Section>

        {/* How it works — a single horizontal rail, not another card grid. */}
        <Section id={landingSections.workflow.id}>
          <SectionHeading
            eyebrow="Workflow"
            heading={landingSections.workflow.heading}
            intro={workflowIntro}
          />

          <ol className="reveal-on-scroll mt-12 grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-8 lg:border-t lg:border-border">
            {workflowSteps.map((step, index) => (
              <li key={step.title} className="relative flex flex-col gap-2 lg:pt-7">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 hidden h-3 w-px bg-border lg:block"
                />
                <span className="font-mono text-sm font-semibold text-brand">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="text-sm leading-6 text-muted-foreground">{step.description}</p>
                <code className="mt-1 block w-fit max-w-full overflow-x-auto whitespace-nowrap rounded-md border border-border bg-muted/60 px-3 py-2 font-mono text-xs text-foreground/80">
                  {step.command}
                </code>
              </li>
            ))}
          </ol>
        </Section>

        {/* FAQ */}
        <Section id={landingSections.faq.id} className="bg-muted/40">
          <div className="mx-auto max-w-3xl">
            <SectionHeading
              eyebrow="FAQ"
              heading={landingSections.faq.heading}
              intro={faqIntro}
            />

            <div className="reveal-on-scroll mt-10">
              <Faq />
            </div>
          </div>
        </Section>

        {/* Open source close — asymmetric: the pitch beside the one real voice. */}
        <Section id={landingSections.community.id} className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-dots [mask-image:radial-gradient(38rem_22rem_at_40%_45%,black,transparent)]"
          />
          <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
            <div className="flex flex-col items-start">
              <Eyebrow>Open source</Eyebrow>
              <h2 className="mt-4 text-3xl font-semibold leading-[1.08] tracking-[-0.045em] text-foreground sm:text-4xl">
                {landingSections.community.heading}
              </h2>
              <p className="mt-4 text-base leading-7 text-muted-foreground">{communityIntro}</p>

              <div className="mt-7 grid w-full max-w-md grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-full border border-border bg-background py-1.5 pl-5 pr-1.5 shadow-card">
                <code className="overflow-x-auto whitespace-nowrap font-mono text-xs text-foreground/90 sm:text-[13px]">
                  {primaryInstallCommand}
                </code>
                <CommandCopyButton command={primaryInstallCommand} />
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={communityLinks[0].href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <Github className="size-4" aria-hidden="true" />
                  {communityLinks[0].label}
                </Link>
                <Link
                  href={communityLinks[1].href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-6 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  {communityLinks[1].label}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </div>

              <a
                href={communityInvite.href}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {communityInvite.label}
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
              <a
                href={`${githubRepoUrl}/releases`}
                target="_blank"
                rel="noreferrer"
                className="mt-2.5 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Bell className="size-3.5" aria-hidden="true" />
                Watch releases to catch new kits as they land
              </a>
            </div>

            <MaintainerNote />
          </div>
        </Section>
      </main>

      <SiteFooter />
    </>
  )
}
