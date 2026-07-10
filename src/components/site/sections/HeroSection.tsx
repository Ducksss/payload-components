import Link from 'next/link'

import { ArrowRight, Github, Sparkles, Star } from 'lucide-react'

import { HeroInstallReplay } from '@/components/site/HeroInstallReplay'
import { HeroInstallStage } from '@/components/site/hero/HeroInstallStage'
import {
  githubRepoUrl,
  heroEyebrow,
  heroHeadlineAccent,
  heroHeadlinePrimary,
  heroPrimaryCta,
  heroReceiptsLine,
  heroSubheadline,
  heroTertiaryLinks,
} from '@/lib/site'

/* Hero — "one command, three surfaces". An editorial masthead (the claim
 * left, actions right), then the install stage: a dark command rail
 * narrates a real `add` run while emerald wires carry it into the three
 * surfaces it lands on — the Payload admin, the rendered page, and the git
 * diff. Stays a server component; the client bits (copy button, replay
 * control) mount inside it. */
export function HeroSection() {
  const [browseLink, wiringLink] = heroTertiaryLinks

  return (
    <section className="hero-shell overflow-hidden border-b border-border/60">
      <div aria-hidden="true" data-parallax="0.1" className="hero-atmosphere" />

      <div className="container relative flex flex-col gap-10 py-12 sm:py-16 lg:gap-14 lg:py-20">
        <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="flex flex-col items-start gap-6 lg:col-span-8">
            <span
              className="hero-reveal flex items-center gap-2 rounded-full border border-border/70 bg-background/90 px-4 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-muted-foreground"
              style={{ animationDelay: '0ms' }}
            >
              <span aria-hidden="true" className="hero-eyebrow-dot" />
              {heroEyebrow}
            </span>

            {/* Two-line lockup: Geist claim over the serif-italic clause. The
                explicit space text node keeps the accessible name equal to
                heroHeadline (the e2e H1 assertion). */}
            <h1
              className="hero-reveal text-balance text-[clamp(2.8rem,6.2vw,5.9rem)] font-medium leading-[0.96] tracking-[-0.08em] text-foreground"
              style={{ animationDelay: '60ms' }}
            >
              {heroHeadlinePrimary}{' '}
              <span className="hero-headline-accent block">{heroHeadlineAccent}</span>
            </h1>
          </div>

          <div className="flex max-w-md flex-col items-start gap-5 lg:col-span-4 lg:pb-1.5">
            <p
              className="hero-reveal text-pretty text-base leading-7 text-muted-foreground sm:text-lg"
              style={{ animationDelay: '110ms' }}
            >
              {heroSubheadline}
            </p>

            <div
              className="hero-reveal flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center lg:w-auto"
              style={{ animationDelay: '150ms' }}
            >
              <Link
                href={heroPrimaryCta.href}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-[0_18px_40px_-22px_rgba(15,23,42,0.55)] transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-[0_22px_50px_-22px_rgba(15,23,42,0.6)] sm:w-auto"
              >
                {heroPrimaryCta.label}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
              <a
                href={githubRepoUrl}
                target="_blank"
                rel="noreferrer"
                className="shine-cta inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-border/70 bg-background/80 px-5 text-sm font-medium text-foreground transition-[transform,background-color] duration-200 hover:-translate-y-px hover:bg-background sm:w-auto"
              >
                {/* Decorative star twinkles — must stay the first three children
                    (the .cta-twinkle styles position them via nth-child). */}
                <span aria-hidden="true" className="cta-twinkle" />
                <span aria-hidden="true" className="cta-twinkle" />
                <span aria-hidden="true" className="cta-twinkle" />
                <Github className="size-4" aria-hidden="true" />
                Star on GitHub
                <span className="inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-foreground/8 px-2 py-0.5 text-[0.72rem] font-semibold text-foreground/80">
                  <Star className="cta-badge-star size-3 fill-current" aria-hidden="true" />
                  Open source
                </span>
              </a>
            </div>

            <div
              className="hero-reveal flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground"
              style={{ animationDelay: '190ms' }}
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

            <p
              className="hero-reveal flex items-center gap-2 font-mono text-xs text-muted-foreground"
              style={{ animationDelay: '230ms' }}
            >
              <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
              {heroReceiptsLine}
            </p>
          </div>
        </div>

        <div className="hero-proof-enter">
          <HeroInstallReplay>
            <HeroInstallStage />
          </HeroInstallReplay>
        </div>
      </div>
    </section>
  )
}
