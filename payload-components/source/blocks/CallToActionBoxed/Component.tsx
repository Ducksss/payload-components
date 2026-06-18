import React from 'react'

import type { CallToActionBoxedBlock as CallToActionBoxedBlockData } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { cn } from '@/utilities/ui'

type Props = CallToActionBoxedBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const CallToActionBoxedBlock: React.FC<Props> = ({
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
          className={cn('rounded-2xl border border-border/70 bg-background/60 px-6 py-10 sm:px-10 sm:py-14', {
            'mx-auto max-w-3xl': !disableInnerContainer,
          })}
        >
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-4xl font-medium tracking-display text-balance sm:text-5xl">{title}</h2>

            {description ? (
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
            ) : null}

            {links && links.length > 0 ? (
              <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
                {links.map(({ link }, index) => (
                  <CMSLink
                    key={index}
                    appearance={link.appearance === 'outline' ? 'outline' : 'default'}
                    {...link}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
