'use client'

import { useSyncExternalStore } from 'react'

import { CommandCopyButton } from '@/components/site/CommandCopyButton'
import { componentEntries } from '@/lib/component-catalog'

/* Backs <ComponentInstall slug command manual /> in MDX: the Installation panel of a
 * component reference page. One rounded-lg panel: a package-manager switcher and
 * the page's primary copy button on a strip, the CLI command under it, then a
 * quieter Manual row with the shadcn registry command. The MDX passes the npm
 * (`npx …`) and pnpm (`pnpm dlx shadcn@latest …`) forms verbatim — the /llms* and
 * per-page markdown surfaces serialize the tag with its props — and the switcher
 * derives the other forms by swapping the runner in front of the package.
 *
 * The choice lives in localStorage (`payload-components:package-manager`), read
 * through useSyncExternalStore: the server snapshot is npm, so the markup hydrates
 * clean and the e2e install-copy pin (`npx payload-components add <slug>` on a
 * fresh profile) holds, and the stored choice replaces it right after hydration.
 * The command line is one row, so the restore moves no layout.
 * CommandCopyController drives the copy buttons: `data-copy-command` follows the
 * selection, and the primary button keeps its `Copy the <slug> install command`
 * name through the swap. */

const storageKey = 'payload-components:package-manager'

const packageManagers = [
  { id: 'npm', runner: 'npx' },
  { id: 'pnpm', runner: 'pnpm dlx' },
  { id: 'yarn', runner: 'yarn dlx' },
  { id: 'bun', runner: 'bunx' },
] as const

type PackageManager = (typeof packageManagers)[number]['id']

const isPackageManager = (value: unknown): value is PackageManager =>
  packageManagers.some((manager) => manager.id === value)

/* `npx payload-components add x` → `pnpm dlx payload-components add x`. A command
   that starts with no known runner is left alone. */
const runnerPrefix = /^(?:npx|pnpm dlx|yarn dlx|bunx(?: --bun)?)\s+/
const withRunner = (command: string, runner: string) =>
  runnerPrefix.test(command) ? command.replace(runnerPrefix, `${runner} `) : command

/* The store: localStorage, with an in-memory fallback when it is unavailable
   (private mode / disabled) so the choice still lasts for the page. */
let memory: PackageManager = 'npm'
const listeners = new Set<() => void>()

function readManager(): PackageManager {
  try {
    const stored = window.localStorage.getItem(storageKey)
    return isPackageManager(stored) ? stored : memory
  } catch {
    return memory
  }
}

function writeManager(manager: PackageManager) {
  memory = manager
  try {
    window.localStorage.setItem(storageKey, manager)
  } catch {
    // Kept in memory only.
  }
  for (const listener of listeners) listener()
}

/* Other tabs write the same key; the `storage` event keeps this one in step. */
function subscribe(listener: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === storageKey) listener()
  }
  listeners.add(listener)
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

const serverManager = (): PackageManager => 'npm'

function usePackageManager() {
  return [useSyncExternalStore(subscribe, readManager, serverManager), writeManager] as const
}

export function ComponentInstall({
  command,
  manual,
  slug,
}: {
  command: string
  manual: string
  slug: string
}) {
  const [manager, select] = usePackageManager()
  /* Post components install as files only: the registry copy is the whole install. */
  const fileOnly = componentEntries.find((entry) => entry.slug === slug)?.family === 'posts'

  const runner = packageManagers.find((entry) => entry.id === manager)?.runner ?? 'npx'
  const cliCommand = withRunner(command, runner)
  const manualCommand = withRunner(manual, runner)

  return (
    <div
      className="not-prose my-6 overflow-hidden rounded-lg border border-border bg-background"
      data-component-install={slug}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-4 py-3">
        <div
          role="radiogroup"
          aria-label="Package manager"
          className="inline-flex h-9 items-center gap-1 rounded-md border border-border bg-background p-1"
        >
          {packageManagers.map((entry) => (
            <label key={entry.id} className="relative">
              <input
                type="radio"
                name={`package-manager-${slug}`}
                value={entry.id}
                checked={manager === entry.id}
                onChange={() => select(entry.id)}
                className="peer sr-only"
              />
              <span className="inline-flex h-7 cursor-pointer select-none items-center rounded-sm px-3 font-mono text-xs leading-none text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground peer-checked:bg-secondary peer-checked:text-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background">
                {entry.id}
              </span>
            </label>
          ))}
        </div>
        <CommandCopyButton
          command={cliCommand}
          emphasis="solid"
          ariaLabel={`Copy the ${slug} install command`}
          trackInstall
        />
      </div>

      <div className="flex items-center gap-3 px-4 py-4">
        <span
          aria-hidden="true"
          className="select-none font-mono text-[13px] text-muted-foreground"
        >
          $
        </span>
        <code
          tabIndex={0}
          className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-[13px] text-foreground"
        >
          {cliCommand}
        </code>
      </div>

      <div className="flex flex-col gap-2 border-t border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="shrink-0 self-start pt-1.5 text-xs font-medium text-muted-foreground">
            Manual
          </span>
          <code className="min-w-0 flex-1 break-all font-mono text-[13px] text-muted-foreground">
            {manualCommand}
          </code>
          <CommandCopyButton
            command={manualCommand}
            ariaLabel={`Copy the ${slug} manual install command`}
            trackInstall={false}
          />
        </div>
        <p className="text-xs leading-5 text-muted-foreground">
          {fileOnly
            ? 'This file-only component needs no Payload wiring: either command copies the same source files.'
            : 'The registry copy brings the source files only; register the block and map its renderer yourself, or let the CLI command above do both.'}
        </p>
      </div>
    </div>
  )
}
