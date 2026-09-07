'use client'

import React, { useId, useRef, useState } from 'react'

import type { ContactFormBasicBlock as ContactFormBasicBlockData } from '@/payload-types'

import { getSafeFormAction } from '@/blocks/shared/safeUrls'
import { cn } from '@/utilities/ui'

import { type ContactErrors, type ContactField, sendContactForm, validateContactForm } from './form'

type Props = ContactFormBasicBlockData & {
  id?: string
  className?: string
  disableInnerContainer?: boolean
}

export const ContactFormBasicBlock: React.FC<Props> = (props) => {
  // A new block or destination starts a new form. Keeping its state and DOM in
  // a keyed instance prevents an older request from clearing or acknowledging
  // a replacement form during live preview or another parent update.
  const identity = JSON.stringify([props.id, getSafeFormAction(props.action)])
  return <ContactFormInstance {...props} key={identity} />
}

const ContactFormInstance: React.FC<Props> = ({
  action,
  className,
  description,
  disableInnerContainer,
  emailLabel,
  id,
  messageLabel,
  nameLabel,
  organizationLabel,
  submitLabel,
  successMessage,
  title,
}) => {
  const formId = useId()
  const submitting = useRef(false)
  const [pending, setPending] = useState(false)
  const [errors, setErrors] = useState<ContactErrors>({})
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const formAction = getSafeFormAction(action)
  const fields: {
    name: ContactField
    label: string
    autoComplete?: string
    type?: string
    required?: boolean
  }[] = [
    {
      name: 'name',
      label: nameLabel || 'Name',
      autoComplete: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      label: emailLabel || 'Email',
      autoComplete: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'organization',
      label: organizationLabel || 'Organization',
      autoComplete: 'organization',
      type: 'text',
    },
    { name: 'message', label: messageLabel || 'Message', required: true },
  ]

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!formAction || submitting.current) return
    const form = event.currentTarget
    const data = new FormData(form)
    const nextErrors = validateContactForm(data)
    setErrors(nextErrors)
    setStatus('idle')
    const firstInvalid = fields.find(({ name }) => nextErrors[name])
    if (firstInvalid) {
      const control = form.elements.namedItem(firstInvalid.name)
      if (control instanceof HTMLElement) control.focus()
      return
    }
    submitting.current = true
    setPending(true)
    try {
      await sendContactForm(formAction, data)
      form.reset()
      setStatus('success')
    } catch {
      setStatus('error')
    } finally {
      submitting.current = false
      setPending(false)
    }
  }

  return (
    <section className={cn('container', className)} id={id ? `block-${id}` : undefined}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div
          className={cn('grid gap-10 lg:grid-cols-2 lg:gap-16', {
            'mx-auto max-w-5xl': !disableInnerContainer,
          })}
        >
          <div className="space-y-5">
            <p className="text-xs font-medium uppercase tracking-eyebrow text-muted-foreground">
              Get in touch
            </p>
            <h2 className="text-4xl font-medium tracking-display text-balance sm:text-5xl">
              {title}
            </h2>
            {description ? (
              <p className="max-w-md text-base leading-7 text-muted-foreground">{description}</p>
            ) : null}
            <p className="text-sm text-muted-foreground">Fields marked * are required.</p>
          </div>
          <form
            action={formAction}
            method="post"
            encType="multipart/form-data"
            noValidate
            onSubmit={submit}
            aria-busy={pending}
            aria-describedby={`${formId}-status`}
            className="space-y-5"
          >
            {fields.map(({ name, label, autoComplete, type, required }) => {
              const controlProps = {
                id: `${formId}-${name}`,
                name,
                autoComplete,
                required,
                disabled: !formAction || pending,
                'aria-invalid': Boolean(errors[name]),
                'aria-describedby': errors[name] ? `${formId}-${name}-error` : undefined,
                onChange: () => {
                  setErrors((current) => ({ ...current, [name]: undefined }))
                  setStatus('idle')
                },
              }
              return (
                <div key={name} className="space-y-2">
                  <label htmlFor={controlProps.id} className="block text-sm font-medium">
                    {label}
                    {required ? ' *' : ' (optional)'}
                  </label>
                  {name === 'message' ? (
                    <textarea
                      {...controlProps}
                      rows={4}
                      maxLength={10000}
                      className="w-full resize-y rounded-lg border border-border bg-background px-4 py-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
                    />
                  ) : (
                    <input
                      {...controlProps}
                      type={type}
                      inputMode={name === 'email' ? 'email' : undefined}
                      maxLength={name === 'email' ? 254 : 200}
                      className="h-12 w-full rounded-lg border border-border bg-background px-4 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
                    />
                  )}
                  {errors[name] ? (
                    <p id={`${formId}-${name}-error`} className="text-sm text-destructive">
                      {errors[name]}
                    </p>
                  ) : null}
                </div>
              )
            })}
            <button
              disabled={!formAction || pending}
              type="submit"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? 'Sending…' : submitLabel || 'Send message'}
            </button>
            <p
              id={`${formId}-status`}
              role="status"
              aria-live="polite"
              className="text-sm leading-6 text-muted-foreground"
            >
              {!formAction
                ? 'Contact form unavailable. Please try again later.'
                : status === 'success'
                  ? successMessage || 'Thanks for reaching out. Your message has been received.'
                  : status === 'error'
                    ? 'We could not confirm delivery. Your message is still here; please try again.'
                    : ''}
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
