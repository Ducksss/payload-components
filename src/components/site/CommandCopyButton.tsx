'use client'

import { useState } from 'react'

import { Check, Copy } from 'lucide-react'

export function CommandCopyButton({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      className={
        copied
          ? 'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-brand/40 bg-brand/10 px-2.5 font-mono text-xs font-medium text-brand transition-colors'
          : 'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 font-mono text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground'
      }
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(command)
        } catch {
          // Clipboard writes can be denied in locked-down browsers; the visible state still confirms the action.
        }

        setCopied(true)
        window.setTimeout(() => setCopied(false), 1100)
      }}
    >
      {copied ? (
        <Check className="size-3.5" aria-hidden="true" />
      ) : (
        <Copy className="size-3.5" aria-hidden="true" />
      )}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}
