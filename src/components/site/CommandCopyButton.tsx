import { Check, Copy } from 'lucide-react'

export function CommandCopyButton({ command }: { command: string }) {
  return (
    <button
      type="button"
      data-copy-command={command}
      className="copy-button inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 font-mono text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground data-[copied=true]:border-brand/40 data-[copied=true]:bg-brand/10 data-[copied=true]:text-brand"
    >
      <Copy className="copy-icon-idle size-3.5" aria-hidden="true" />
      <Check className="copy-icon-done size-3.5" aria-hidden="true" />
      <span data-copy-label>Copy</span>
    </button>
  )
}
