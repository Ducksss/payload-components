'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/utilities/ui'

import { faqItems } from './content'

export const FaqAccordion = () => {
  return (
    <div
      className={cn('rounded-2xl border border-border bg-background px-5 sm:px-6')}
    >
      <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
        {faqItems.map((item, index) => (
          <AccordionItem
            key={item.question}
            value={`item-${index}`}
            className="border-border last:border-b-0"
          >
            <AccordionTrigger
              className={cn(
                'gap-6 py-5 text-left text-[1.05rem] font-medium tracking-[-0.01em] no-underline transition-colors hover:no-underline data-[state=open]:text-foreground sm:text-lg',
              )}
            >
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="max-w-2xl pb-6 text-base leading-7 text-muted-foreground">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
