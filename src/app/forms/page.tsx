import type { Metadata } from 'next'

import Link from 'next/link'

import {
  ArrowRight,
  CheckCircle2,
  FileCode2,
  MailPlus,
  Route,
  ShieldCheck,
  SquareTerminal,
} from 'lucide-react'

import { JsonLd } from '@/components/seo/JsonLd'
import { CommandCopyButton } from '@/components/site/CommandCopyButton'
import { CallToActionSignupDemo } from '@/components/site/demos/CallToActionSignupDemo'
import { Eyebrow, Section, SectionHeading } from '@/components/site/section'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { componentEntries } from '@/lib/site'
import { breadcrumbNode, graph } from '@/lib/structured-data'

const description =
  'Install form-facing Payload CMS components honestly: start with the email-capture CTA block, get Payload wiring in one command, and bring your own same-origin form handler.'

function getSignupBlock() {
  const block = componentEntries.find((component) => component.slug === 'call-to-action-signup')

  if (!block) {
    throw new Error('Missing call-to-action-signup component entry')
  }

  return block
}

const signupBlock = getSignupBlock()

export const metadata: Metadata = {
  alternates: { canonical: '/forms' },
  title: 'Payload Forms Install Guide',
  description,
  openGraph: {
    description,
    title: 'Payload Forms Install Guide',
    type: 'website',
    url: '/forms',
  },
  twitter: {
    card: 'summary_large_image',
    description,
    title: 'Payload Forms Install Guide',
  },
}

const formsStructuredData = graph(
  breadcrumbNode([
    { name: 'Home', path: '/' },
    { name: 'Forms install guide', path: '/forms' },
  ]),
)

const proofRows = [
  {
    copy: 'The registry ships an email-capture call-to-action block with editable title, copy, placeholder, submit label, and form action fields.',
    icon: MailPlus,
    label: 'Available today',
  },
  {
    copy: 'The installer copies block source, registers it in the Pages collection, maps the renderer, then regenerates types and the admin import map.',
    icon: CheckCircle2,
    label: 'Wired by the CLI',
  },
  {
    copy: 'The block validates that form actions stay same-origin, such as /api/newsletter, before it renders the post target.',
    icon: ShieldCheck,
    label: 'Safer form surface',
  },
] as const

const installSteps = [
  {
    body: 'Run the CLI from a supported Payload v3 and Next.js project. The command installs the form-facing CTA block and lands everything as a normal repo diff.',
    icon: SquareTerminal,
    title: 'Install the signup block',
  },
  {
    body: 'Review the added block config, component source, Pages collection patch, RenderBlocks mapping, generated types, and admin import map.',
    icon: FileCode2,
    title: 'Review what changed',
  },
  {
    body: 'Create the same-origin endpoint named in the action field. Payload Components gives you the editable form surface, not the email service or CRM pipeline.',
    icon: Route,
    title: 'Bring the handler',
  },
] as const

const boundaryRows = [
  {
    label: 'It is',
    text: 'A page block for email capture, newsletter signups, waitlists, and other simple one-field capture moments.',
  },
  {
    label: 'It is not',
    text: 'A general form builder, submissions database, spam layer, email provider integration, or CRM connector.',
  },
  {
    label: 'You can extend',
    text: 'The installed source after it lands in your repo, including fields, validation, and the endpoint it posts to.',
  },
] as const

export default function FormsPage() {
  return (
    <>
      <JsonLd data={formsStructuredData} />
      <SiteHeader />

      <main className="flex-1">
        <section className="overflow-hidden border-b border-border">
          <div className="container grid gap-10 py-14 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.82fr)] lg:items-center lg:py-20">
            <div className="max-w-3xl">
              <Eyebrow>Payload forms</Eyebrow>
              <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.04] text-foreground sm:text-5xl">
                Payload forms start with one honest install.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                Payload Components does not ship a full form builder or submission backend today.
                It does ship a form-facing signup block that installs the Payload config, renderer,
                generated types, import map, and same-origin action surface in one command.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={signupBlock.href}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Open the signup block
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/components?category=cta"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  Browse CTA blocks
                </Link>
              </div>

              <div className="mt-6 flex max-w-full flex-col gap-2 rounded-md border border-border bg-muted/40 p-3 sm:inline-flex sm:flex-row sm:items-center">
                <code className="min-w-0 overflow-x-auto whitespace-nowrap font-mono text-sm text-foreground">
                  {signupBlock.command}
                </code>
                <CommandCopyButton command={signupBlock.command} />
              </div>
            </div>

            <aside className="rounded-md border border-border bg-muted/30 p-4 sm:p-5">
              <p className="font-mono text-[11px] font-medium uppercase text-muted-foreground">
                Current support
              </p>
              <div className="mt-5 flex flex-col gap-4">
                {proofRows.map((row) => {
                  const Icon = row.icon

                  return (
                    <div key={row.label} className="flex gap-3">
                      <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-background text-brand">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <div>
                        <h2 className="text-sm font-semibold text-foreground">{row.label}</h2>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">{row.copy}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </aside>
          </div>
        </section>

        <Section>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-start">
            <div>
              <SectionHeading
                eyebrow="What you get"
                heading="A form surface, already wired for Payload."
                intro="The useful part is not just a rendered input. The install makes the block editable in Payload, renderable on the frontend, and visible to TypeScript and the admin import map."
              />
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/docs/installation"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  Read install docs
                </Link>
                <Link
                  href="/docs/architecture"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  See architecture
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-md border border-border bg-background">
              <CallToActionSignupDemo />
            </div>
          </div>
        </Section>

        <Section className="bg-muted/35">
          <div className="grid gap-6 lg:grid-cols-3">
            {installSteps.map((step, index) => {
              const Icon = step.icon

              return (
                <article key={step.title} className="rounded-md border border-border bg-background p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex size-10 items-center justify-center rounded-md bg-brand/10 text-brand">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      Step {index + 1}
                    </span>
                  </div>
                  <h2 className="mt-5 text-lg font-semibold text-foreground">{step.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.body}</p>
                  {index === 0 ? (
                    <div className="mt-5 flex items-center justify-between gap-3 rounded-md border border-border bg-muted/45 p-3">
                      <code className="min-w-0 overflow-x-auto whitespace-nowrap font-mono text-xs text-foreground">
                        {signupBlock.command}
                      </code>
                      <CommandCopyButton command={signupBlock.command} />
                    </div>
                  ) : null}
                </article>
              )
            })}
          </div>
        </Section>

        <Section>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <SectionHeading
              eyebrow="Boundaries"
              heading="What the forms page can promise."
              intro="This page is deliberately narrow. It routes form intent to the block that exists today and leaves backend form decisions where they belong: inside your project."
            />

            <div className="grid gap-4">
              {boundaryRows.map((row) => (
                <div key={row.label} className="rounded-md border border-border bg-muted/30 p-5">
                  <h2 className="font-mono text-[11px] font-medium uppercase text-muted-foreground">
                    {row.label}
                  </h2>
                  <p className="mt-3 text-base leading-7 text-foreground">{row.text}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section className="bg-foreground text-background">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <Eyebrow className="text-background/70">Start with the real block</Eyebrow>
              <h2 className="mt-4 max-w-2xl text-3xl font-semibold leading-[1.08] sm:text-4xl">
                Install the form-facing CTA, then add the backend you trust.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-background/70">
                The command gets the editable Payload surface into your repo. Your project still
                chooses where submissions go and how they are stored, filtered, or sent.
              </p>
            </div>

            <Link
              href={signupBlock.href}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-background px-5 text-sm font-medium text-foreground transition-colors hover:bg-background/90"
            >
              View component docs
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </Section>
      </main>

      <SiteFooter />
    </>
  )
}
