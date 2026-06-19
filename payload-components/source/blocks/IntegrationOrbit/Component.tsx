import React from 'react'

import type { IntegrationOrbitBlock as IntegrationOrbitBlockData } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type Props = IntegrationOrbitBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

/* Place an item around a ring: rotate to its slot, push out by the radius, then
   counter-rotate the content so the logo stays upright. The animated spin lives
   in globals.css (.integration-orbit-ring / .integration-orbit-logo) and runs
   only on hover, so nothing animates on load. */
const slotStyle = (index: number, count: number, radius: string) => ({
  transform: `rotate(${(360 / Math.max(count, 1)) * index}deg) translateY(-${radius})`,
})
const uprightStyle = (index: number, count: number) => ({
  transform: `rotate(${-(360 / Math.max(count, 1)) * index}deg)`,
})

export const IntegrationOrbitBlock: React.FC<Props> = ({
  className,
  disableInnerContainer,
  featuredLogo,
  heading,
  id,
  integrations,
  subtext,
}) => {
  const items = integrations ?? []
  const outer = items.slice(0, Math.ceil(items.length / 2))
  const inner = items.slice(Math.ceil(items.length / 2))

  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-14 sm:px-8 lg:px-12 lg:py-20">
        <div
          className={cn('flex flex-col items-center gap-12', {
            'mx-auto max-w-3xl': !disableInnerContainer,
          })}
        >
          <div className="group relative mx-auto flex aspect-square w-full max-w-xs items-center justify-center">
            <div className="integration-orbit-ring absolute inset-0">
              <div className="absolute inset-0 rounded-full border border-dashed border-border/70" />
              {outer.map((item, index) => (
                <div
                  className="absolute left-1/2 top-1/2"
                  key={item.id ?? `outer-${item.name}-${index}`}
                  style={slotStyle(index, outer.length, '7.5rem')}
                >
                  <div style={uprightStyle(index, outer.length)}>
                    <div className="integration-orbit-logo">
                      <div className="flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-border/70 bg-background shadow-sm">
                        <Media resource={item.logo} imgClassName="size-6 w-auto object-contain" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="integration-orbit-ring-reverse absolute inset-[24%]">
              <div className="absolute inset-0 rounded-full border border-dashed border-border/70" />
              {inner.map((item, index) => (
                <div
                  className="absolute left-1/2 top-1/2"
                  key={item.id ?? `inner-${item.name}-${index}`}
                  style={slotStyle(index, inner.length, '4.25rem')}
                >
                  <div style={uprightStyle(index, inner.length)}>
                    <div className="integration-orbit-logo">
                      <div className="flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-border/70 bg-background shadow-sm">
                        <Media resource={item.logo} imgClassName="size-5 w-auto object-contain" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {featuredLogo ? (
              <div className="relative z-10 flex size-16 items-center justify-center rounded-2xl border border-foreground/25 bg-card shadow-lg">
                <Media resource={featuredLogo} imgClassName="size-9 w-auto object-contain" />
              </div>
            ) : null}
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
