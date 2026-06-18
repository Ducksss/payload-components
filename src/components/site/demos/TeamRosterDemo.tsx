import { Badge } from '@/components/ui/badge'
import { teamRosterDemoContent, type TeamSectionDemoContent } from '@/lib/demo-content'

/* DEMO TWIN of payload-components/source/blocks/TeamRoster/Component.tsx
 * (team-roster@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions — nothing else may diverge:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2> / <h3>                              → <div> (the catalog owns its outline)
 *   <Media> upload                           → presentational placeholder (no DB on the landing)
 *   TeamRosterBlockData                      → TeamSectionDemoContent (@/payload-types is consumer-only)
 *   cn() outer wrapper                       → plain flex div (skipped by the class-mirror guard)
 * imgClassName values are not mirrored (they live on imgClassName, not className).
 * If the component Component.tsx changes, update this file in the same PR. */

export function TeamRosterDemo({
  className,
  content = teamRosterDemoContent,
}: {
  className?: string
  content?: TeamSectionDemoContent
}) {
  const { eyebrow, groups, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-5xl flex-col gap-12">
          <div className="flex flex-col gap-4">
            {eyebrow ? (
              <Badge
                variant="outline"
                className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow"
              >
                {eyebrow}
              </Badge>
            ) : null}

            <div className="text-4xl font-medium tracking-display text-balance">{title}</div>
          </div>

          {groups && groups.length > 0 ? (
            <div className="flex flex-col gap-10">
              {groups.map((group, groupIndex) => (
                <div className="flex flex-col gap-6" key={groupIndex}>
                  <div className="text-lg font-medium">{group.label}</div>

                  <div className="grid grid-cols-2 gap-6 border-t border-border/70 pt-6 md:grid-cols-4">
                    {group.members.map((member, memberIndex) => (
                      <div className="flex flex-col gap-2" key={memberIndex}>
                        <div className="size-20 overflow-hidden rounded-full border border-border/70 bg-card p-0.5">
                          <div className="h-full w-full bg-muted" />
                        </div>
                        <span className="text-sm">{member.name}</span>
                        <span className="text-xs text-muted-foreground">{member.role}</span>
                      </div>
                    ))}
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
