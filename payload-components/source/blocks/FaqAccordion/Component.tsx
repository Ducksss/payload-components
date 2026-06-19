import React from 'react'

import type { FaqAccordionBlock as FaqAccordionBlockData } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

type Props = FaqAccordionBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const FaqAccordionBlock: React.FC<Props> = ({
  className,
  description,
  disableInnerContainer,
  eyebrow,
  id,
  items,
  links,
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
              {items.map((item, index) => (
                <AccordionItem
                  key={item.id ?? `${item.question}-${index}`}
                  value={item.id ?? `item-${index}`}
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
          ) : null}

          {links && links.length > 0 ? (
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
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
    </section>
  )
}
