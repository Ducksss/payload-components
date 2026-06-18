import React from 'react'

import type { IntegrationConnectBlock as IntegrationConnectBlockData } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type Props = IntegrationConnectBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const IntegrationConnectBlock: React.FC<Props> = ({
  className,
  disableInnerContainer,
  featuredLogo,
  heading,
  id,
  integrations,
  subtext,
}) => {
  const items = integrations ?? []
  const half = Math.ceil(items.length / 2)
  const left = items.slice(0, half)
  const right = items.slice(half)

  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div
          className={cn('flex flex-col items-center gap-12', {
            'mx-auto max-w-3xl': !disableInnerContainer,
          })}
        >
          <div className="relative flex w-full max-w-md items-center justify-between">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-12 inset-y-0 bg-[radial-gradient(var(--connect-dots)_1px,transparent_1px)] [--connect-dots:rgba(120,120,130,0.35)] [background-size:16px_16px] opacity-60 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_55%,transparent_100%)]"
            />

            <div className="flex flex-col gap-6">
              {left.map((item, index) => (
                <div
                  className="relative flex size-12 items-center justify-center rounded-xl border border-border/70 bg-background"
                  key={item.id ?? `${item.name}-${index}`}
                >
                  <Media resource={item.logo} imgClassName="size-6 w-auto object-contain" />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-full top-1/2 h-px w-10 bg-gradient-to-r from-border to-transparent"
                  />
                </div>
              ))}
            </div>

            {featuredLogo ? (
              <div className="relative z-10 flex size-16 items-center justify-center rounded-2xl border border-foreground/25 bg-card shadow-lg">
                <Media resource={featuredLogo} imgClassName="size-9 w-auto object-contain" />
              </div>
            ) : null}

            <div className="flex flex-col gap-6">
              {right.map((item, index) => (
                <div
                  className="relative flex size-12 items-center justify-center rounded-xl border border-border/70 bg-background"
                  key={item.id ?? `right-${item.name}-${index}`}
                >
                  <Media resource={item.logo} imgClassName="size-6 w-auto object-contain" />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute right-full top-1/2 h-px w-10 bg-gradient-to-l from-border to-transparent"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex max-w-lg flex-col items-center gap-5 text-center">
            <h2 className="text-balance text-2xl font-semibold tracking-heading text-foreground sm:text-3xl">
              {heading}
            </h2>
            {subtext ? (
              <p className="text-pretty text-sm text-muted-foreground sm:text-base">{subtext}</p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
