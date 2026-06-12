import { cn } from '@/utilities/ui'

import type { DemoLinkData } from '@/lib/demo-content'

/* Stand-in for the website starter's CMSLink (which renders a shadcn
 * Button). Twins are aria-hidden illustrations, so this is a <span> —
 * never <a>/<button> — because aria-hidden content must not contain
 * focusable descendants. */

const appearances = {
  default: 'bg-primary text-primary-foreground',
  outline: 'border border-border bg-background text-foreground',
} as const

export function DemoLink({ appearance, label }: DemoLinkData) {
  return (
    <span
      className={cn(
        'inline-flex h-10 items-center justify-center rounded-md px-5 text-sm font-medium',
        appearances[appearance],
      )}
    >
      {label}
    </span>
  )
}
