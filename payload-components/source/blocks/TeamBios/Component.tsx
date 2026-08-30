import React from 'react'

import type { TeamBiosBlock as TeamBiosBlockData } from '@/payload-types'

import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

type Props = TeamBiosBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const TeamBiosBlock: React.FC<Props> = ({
  className,
  description,
  disableInnerContainer,
  eyebrow,
  id,
  members,
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
          <div className="flex max-w-2xl flex-col gap-4">
            {eyebrow ? (
              <Badge
                variant="outline"
                className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow"
              >
                {eyebrow}
              </Badge>
            ) : null}

            <h2 className="text-3xl font-medium tracking-title text-balance sm:text-4xl">
              {title}
            </h2>

            {description ? (
              <p className="text-base leading-7 text-muted-foreground">{description}</p>
            ) : null}
          </div>

          {members && members.length > 0 ? (
            <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
              {members.map((member, index) => (
                <article
                  className="flex flex-col gap-4 rounded-panel border border-border/70 bg-background/70 p-6"
                  key={member.id ?? index}
                >
                  <div className="flex items-center gap-4">
                    <div className="size-14 shrink-0 overflow-hidden rounded-full border border-border/70 bg-card p-0.5">
                      <Media
                        resource={member.avatar}
                        imgClassName="h-full w-full rounded-full object-cover object-top"
                      />
                    </div>

                    <div className="flex min-w-0 flex-col">
                      <h3 className="truncate text-base font-medium text-foreground">
                        {member.name}
                      </h3>
                      <span className="truncate text-sm text-muted-foreground">{member.role}</span>
                    </div>
                  </div>

                  <p className="text-sm leading-6 text-muted-foreground">{member.bio}</p>

                  {member.href ? (
                    <a
                      className="mt-auto w-fit text-sm font-medium text-foreground underline-offset-4 hover:underline"
                      href={member.href}
                    >
                      Read more
                    </a>
                  ) : null}
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
