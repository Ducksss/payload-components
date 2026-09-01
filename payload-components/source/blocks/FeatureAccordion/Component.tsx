'use client'

import React, { useState } from 'react'

import type { FeatureAccordionBlock as FeatureAccordionBlockData } from '@/payload-types'
import type { FeatureIconName } from '@/blocks/shared/featureIcons'

import { featureIcons } from '@/blocks/shared/featureIcons'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/utilities/ui'

// Layout adapted from tailark/blocks (MIT) — re-implemented as a Payload block.

type Props = FeatureAccordionBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const FeatureAccordionBlock: React.FC<Props> = ({
  className,
  description,
  disableInnerContainer,
  eyebrow,
  id,
  items,
  links,
  title,
}) => {
  const [activeValue, setActiveValue] = useState('0')
  const parsedIndex = Number.parseInt(activeValue, 10)
  const activeIndex =
    items && Number.isInteger(parsedIndex) && parsedIndex >= 0 && parsedIndex < items.length
      ? parsedIndex
      : 0
  const activeItem = items?.[activeIndex]
  const ActiveIcon =
    activeItem?.icon && activeItem.icon in featureIcons
      ? featureIcons[activeItem.icon as FeatureIconName]
      : undefined

  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div
          className={cn('flex flex-col gap-10', {
            'mx-auto max-w-6xl': !disableInnerContainer,
          })}
        >
          <div className="flex max-w-3xl flex-col gap-4">
            {eyebrow ? (
              <Badge variant="outline" className="w-fit rounded-full px-3 py-1 uppercase tracking-eyebrow">
                {eyebrow}
              </Badge>
            ) : null}

            <h2 className="text-4xl font-medium tracking-display text-balance sm:text-5xl">{title}</h2>

            {description ? (
              <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
            ) : null}
          </div>

          {items && items.length > 0 ? (
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <Accordion
                type="single"
                collapsible={false}
                className="w-full"
                value={activeValue}
                onValueChange={setActiveValue}
              >
                {items.map((item, index) => (
                  <AccordionItem
                    key={item.id ?? `${item.title}-${index}`}
                    value={`${index}`}
                    className="border-border/70"
                  >
                    <AccordionTrigger className="text-start text-lg tracking-title hover:no-underline">
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm leading-7 text-muted-foreground">
                      {item.description}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="relative aspect-[4/3] overflow-hidden rounded-panel border border-border/70 bg-muted">
                {activeItem?.image ? (
                  <Media
                    resource={activeItem.image}
                    imgClassName="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-background/60">
                    {ActiveIcon ? (
                      <ActiveIcon className="size-16 text-muted-foreground" strokeWidth={1.5} />
                    ) : (
                      <div className="size-16 rounded-full border border-border/70 bg-muted" />
                    )}
                  </div>
                )}
              </div>
            </div>
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
      </div>
    </section>
  )
}
