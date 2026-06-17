import { ArrowUpRight } from 'lucide-react'

import { showcaseSetupTaxLabel, type ClientProject } from '@/lib/site'
import { cn } from '@/utilities/ui'

/* One client site, framed as a browser window: the polished result up top,
 * the manual setup tax it paid by hand below. Shares ComponentCard's shell and the
 * ComponentPreviewThumb framed-media idiom; the chrome borrows HeroProductFrame's
 * traffic lights. Pure presentation — no client hooks. */
export function ProjectShowcaseCard({
  className,
  project,
}: {
  className?: string
  project: ClientProject
}) {
  return (
    <article
      className={cn(
        'group flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-0.5 hover:shadow-frame',
        className,
      )}
    >
      {/* Browser chrome: traffic lights + a faux address bar showing the host. */}
      <div className="flex items-center gap-3 border-b border-border bg-muted/50 px-4 py-2.5">
        <div aria-hidden="true" className="flex shrink-0 items-center gap-1.5">
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
          <span className="size-2.5 rounded-full bg-foreground/15" />
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-1.5 rounded-md border border-border bg-background/80 px-2.5 py-1">
          <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-brand" />
          <span className="truncate font-mono text-[11px] text-muted-foreground">
            {project.displayUrl}
          </span>
        </div>
      </div>

      {/* Screenshot viewport — links to the live site, fades into the card. */}
      <a
        href={project.url}
        target="_blank"
        rel="noreferrer"
        aria-label={`Visit ${project.name} (opens in a new tab)`}
        className="relative block aspect-[16/10] overflow-hidden border-b border-border bg-muted/40 [mask-image:linear-gradient(to_bottom,black_82%,transparent)]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- no next/image in this project (no images config); plain /public asset by convention */}
        <img
          src={`/showcase/${project.slug}.jpg`}
          alt={project.alt}
          width={1280}
          height={800}
          loading="lazy"
          decoding="async"
          className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.015]"
        />
        <span className="absolute left-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/90 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground backdrop-blur-sm">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
          Live site
        </span>
      </a>

      {/* Body: name + summary, optional stat chips, then the tax it paid. */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-semibold tracking-tight text-foreground">{project.name}</h3>
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Visit ${project.name} (opens in a new tab)`}
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-foreground transition-colors hover:text-brand"
          >
            Visit
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{project.summary}</p>

        {project.taxStats?.length ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.taxStats.map((stat) => (
              <span
                key={stat.label}
                className="inline-flex items-baseline gap-1 rounded border border-border bg-secondary/60 px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground"
              >
                <span className="font-medium text-brand">
                  {stat.approx ? '~' : ''}
                  {stat.value}
                </span>
                {stat.label}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-5 border-t border-border pt-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            {showcaseSetupTaxLabel}
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {project.setupTax.map((item) => (
              <li
                key={item}
                className="flex items-start gap-2.5 text-[13px] leading-6 text-foreground/75"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground/50"
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  )
}
