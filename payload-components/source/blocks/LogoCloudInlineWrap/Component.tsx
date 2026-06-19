import React from 'react'

import type { LogoCloudInlineWrapBlock as LogoCloudInlineWrapBlockData } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type Props = LogoCloudInlineWrapBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const LogoCloudInlineWrapBlock: React.FC<Props> = ({
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
          className={cn('flex flex-wrap items-center gap-x-8 gap-y-4', {
            'mx-auto max-w-5xl': !disableInnerContainer,
          })}
        >
          <p className="text-muted-foreground">{heading}</p>

          {logos && logos.length > 0 ? (
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              {logos.map((item, index) => {
                const logo = (
                  <Media resource={item.logo} imgClassName="h-6 w-auto object-contain" />
                )

                return (
                  <div className="flex items-center" key={item.id ?? `${item.name}-${index}`}>
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
