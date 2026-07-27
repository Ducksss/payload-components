'use client'

import { privacySignalOptOut, setConsent } from '@/lib/consent'

import { useConsent } from './useConsent'

const buttonClass =
  'inline-flex items-center justify-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
const primaryButtonClass =
  'inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'

/* A consent gate that cannot be revisited is not really a choice, so the
 * privacy page carries the live state and both switches. Rendered as a status
 * region: the text changes under the visitor without moving focus. */
export function ConsentSettings() {
  const consent = useConsent()

  if (consent === undefined) {
    // Pre-hydration: render the container so the surrounding layout is stable,
    // but no state text that the server could disagree with.
    return <div className="min-h-24" data-consent-settings="" />
  }

  const signalled = privacySignalOptOut()

  return (
    <div
      className="space-y-3 rounded-card border border-border bg-card p-4 shadow-card"
      data-consent-settings=""
    >
      <p className="text-sm text-muted-foreground" role="status">
        {signalled
          ? 'Your browser sends a privacy signal (Global Privacy Control or Do Not Track), so analytics stays off and this cannot be overridden here.'
          : consent === 'granted'
            ? 'Analytics is currently on.'
            : consent === 'denied'
              ? 'Analytics is currently off.'
              : 'You have not chosen yet, so analytics is off.'}
      </p>
      {signalled ? null : (
        <div className="flex flex-wrap gap-2">
          <button className={buttonClass} onClick={() => setConsent('denied')} type="button">
            Turn analytics off
          </button>
          <button
            className={primaryButtonClass}
            onClick={() => setConsent('granted')}
            type="button"
          >
            Turn analytics on
          </button>
        </div>
      )}
    </div>
  )
}
