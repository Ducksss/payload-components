import { ArrowRight } from 'lucide-react'

import packageJson from '../../../../package.json' with { type: 'json' }

import { Accent, CaseHeading, Chapter, KeyedMark } from '@/components/site/case-study/parts'
import Link from '@/i18n/Link'
import { componentEntries, githubRepoUrl, pipelineStages } from '@/lib/site'
import { templateShowcases } from '@/lib/templates/registry'

/* Chapters 09 and credits. Every number is read from the source it describes —
 * the catalog, the template registry, the pipeline copy, the CLI's own
 * package.json — so the outcomes cannot drift from the product. */

const stats = [
  { label: 'components in the registry', value: componentEntries.length },
  { label: 'site templates composed from them', value: templateShowcases.length },
  { label: 'artifacts wired by every install', value: pipelineStages.length },
  {
    label: 'runtime dependencies in the published CLI',
    value: Object.keys(packageJson.dependencies).length,
  },
  { label: 'accent color, end to end', value: 1 },
  { label: 'pricing tiers, license keys, or waitlists', value: 0 },
] as const

const credits = [
  { label: 'Typefaces', value: 'Geist Sans and Geist Mono by Vercel; Instrument Serif' },
  { label: 'Built with', value: 'Next.js, Fumadocs, Tailwind CSS, shadcn/ui' },
  { label: 'Made for', value: 'Payload CMS v3 on Next.js' },
  { label: 'Color study', value: 'After Josef Albers, Homage to the Square' },
  { label: 'License', value: 'MIT — registry, CLI, components, and this site' },
] as const

export function CaseNumbers() {
  return (
    <section className="relative overflow-x-clip border-b border-border">
      <div className="container py-24 lg:py-36">
        <Chapter index="09">Outcomes</Chapter>
        <CaseHeading className="mt-8">
          By the <Accent>numbers</Accent>.
        </CaseHeading>
        <dl className="mt-16 grid gap-x-10 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-4 border-t border-border py-10 lg:py-12"
            >
              <dt className="order-2 max-w-[16rem] text-sm leading-6 text-muted-foreground">
                {stat.label}
              </dt>
              <dd className="order-1 text-[clamp(5rem,11vw,10.5rem)] font-medium leading-[0.8] tracking-display text-foreground">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}

export function CaseCredits() {
  return (
    <section className="relative overflow-x-clip">
      <div className="container py-24 lg:py-36">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Chapter index="10">Credits</Chapter>
            <dl className="mt-10 flex flex-col divide-y divide-border border-y border-border">
              {credits.map((credit) => (
                <div
                  key={credit.label}
                  className="grid gap-1 py-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6"
                >
                  <dt className="font-mono text-[10px] font-medium uppercase leading-6 tracking-eyebrow text-muted-foreground">
                    {credit.label}
                  </dt>
                  <dd className="text-sm leading-6 text-foreground">{credit.value}</dd>
                </div>
              ))}
            </dl>
            <a
              className="mt-8 inline-flex items-center gap-2 font-mono text-xs text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
              href={githubRepoUrl}
              rel="noreferrer"
              target="_blank"
            >
              github.com/Ducksss/payload-components
            </a>
          </div>

          <div className="flex flex-col justify-between gap-12 lg:col-span-6 lg:col-start-7">
            <KeyedMark className="size-16" />
            <div>
              <p className="font-mono text-[11px] font-medium uppercase tracking-eyebrow text-muted-foreground">
                Next
              </p>
              <Link className="group mt-5 block" href="/docs/design">
                <CaseHeading className="transition-colors group-hover:text-brand">
                  Read the design <Accent>philosophy</Accent>
                  <ArrowRight
                    aria-hidden="true"
                    className="ms-3 inline size-[0.6em] align-baseline transition-transform group-hover:translate-x-2"
                  />
                </CaseHeading>
              </Link>
              <p className="mt-6 max-w-md text-pretty leading-7 text-muted-foreground">
                The principles, the decision ledger with a receipt for every choice, and the rules
                behind this page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
