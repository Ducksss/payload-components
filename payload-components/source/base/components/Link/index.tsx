import Link from 'next/link'
import React from 'react'

import { cn } from '@/utilities/ui'

type CMSLinkType = {
  appearance?: 'default' | 'inline' | 'outline' | null
  children?: React.ReactNode
  className?: string
  label?: null | string
  newTab?: boolean | null
  reference?: {
    relationTo: string
    value: { slug?: null | string } | number | string
  } | null
  size?: 'default' | 'lg' | 'sm' | null
  type?: 'custom' | 'reference' | null
  url?: null | string
}

const appearanceClasses: Record<'default' | 'outline', string> = {
  default:
    'inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  outline:
    'inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
}

/**
 * Renders one link from the `link` field: an internal reference resolves to
 * `/{slug}`, a custom link uses its URL verbatim.
 *
 * Mirrors the component the Payload website starter ships at
 * `src/components/Link/index.tsx`, because every installed block that renders a
 * call to action imports `CMSLink` from that path and spreads a stored link
 * value straight into it.
 *
 * Deliberately dependency-free beyond `next/link` and `cn`: the starter's version
 * renders through its own `Button`, which a bare project does not have. Swap in
 * your own button here if you want the two to share styling.
 */
export const CMSLink: React.FC<CMSLinkType> = ({
  appearance = 'inline',
  children,
  className,
  label,
  newTab,
  reference,
  size,
  type,
  url,
}) => {
  const href =
    type === 'reference' && typeof reference?.value === 'object' && reference.value.slug
      ? `${reference.relationTo !== 'pages' ? `/${reference.relationTo}` : ''}/${reference.value.slug}`
      : url

  if (!href) return null

  const newTabProps = newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}
  const styled = appearance === 'default' || appearance === 'outline'

  return (
    <Link
      className={cn(styled ? appearanceClasses[appearance] : undefined, className)}
      data-size={size ?? undefined}
      href={href}
      {...newTabProps}
    >
      {label}
      {children}
    </Link>
  )
}
