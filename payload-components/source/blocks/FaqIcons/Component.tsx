import React from 'react'

import type { FaqIconsBlock as FaqIconsBlockData } from '@/payload-types'

import { faqIcons } from '@/blocks/shared/faqIcons'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

type Props = FaqIconsBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const FaqIconsBlock: React.FC<Props> = ({
  className,
  description,
  disableInnerContainer,
  eyebrow,
  id,
  items,
  title,
}) => {
  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div
          className={cn('flex flex-col gap-10', {
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

          {items && items.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {items.map((item, index) => {
                const Icon = item.icon ? faqIcons[item.icon] : null

                return (
                  <AccordionItem
                    key={item.id ?? `${item.question}-${index}`}
                    value={item.id ?? `item-${index}`}
                    className="border-border/70"
                  >
                    <AccordionTrigger className="text-left text-base tracking-title hover:no-underline">
                      <span className="flex items-center gap-3">
                        {Icon ? <Icon className="size-4 text-muted-foreground" /> : null}
                        {item.question}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-7 text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          ) : null}
        </div>
      </div>
    </section>
  )
}
