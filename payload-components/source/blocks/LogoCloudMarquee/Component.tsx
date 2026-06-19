import React from 'react'

import type { LogoCloudMarqueeBlock as LogoCloudMarqueeBlockData } from '@/payload-types'

import { Media } from '@/components/Media'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { cn } from '@/utilities/ui'

type Props = LogoCloudMarqueeBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const LogoCloudMarqueeBlock: React.FC<Props> = ({
  className,
  disableInnerContainer,
  heading,
  id,
  logos,
}) => {
  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div
          className={cn('flex flex-col items-center gap-6 md:flex-row md:gap-0', {
            'mx-auto max-w-6xl': !disableInnerContainer,
          })}
        >
          <div className="md:max-w-44 md:border-r md:border-border/70 md:pr-6">
            <p className="text-center text-sm text-muted-foreground md:text-end">{heading}</p>
          </div>

          <div className="relative w-full py-6 md:w-[calc(100%-11rem)]">
            <InfiniteSlider gap={112} speed={40} speedOnHover={20}>
              {logos?.map((item, index) => {
                const logo = <Media resource={item.logo} imgClassName="h-7 w-auto object-contain" />

                return (
                  <div
                    className="flex items-center justify-center"
                    key={item.id ?? `${item.name}-${index}`}
                  >
                    {item.href ? <a href={item.href}>{logo}</a> : logo}
                  </div>
                )
              })}
            </InfiniteSlider>

            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-card/80 to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-card/80 to-transparent"
            />
            <ProgressiveBlur
              blurIntensity={1}
              className="pointer-events-none absolute left-0 top-0 h-full w-20"
              direction="left"
            />
            <ProgressiveBlur
              blurIntensity={1}
              className="pointer-events-none absolute right-0 top-0 h-full w-20"
              direction="right"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
