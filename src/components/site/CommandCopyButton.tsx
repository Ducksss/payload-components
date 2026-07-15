import { Check, Copy } from 'lucide-react'

import { cn } from '@/utilities/ui'

export function CommandCopyButton({
  command,
  emphasis = 'default',
  label = 'Copy',
  ariaLabel,
}: {
  command: string
  emphasis?: 'default' | 'primary'
  label?: string
  ariaLabel?: string
}) {
  const primary = emphasis === 'primary'

  return (
    <button
      type="button"
      data-copy-command={command}
      data-copy-default-label={label}
      data-cta-level={primary ? 'primary' : 'secondary'}
      aria-label={ariaLabel}
      className={cn(
        'copy-button inline-flex shrink-0 items-center justify-center gap-1.5 border font-medium transition-[transform,background-color,border-color,box-shadow,color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        primary
          ? 'h-11 rounded-full border-primary bg-primary px-4 text-sm text-primary-foreground shadow-[0_16px_36px_-20px_rgba(15,23,42,0.72)] hover:-translate-y-px hover:bg-primary/90 hover:shadow-[0_20px_44px_-20px_rgba(15,23,42,0.78)] motion-reduce:transform-none data-[copied=true]:border-brand data-[copied=true]:bg-brand data-[copied=true]:text-brand-foreground'
          : 'h-8 rounded-md border-border bg-background px-2.5 font-mono text-xs text-muted-foreground hover:bg-secondary hover:text-foreground data-[copied=true]:border-brand/40 data-[copied=true]:bg-brand/10 data-[copied=true]:text-brand',
      )}
    >
      <Copy className="copy-icon-idle size-3.5" aria-hidden="true" />
      <Check className="copy-icon-done size-3.5" aria-hidden="true" />
      <span data-copy-label>{label}</span>
    </button>
  )
}
