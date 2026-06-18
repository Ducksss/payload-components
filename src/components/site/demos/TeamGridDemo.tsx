import { Badge } from '@/components/ui/badge'
import { teamGridDemoContent, type TeamSectionDemoContent } from '@/lib/demo-content'

/* DEMO TWIN of payload-components/source/blocks/TeamGrid/Component.tsx
 * (team-grid@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions — nothing else may diverge:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2> / <h3>                              → <div> (the catalog owns its outline)
 *   <a href> profile link                    → <div> (aria-hidden twins hold no focusable elements)
 *   <Media> upload                           → presentational placeholder (no DB on the landing)
 *   TeamGridBlockData                        → TeamSectionDemoContent (@/payload-types is consumer-only)
 *   cn() outer wrapper                       → plain flex div (skipped by the class-mirror guard)
 * imgClassName values are not mirrored (they live on imgClassName, not className).
 * If the component Component.tsx changes, update this file in the same PR. */

export function TeamGridDemo({
  className,
  content = teamGridDemoContent,
}: {
  className?: string
  content?: TeamSectionDemoContent
}) {
  const { description, eyebrow, members, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-5xl flex-col gap-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4">
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
            </div>

            {description ? (
              <p className="max-w-md text-base leading-7 text-muted-foreground">{description}</p>
            ) : null}
          </div>

          {members && members.length > 0 ? (
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member, index) => (
                <div className="group overflow-hidden" key={index}>
                  <div className="h-96 w-full overflow-hidden rounded-md transition-all duration-500 group-hover:rounded-xl">
                    <div className="h-full w-full bg-muted" />
                  </div>

                  <div className="px-2 pt-4">
                    <div className="flex items-center justify-between">
                      <div className="text-base font-medium transition-all duration-500 group-hover:tracking-wider">
                        {member.name}
                      </div>
                      <span className="text-xs text-muted-foreground">_0{index + 1}</span>
                    </div>

                    <div className="mt-1 flex items-center justify-between">
                      <span className="translate-y-6 text-sm text-muted-foreground opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        {member.role}
                      </span>

                      <div className="inline-block translate-y-8 text-sm tracking-wide opacity-0 transition-all duration-500 hover:underline group-hover:translate-y-0 group-hover:opacity-100">
                        Profile
                      </div>
                    </div>
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
