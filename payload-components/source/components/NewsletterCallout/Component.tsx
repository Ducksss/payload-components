import React, { useId } from 'react'

export type NewsletterCalloutProps = {
  title: string
  description?: string | null
  action: string
  emailPlaceholder?: string
  legalText?: string | null
  buttonLabel?: string
  emailLabel?: string
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

/** Newsletter signup form; your application owns the endpoint, consent, and response handling. */
export function NewsletterCallout({
  title,
  description,
  action,
  emailPlaceholder = 'you@example.com',
  legalText,
  buttonLabel = 'Subscribe',
  emailLabel = 'Email address',
  id,
  className,
  disableInnerContainer = false,
}: NewsletterCalloutProps) {
  const generatedEmailId = useId()
  const emailId = id ? `${id}-email` : generatedEmailId

  return (
    <section
      id={id}
      aria-labelledby={id ? `${id}-title` : undefined}
      className={['bg-background py-12 text-foreground', className].filter(Boolean).join(' ')}
    >
      <div className={disableInnerContainer ? undefined : 'container mx-auto px-6'}>
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-muted/40 p-6 sm:p-10">
          <h2 id={id ? `${id}-title` : undefined} className="font-serif text-3xl tracking-tight">
            {title}
          </h2>
          {description ? (
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              {description}
            </p>
          ) : null}
          <form action={action} method="post" className="mt-6 flex flex-col gap-3 sm:flex-row">
            <label className="sr-only" htmlFor={emailId}>
              {emailLabel}
            </label>
            <input
              id={emailId}
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder={emailPlaceholder}
              className="min-h-11 min-w-0 flex-1 rounded-md border border-input bg-background px-4 text-base outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
            <button
              type="submit"
              className="min-h-11 rounded-md bg-primary px-5 font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {buttonLabel}
            </button>
          </form>
          {legalText ? <p className="mt-3 text-xs leading-5 text-muted-foreground">{legalText}</p> : null}
        </div>
      </div>
    </section>
  )
}
