'use client'

import { useEffect, useState } from 'react'

import { resolveConsent, subscribeToConsent, type ConsentState } from '@/lib/consent'

/* `undefined` means "not read yet". The server and the first client render both
 * see it, so markup matches and hydration stays clean; the real value arrives in
 * the effect below. Callers must render nothing consent-dependent until then. */
export type ResolvedConsent = ConsentState | null | undefined

export function useConsent(): ResolvedConsent {
  const [consent, setConsentState] = useState<ResolvedConsent>(undefined)

  useEffect(() => {
    const sync = () => setConsentState(resolveConsent())

    sync()

    return subscribeToConsent(sync)
  }, [])

  return consent
}
