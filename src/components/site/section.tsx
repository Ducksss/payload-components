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

export function SectionHeading({
  className,
  eyebrow,
  heading,
  id,
  intro,
}: {
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
        className="mt-4 text-3xl font-semibold leading-[1.08] tracking-[-0.045em] text-foreground sm:text-4xl"
      >
        {heading}
      </h2>
      {intro ? <p className="mt-4 text-base leading-7 text-muted-foreground">{intro}</p> : null}
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
