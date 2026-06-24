import { ChevronDown } from 'lucide-react'

import { faqEntries } from '@/lib/site'

/** CSS-only accordion: native <details>, no client JS. */
export function Faq() {
  return (
    <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-card">
      {faqEntries.map((entry) => (
        <details key={entry.question} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-base font-medium text-foreground transition-colors hover:bg-muted/40 [&::-webkit-details-marker]:hidden">
            {entry.question}
            <ChevronDown
              className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <p className="max-w-3xl px-6 pb-5 text-sm leading-7 text-muted-foreground">
            {entry.answer}
          </p>
        </details>
      ))}
    </div>
  )
}
