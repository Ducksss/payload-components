import { Badge } from '@/components/ui/badge'
import { teamBiosDemoContent, type TeamSectionDemoContent } from '@/lib/demo-content'

/* DEMO TWIN of payload-components/source/blocks/TeamBios/Component.tsx
 * (team-bios@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions — nothing else may diverge:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2> / <h3>                              → <div> (the catalog owns its outline)
 *   <article>                                → <div> (role-neutral inside an aria-hidden twin)
 *   <a href> profile link                    → <div> (aria-hidden twins hold no focusable elements)
 *   <Media> upload                           → presentational placeholder (no DB on the landing)
 *   TeamBiosBlockData                        → TeamSectionDemoContent (@/payload-types is consumer-only)
 *   cn() outer wrapper                       → plain flex div (skipped by the class-mirror guard)
 * imgClassName values are not mirrored (they live on imgClassName, not className).
 * If the component Component.tsx changes, update this file in the same PR. */

export function TeamBiosDemo({
  className,
  content = teamBiosDemoContent,
}: {
  className?: string
  content?: TeamSectionDemoContent
}) {
  const { description, eyebrow, members, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-5xl flex-col gap-12">
          <div className="flex max-w-2xl flex-col gap-4">
            {eyebrow ? (
              <Badge
                variant="outline"
                className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow"
              >
                {eyebrow}
              </Badge>
            ) : null}

            <div className="text-3xl font-medium tracking-title text-balance sm:text-4xl">
              {title}
            </div>

            {description ? (
              <p className="text-base leading-7 text-muted-foreground">{description}</p>
            ) : null}
          </div>

          {members && members.length > 0 ? (
            <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
              {members.map((member, index) => (
                <div
                  className="flex flex-col gap-4 rounded-panel border border-border/70 bg-background/70 p-6"
                  key={index}
                >
                  <div className="flex items-center gap-4">
                    <div className="size-14 shrink-0 overflow-hidden rounded-full border border-border/70 bg-card p-0.5">
                      <div className="h-full w-full rounded-full bg-muted" />
                    </div>

                    <div className="flex min-w-0 flex-col">
                      <div className="truncate text-base font-medium text-foreground">
                        {member.name}
                      </div>
                      <span className="truncate text-sm text-muted-foreground">{member.role}</span>
                    </div>
                  </div>

                  <p className="text-sm leading-6 text-muted-foreground">{member.bio}</p>

                  <div className="mt-auto w-fit text-sm font-medium text-foreground underline-offset-4 hover:underline">
                    Read more
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
