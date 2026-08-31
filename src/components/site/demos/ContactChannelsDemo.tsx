import { Badge } from '@/components/ui/badge'
import { contactChannelsDemoContent, type ContactChannelsDemoContent } from '@/lib/demo-content'

/* DEMO TWIN of payload-components/source/blocks/ContactChannels/Component.tsx
 * (contact-channels@0.1.0). Class strings are copied verbatim from the component
 * source, in source order. Deliberate substitutions — nothing else may diverge:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2>                                     → <div> (the catalog owns its outline)
 *   <a href> channel link                    → <span> carrying the same class string
 *                                              (aria-hidden twins hold no focusable elements)
 *   ContactChannelsBlockData                 → ContactChannelsDemoContent (@/payload-types is
 *                                              consumer-only)
 *   cn() outer wrapper                       → plain flex div (skipped by the class-mirror guard)
 * If the component Component.tsx changes, update this file in the same PR. */

export function ContactChannelsDemo({
  className,
  content = contactChannelsDemoContent,
}: {
  className?: string
  content?: ContactChannelsDemoContent
}) {
  const { channels, description, eyebrow, footnote, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-5xl flex-col gap-10">
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

          {channels.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {channels.map((channel, index) => (
                <div
                  key={`${channel.label}-${index}`}
                  className="flex flex-col rounded-panel border border-border/70 bg-background/70 p-5"
                >
                  <p className="text-sm font-medium text-foreground">{channel.label}</p>
                  {/* The block styles a channel by whether its value resolves to a
                      safe href. The twin has no resolver, so — following
                      ContactRoutingFormDemo — it renders both branches
                      positionally: the linked treatment for every card but the
                      last, which stands in for the unresolved fallback. Both
                      class strings stay mirrored, and neither branch is a real
                      link (aria-hidden twins hold no focusable elements). */}
                  {index < channels.length - 1 ? (
                    <span className="mt-2 block break-words text-base text-primary underline-offset-4 hover:underline">
                      {channel.value}
                    </span>
                  ) : (
                    <span className="mt-2 block break-words text-base text-muted-foreground">
                      {channel.value}
                    </span>
                  )}
                  {channel.description ? (
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {channel.description}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}

          {footnote ? <p className="text-sm leading-6 text-muted-foreground">{footnote}</p> : null}
        </div>
      </div>
    </div>
  )
}
