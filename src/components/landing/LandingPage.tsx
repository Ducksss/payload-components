import type { Metadata } from 'next'
import Link from 'next/link'

import { KitGalleryTeaser } from '@/components/gallery/KitGalleryTeaser'
import { JsonLd } from '@/components/JsonLd'
import { FinalCta } from '@/components/landing/FinalCta'
import { FaqAccordion } from '@/components/landing/FaqAccordion'
import { HeroProductFrame } from '@/components/landing/HeroProductFrame'
import { StepCard } from '@/components/landing/StepCard'
import {
  githubRepoUrl,
  heroStats,
  installSteps,
  productDifferentiators,
  proofChecks,
  proofPills,
  registryColumns,
  reliabilityItems,
  whyPayloadKits,
} from '@/components/landing/content'
import styles from '@/components/landing/landing.module.css'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { buildHomeJsonLd, getJsonLdGraphNodes } from '@/seo/geo'
import { cn } from '@/utilities/ui'
import { ArrowRight, ArrowUpRight, CheckCircle2, Github, Sparkles, Star } from 'lucide-react'

export const landingMetadata: Metadata = {
  alternates: {
    canonical: '/',
  },
  title: 'Payload Kits | Install production-ready Payload blocks with one command',
  description:
    'Payload Kits is a Payload-native kit platform for agencies and freelancers. Install curated block kits with one command, including schema wiring, render components, type generation, and import-map updates.',
  openGraph: {
    description:
      'Payload Kits is a Payload-native kit platform for agencies and freelancers. Install curated block kits with one command, including schema wiring, render components, type generation, and import-map updates.',
    images: [
      {
        alt: 'Payload Kits social preview',
        height: 630,
        url: '/website-template-OG.webp',
        width: 1200,
      },
    ],
    siteName: 'Payload Kits',
    title: 'Payload Kits | Install production-ready Payload blocks with one command',
    type: 'website',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
    description:
      'Payload Kits is a Payload-native kit platform for agencies and freelancers. Install curated block kits with one command, including schema wiring, render components, type generation, and import-map updates.',
    images: [
      {
        alt: 'Payload Kits social preview',
        height: 630,
        url: '/website-template-OG.webp',
        width: 1200,
      },
    ],
    title: 'Payload Kits | Install production-ready Payload blocks with one command',
  },
}

export function LandingPage() {
  return (
    <main className={cn(styles.landingRoot, 'bg-background text-foreground')}>
      <JsonLd data={getJsonLdGraphNodes(buildHomeJsonLd())} />

      {/* HERO */}
      <section className={cn(styles.heroShell, 'overflow-hidden border-b border-border/60')}>
        <div aria-hidden="true" className={styles.heroAtmosphere} />
        <div className="container relative flex flex-col gap-10 py-10 sm:py-14 lg:gap-14 lg:py-20">
          <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-5 text-center">
            <Badge
              variant="outline"
              className={cn(
                styles.heroEyebrow,
                'flex items-center gap-2 rounded-full border-border/70 bg-background/90 px-4 py-1 text-[0.72rem] font-medium uppercase tracking-[0.2em] backdrop-blur-sm',
              )}
            >
              <span aria-hidden="true" className={styles.heroEyebrowDot} />
              Payload Kits public alpha
            </Badge>

            <div className="flex flex-col gap-4">
              <div className={styles.heroHeadlineFrame}>
                <h1
                  className={cn(
                    styles.heroHeadline,
                    'max-w-5xl text-[clamp(2.6rem,8.4vw,6rem)] font-medium leading-[0.94] tracking-[-0.085em] text-balance',
                  )}
                >
                  Install production-ready Payload blocks{' '}
                  <span className={styles.heroHeadlineAccent}>with one command.</span>
                </h1>
              </div>
              <p
                className={cn(
                  styles.heroBody,
                  'mx-auto max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg',
                )}
              >
                Payload Kits wires schema, render components, generated types, and import-map
                updates straight into your Payload v3 repo — so blocks belong, not just paste.
              </p>
            </div>

            <div
              className={cn(
                styles.heroActions,
                'flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center',
              )}
            >
              <Button
                asChild
                size="lg"
                className={cn(
                  styles.heroPrimaryCta,
                  'w-full rounded-full px-6 font-medium shadow-[0_18px_40px_-22px_rgba(15,23,42,0.55)] sm:w-auto',
                )}
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
                className={cn(
                  styles.heroSecondaryCta,
                  'w-full rounded-full border-border/70 bg-background/80 px-5 font-medium text-foreground backdrop-blur-sm hover:bg-background sm:w-auto',
                )}
              >
                <Link href={githubRepoUrl} target="_blank" rel="noreferrer">
                  <Github className="size-4" aria-hidden="true" />
                  Star on GitHub
                  <span
                    className={cn(
                      styles.heroStarChip,
                      'inline-flex items-center gap-1 rounded-full bg-foreground/8 px-2 py-0.5 text-[0.72rem] font-semibold text-foreground/80',
                    )}
                  >
                    <Star className="size-3 fill-current" aria-hidden="true" />
                    Open source
                  </span>
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              <Link
                href="/?intent=design-partner&source=landing-hero-design-partner#early-access"
                className="inline-flex items-center gap-1.5 font-medium text-foreground transition-opacity hover:opacity-75"
              >
                <Sparkles className="size-3.5" aria-hidden="true" />
                Apply as a design partner
              </Link>
              <span aria-hidden="true" className="hidden text-border sm:inline">
                /
              </span>
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-1.5 transition-opacity hover:text-foreground"
              >
                See the install flow in 30 seconds
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className={styles.heroProof}>
            <HeroProductFrame />
          </div>

          {/* HERO STATS */}
          <dl
            className={cn(
              styles.heroStats,
              'mx-auto grid w-full max-w-4xl grid-cols-1 gap-px overflow-hidden rounded-[1.75rem] border border-border/70 bg-border/70 sm:grid-cols-3',
            )}
          >
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-2 bg-background/90 p-5 backdrop-blur-sm sm:p-6"
              >
                <dt className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {stat.label}
                </dt>
                <dd className="text-4xl font-medium tracking-[-0.06em] sm:text-5xl">
                  {stat.value}
                </dd>
                <dd className="text-sm leading-6 text-muted-foreground">{stat.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* PROOF / COMPATIBILITY STRIP */}
      <section className="border-b border-border/60 bg-card/[0.12]">
        <div className="container py-6 sm:py-8">
          <div className="flex flex-col items-center gap-3 sm:gap-4">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.28em] text-muted-foreground">
              Built for your stack
            </p>
            <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:gap-x-5">
              {proofPills.map((pill) => (
                <li
                  key={pill.label}
                  className={cn(
                    styles.proofPill,
                    'inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/85 px-3.5 py-1.5 text-[0.78rem] font-medium text-foreground/85 backdrop-blur-sm transition-colors duration-200 hover:border-border hover:text-foreground sm:px-4',
                  )}
                >
                  {pill.icon ? (
                    <pill.icon className="size-3.5 text-muted-foreground" aria-hidden="true" />
                  ) : null}
                  {pill.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className={cn(styles.sectionAnchor, 'border-b border-border/60 bg-card/[0.18]')}
      >
        <div className="container py-20 lg:py-24">
          <SectionHeading
            eyebrow="How it works"
            title="A three-command flow built for repeatable delivery, not demo theatrics."
            description="Detect the repo, add the kit, and verify the result before shipping. Two steps are live in the public alpha today, the third is on the roadmap."
          />

          <div
            className={cn(styles.stepFlow, 'relative grid gap-8 lg:grid-cols-3 lg:gap-6 xl:gap-8')}
          >
            {installSteps.map((step, index) => (
              <StepCard
                key={step.command}
                step={step}
                isLast={index === installSteps.length - 1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* MOAT / DIFFERENTIATORS */}
      <section id="product" className={cn(styles.sectionAnchor, 'border-b border-border/60')}>
        <div className="container py-20 lg:py-28">
          <SectionHeading
            eyebrow="Payload-native moat"
            title="Integration quality is the product."
            description="Every install lands like a native repo update, not a pasted screenshot with a schema gap. The moat is that kits understand layouts, type generation, import-map updates, and the constraints agencies deal with every week."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {productDifferentiators.map((feature, index) => (
              <article
                key={feature.title}
                className={cn(
                  styles.featureCard,
                  'group relative flex flex-col gap-4 rounded-[1.5rem] border border-border/70 bg-background/86 p-6 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-border hover:shadow-[0_22px_55px_-38px_rgba(15,23,42,0.5)]',
                )}
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="grid size-11 place-items-center rounded-2xl border border-border/70 bg-card transition-colors group-hover:bg-foreground group-hover:text-background">
                  <feature.icon className="size-5" aria-hidden="true" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-medium tracking-[-0.04em]">{feature.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{feature.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 overflow-hidden rounded-[1.75rem] border border-border/70 bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col gap-4 border-b border-border/70 p-6 sm:p-7">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Why teams trust the install
              </p>
              <p className="max-w-3xl text-lg leading-7 tracking-[-0.01em] text-foreground/85">
                Curated kits that ship with the pieces agencies actually reuse — and the
                post-install hygiene other component CDNs leave behind.
              </p>
            </div>

            <div className="grid divide-border/60 sm:grid-cols-3 sm:divide-x">
              {whyPayloadKits.slice(0, 3).map((item) => (
                <div key={item.title} className="flex flex-col gap-3 p-6 sm:p-7">
                  <div className="grid size-10 place-items-center rounded-2xl border border-border/70 bg-card">
                    <item.icon className="size-5" aria-hidden="true" />
                  </div>
                  <p className="text-base font-medium tracking-[-0.03em]">{item.title}</p>
                  <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>

            <ul className="grid gap-3 border-t border-border/70 bg-card/30 p-6 sm:grid-cols-3 sm:p-7">
              {proofChecks.map((item) => (
                <li
                  key={item.text}
                  className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
                >
                  <item.icon className="mt-0.5 size-4 shrink-0 text-foreground" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CATALOG */}
      <section id="catalog" className={cn(styles.sectionAnchor, 'border-b border-border/60')}>
        <div className="container py-20 lg:py-28">
          <SectionHeading
            eyebrow="Live gallery"
            title="Two real kits. Two real install commands. Live previews."
            description="The gallery stays narrow on purpose: every kit you see here installs cleanly into a Payload v3 repo today, with type generation and import-map updates handled for you."
          />

          <KitGalleryTeaser />
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className={cn(styles.sectionAnchor, 'border-b border-border/60 bg-card/[0.2]')}>
        <div className="container py-20 lg:py-28">
          <SectionHeading
            eyebrow="Open core pricing"
            title="Free public trust layer. Paid private registry when the work gets serious."
            description="The public catalog builds trust and adoption. The private Pro namespace unlocks the premium kits and bundles that matter when you are shipping repeatedly for clients."
          />

          <div className="grid gap-6 lg:grid-cols-2">
            {registryColumns.map((column) => {
              const isHighlight = column.highlight
              return (
                <Card
                  key={column.title}
                  className={cn(
                    styles.pricingCard,
                    'flex flex-col gap-6 rounded-[1.75rem] border-border/70 shadow-none backdrop-blur-sm',
                    isHighlight
                      ? 'border-foreground/85 bg-background ring-1 ring-foreground/85'
                      : 'bg-background/80',
                  )}
                  data-highlight={isHighlight ? 'true' : 'false'}
                >
                  <CardHeader className="gap-4">
                    <div className="flex items-center justify-between gap-4">
                      <Badge
                        variant={isHighlight ? 'default' : 'secondary'}
                        className={cn(
                          'rounded-full px-4 py-1 text-[0.72rem] uppercase tracking-[0.18em]',
                          isHighlight
                            ? 'bg-foreground text-background hover:bg-foreground'
                            : 'bg-card text-foreground hover:bg-card',
                        )}
                      >
                        {column.badge}
                      </Badge>
                      <column.icon className="size-5 text-foreground" aria-hidden="true" />
                    </div>

                    <div className="flex flex-col gap-2">
                      <CardTitle className="text-3xl tracking-[-0.06em]">{column.title}</CardTitle>
                      <CardDescription className="text-base leading-7">
                        {column.description}
                      </CardDescription>
                    </div>

                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-5xl font-medium tracking-[-0.07em]">{column.price}</span>
                      {column.priceUnit && (
                        <span className="text-sm text-muted-foreground">
                          {column.priceUnit}
                        </span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="flex flex-1 flex-col gap-5">
                    <ul className="flex flex-col gap-3">
                      {column.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"
                        >
                          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-foreground" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      asChild
                      variant={isHighlight ? 'default' : 'outline'}
                      size="lg"
                      className={cn(
                        'mt-auto w-full justify-center rounded-full px-5 font-medium',
                        !isHighlight && 'border-border/70 bg-background/90 hover:bg-background',
                      )}
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
        </div>
      </section>

      {/* RELIABILITY */}
      <section className={cn(styles.sectionAnchor, 'border-b border-border/60')}>
        <div className="container py-20 lg:py-24">
          <SectionHeading
            eyebrow="Reliability"
            title="Sell install confidence, not just visual polish."
            description="Reliable installs, clean upgrades, and predictable repo wiring matter as much as the blocks themselves — especially when delivery volume starts climbing."
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:gap-5">
            {reliabilityItems.map((item) => (
              <article
                key={item.title}
                className={cn(
                  styles.reliabilityCard,
                  'flex flex-col gap-4 rounded-[1.5rem] border border-border/70 bg-background/86 p-6 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-border hover:shadow-[0_22px_55px_-38px_rgba(15,23,42,0.5)] sm:p-7',
                )}
              >
                <div className="grid size-12 place-items-center rounded-2xl border border-border/70 bg-card text-foreground">
                  <item.icon className="size-5" aria-hidden="true" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-medium tracking-[-0.04em]">{item.title}</h3>
                  <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className={cn(styles.sectionAnchor, 'border-b border-border/60 bg-card/[0.18]')}>
        <div className="container py-20 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <SectionHeading
              align="left"
              eyebrow="FAQ"
              title="Opinionated constraints, answered directly."
              description="The first launch stays narrow on purpose so the install experience can be dependable. These answers set the expectation up front."
            />
            <FaqAccordion />
          </div>
        </div>
      </section>

      <FinalCta />
    </main>
  )
}

type SectionHeadingProps = {
  align?: 'center' | 'left'
  description: string
  eyebrow: string
  title: string
}

function SectionHeading({ align = 'center', description, eyebrow, title }: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'mb-10 flex flex-col gap-3.5 sm:mb-12 lg:mb-14',
        align === 'center' ? 'mx-auto max-w-[46rem] text-center' : 'max-w-[42rem] text-left',
      )}
    >
      <Badge
        variant="outline"
        className={cn(
          'rounded-full border-border/70 bg-background/80 px-3.5 py-1 text-[0.7rem] font-medium uppercase tracking-[0.22em] backdrop-blur-sm sm:px-4',
          align === 'center' ? 'mx-auto' : 'mr-auto',
        )}
      >
        {eyebrow}
      </Badge>
      <h2 className="text-3xl font-medium leading-[1.02] tracking-[-0.06em] text-balance sm:text-4xl lg:text-[3rem]">
        {title}
      </h2>
      <p className="text-base leading-7 text-muted-foreground sm:text-[1.05rem]">{description}</p>
    </div>
  )
}

export default LandingPage
