import React from 'react'

import type { ContentColumnsBlock as ContentColumnsBlockData } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

type Props = ContentColumnsBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const ContentColumnsBlock: React.FC<Props> = ({
  className,
  disableInnerContainer,
  eyebrow,
  id,
  links,
  paragraphs,
  title,
}) => {
  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div
          className={cn('grid gap-10 lg:grid-cols-2 lg:gap-16', {
            'mx-auto max-w-5xl': !disableInnerContainer,
          })}
        >
          <div className="flex flex-col gap-4">
            {eyebrow ? (
              <Badge variant="outline" className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow">
                {eyebrow}
              </Badge>
            ) : null}

            <h2 className="text-4xl font-medium tracking-display text-balance">{title}</h2>
          </div>

          <div className="flex flex-col gap-6">
            {paragraphs && paragraphs.length > 0
              ? paragraphs.map((paragraph, index) => (
                  <p
                    className="text-base leading-7 text-muted-foreground"
                    key={paragraph.id ?? index}
                  >
                    {paragraph.text}
                  </p>
                ))
              : null}

            {links && links.length > 0 ? (
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
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
