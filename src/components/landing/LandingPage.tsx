import type { Metadata } from 'next'
import Link from 'next/link'

import { FinalCta } from '@/components/landing/FinalCta'
import { FaqAccordion } from '@/components/landing/FaqAccordion'
import { HeroProductFrame } from '@/components/landing/HeroProductFrame'
import { KitCatalog } from '@/components/landing/KitCatalog'
import { StepCard } from '@/components/landing/StepCard'
import {
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
import { Separator } from '@/components/ui/separator'
import { cn } from '@/utilities/ui'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export const landingMetadata: Metadata = {
  title: 'Payload Kits | Install production-ready Payload blocks with one command',
  description:
    'Payload Kits is a Payload-native kit platform for agencies and freelancers. Install curated block kits with one command, including schema wiring, render components, type generation, and import-map updates.',
  openGraph: {
    description:
      'Payload Kits is a Payload-native kit platform for agencies and freelancers. Install curated block kits with one command, including schema wiring, render components, type generation, and import-map updates.',
    title: 'Payload Kits | Install production-ready Payload blocks with one command',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    description:
      'Payload Kits is a Payload-native kit platform for agencies and freelancers. Install curated block kits with one command, including schema wiring, render components, type generation, and import-map updates.',
    title: 'Payload Kits | Install production-ready Payload blocks with one command',
  },
}

export function LandingPage() {
  return (
    <main className="bg-background text-foreground">
      <section className={cn(styles.heroShell, 'overflow-hidden border-b border-border/60')}>
        <div className="container relative flex flex-col gap-10 py-8 sm:py-12 lg:gap-12 lg:py-16">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
            <Badge
              variant="outline"
              className="rounded-full bg-background/90 px-3.5 py-1 text-[0.72rem] font-medium uppercase tracking-[0.18em] backdrop-blur-sm sm:px-4"
            >
              Payload Kits for agencies and freelancers
            </Badge>

            <div className="flex flex-col gap-3">
              <h1 className="max-w-5xl text-[clamp(2.7rem,9vw,6.5rem)] font-medium leading-[0.92] tracking-[-0.085em] text-balance">
                Payload Kits installs production-ready blocks with one command.
              </h1>
              <p className="mx-auto max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                Curated kits wire schema, render components, generated types, and import-map
                updates into real Payload v3 repos.
              </p>
            </div>

            <div className="flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="w-full rounded-full px-6 sm:w-auto">
                <Link href="#product">
                  See the product proof
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full rounded-full px-6 sm:w-auto"
              >
                <Link href="#how-it-works">How it works</Link>
              </Button>
            </div>

          </div>

          <HeroProductFrame />
        </div>
      </section>

      <section className="border-b border-border/60">
        <div className="container py-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {proofPills.map((pill) => (
              <Badge
                key={pill.label}
                variant="secondary"
                className="rounded-full px-3.5 py-1 text-[0.78rem] font-medium sm:px-4"
              >
                {pill.label}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-b border-border/60 bg-card/[0.18]">
        <div className="container py-16 lg:py-20">
          <SectionHeading
            eyebrow="How it works"
            title="A three-command flow built for repeatable delivery, not demo theatrics."
            description="Detect the repo, add the kit, and verify the result before shipping."
          />

          <div className="grid gap-8 border-t border-border/60 pt-6 lg:grid-cols-3 lg:gap-10 lg:pt-8">
            {installSteps.map((step) => (
              <StepCard key={step.command} step={step} />
            ))}
          </div>
        </div>
      </section>

      <section id="product" className="border-y border-border/60 bg-card/35">
        <div className="container py-16 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="flex flex-col gap-6">
              <SectionHeading
                align="left"
                eyebrow="Payload-native moat"
                title="The value is not just the block. It is everything required to make the block belong."
                description="Payload Kits is positioned as a kit platform, not a generic component CDN. Every install is meant to feel like a native repo update rather than a pasted screenshot with a schema gap."
              />

              <div className="rounded-[1.75rem] border border-border/70 bg-background/78 p-6 shadow-none">
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                  Why teams trust the install
                </p>
                <div className="mt-5 flex flex-col gap-4">
                  {proofChecks.map((item) => (
                    <div key={item.text} className="flex items-start gap-3">
                      <item.icon className="mt-0.5 size-4 shrink-0 text-foreground" />
                      <p className="text-sm leading-7 text-muted-foreground">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-background/62">
                {productDifferentiators.map((feature) => (
                  <div
                    key={feature.title}
                    className="flex items-start gap-4 border-t border-border/70 px-6 py-5 first:border-t-0"
                  >
                    <div className="grid size-10 shrink-0 place-items-center rounded-2xl border border-border/70 bg-background/80">
                      <feature.icon className="size-5 text-foreground" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <p className="text-xl font-medium tracking-[-0.05em]">{feature.title}</p>
                      <p className="text-sm leading-7 text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4">
              <Card className="rounded-[1.75rem] border-border/70 bg-background/90 shadow-none">
                <CardHeader className="gap-4">
                  <Badge
                    variant="outline"
                    className="w-fit rounded-full px-3 py-1 uppercase tracking-[0.18em]"
                  >
                    Why this wins
                  </Badge>
                  <div className="flex flex-col gap-2">
                    <CardTitle className="text-3xl tracking-[-0.06em]">
                      Integration quality is the product.
                    </CardTitle>
                    <CardDescription className="text-base leading-7">
                      The moat is that kits understand Payload layouts, type generation, import-map
                      updates, and the repo constraints agencies deal with every week.
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4">
                  {whyPayloadKits.map((item, index) => (
                    <div key={item.title}>
                      {index > 0 && <Separator className="mb-4" />}
                      <div className="flex items-start gap-4">
                        <div className="grid size-11 place-items-center rounded-2xl border border-border/80 bg-card">
                          <item.icon className="size-5 text-foreground" />
                        </div>
                        <div>
                          <p className="text-lg font-medium tracking-[-0.04em]">{item.title}</p>
                          <p className="mt-2 text-sm leading-7 text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="catalog" className="container py-16 lg:py-24">
        <SectionHeading
          eyebrow="Kit catalog"
          title="Start with the blocks agencies and freelancers actually install on repeat."
          description="v1 stays deliberately focused on website blocks first: heroes, pricing, testimonials, FAQs, CTAs, forms, proof sections, and the supporting content layouts around them."
        />

        <KitCatalog />
      </section>

      <section id="pricing" className="border-y border-border/60">
        <div className="container py-16 lg:py-24">
          <SectionHeading
            eyebrow="Open core business model"
            title="Free public trust layer. Paid private registry when the work gets serious."
            description="The public catalog builds trust and adoption. The private Pro namespace unlocks the premium kits and bundles that matter when you are shipping repeatedly for clients."
          />

          <div className="grid gap-6 lg:grid-cols-2">
            {registryColumns.map((column) => (
              <Card
                key={column.title}
                className="rounded-[1.75rem] border-border/70 bg-background/72 shadow-none backdrop-blur-sm"
              >
                <CardHeader className="gap-4">
                  <div className="flex items-center justify-between gap-4">
                    <Badge
                      variant="secondary"
                      className="rounded-full px-4 py-1 text-[0.72rem] uppercase tracking-[0.18em]"
                    >
                      {column.badge}
                    </Badge>
                    <column.icon className="size-5 text-foreground" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <CardTitle className="text-3xl tracking-[-0.06em]">{column.title}</CardTitle>
                    <CardDescription className="text-base leading-7">
                      {column.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="flex flex-col gap-3">
                  {column.points.map((point) => (
                    <div
                      key={point}
                      className="flex items-start gap-3 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-foreground" />
                      <span>{point}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-card/[0.16]">
        <div className="container py-16 lg:py-20">
          <SectionHeading
            eyebrow="Reliability"
            title="Sell install confidence, not just visual polish."
            description="Make it obvious that reliable installs, clean upgrades, and predictable repo wiring matter as much as the blocks themselves."
          />

          <div className="overflow-hidden rounded-[1.75rem] border border-border/70 bg-background/70 backdrop-blur-sm">
            {reliabilityItems.map((item) => (
              <div
                key={item.title}
                className={cn(
                  styles.panelLift,
                  'flex flex-col gap-4 border-t border-border/70 px-6 py-5 first:border-t-0 md:flex-row md:items-start md:gap-5',
                )}
              >
                <div className="grid size-11 shrink-0 place-items-center rounded-2xl border border-border/80 bg-card">
                  <item.icon className="size-5 text-foreground" />
                </div>
                <div className="max-w-3xl">
                  <p className="text-2xl font-medium tracking-[-0.05em]">{item.title}</p>
                  <p className="mt-2 text-base leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="border-t border-border/60 bg-card/35">
        <div className="container py-16 lg:py-24">
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
        'mb-8 flex flex-col gap-3.5 sm:mb-10 lg:mb-12',
        align === 'center' ? 'mx-auto max-w-[46rem] text-center' : 'max-w-[42rem] text-left',
      )}
    >
      <Badge
        variant="outline"
        className={cn(
          'rounded-full px-3.5 py-1 text-[0.72rem] font-medium uppercase tracking-[0.18em] sm:px-4',
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
