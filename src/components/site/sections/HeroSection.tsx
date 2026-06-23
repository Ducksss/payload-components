import Link from 'next/link'

import { ArrowRight, Github, Sparkles, Star } from 'lucide-react'

import { CommandCopyButton } from '@/components/site/CommandCopyButton'
import { HeroInstallReplay } from '@/components/site/HeroInstallReplay'
import { HeroProductFrame } from '@/components/site/HeroProductFrame'
import {
  githubRepoUrl,
  heroEyebrow,
  heroHeadlineAccent,
  heroHeadlinePrimary,
  heroPrimaryCta,
  heroSubheadline,
  heroTertiaryLinks,
  primaryInstallCommand,
} from '@/lib/site'

/* Hero — the claim set in Geist with one italic-serif clause, the install
 * command above the fold, then the install replay as proof. Stays a server
 * component; the client bits (copy button, replay control) mount inside it. */
export function HeroSection() {
  const [browseLink, wiringLink] = heroTertiaryLinks

  return (
    <section className="hero-shell overflow-hidden border-b border-border/60">
      <div aria-hidden="true" className="hero-atmosphere" />

      <div className="container relative flex flex-col gap-12 py-12 sm:py-16 lg:gap-16 lg:py-24">
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
          <span
            className="hero-reveal flex items-center gap-2 rounded-full border border-border/70 bg-background/90 px-4 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-muted-foreground"
            style={{ animationDelay: '0ms' }}
          >
            <span aria-hidden="true" className="hero-eyebrow-dot" />
            {heroEyebrow}
          </span>

          <h1
            className="hero-reveal max-w-5xl text-balance text-[clamp(2.6rem,8.4vw,6rem)] font-medium leading-[0.94] tracking-[-0.085em] text-foreground"
            style={{ animationDelay: '60ms' }}
          >
            {heroHeadlinePrimary}{' '}
            <span className="hero-headline-accent">{heroHeadlineAccent}</span>
          </h1>

          <p
            className="hero-reveal mx-auto max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg"
            style={{ animationDelay: '110ms' }}
          >
            {heroSubheadline}
          </p>

          {/* The command itself, above the fold — first Copy button on the
              page (the e2e copy assertion targets it). */}
          <div
            className="hero-reveal grid w-full max-w-md grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-full border border-border bg-background py-1.5 pl-5 pr-1.5 shadow-card"
            style={{ animationDelay: '150ms' }}
          >
            <code tabIndex={0} className="overflow-x-auto whitespace-nowrap font-mono text-xs text-foreground/90 sm:text-[13px]">
              {primaryInstallCommand}
            </code>
            <CommandCopyButton command={primaryInstallCommand} />
          </div>

          <div
            className="hero-reveal flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center"
            style={{ animationDelay: '190ms' }}
          >
            <Link
              href={heroPrimaryCta.href}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-[0_18px_40px_-22px_rgba(15,23,42,0.55)] transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-[0_22px_50px_-22px_rgba(15,23,42,0.6)] sm:w-auto"
            >
              {heroPrimaryCta.label}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            <a
              href={githubRepoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border/70 bg-background/80 px-5 text-sm font-medium text-foreground transition-[transform,background-color] duration-200 hover:-translate-y-px hover:bg-background sm:w-auto"
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
            style={{ animationDelay: '230ms' }}
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
  )
}
