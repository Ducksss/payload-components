import Link from 'next/link'

import { ArrowRight, Github, Sparkles } from 'lucide-react'

import { CommandCopyButton } from '@/components/site/CommandCopyButton'
import { HeroInstallReplay } from '@/components/site/HeroInstallReplay'
import { HeroProductFrame } from '@/components/site/HeroProductFrame'
import {
  githubRepoUrl,
  heroEyebrow,
  heroGuideLink,
  heroHeadlineAccent,
  heroHeadlinePrimary,
  heroSubheadline,
  heroTertiaryLinks,
  primaryInstallCommand,
} from '@/lib/site'

/* Hero — the claim set in Geist with one italic-serif clause, the install
 * command above the fold, then the install replay as proof. Stays a server
 * component; the client bits (copy button, replay control) mount inside it. */
export function HeroSection() {
  const [browseLink] = heroTertiaryLinks

  return (
    <section className="hero-shell overflow-hidden border-b border-border/60">
      <div aria-hidden="true" data-parallax="0.1" className="hero-atmosphere" />

      <div className="container relative flex flex-col gap-10 py-10 sm:py-14 lg:gap-12 lg:py-16">
        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-5 text-center">
          <span
            className="hero-reveal flex items-center gap-2 rounded-full border border-border/70 bg-background/90 px-4 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-muted-foreground"
            style={{ animationDelay: '0ms' }}
          >
            <span aria-hidden="true" className="hero-eyebrow-dot" />
            {heroEyebrow}
          </span>

          <h1
            className="hero-reveal max-w-5xl text-balance text-[clamp(2.6rem,8.4vw,5.5rem)] font-medium leading-[0.94] tracking-[-0.075em] text-foreground"
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
            className="hero-reveal grid w-full max-w-xl grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-full border border-border bg-background py-1 pl-5 pr-1 shadow-card"
            style={{ animationDelay: '150ms' }}
          >
            <code
              tabIndex={0}
              className="overflow-x-auto whitespace-nowrap font-mono text-xs text-foreground/90 sm:text-[13px]"
            >
              {primaryInstallCommand}
            </code>
            <CommandCopyButton
              command={primaryInstallCommand}
              emphasis="primary"
              label="Copy install command"
            />
          </div>

          <div
            className="hero-reveal flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground"
            style={{ animationDelay: '190ms' }}
          >
            <Link
              href={heroGuideLink.href}
              data-cta-level="tertiary"
              className="inline-flex items-center gap-1.5 font-medium text-foreground transition-opacity hover:opacity-75"
            >
              {heroGuideLink.label}
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
            <a
              href={githubRepoUrl}
              target="_blank"
              rel="noreferrer"
              data-cta-level="tertiary"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <Github className="size-3.5" aria-hidden="true" />
              Star on GitHub
            </a>
            <Link
              href={browseLink.href}
              data-cta-level="tertiary"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <Sparkles className="size-3.5" aria-hidden="true" />
              {browseLink.label}
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
