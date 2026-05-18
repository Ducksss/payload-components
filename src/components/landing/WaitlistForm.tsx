'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { FormEvent, useId, useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  normalizeMarketingToken,
  normalizeWaitlistIntent,
  normalizeWaitlistRole,
  type WaitlistIntent,
  type WaitlistRole,
} from '@/utilities/waitlist'
import { ArrowRight, BriefcaseBusiness, Rocket } from 'lucide-react'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DEFAULT_SOURCE = 'homepage-final-cta'

type WaitlistResponse = {
  error?: string
}

type WaitlistFormProps = {
  defaultIntent?: WaitlistIntent
  defaultSource?: string
}

const roleOptions: { label: string; value: WaitlistRole }[] = [
  { label: 'Agency', value: 'agency' },
  { label: 'Freelancer', value: 'freelancer' },
  { label: 'In-house team', value: 'in-house' },
  { label: 'Other', value: 'other' },
]

export const WaitlistForm = ({
  defaultIntent = 'waitlist',
  defaultSource = DEFAULT_SOURCE,
}: WaitlistFormProps) => {
  const emailId = useId()
  const honeyId = useId()
  const roleId = useId()
  const searchParams = useSearchParams()
  const searchIntent = searchParams.get('intent')
  const searchRole = searchParams.get('role')
  const [email, setEmail] = useState('')
  const [honey, setHoney] = useState('')
  const [intent, setIntent] = useState<WaitlistIntent>(() =>
    normalizeWaitlistIntent(searchIntent, defaultIntent),
  )
  const [role, setRole] = useState<WaitlistRole | undefined>(() =>
    normalizeWaitlistRole(searchRole),
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmedEmail = email.trim()
    const source =
      normalizeMarketingToken(searchParams.get('source')) ||
      normalizeMarketingToken(searchParams.get('utm_source')) ||
      normalizeMarketingToken(defaultSource, DEFAULT_SOURCE) ||
      DEFAULT_SOURCE
    const utmSource = normalizeMarketingToken(searchParams.get('utm_source'))
    const utmMedium = normalizeMarketingToken(searchParams.get('utm_medium'))
    const utmCampaign = normalizeMarketingToken(searchParams.get('utm_campaign'))
    const utmContent = normalizeMarketingToken(searchParams.get('utm_content'))
    const utmTerm = normalizeMarketingToken(searchParams.get('utm_term'))
    const currentPath =
      typeof window !== 'undefined'
        ? `${window.location.pathname}${window.location.search}${window.location.hash}`
        : undefined
    const referrer = typeof document !== 'undefined' ? document.referrer || undefined : undefined

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
            currentPath,
            email: trimmedEmail,
            honey,
            intent,
            referrer,
            role,
            source,
            utmCampaign,
            utmContent,
            utmMedium,
            utmSource,
            utmTerm,
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
        setSuccessMessage(
          intent === 'design-partner'
            ? "You're in. We'll follow up if there's a fit for the design partner track."
            : "You're on the list. We'll email you when early access opens.",
        )
      } catch {
        setSuccessMessage(null)
        setErrorMessage('We could not join the waitlist right now.')
      }
    })
  }

  return (
    <div className="rounded-[1.5rem] border border-background/15 bg-background/8 p-4 backdrop-blur-sm sm:p-6">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-background/70">
          Early access
        </p>
        <h3 className="text-2xl font-medium tracking-[-0.05em] text-balance">
          {intent === 'design-partner'
            ? 'Raise your hand for the design partner track.'
            : 'Get notified when the first kits are ready to install.'}
        </h3>
        <p className="text-sm leading-6 text-background/72">
          {intent === 'design-partner'
            ? 'Tell us who you build for so we can prioritize agencies and freelancers testing real installs.'
            : 'Join the waitlist for launch updates, public-kit drops, and early install access.'}
        </p>
      </div>

      <form className="mt-5 flex flex-col gap-3" onSubmit={handleSubmit}>
        <fieldset className="grid gap-2">
          <legend className="text-sm font-medium text-background">I want</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              aria-pressed={intent === 'waitlist'}
              onClick={() => setIntent('waitlist')}
              className={[
                'flex items-start gap-3 rounded-3xl border px-4 py-3 text-left transition-colors',
                intent === 'waitlist'
                  ? 'border-background/60 bg-background/14 text-background'
                  : 'border-background/18 bg-background/4 text-background/78 hover:bg-background/10',
              ].join(' ')}
            >
              <Rocket className="mt-0.5 size-4 shrink-0" />
              <span className="space-y-1">
                <span className="block text-sm font-medium">Launch updates</span>
                <span className="block text-xs leading-5 text-background/70">
                  Join the waitlist for early access and public-kit updates.
                </span>
              </span>
            </button>

            <button
              type="button"
              aria-pressed={intent === 'design-partner'}
              onClick={() => setIntent('design-partner')}
              className={[
                'flex items-start gap-3 rounded-3xl border px-4 py-3 text-left transition-colors',
                intent === 'design-partner'
                  ? 'border-background/60 bg-background/14 text-background'
                  : 'border-background/18 bg-background/4 text-background/78 hover:bg-background/10',
              ].join(' ')}
            >
              <BriefcaseBusiness className="mt-0.5 size-4 shrink-0" />
              <span className="space-y-1">
                <span className="block text-sm font-medium">Design partner</span>
                <span className="block text-xs leading-5 text-background/70">
                  Better fit if you ship Payload sites for clients and want to test installs early.
                </span>
              </span>
            </button>
          </div>
        </fieldset>

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

        <label className="space-y-2" htmlFor={roleId}>
          <span className="text-sm font-medium text-background">Which best describes you?</span>
          <Select value={role} onValueChange={(value) => setRole(value as WaitlistRole)}>
            <SelectTrigger
              id={roleId}
              className="h-11 rounded-full border-background/18 bg-background/10 px-4 text-background data-[placeholder]:text-background/45 [&_svg]:text-background/45"
            >
              <SelectValue placeholder="Select your role (optional)" />
            </SelectTrigger>
            <SelectContent>
              {roleOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            className="w-full rounded-full bg-background px-6 text-foreground hover:bg-background/90 sm:w-auto"
          >
            {isPending
              ? 'Joining...'
              : intent === 'design-partner'
                ? 'Request design partner access'
                : 'Join the waitlist'}
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
          {errorMessage ||
            successMessage ||
            'We email this signup with channel context so we can tell which early-access paths are working.'}
        </p>
      </form>
    </div>
  )
}
