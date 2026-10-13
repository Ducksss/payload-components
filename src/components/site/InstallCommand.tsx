import type { CSSProperties } from 'react'

import { CommandCopyButton } from '@/components/site/CommandCopyButton'
import { cn } from '@/utilities/ui'

/* The Datasheet install field: the command on paper inside an ink rule, with
 * the page's one solid key beside it — trace green inside the brand scope.
 * The landing's first <code> and first Copy button live here (frontend e2e
 * pins both), as does the closing CTA's.
 *
 * The visible label stays the full "Copy install command": the copy
 * controller swaps that text for "Copied", and the button's accessible name
 * has to follow it, so it cannot move into an aria-label. A field whose
 * content box is narrower than 34rem gets the key alone (the label stays for
 * assistive tech). The field is the query container, so that holds in a
 * laptop's half-width column as well as on a phone, and phones also lose the
 * prompt. That keeps the whole command visible from 390px up (frontend e2e
 * checks it). */
export function InstallCommand({
  className,
  command,
  label,
  style,
}: {
  className?: string
  command: string
  label: string
  style?: CSSProperties
}) {
  return (
    <div
      className={cn(
        '@container grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-md border border-foreground bg-background py-1.5 pe-1.5 ps-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-2.5 sm:ps-4',
        className,
      )}
      style={style}
    >
      <span
        aria-hidden="true"
        className="hidden font-mono text-[13px] text-muted-foreground sm:inline"
      >
        $
      </span>
      <code
        tabIndex={0}
        className="overflow-x-auto whitespace-nowrap font-mono text-[11.5px] text-foreground sm:text-[13px]"
      >
        {command}
      </code>
      <CommandCopyButton command={command} emphasis="brand" label={label} />
    </div>
  )
}
