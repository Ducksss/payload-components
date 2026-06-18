import React from 'react'

import type { TeamRosterBlock as TeamRosterBlockData } from '@/payload-types'

import { Media } from '@/components/Media'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

type Props = TeamRosterBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const TeamRosterBlock: React.FC<Props> = ({
  className,
  disableInnerContainer,
  eyebrow,
  groups,
  id,
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
          <div className="flex flex-col gap-4">
            {eyebrow ? (
              <Badge variant="outline" className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow">
                {eyebrow}
              </Badge>
            ) : null}

            <h2 className="text-4xl font-medium tracking-display text-balance">{title}</h2>
          </div>

          {groups && groups.length > 0 ? (
            <div className="flex flex-col gap-10">
              {groups.map((group, groupIndex) => (
                <div className="flex flex-col gap-6" key={group.id ?? groupIndex}>
                  <h3 className="text-lg font-medium">{group.label}</h3>

                  <div className="grid grid-cols-2 gap-6 border-t border-border/70 pt-6 md:grid-cols-4">
                    {group.members && group.members.length > 0
                      ? group.members.map((member, memberIndex) => (
                          <div className="flex flex-col gap-2" key={member.id ?? memberIndex}>
                            <div className="size-20 overflow-hidden rounded-full border border-border/70 bg-card p-0.5">
                              <Media
                                resource={member.avatar}
                                imgClassName="aspect-square h-full w-full rounded-full object-cover"
                              />
                            </div>
                            <span className="text-sm">{member.name}</span>
                            <span className="text-xs text-muted-foreground">{member.role}</span>
                          </div>
                        ))
                      : null}
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
