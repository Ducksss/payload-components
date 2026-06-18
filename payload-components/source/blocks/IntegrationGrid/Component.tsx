import React from 'react'

import type { IntegrationGridBlock as IntegrationGridBlockData } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type Props = IntegrationGridBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const IntegrationGridBlock: React.FC<Props> = ({
  className,
  disableInnerContainer,
  heading,
  id,
  integrations,
  subtext,
}) => {
  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div
          className={cn('flex flex-col gap-12', {
            'mx-auto max-w-5xl': !disableInnerContainer,
          })}
        >
          <div className="flex flex-col gap-4 text-center">
            <h2 className="text-balance text-2xl font-semibold tracking-heading text-foreground sm:text-3xl">
              {heading}
            </h2>
            {subtext ? (
              <p className="mx-auto max-w-2xl text-pretty text-sm text-muted-foreground sm:text-base">
                {subtext}
              </p>
            ) : null}
          </div>

          {integrations && integrations.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {integrations.map((item, index) => (
                <div
                  className="flex flex-col gap-5 rounded-2xl border border-border/70 bg-background/60 p-6"
                  key={item.id ?? `${item.name}-${index}`}
                >
                  <div className="flex size-11 items-center justify-center rounded-xl border border-border/70 bg-card">
                    <Media resource={item.logo} imgClassName="size-6 w-auto object-contain" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-base font-medium text-foreground">{item.name}</h3>
                    {item.description ? (
                      <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                    ) : null}
                  </div>

                  {item.href ? (
                    <div className="mt-auto border-t border-dashed border-border/70 pt-5">
                      <a
                        className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                        href={item.href}
                      >
                        Learn more
                        <span aria-hidden="true">&rarr;</span>
                      </a>
                    </div>
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
