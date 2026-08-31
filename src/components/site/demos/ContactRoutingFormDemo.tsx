import { Badge } from '@/components/ui/badge'
import {
  contactRoutingFormDemoContent,
  type ContactRoutingFormDemoContent,
} from '@/lib/demo-content'

/* DEMO TWIN of payload-components/source/blocks/ContactRoutingForm/Component.tsx
 * (contact-routing-form@0.2.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions — nothing else
 * may diverge:
 *   <section className={cn('container', …)}> → <div> root (no landmark)
 *   <h2>/<h3>                                → <div>s (the catalog owns its outline)
 *   <a>                                      → <span> (aria-hidden content is not focusable)
 *   form controls/Button                     → non-interactive visual <div>s
 *   ContactRoutingFormBlockData              → ContactRoutingFormDemoContent
 *   cn() inner wrapper                       → fixed max-width div
 * If the component Component.tsx changes, update this file in the same PR. */

export function ContactRoutingFormDemo({
  className,
  content = contactRoutingFormDemoContent,
}: {
  className?: string
  content?: ContactRoutingFormDemoContent
}) {
  const {
    channels,
    description,
    eyebrow,
    formConfigured,
    formDescription,
    formLabels,
    formTitle,
    submitLabel,
    title,
  } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-10">
          <div className="flex max-w-3xl flex-col gap-4">
            {eyebrow ? (
              <Badge
                variant="outline"
                className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow"
              >
                {eyebrow}
              </Badge>
            ) : null}

            <div className="text-4xl font-medium tracking-display text-balance sm:text-5xl">
              {title}
            </div>
            {description ? (
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
            ) : null}
          </div>

          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
            <address className="not-italic">
              {channels.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {channels.map((channel, index) => (
                    <div
                      key={`${channel.label}-${index}`}
                      className="rounded-panel border border-border/70 bg-background/70 p-5"
                    >
                      <p className="text-sm font-medium text-foreground">{channel.label}</p>
                      {index === 0 ? (
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
            </address>

            <div className="rounded-panel border border-border/70 bg-background/85 p-6 sm:p-8">
              <div className="mb-6 flex flex-col gap-2">
                <div className="text-2xl font-medium tracking-title text-foreground">
                  {formTitle}
                </div>
                {formDescription ? (
                  <p className="text-sm leading-6 text-muted-foreground">{formDescription}</p>
                ) : null}
              </div>

              <div className="relative flex flex-col gap-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  {formLabels.slice(0, 4).map((label) => (
                    <div className="flex flex-col gap-2" key={label}>
                      <div className="text-sm font-medium text-foreground">{label}</div>
                      <div className="h-10 rounded-md border border-input bg-background" />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-medium text-foreground">{formLabels[4]}</div>
                  <div className="h-28 rounded-md border border-input bg-background" />
                </div>
                <div className="absolute left-0 top-0 size-px opacity-0" />
                <span className="inline-flex h-10 w-full items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground sm:w-fit">
                  {submitLabel}
                </span>
              </div>

              {!formConfigured ? (
                <p className="mt-4 text-sm text-destructive">
                  Configure a valid same-origin form action before publishing.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
