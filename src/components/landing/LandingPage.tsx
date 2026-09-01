import type { Metadata } from 'next'
import type { CSSProperties } from 'react'
import Link from 'next/link'

import { KitGalleryTeaser } from '@/components/gallery/KitGalleryTeaser'
import { JsonLd } from '@/components/JsonLd'
import { CopyCommandChip } from '@/components/landing/CopyCommandChip'
import { FinalCta } from '@/components/landing/FinalCta'
import { FaqAccordion } from '@/components/landing/FaqAccordion'
import { HeroProductFrame } from '@/components/landing/HeroProductFrame'
import { StepCard } from '@/components/landing/StepCard'
import {
  type FeatureCard,
  featureCards,
  featureShowcases,
  githubRepoUrl,
  heroInstallCommand,
  installSteps,
  registryColumns,
  worksWith,
} from '@/components/landing/content'
import styles from '@/components/landing/landing.module.css'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { buildHomeJsonLd, getJsonLdGraphNodes } from '@/seo/geo'
import { siteConfig } from '@/utilities/site'
import { cn } from '@/utilities/ui'
import { ArrowRight, ArrowUpRight, Check, CheckCircle2, FileCode2, Github } from 'lucide-react'

export const landingMetadata: Metadata = {
  alternates: {
    canonical: '/',
  },
  title: siteConfig.defaultTitle,
  description: siteConfig.defaultDescription,
  openGraph: {
    description: siteConfig.defaultDescription,
    images: [
      {
        alt: `${siteConfig.name} social preview`,
        height: 630,
        url: siteConfig.defaultOgImagePath,
        width: 1200,
      },
    ],
    siteName: siteConfig.name,
    title: siteConfig.defaultTitle,
    type: 'website',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    creator: siteConfig.twitterCreator,
    description: siteConfig.defaultDescription,
    images: [
      {
        alt: `${siteConfig.name} social preview`,
        height: 630,
        url: siteConfig.defaultOgImagePath,
        width: 1200,
      },
    ],
    title: siteConfig.defaultTitle,
  },
}

const repoChanges = [
  { path: 'src/blocks/HeroBasic/config.ts', status: 'A' },
  { path: 'src/blocks/HeroBasic/Component.tsx', status: 'A' },
  { path: 'src/blocks/RenderBlocks.tsx', status: 'M' },
  { path: 'src/collections/Pages/index.ts', status: 'M' },
  { path: 'src/app/(payload)/admin/importMap.js', status: 'M' },
]

const postInstallTasks = ['payload generate:types', 'payload generate:importmap']

export function LandingPage() {
  return (
    <main className={cn(styles.landingRoot, 'bg-background text-foreground')}>
      <JsonLd data={getJsonLdGraphNodes(buildHomeJsonLd())} />

      {/* HERO */}
      <section className={cn(styles.heroShell, 'overflow-hidden border-b border-border')}>
        <div className="container flex flex-col gap-12 py-16 sm:py-20 lg:gap-16 lg:py-24">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
            <Link
              href={githubRepoUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(
                styles.heroEyebrow,
                'inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground',
              )}
            >
              <span aria-hidden="true" className={styles.heroEyebrowDot} />
              Public alpha — free and open source
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Link>

            <h1
              className={cn(
                styles.heroHeadline,
                'max-w-5xl text-[clamp(2.75rem,7.2vw,5.75rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-balance',
              )}
            >
              Payload blocks that{' '}
              <span className={styles.heroHeadlineAccent}>install themselves.</span>
            </h1>

            <p
              className={cn(
                styles.heroBody,
                'mx-auto max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8',
              )}
            >
              Production-ready kits for Payload v3. One command wires the schema, render
              components, generated types, and import map into your repo — every block lands like
              it was built there.
            </p>

            <div
              className={cn(
                styles.heroActions,
                'flex w-full max-w-md flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-center',
              )}
            >
              <Button
                asChild
                size="lg"
                variant="brand"
                className={cn(styles.heroPrimaryCta, 'w-full rounded-full px-7 sm:w-auto')}
              >
                <Link href="/?intent=waitlist&source=landing-hero#early-access">
                  Join early access
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className={cn(styles.heroSecondaryCta, 'w-full rounded-full px-6 sm:w-auto')}
              >
                <Link href="/components">Browse the components</Link>
              </Button>
            </div>

            <div className={styles.heroCommand}>
              <CopyCommandChip command={heroInstallCommand} />
            </div>
          </div>

          <div className={styles.heroProof}>
            <HeroProductFrame />
          </div>
        </div>
      </section>

      {/* WORKS-WITH STRIP */}
      <section className="border-b border-border">
        <div className="container flex flex-col items-center gap-3 py-7 sm:flex-row sm:justify-center sm:gap-10">
          <p className="font-mono text-[0.68rem] font-medium tracking-[0.28em] text-muted-foreground/70 uppercase">
            Works with
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
            {worksWith.map((item) => (
              <li
                key={item}
                className={cn(styles.stripItem, 'font-mono text-sm text-muted-foreground')}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className={cn(styles.sectionAnchor, 'border-b border-border bg-card')}
      >
        <div className="container py-20 lg:py-28">
          <SectionHeading
            kicker="How it works"
            title="Three commands from empty repo to shipped page."
            description="Detect the repo, add the kit, verify the result. The wiring other tools leave as homework happens automatically."
          />

          <div className="grid gap-5 lg:grid-cols-3 lg:gap-6">
            {installSteps.map((step) => (
              <StepCard key={step.command} step={step} />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="product" className={cn(styles.sectionAnchor, 'border-b border-border')}>
        <div className="container py-20 lg:py-28">
          <SectionHeading
            kicker="Why Payload Kits"
            title="Integration quality is the product."
            description="Component libraries hand you files and walk away. A Payload Kits install finishes the whole job — schema, render, types, and admin wiring, every time."
          />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8 lg:gap-5">
            <article
              className={cn(
                styles.featureCard,
                'flex min-w-0 flex-col justify-between gap-8 rounded-2xl border border-border bg-card p-6 sm:p-7 md:col-span-2 lg:col-span-5',
              )}
              style={cardDelay(0)}
            >
              <div className="max-w-lg">
                <h3 className="font-display text-2xl font-semibold tracking-[-0.02em] text-balance">
                  {featureShowcases[0].title}
                </h3>
                <p className="mt-3 text-base leading-7 text-muted-foreground">
                  {featureShowcases[0].description}
                </p>
              </div>

              <div className="overflow-hidden rounded-xl border border-border bg-background font-mono text-[0.8rem]">
                {repoChanges.map((change) => (
                  <div
                    key={change.path}
                    className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5 last:border-b-0"
                  >
                    <span className="flex min-w-0 items-center gap-2.5">
                      <FileCode2
                        className="size-4 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <span className="truncate text-foreground/85">{change.path}</span>
                    </span>
                    <span
                      className={cn(
                        'shrink-0 font-semibold',
                        change.status === 'A' ? 'text-emerald-600' : 'text-brand',
                      )}
                    >
                      {change.status}
                    </span>
                  </div>
                ))}
              </div>
            </article>

            <FeatureCell card={featureCards[0]} className="lg:col-span-3" delay={80} />
            <FeatureCell card={featureCards[1]} className="lg:col-span-3" delay={160} />

            <article
              className={cn(
                styles.featureCard,
                'flex min-w-0 flex-col justify-between gap-8 rounded-2xl border border-border bg-card p-6 sm:p-7 md:col-span-2 lg:col-span-5',
              )}
              style={cardDelay(240)}
            >
              <div className="max-w-lg">
                <h3 className="font-display text-2xl font-semibold tracking-[-0.02em] text-balance">
                  {featureShowcases[1].title}
                </h3>
                <p className="mt-3 text-base leading-7 text-muted-foreground">
                  {featureShowcases[1].description}
                </p>
              </div>

              <div className="rounded-xl bg-zinc-950 p-4 font-mono text-[0.8rem] leading-7 text-zinc-300">
                {postInstallTasks.map((task) => (
                  <p key={task} className="flex items-center gap-2.5">
                    <Check className="size-3.5 shrink-0 text-emerald-400" aria-hidden="true" />
                    <span>{task}</span>
                    <span className="ml-auto text-zinc-600">auto</span>
                  </p>
                ))}
                <p className="mt-1 text-zinc-500">Repo compiles. Admin panel ready.</p>
              </div>
            </article>

            <FeatureCell card={featureCards[2]} className="lg:col-span-4" delay={320} />
            <FeatureCell card={featureCards[3]} className="lg:col-span-4" delay={400} />
          </div>
        </div>
      </section>

      {/* CATALOG */}
      <section id="catalog" className={cn(styles.sectionAnchor, 'border-b border-border')}>
        <div className="container py-20 lg:py-28">
          <SectionHeading
            kicker="Components"
            title="Live previews. Real install commands."
            description="Every kit in the gallery installs cleanly into a Payload v3 repo today — the previews render from the exact components you ship."
          />

          <KitGalleryTeaser />
        </div>
      </section>

      {/* PRICING */}
      <section
        id="pricing"
        className={cn(styles.sectionAnchor, 'border-b border-border bg-card')}
      >
        <div className="container py-20 lg:py-28">
          <SectionHeading
            kicker="Pricing"
            title="Free where it builds trust. Paid where it does the heavy lifting."
            description="The public catalog is free and open source. Pro adds the private registry teams reach for when client work scales."
          />

          <div className="mx-auto grid max-w-4xl gap-6 lg:grid-cols-2">
            {registryColumns.map((column) => {
              const isHighlight = column.highlight
              return (
                <Card
                  key={column.title}
                  className={cn(
                    styles.pricingCard,
                    'flex flex-col gap-6 rounded-2xl bg-background shadow-none',
                    isHighlight ? 'border-brand ring-1 ring-brand' : 'border-border',
                  )}
                  data-highlight={isHighlight ? 'true' : 'false'}
                >
                  <CardHeader className="gap-4">
                    <div className="flex items-center justify-between gap-4">
                      <Badge
                        className={cn(
                          'rounded-full px-3 py-1 text-[0.7rem] font-semibold tracking-[0.14em] uppercase',
                          isHighlight
                            ? 'bg-brand text-brand-foreground hover:bg-brand'
                            : 'bg-card text-muted-foreground hover:bg-card',
                        )}
                      >
                        {column.badge}
                      </Badge>
                      <column.icon
                        className={cn('size-5', isHighlight ? 'text-brand' : 'text-muted-foreground')}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <CardTitle className="text-2xl tracking-[-0.02em]">{column.title}</CardTitle>
                      <CardDescription className="text-base leading-7">
                        {column.description}
                      </CardDescription>
                    </div>

                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-display text-5xl font-semibold tracking-[-0.03em]">
                        {column.price}
                      </span>
                      {column.priceUnit && (
                        <span className="text-sm text-muted-foreground">{column.priceUnit}</span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-1 flex-col gap-6">
                    <ul className="flex flex-col gap-3">
                      {column.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
                        >
                          <CheckCircle2
                            className={cn(
                              'mt-0.5 size-4 shrink-0',
                              isHighlight ? 'text-brand' : 'text-foreground',
                            )}
                            aria-hidden="true"
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      asChild
                      variant={isHighlight ? 'brand' : 'outline'}
                      size="lg"
                      className="mt-auto w-full justify-center rounded-full px-5"
                    >
                      <Link
                        href={column.cta.href}
                        target={column.cta.href.startsWith('http') ? '_blank' : undefined}
                        rel={column.cta.href.startsWith('http') ? 'noreferrer' : undefined}
                      >
                        {column.cta.label}
                        <ArrowUpRight data-icon="inline-end" className="size-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Want to see the source first?{' '}
            <Link
              href={githubRepoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-foreground underline-offset-4 hover:underline"
            >
              <Github className="size-3.5" aria-hidden="true" />
              Star it on GitHub
            </Link>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={cn(styles.sectionAnchor, 'border-b border-border')}>
        <div className="container py-20 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <SectionHeading
              align="left"
              kicker="FAQ"
              title="Opinionated on purpose."
              description="Payload Kits is deliberately narrow so every install can be dependable. Here is exactly where the lines are drawn."
            />
            <FaqAccordion />
          </div>
        </div>
      </section>

      <FinalCta />
    </main>
  )
}

const cardDelay = (delay: number): CSSProperties =>
  ({ '--card-delay': `${delay}ms` }) as CSSProperties

type FeatureCellProps = {
  card: FeatureCard
  className?: string
  delay: number
}

function FeatureCell({ card, className, delay }: FeatureCellProps) {
  return (
    <article
      className={cn(
        styles.featureCard,
        'flex min-w-0 flex-col gap-5 rounded-2xl border border-border bg-card p-6 sm:p-7',
        className,
      )}
      style={cardDelay(delay)}
    >
      <div className="grid size-10 place-items-center rounded-xl bg-brand/10 text-brand">
        <card.icon className="size-5" aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-lg font-semibold tracking-[-0.01em]">{card.title}</h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.description}</p>
      </div>
    </article>
  )
}

type SectionHeadingProps = {
  align?: 'center' | 'left'
  description: string
  kicker: string
  title: string
}

function SectionHeading({ align = 'center', description, kicker, title }: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-12 flex flex-col gap-4 sm:mb-14 lg:mb-16',
        align === 'center' ? 'mx-auto max-w-[44rem] text-center' : 'max-w-[40rem] text-left',
      )}
    >
      <p className="font-mono text-xs font-semibold tracking-[0.2em] text-brand uppercase">
        {kicker}
      </p>
      <h2 className="font-display text-3xl font-semibold leading-[1.05] tracking-[-0.02em] text-balance sm:text-4xl lg:text-[2.75rem]">
        {title}
      </h2>
      <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
    </div>
  )
}

export default LandingPage
