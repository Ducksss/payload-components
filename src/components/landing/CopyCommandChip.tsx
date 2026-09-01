'use client'

import { useEffect, useRef, useState } from 'react'

import { cn } from '@/utilities/ui'
import { Check, Copy } from 'lucide-react'

type CopyCommandChipProps = {
  className?: string
  command: string
}

export const CopyCommandChip = ({ className, command }: CopyCommandChipProps) => {
  const [copied, setCopied] = useState(false)
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current)
    }
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      if (resetTimer.current) clearTimeout(resetTimer.current)
      resetTimer.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable (permissions/insecure context) — leave the chip as-is.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`Copy command: ${command}`}
      className={cn(
        'group inline-flex items-center gap-3 rounded-full border border-border bg-card py-2 pr-3.5 pl-4 font-mono text-[0.82rem] text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground',
        className,
      )}
    >
      <span>
        <span aria-hidden="true" className="select-none text-muted-foreground/50">
          ${' '}
        </span>
        {command}
      </span>
      <span aria-live="polite">
        {copied ? (
          <>
            <Check aria-hidden="true" className="size-3.5 text-emerald-600" />
            <span className="sr-only">Copied</span>
          </>
        ) : (
          <Copy
            aria-hidden="true"
            className="size-3.5 opacity-50 transition-opacity group-hover:opacity-100"
          />
        )}
      </span>
    </button>
  )
}
