import React from 'react'

import type { ContentCommunityBlock as ContentCommunityBlockData } from '@/payload-types'

import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

type Props = ContentCommunityBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const ContentCommunityBlock: React.FC<Props> = ({
  avatars,
  className,
  disableInnerContainer,
  eyebrow,
  id,
  paragraphs,
  title,
}) => {
  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div
          className={cn('flex flex-col gap-12', {
            'mx-auto max-w-5xl': !disableInnerContainer,
          })}
        >
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
            {eyebrow ? (
              <Badge variant="outline" className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow">
                {eyebrow}
              </Badge>
            ) : null}

            <h2 className="text-3xl font-medium tracking-title text-balance sm:text-4xl">{title}</h2>

            {paragraphs && paragraphs.length > 0
              ? paragraphs.map((paragraph, index) => (
                  <p className="text-base leading-7 text-muted-foreground" key={paragraph.id ?? index}>
                    {paragraph.text}
                  </p>
                ))
              : null}
          </div>

          {avatars && avatars.length > 0 ? (
            <div className="mx-auto flex max-w-3xl flex-wrap justify-center gap-3">
              {avatars.map((item, index) => {
                const avatar = (
                  <Media resource={item.avatar} imgClassName="h-full w-full object-cover" />
                )

                return item.href ? (
                  <a
                    className="size-14 overflow-hidden rounded-full border border-border/70"
                    href={item.href}
                    key={item.id ?? `${item.name}-${index}`}
                    title={item.name}
                  >
                    {avatar}
                  </a>
                ) : (
                  <div
                    className="size-14 overflow-hidden rounded-full border border-border/70"
                    key={item.id ?? `${item.name}-${index}`}
                  >
                    {avatar}
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
