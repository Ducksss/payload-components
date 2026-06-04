'use client'

import { useState } from 'react'

import { Check, Copy } from 'lucide-react'

export function CommandCopyButton({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md border border-zinc-300 bg-white px-3 text-xs font-medium text-zinc-950 transition-colors hover:border-emerald-700 hover:text-emerald-700"
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
