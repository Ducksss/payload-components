'use client'

import { useEffect } from 'react'

const copiedTimers = new WeakMap<HTMLButtonElement, number>()

export function CommandCopyController() {
  useEffect(() => {
    const reset = (button: HTMLButtonElement) => {
      delete button.dataset.copied
      button.querySelector('[data-copy-label]')?.replaceChildren('Copy')
    }

    const onClick = async (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return

      const button = event.target.closest<HTMLButtonElement>('[data-copy-command]')
      const command = button?.dataset.copyCommand

      if (!button || !command) return

      try {
        await navigator.clipboard.writeText(command)
      } catch {
        // Clipboard writes can be denied; the visible state still confirms the click.
      }

      button.dataset.copied = 'true'
      button.querySelector('[data-copy-label]')?.replaceChildren('Copied')

      window.clearTimeout(copiedTimers.get(button))
      copiedTimers.set(button, window.setTimeout(() => reset(button), 1100))
    }

    document.addEventListener('click', onClick)

    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
