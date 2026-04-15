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
      <section className={cn(styles.heroShell, 'overflow-hidden border-y border-border/60')}>
        <div className="container relative flex flex-col gap-14 py-10 sm:py-14 lg:gap-16 lg:py-20">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
            <Badge
              variant="outline"
              className="rounded-full bg-background/85 px-4 py-1 uppercase tracking-[0.2em] backdrop-blur-sm"
            >
              Payload Kits for agencies and freelancers
            </Badge>

            <div className="flex flex-col gap-4">
              <h1 className="text-5xl font-medium tracking-[-0.08em] text-balance sm:text-6xl lg:text-7xl">
                Payload Kits installs production-ready Payload blocks with one command.
              </h1>
              <p className="mx-auto max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Curated kits for Payload v3 + Next.js App Router projects that wire the schema,
                render component, admin-safe defaults, type generation, and import-map updates into
                the repo you actually ship.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-6">
                <Link href="#product">
                  See the product proof
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="rounded-full px-6">
                <Link href="#how-it-works">How it works</Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              Opinionated by design: Payload v3 only, Next.js App Router only, curated website kits
              first.
            </p>
          </div>

          <HeroProductFrame />
        </div>
      </section>

      <section className="border-b border-border/60">
        <div className="container py-5">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {proofPills.map((pill) => (
              <Badge
                key={pill.label}
                variant="secondary"
                className="rounded-full px-4 py-1 text-sm font-medium"
              >
                {pill.label}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="container py-16 lg:py-24">
        <SectionHeading
          eyebrow="How it works"
          title="A three-command flow built for repeatable delivery, not demo theatrics."
          description="The product surface stays intentionally narrow so installation quality can stay high. Detect the repo, add the kit, verify the result."
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {installSteps.map((step) => (
            <StepCard key={step.command} step={step} />
          ))}
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

              <div className="rounded-[1.75rem] border border-border/70 bg-background/85 p-6 shadow-none">
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

              <div className="grid gap-4 sm:grid-cols-2">
                {productDifferentiators.map((feature) => (
                  <Card
                    key={feature.title}
                    className="rounded-[1.5rem] border-border/70 bg-background/85 shadow-none"
                  >
                    <CardHeader className="gap-4">
                      <feature.icon className="size-5 text-foreground" />
                      <div className="flex flex-col gap-2">
                        <CardTitle className="text-2xl tracking-[-0.05em]">
                          {feature.title}
                        </CardTitle>
                        <CardDescription className="text-base leading-7">
                          {feature.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                  </Card>
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
                className="rounded-[1.75rem] border-border/70 bg-card/65 shadow-none backdrop-blur-sm"
              >
                <CardHeader className="gap-4">
                  <div className="flex items-center justify-between gap-4">
                    <Badge
                      variant="secondary"
                      className="rounded-full px-4 py-1 uppercase tracking-[0.18em]"
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

      <section className="container py-16 lg:py-24">
        <SectionHeading
          eyebrow="Reliability"
          title="Sell install confidence, not just visual polish."
          description="The page should make it obvious that success is measured by reliable installs, clean upgrades, and predictable project wiring as much as by how the blocks look."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {reliabilityItems.map((item) => (
            <Card
              key={item.title}
              className={cn(
                styles.panelLift,
                'rounded-[1.5rem] border-border/70 bg-background/90 shadow-none',
              )}
            >
              <CardHeader className="gap-4">
                <div className="grid size-11 place-items-center rounded-2xl border border-border/80 bg-card">
                  <item.icon className="size-5 text-foreground" />
                </div>
                <div className="flex flex-col gap-2">
                  <CardTitle className="text-2xl tracking-[-0.05em]">{item.title}</CardTitle>
                  <CardDescription className="text-base leading-7">
                    {item.description}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
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
        'mb-10 flex flex-col gap-4',
        align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl text-left',
      )}
    >
      <Badge
        variant="outline"
        className={cn(
          'rounded-full px-4 py-1 uppercase tracking-[0.2em]',
          align === 'center' ? 'mx-auto' : 'mr-auto',
        )}
      >
        {eyebrow}
      </Badge>
      <h2 className="text-4xl font-medium tracking-[-0.06em] text-balance sm:text-5xl">{title}</h2>
      <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
    </div>
  )
}

export default LandingPage
