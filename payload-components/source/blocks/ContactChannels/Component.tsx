import React from 'react'

import type { ContactChannelsBlock as ContactChannelsBlockData } from '@/payload-types'

import { getSafeContactHref } from '@/blocks/shared/contactUrls'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

type Props = ContactChannelsBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const ContactChannelsBlock: React.FC<Props> = ({
  channels,
  className,
  description,
  disableInnerContainer,
  eyebrow,
  footnote,
  id,
  title,
}) => {
  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div
          className={cn('flex flex-col gap-10', {
            'mx-auto max-w-5xl': !disableInnerContainer,
          })}
        >
          <div className="flex max-w-2xl flex-col gap-4">
            {eyebrow ? (
              <Badge
                variant="outline"
                className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow"
              >
                {eyebrow}
              </Badge>
            ) : null}

            <h2 className="text-3xl font-medium tracking-title text-balance sm:text-4xl">
              {title}
            </h2>

            {description ? (
              <p className="text-base leading-7 text-muted-foreground">{description}</p>
            ) : null}
          </div>

          {channels && channels.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {channels.map((channel, index) => {
                /* Rejects anything that would not resolve to a safe mailto:,
                   tel:, same-origin path, or HTTPS URL; an unsafe value falls
                   back to plain text rather than rendering a dead link. */
                const href = getSafeContactHref(channel.type, channel.value)

                return (
                  <div
                    key={channel.id ?? `${channel.label}-${index}`}
                    className="flex flex-col rounded-panel border border-border/70 bg-background/70 p-5"
                  >
                    <p className="text-sm font-medium text-foreground">{channel.label}</p>
                    {href ? (
                      <a
                        className="mt-2 block break-words text-base text-primary underline-offset-4 hover:underline"
                        href={href}
                      >
                        {channel.value}
                      </a>
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
                )
              })}
            </div>
          ) : null}

          {footnote ? <p className="text-sm leading-6 text-muted-foreground">{footnote}</p> : null}
        </div>
      </div>
    </section>
  )
}
