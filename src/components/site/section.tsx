import type { ReactNode } from 'react'

import { cn } from '@/utilities/ui'

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        'flex items-center gap-2.5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground',
        className,
      )}
    >
      <span aria-hidden="true" className="inline-block size-1.5 rounded-full bg-brand" />
      {children}
    </p>
  )
}

/* One word per heading set in the editorial serif italic. The accent is
   rendered inline inside the same heading element, so the element's
   accessible name still equals the full `heading` string (the e2e suite
   asserts headings by their exact name). */
export function HeadingAccent({ children }: { children: ReactNode }) {
  return (
    <span className="font-serif text-[1.06em] font-normal italic tracking-[-0.01em]">
      {children}
    </span>
  )
}

function renderHeading(heading: string, accentWord?: string): ReactNode {
  if (!accentWord) return heading
  const index = heading.indexOf(accentWord)
  if (index === -1) return heading

  return (
    <>
      {heading.slice(0, index)}
      <HeadingAccent>{accentWord}</HeadingAccent>
      {heading.slice(index + accentWord.length)}
    </>
  )
}

export function SectionHeading({
  accentWord,
  className,
  eyebrow,
  heading,
  id,
  intro,
}: {
  accentWord?: string
  className?: string
  eyebrow?: string
  heading: string
  id?: string
  intro?: string
}) {
  return (
    <div className={cn('max-w-2xl', className)}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2
        id={id}
        className="mt-4 text-balance text-3xl font-semibold leading-[1.08] tracking-[-0.045em] text-foreground sm:text-[2.6rem]"
      >
        {renderHeading(heading, accentWord)}
      </h2>
      {intro ? (
        <p className="mt-5 text-base leading-7 text-muted-foreground">{intro}</p>
      ) : null}
    </div>
  )
}

export function Section({
  children,
  className,
  containerClassName,
  id,
}: {
  children: ReactNode
  className?: string
  containerClassName?: string
  id?: string
}) {
  return (
    <section id={id} className={cn('border-t border-border', className)}>
      <div className={cn('container py-16 sm:py-20 lg:py-24', containerClassName)}>{children}</div>
    </section>
  )
}
