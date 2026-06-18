import { Plus } from 'lucide-react'
import React from 'react'

import type { IntegrationListBlock as IntegrationListBlockData } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type Props = IntegrationListBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const IntegrationListBlock: React.FC<Props> = ({
  className,
  disableInnerContainer,
  heading,
  id,
  integrations,
  subtext,
}) => {
  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div
          className={cn('flex flex-col gap-10', {
            'mx-auto max-w-2xl': !disableInnerContainer,
          })}
        >
          <div className="flex flex-col gap-4 text-center">
            <h2 className="text-balance text-2xl font-semibold tracking-heading text-foreground sm:text-3xl">
              {heading}
            </h2>
            {subtext ? (
              <p className="mx-auto max-w-xl text-pretty text-sm text-muted-foreground sm:text-base">
                {subtext}
              </p>
            ) : null}
          </div>

          {integrations && integrations.length > 0 ? (
            <div className="flex flex-col rounded-2xl border border-border/70 bg-background/60 px-5">
              {integrations.map((item, index) => {
                const action = (
                  <span className="flex size-9 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                    <Plus className="size-4" />
                  </span>
                )

                return (
                  <div
                    className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-dashed border-border/70 py-4 last:border-b-0"
                    key={item.id ?? `${item.name}-${index}`}
                  >
                    <div className="flex size-11 items-center justify-center rounded-xl border border-border/70 bg-card">
                      <Media resource={item.logo} imgClassName="size-6 w-auto object-contain" />
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <h3 className="text-sm font-medium text-foreground">{item.name}</h3>
                      {item.description ? (
                        <p className="line-clamp-1 text-sm text-muted-foreground">{item.description}</p>
                      ) : null}
                    </div>

                    {item.href ? <a href={item.href}>{action}</a> : action}
                  </div>
                )
              })}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
