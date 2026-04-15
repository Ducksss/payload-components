'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import { faqItems } from './content'

export const FaqAccordion = () => {
  return (
    <div className="rounded-[1.75rem] border border-border/70 bg-background/75 px-5 py-2 shadow-none backdrop-blur-sm sm:px-6">
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem
            key={item.question}
            value={`item-${index}`}
            className="border-border/70 last:border-b-0"
          >
            <AccordionTrigger className="gap-6 py-6 text-left text-lg font-medium no-underline hover:no-underline">
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
