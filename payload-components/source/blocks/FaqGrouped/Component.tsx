import React from 'react'

import type { FaqGroupedBlock as FaqGroupedBlockData } from '@/payload-types'

import { faqIcons } from '@/blocks/shared/faqIcons'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

type Props = FaqGroupedBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const FaqGroupedBlock: React.FC<Props> = ({
  className,
  description,
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
            'mx-auto max-w-3xl': !disableInnerContainer,
          })}
        >
          <div className="flex flex-col gap-4 text-center">
            {eyebrow ? (
              <Badge variant="outline" className="mx-auto w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow">
                {eyebrow}
              </Badge>
            ) : null}

            <h2 className="text-4xl font-medium tracking-display text-balance sm:text-5xl">{title}</h2>

            {description ? (
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
            ) : null}
          </div>

          {groups && groups.length > 0 ? (
            <div className="flex flex-col gap-10">
              {groups.map((group, groupIndex) => {
                const Icon = group.icon ? faqIcons[group.icon] : null

                return (
                  <div className="flex flex-col gap-4" key={group.id ?? `${group.title}-${groupIndex}`}>
                    <div className="flex items-center gap-3">
                      {Icon ? <Icon className="size-5 text-muted-foreground" /> : null}
                      <h3 className="text-lg font-medium tracking-title">{group.title}</h3>
                    </div>

                    <Accordion type="single" collapsible className="w-full">
                      {group.items?.map((item, index) => (
                        <AccordionItem
                          key={item.id ?? `${item.question}-${index}`}
                          value={item.id ?? `group-${groupIndex}-item-${index}`}
                          className="border-border/70"
                        >
                          <AccordionTrigger className="text-left text-base tracking-title hover:no-underline">
                            {item.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-sm leading-7 text-muted-foreground">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
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
