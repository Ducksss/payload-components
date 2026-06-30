'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

import { trackPageView } from '@/lib/analytics'

export function AnalyticsPageview() {
  const pathname = usePathname()

  useEffect(() => {
    trackPageView()
  }, [pathname])

  return null
}
