import React from 'react'

import type { CallToActionSignupBlock as CallToActionSignupBlockData } from '@/payload-types'

import { Mail, SendHorizonal } from 'lucide-react'

import { getSafeFormAction } from '@/blocks/shared/safeUrls'
import { Button } from '@/components/ui/button'
import { cn } from '@/utilities/ui'

type Props = CallToActionSignupBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const CallToActionSignupBlock: React.FC<Props> = ({
  action,
  className,
  description,
  disableInnerContainer,
  emailPlaceholder,
  id,
  submitLabel,
  title,
}) => {
  const formAction = getSafeFormAction(action) ?? '#'

  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div
          className={cn('flex flex-col items-center gap-4 text-center', {
            'mx-auto max-w-2xl': !disableInnerContainer,
          })}
        >
          <h2 className="text-4xl font-medium tracking-display text-balance sm:text-5xl">{title}</h2>

          {description ? (
            <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
          ) : null}

          <form action={formAction} className="mt-2 w-full max-w-sm" method="post">
            <div className="relative grid grid-cols-[1fr_auto] items-center rounded-frame border border-border/70 bg-background/80 pr-2">
              <Mail className="pointer-events-none absolute inset-y-0 left-4 my-auto size-5 text-muted-foreground" />

              <input
                aria-label={emailPlaceholder || 'Email address'}
                autoComplete="email"
                className="h-12 w-full bg-transparent pl-11 text-sm focus:outline-none"
                name="email"
                placeholder={emailPlaceholder || 'Your email address'}
                required
                type="email"
              />

              <Button aria-label="Subscribe" type="submit">
                <span className="hidden sm:block">{submitLabel || 'Get Started'}</span>
                <SendHorizonal className="size-4 sm:hidden" strokeWidth={2} />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
