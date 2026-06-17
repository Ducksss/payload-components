'use client'

import { useEffect, useRef, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const copiedTimers = new WeakMap<HTMLButtonElement, number>()
const alertDurationMs = 2200

export function CommandCopyController() {
  const [alertKey, setAlertKey] = useState(0)
  const [showAlert, setShowAlert] = useState(false)
  const alertTimer = useRef<number | null>(null)

  useEffect(() => {
    const showCopiedAlert = () => {
      setAlertKey((key) => key + 1)
      setShowAlert(true)

      if (alertTimer.current) window.clearTimeout(alertTimer.current)
      alertTimer.current = window.setTimeout(() => setShowAlert(false), alertDurationMs)
    }

    const reset = (button: HTMLButtonElement) => {
      delete button.dataset.copied
      button.querySelector('[data-copy-label]')?.replaceChildren('Copy')
    }

    const clipboard = navigator.clipboard
    const originalWriteText = clipboard?.writeText
    const originalWrite = clipboard?.write
    let patchedWriteText: Clipboard['writeText'] | undefined
    let patchedWrite: Clipboard['write'] | undefined

    if (clipboard && originalWriteText) {
      patchedWriteText = (async (text) => {
        const result = await originalWriteText.call(clipboard, text)
        showCopiedAlert()
        return result
      }) as Clipboard['writeText']
      clipboard.writeText = patchedWriteText
    }

    if (clipboard && originalWrite) {
      patchedWrite = (async (data) => {
        const result = await originalWrite.call(clipboard, data)
        showCopiedAlert()
        return result
      }) as Clipboard['write']
      clipboard.write = patchedWrite
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

    return () => {
      document.removeEventListener('click', onClick)
      if (clipboard && patchedWriteText && clipboard.writeText === patchedWriteText) {
        clipboard.writeText = originalWriteText
      }
      if (clipboard && patchedWrite && clipboard.write === patchedWrite) {
        clipboard.write = originalWrite
      }
      if (alertTimer.current) window.clearTimeout(alertTimer.current)
    }
  }, [])

  if (!showAlert) return null

  return (
    <Alert
      key={alertKey}
      className="pointer-events-none fixed right-4 bottom-4 z-50 w-[calc(100vw-2rem)] max-w-sm shadow-card sm:right-6 sm:bottom-6"
    >
      <CheckCircle2 aria-hidden="true" />
      <AlertTitle>Copied</AlertTitle>
      <AlertDescription>Copied to clipboard.</AlertDescription>
    </Alert>
  )
}
