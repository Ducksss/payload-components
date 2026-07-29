'use client'

import type { ReactNode } from 'react'

import Link from 'next/link'

import {
  trackTemplateEvent,
  type TemplateAnalyticsEvent,
  type TemplateAnalyticsProperties,
} from '@/lib/analytics'

/* A link that reports one approved template event on click. Internal hrefs go
 * through next/link; external ones (GitHub) open a new tab. Analytics never
 * blocks navigation — trackTemplateEvent swallows its own failures. */
export function TemplateTrackedLink({
  children,
  className,
  event,
  external = false,
  href,
  properties,
}: {
  children: ReactNode
  className?: string
  event: TemplateAnalyticsEvent
  external?: boolean
  href: string
  properties: TemplateAnalyticsProperties
}) {
  const onClick = () => trackTemplateEvent(event, properties)

  if (external) {
    return (
      <a className={className} href={href} onClick={onClick} rel="noreferrer" target="_blank">
        {children}
      </a>
    )
  }

  return (
    <Link className={className} href={href} onClick={onClick}>
      {children}
    </Link>
  )
}
