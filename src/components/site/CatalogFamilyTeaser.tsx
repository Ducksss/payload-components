import Link from 'next/link'

import { ArrowRight, ArrowUpRight } from 'lucide-react'

import { CommandCopyButton } from '@/components/site/CommandCopyButton'
import { ComponentFamilyHeader } from '@/components/site/ComponentGrid'
import { DemoFitFrame } from '@/components/site/demos/DemoFitFrame'
import { demosBySlug } from '@/components/site/demos/registry'
import {
  componentCategories,
  componentEntries,
  componentFamilies,
  type ComponentEntry,
} from '@/lib/site'

/* The landing catalog, visual-first: instead of re-listing all installable
 * components as text rows (that index now lives in full at /components), each
 * page family shows ONE live demo twin as a preview, with a count and a real
 * install command. The previews are the same twins the catalog wall and the docs
 * pages render (demosBySlug), so the three surfaces never drift. */

/* Visually strongest representative per family — each has a twin in demosBySlug.
 * Families fall back to their first installable entry with a twin if the pick is
 * ever removed. */
const familyRepresentatives: Record<string, string> = {
  hero: 'hero-basic',
  features: 'feature-bento',
  content: 'content-showcase',
  cta: 'call-to-action-centered',
  integration: 'integration-orbit',
  logos: 'logo-cloud-marquee',
  team: 'team-grid',
  embed: 'embed-basic',
}

type PageFamily = {
  count: number
  key: string
  label: string
  representative: ComponentEntry
}

/* Page families with at least one installable component, in catalog order. */
function pageFamilies(): PageFamily[] {
  return Object.entries(componentCategories)
    .filter(([, category]) => category.family === 'pages')
    .map(([key, category]) => {
      const entries = componentEntries.filter((entry) => entry.category === key)
      const picked = familyRepresentatives[key]
      const representative =
        (picked && demosBySlug[picked] && entries.find((entry) => entry.slug === picked)) ||
        entries.find((entry) => demosBySlug[entry.slug])
      return representative
        ? { count: entries.length, key, label: category.label, representative }
        : null
    })
    .filter((family): family is PageFamily => family !== null)
}

function FamilyCard({ family }: { family: PageFamily }) {
  const Demo = demosBySlug[family.representative.slug]
  const categoryHref = `/components?category=${family.key}`

  return (
    <article
      id={family.representative.slug}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-card transition-shadow duration-300 hover:shadow-frame"
    >
      <Link
        href={categoryHref}
        aria-label={`Browse ${family.label} components`}
        className="relative block border-b border-border bg-muted/40"
      >
        <DemoFitFrame className="h-52 [mask-image:linear-gradient(to_bottom,black_82%,transparent)] transition-transform duration-500 ease-out group-hover:scale-[1.02] motion-reduce:transform-none motion-reduce:transition-none">
          <div className="px-4 py-4">
            {Demo ? <Demo /> : null}
          </div>
        </DemoFitFrame>
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/90 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground backdrop-blur">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
          Live preview
        </span>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h4 className="text-base font-semibold tracking-tight text-foreground">{family.label}</h4>
          <span className="shrink-0 rounded-full border border-border bg-muted/50 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {family.count} {family.count === 1 ? 'block' : 'blocks'}
          </span>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-border bg-muted/60 py-1 pl-3 pr-1">
          <code className="overflow-x-auto whitespace-nowrap font-mono text-[11px] text-foreground/90">
            {family.representative.command}
          </code>
          <CommandCopyButton command={family.representative.command} />
        </div>

        <Link
          href={categoryHref}
          className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-medium text-foreground transition-colors hover:text-brand"
        >
          Browse {family.label.toLowerCase()}
          <ArrowRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}

export function CatalogFamilyTeaser() {
  const families = pageFamilies()
  const installableCount = componentEntries.length

  return (
    <div className="flex flex-col gap-8">
      <ComponentFamilyHeader
        countLabel={componentFamilies.pages.countLabel}
        description={componentFamilies.pages.description}
        name={componentFamilies.pages.name}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {families.map((family) => (
          <FamilyCard key={family.key} family={family} />
        ))}
      </div>

      {/* The full index lives at /components — keep the landing an invitation, not a catalog. */}
      <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/components"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-brand"
        >
          Browse all {installableCount} components
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
        <Link
          href="/components"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
        >
          Post components · {componentFamilies.posts.countLabel}
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
