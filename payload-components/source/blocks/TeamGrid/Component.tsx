import React from 'react'

import type { TeamGridBlock as TeamGridBlockData } from '@/payload-types'

import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

type Props = TeamGridBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const TeamGridBlock: React.FC<Props> = ({
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4">
              {eyebrow ? (
                <Badge variant="outline" className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow">
                  {eyebrow}
                </Badge>
              ) : null}

              <h2 className="text-3xl font-medium tracking-title text-balance sm:text-4xl">{title}</h2>
            </div>

            {description ? (
              <p className="max-w-md text-base leading-7 text-muted-foreground">{description}</p>
            ) : null}
          </div>

          {members && members.length > 0 ? (
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((member, index) => (
                <div className="group overflow-hidden" key={member.id ?? index}>
                  <div className="h-96 w-full overflow-hidden rounded-md transition-all duration-500 group-hover:rounded-xl">
                    <Media
                      resource={member.avatar}
                      imgClassName="h-full w-full object-cover object-top grayscale transition-all duration-500 group-hover:grayscale-0"
                    />
                  </div>

                  <div className="px-2 pt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-medium transition-all duration-500 group-hover:tracking-wider">
                        {member.name}
                      </h3>
                      <span className="text-xs text-muted-foreground">_0{index + 1}</span>
                    </div>

                    <div className="mt-1 flex items-center justify-between">
                      <span className="translate-y-6 text-sm text-muted-foreground opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        {member.role}
                      </span>

                      {member.href ? (
                        <a
                          className="inline-block translate-y-8 text-sm tracking-wide opacity-0 transition-all duration-500 hover:underline group-hover:translate-y-0 group-hover:opacity-100"
                          href={member.href}
                        >
                          Profile
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
