import React from 'react'

import type { CallToActionSplitBlock as CallToActionSplitBlockData } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

type Props = CallToActionSplitBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const CallToActionSplitBlock: React.FC<Props> = ({
  assurance,
  className,
  description,
  disableInnerContainer,
  id,
  links,
  title,
}) => {
  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div
          className={cn(
            'flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-16',
            {
              'mx-auto max-w-6xl': !disableInnerContainer,
            },
          )}
        >
          <div className="flex max-w-2xl flex-col gap-4">
            <h2 className="text-4xl font-medium tracking-display text-balance sm:text-5xl">
              {title}
            </h2>

            {description ? (
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
            ) : null}
          </div>

          {links && links.length > 0 ? (
            <div className="flex shrink-0 flex-col gap-3">
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                {links.map(({ link }, index) => (
                  <CMSLink
                    key={index}
                    appearance={link.appearance === 'outline' ? 'outline' : 'default'}
                    {...link}
                  />
                ))}
              </div>
              {assurance ? (
                <p className="text-sm leading-6 text-muted-foreground lg:text-right">{assurance}</p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
