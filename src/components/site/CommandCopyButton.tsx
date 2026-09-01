'use client'

import { useState } from 'react'

import { Check, Copy } from 'lucide-react'

const variantClasses = {
  dark: 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white',
  light: 'border-zinc-300 bg-white text-zinc-950 hover:border-zinc-950',
} as const

const copiedClasses = {
  dark: 'border-emerald-500/60 text-emerald-400',
  light: 'border-emerald-600 text-emerald-700',
} as const

export function CommandCopyButton({
  command,
  variant = 'light',
}: {
  command: string
  variant?: keyof typeof variantClasses
}) {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      className={[
        'inline-flex h-8 shrink-0 items-center gap-2 rounded-md border px-3 text-xs font-medium transition-colors',
        copied ? copiedClasses[variant] : variantClasses[variant],
      ].join(' ')}
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
