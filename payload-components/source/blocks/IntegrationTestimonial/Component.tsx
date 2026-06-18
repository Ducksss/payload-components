import React from 'react'

import type { IntegrationTestimonialBlock as IntegrationTestimonialBlockData } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type Props = IntegrationTestimonialBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const IntegrationTestimonialBlock: React.FC<Props> = ({
  author,
  authorAvatar,
  className,
  disableInnerContainer,
  heading,
  id,
  integrations,
  quote,
  role,
  subtext,
}) => {
  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div
          className={cn('grid items-center gap-10 md:grid-cols-2', {
            'mx-auto max-w-5xl': !disableInnerContainer,
          })}
        >
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-5">
              <h2 className="text-balance text-2xl font-semibold tracking-heading text-foreground sm:text-3xl">
                {heading}
              </h2>
              {subtext ? (
                <p className="text-pretty text-sm text-muted-foreground sm:text-base">{subtext}</p>
              ) : null}
            </div>

            <figure className="flex flex-col gap-4 border-l-2 border-border pl-5">
              <blockquote className="text-pretty text-sm text-foreground sm:text-base">
                {quote}
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center overflow-hidden rounded-full border border-border/70 bg-card">
                  {authorAvatar ? (
                    <Media resource={authorAvatar} imgClassName="size-full object-cover" />
                  ) : null}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">{author}</span>
                  {role ? <span className="text-xs text-muted-foreground">{role}</span> : null}
                </div>
              </figcaption>
            </figure>
          </div>

          {integrations && integrations.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {integrations.map((item, index) => (
                <div
                  className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-background/60 p-4"
                  key={item.id ?? `${item.name}-${index}`}
                >
                  <div className="flex size-10 items-center justify-center rounded-lg border border-border/70 bg-card">
                    <Media resource={item.logo} imgClassName="size-5 w-auto object-contain" />
                  </div>
                  <div className="text-sm font-medium text-foreground">{item.name}</div>
                  {item.description ? (
                    <p className="line-clamp-2 text-xs text-muted-foreground">{item.description}</p>
                  ) : null}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
