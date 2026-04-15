'use client'

import Link from 'next/link'
import { FormEvent, useId, useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight } from 'lucide-react'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type WaitlistResponse = {
  error?: string
}

export const WaitlistForm = () => {
  const emailId = useId()
  const honeyId = useId()
  const [email, setEmail] = useState('')
  const [honey, setHoney] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedEmail = email.trim()

    if (!EMAIL_PATTERN.test(trimmedEmail)) {
      setSuccessMessage(null)
      setErrorMessage('Enter a valid email address to join the waitlist.')
      return
    }

    setErrorMessage(null)

    startTransition(async () => {
      try {
        const response = await fetch('/api/waitlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: trimmedEmail,
            honey,
          }),
        })

        const result = (await response.json().catch(() => null)) as WaitlistResponse | null

        if (!response.ok) {
          setSuccessMessage(null)
          setErrorMessage(result?.error || 'We could not join the waitlist right now.')
          return
        }

        setEmail('')
        setHoney('')
        setErrorMessage(null)
        setSuccessMessage("You're on the list. We'll email you when early access opens.")
      } catch {
        setSuccessMessage(null)
        setErrorMessage('We could not join the waitlist right now.')
      }
    })
  }

  return (
    <div className="rounded-[1.5rem] border border-background/15 bg-background/8 p-5 backdrop-blur-sm sm:p-6">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-background/70">
          Join the waitlist
        </p>
        <h3 className="text-2xl font-medium tracking-[-0.05em] text-balance">
          Get notified when the first kits are ready to install.
        </h3>
        <p className="text-sm leading-6 text-background/72">
          Send one email address straight to the waitlist service. We do not store these signups in
          Payload.
        </p>
      </div>

      <form className="mt-5 flex flex-col gap-3" onSubmit={handleSubmit}>
        <label className="space-y-2" htmlFor={emailId}>
          <span className="text-sm font-medium text-background">Email address</span>
          <Input
            id={emailId}
            type="email"
            name="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            placeholder="you@agency.com"
            aria-describedby="waitlist-status"
            aria-invalid={Boolean(errorMessage)}
            className="h-11 rounded-full border-background/18 bg-background/10 px-4 text-background placeholder:text-background/45 focus-visible:ring-background/20"
          />
        </label>

        <div className="hidden" aria-hidden="true">
          <label htmlFor={honeyId}>Leave this field empty</label>
          <input
            id={honeyId}
            type="text"
            name="honey"
            value={honey}
            onChange={(event) => setHoney(event.target.value)}
            autoComplete="off"
            tabIndex={-1}
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button
            type="submit"
            size="lg"
            disabled={isPending}
            className="rounded-full bg-background px-6 text-foreground hover:bg-background/90"
          >
            {isPending ? 'Joining...' : 'Join the waitlist'}
          </Button>

          <Button
            asChild
            variant="ghost"
            size="lg"
            className="justify-start rounded-full px-0 text-background hover:bg-transparent hover:text-background/85"
          >
            <Link href="#how-it-works">
              Review the install flow
              <ArrowRight data-icon="inline-end" />
            </Link>
          </Button>
        </div>

        <p
          id="waitlist-status"
          aria-live="polite"
          className={[
            'min-h-6 text-sm leading-6',
            errorMessage ? 'text-red-200' : 'text-background/72',
          ].join(' ')}
        >
          {errorMessage || successMessage || 'We only need your email address for early access.'}
        </p>
      </form>
    </div>
  )
}
