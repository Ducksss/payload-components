import React from 'react'

import type { IntegrationMarqueeBlock as IntegrationMarqueeBlockData } from '@/payload-types'

import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type Props = IntegrationMarqueeBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const IntegrationMarqueeBlock: React.FC<Props> = ({
  className,
  disableInnerContainer,
  featuredLogo,
  heading,
  id,
  integrations,
  subtext,
}) => {
  const logos = integrations ?? []

  const chip = (item: NonNullable<typeof integrations>[number], index: number) => (
    <div
      className="flex size-14 items-center justify-center rounded-2xl border border-border/70 bg-background shadow-sm"
      key={item.id ?? `${item.name}-${index}`}
    >
      <Media resource={item.logo} imgClassName="size-7 w-auto object-contain" />
    </div>
  )

  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div
          className={cn('flex flex-col items-center gap-10', {
            'mx-auto max-w-3xl': !disableInnerContainer,
          })}
        >
          <div className="relative w-full max-w-2xl space-y-4 [mask-image:radial-gradient(ellipse_70%_80%_at_50%_50%,#000_55%,transparent_100%)]">
            <InfiniteSlider gap={20} speed={26} speedOnHover={12}>
              {logos.map((item, index) => chip(item, index))}
            </InfiniteSlider>
            <InfiniteSlider gap={20} reverse speed={26} speedOnHover={12}>
              {logos.map((item, index) => chip(item, index))}
            </InfiniteSlider>
            <InfiniteSlider gap={20} speed={26} speedOnHover={12}>
              {logos.map((item, index) => chip(item, index))}
            </InfiniteSlider>

            {featuredLogo ? (
              <div className="pointer-events-none absolute inset-0 z-10 m-auto flex size-16 items-center justify-center rounded-2xl border border-foreground/25 bg-card shadow-lg">
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
