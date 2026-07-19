import { CommandCopyButton } from '@/components/site/CommandCopyButton'

export function RunnableCommand({
  command,
  label,
  trackInstall = false,
}: {
  command: string
  label: string
  trackInstall?: boolean
}) {
  return (
    <span className="not-prose my-1 inline-grid max-w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-border bg-muted/40 p-1 pl-3 align-middle">
      <code
        tabIndex={0}
        className="min-w-0 overflow-x-auto whitespace-nowrap font-mono text-xs text-foreground/90"
      >
        {command}
      </code>
      <CommandCopyButton command={command} ariaLabel={label} trackInstall={trackInstall} />
    </span>
  )
}
