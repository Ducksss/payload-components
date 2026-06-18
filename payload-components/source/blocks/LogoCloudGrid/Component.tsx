import React from 'react'

import type { LogoCloudGridBlock as LogoCloudGridBlockData } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type Props = LogoCloudGridBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const LogoCloudGridBlock: React.FC<Props> = ({
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
          className={cn('flex flex-col gap-12', {
            'mx-auto max-w-5xl': !disableInnerContainer,
          })}
        >
          <h2 className="text-center text-lg font-medium tracking-heading text-foreground">
            {heading}
          </h2>

          {logos && logos.length > 0 ? (
            <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-8 sm:gap-x-16 sm:gap-y-12">
              {logos.map((item, index) => {
                const logo = (
                  <Media
                    resource={item.logo}
                    imgClassName="h-7 w-auto object-contain opacity-70 transition-opacity hover:opacity-100"
                  />
                )

                return (
                  <div
                    className="flex items-center justify-center"
                    key={item.id ?? `${item.name}-${index}`}
                  >
                    {item.href ? (
                      <a aria-label={item.name} href={item.href}>
                        {logo}
                      </a>
                    ) : (
                      logo
                    )}
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
