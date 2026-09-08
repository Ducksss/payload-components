'use client'

import { useEffect, useRef } from 'react'

import DefaultSearchDialog from 'fumadocs-ui/components/dialog/search-default'
import type { DefaultSearchDialogProps } from 'fumadocs-ui/components/dialog/search-default'

let lastSearchInvoker: HTMLElement | null = null

/* The dialog is lazily mounted by Fumadocs, after its trigger has already been
 * activated. This always-mounted capture sits in the docs shell so the custom
 * dialog can restore the real invoker instead of guessing at a selector. */
export function DocsSearchFocusCapture() {
  useEffect(() => {
    const rememberInvoker = (event: Event) => {
      const target = event.target

      if (!(target instanceof Element)) return
      const trigger = target.closest<HTMLElement>('[data-search], [data-search-full]')

      if (trigger) {
        lastSearchInvoker = trigger
      }
    }
    const rememberHotkeyTarget = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'k' || (!event.metaKey && !event.ctrlKey)) return

      if (
        document.activeElement instanceof HTMLElement &&
        document.activeElement !== document.body
      ) {
        lastSearchInvoker = document.activeElement
      }
    }

    document.addEventListener('pointerdown', rememberInvoker, true)
    document.addEventListener('click', rememberInvoker, true)
    document.addEventListener('keydown', rememberHotkeyTarget, true)
    return () => {
      document.removeEventListener('pointerdown', rememberInvoker, true)
      document.removeEventListener('click', rememberInvoker, true)
      document.removeEventListener('keydown', rememberHotkeyTarget, true)
    }
  }, [])

  return null
}

/* Fumadocs opens search through context instead of a Radix DialogTrigger, so
 * Radix has no invoker to restore after Escape/Close. Restore the trigger that
 * the always-mounted capture recorded once the controlled dialog closes. */
export function DocsSearchDialog(props: DefaultSearchDialogProps) {
  const { open } = props
  const openedPathRef = useRef<string | null>(null)
  const previousOpenRef = useRef(open)

  useEffect(() => {
    if (open) {
      openedPathRef.current = window.location.pathname
    }
  }, [open])

  useEffect(() => {
    if (previousOpenRef.current && !open) {
      const target = lastSearchInvoker
      let restoreFrame = 0
      let restoreTimer = 0
      const restoreFocus = () => {
        if (target?.isConnected && openedPathRef.current === window.location.pathname) {
          target.focus()
        }
      }
      const settleFrame = requestAnimationFrame(() => {
        restoreFrame = requestAnimationFrame(() => {
          restoreFocus()
        })
      })
      /* Radix keeps the closing layer mounted through its exit animation and
         may run close autofocus after our layout effect. Re-assert once that
         transition settles; path equality prevents stealing focus after a
         search-result navigation. */
      restoreTimer = window.setTimeout(restoreFocus, 250)

      previousOpenRef.current = open
      return () => {
        cancelAnimationFrame(settleFrame)
        cancelAnimationFrame(restoreFrame)
        window.clearTimeout(restoreTimer)
      }
    }

    previousOpenRef.current = open
  }, [open])

  return <DefaultSearchDialog {...props} />
}
