import React from 'react'

import type { FaqSplitBlock as FaqSplitBlockData } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

type Props = FaqSplitBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const FaqSplitBlock: React.FC<Props> = ({
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
          className={cn('grid gap-10 md:grid-cols-5 md:gap-12', {
            'mx-auto max-w-5xl': !disableInnerContainer,
          })}
        >
          <div className="flex flex-col gap-4 md:col-span-2">
            {eyebrow ? (
              <Badge variant="outline" className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow">
                {eyebrow}
              </Badge>
            ) : null}

            <h2 className="text-4xl font-medium tracking-display text-balance">{title}</h2>

            {description ? (
              <p className="text-base leading-7 text-muted-foreground">{description}</p>
            ) : null}

            {links && links.length > 0 ? (
              <div className="flex flex-col gap-3 sm:flex-row">
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

          {items && items.length > 0 ? (
            <Accordion type="single" collapsible className="w-full md:col-span-3">
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
        </div>
      </div>
    </section>
  )
}
