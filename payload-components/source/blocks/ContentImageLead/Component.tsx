import React from 'react'

import type { ContentImageLeadBlock as ContentImageLeadBlockData } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

type Props = ContentImageLeadBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const ContentImageLeadBlock: React.FC<Props> = ({
  className,
  disableInnerContainer,
  eyebrow,
  id,
  image,
  links,
  paragraphs,
  title,
}) => {
  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div
          className={cn('flex flex-col gap-10', {
            'mx-auto max-w-5xl': !disableInnerContainer,
          })}
        >
          {image ? (
            <div className="overflow-hidden rounded-panel border border-border/70">
              <Media resource={image} imgClassName="h-full w-full object-cover" />
            </div>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-2 lg:gap-16">
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
      </div>
    </section>
  )
}
