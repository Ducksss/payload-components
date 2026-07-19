import React from 'react'

import type { ContactRoutingFormBlock as ContactRoutingFormBlockData } from '@/payload-types'

import { getSafeContactHref } from '@/blocks/shared/contactUrls'
import { getSafeFormAction } from '@/blocks/shared/safeUrls'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/utilities/ui'

// Layout adapted from tailark/blocks (MIT) — re-implemented as a Payload block.

type Props = ContactRoutingFormBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const ContactRoutingFormBlock: React.FC<Props> = ({
  action,
  channels,
  className,
  description,
  disableInnerContainer,
  eyebrow,
  formDescription,
  formLabels,
  formTitle,
  id,
  submitLabel,
  title,
}) => {
  const fieldPrefix = React.useId()
  const formAction = getSafeFormAction(action)
  const labels = {
    email: formLabels?.email || 'Email',
    message: formLabels?.message || 'Message',
    name: formLabels?.name || 'Name',
    organization: formLabels?.organization || 'Organization',
    phone: formLabels?.phone || 'Phone',
  }

  const formFields = (
    <>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground" htmlFor={`${fieldPrefix}-name`}>
            {labels.name}
          </label>
          <Input autoComplete="name" id={`${fieldPrefix}-name`} name="name" required type="text" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground" htmlFor={`${fieldPrefix}-email`}>
            {labels.email}
          </label>
          <Input autoComplete="email" id={`${fieldPrefix}-email`} name="email" required type="email" />
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-medium text-foreground"
            htmlFor={`${fieldPrefix}-organization`}
          >
            {labels.organization}
          </label>
          <Input
            autoComplete="organization"
            id={`${fieldPrefix}-organization`}
            name="organization"
            type="text"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground" htmlFor={`${fieldPrefix}-phone`}>
            {labels.phone}
          </label>
          <Input
            autoComplete="tel"
            id={`${fieldPrefix}-phone`}
            inputMode="tel"
            name="phone"
            type="tel"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground" htmlFor={`${fieldPrefix}-message`}>
          {labels.message}
        </label>
        <Textarea id={`${fieldPrefix}-message`} name="message" required rows={6} />
      </div>
      <Input
        aria-hidden="true"
        autoComplete="off"
        className="absolute left-0 top-0 size-px opacity-0"
        name="website"
        tabIndex={-1}
        type="text"
      />
      <Button className="w-full sm:w-fit" disabled={!formAction} type="submit">
        {submitLabel || 'Send inquiry'}
      </Button>
    </>
  )

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

          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12">
            <address className="not-italic">
              {channels && channels.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {channels.map((channel, index) => {
                    const href = getSafeContactHref(channel.type, channel.value)

                    return (
                      <div
                        key={channel.id ?? `${channel.label}-${index}`}
                        className="rounded-panel border border-border/70 bg-background/70 p-5"
                      >
                        <p className="text-sm font-medium text-foreground">{channel.label}</p>
                        {href ? (
                          <a className="mt-2 block break-words text-base text-primary underline-offset-4 hover:underline" href={href}>
                            {channel.value}
                          </a>
                        ) : (
                          <span className="mt-2 block break-words text-base text-muted-foreground">
                            {channel.value}
                          </span>
                        )}
                        {channel.description ? (
                          <p className="mt-2 text-sm leading-6 text-muted-foreground">
                            {channel.description}
                          </p>
                        ) : null}
                      </div>
                    )
                  })}
                </div>
              ) : null}
            </address>

            <div className="rounded-panel border border-border/70 bg-background/85 p-6 sm:p-8">
              <div className="mb-6 flex flex-col gap-2">
                <h3 className="text-2xl font-medium tracking-title text-foreground">{formTitle}</h3>
                {formDescription ? (
                  <p className="text-sm leading-6 text-muted-foreground">{formDescription}</p>
                ) : null}
              </div>

              {formAction ? (
                <form action={formAction} className="relative flex flex-col gap-5" method="post">
                  {formFields}
                </form>
              ) : (
                <div className="relative flex flex-col gap-5">{formFields}</div>
              )}

              {!formAction ? (
                <p className="mt-4 text-sm text-destructive" role="status">
                  Configure a valid same-origin form action before publishing.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
