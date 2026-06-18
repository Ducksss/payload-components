import { Mail, SendHorizonal } from 'lucide-react'

import { callToActionSignupDemoContent, type CtaDemoContent } from '@/lib/demo-content'

/* DEMO TWIN of payload-components/source/blocks/CallToActionSignup/Component.tsx
 * (call-to-action-signup@0.1.0). Class strings are copied verbatim from the
 * component source, in source order. Deliberate substitutions:
 *   <section className={cn('container', …)}> → <div> root (frames own spacing; no landmark)
 *   <h2>                                     → <div> (role-neutral; the catalog owns its outline)
 *   <form>/<input>/shadcn <Button>           → non-interactive <div>/<span> carrying the same
 *                                              class literals (aria-hidden content must not be focusable)
 *   CallToActionSignupBlockData              → CtaDemoContent (@/payload-types is consumer-only)
 *   cn() inner wrapper                       → plain mx-auto/max-w-2xl div (skipped by the class-mirror guard)
 * The Mail/SendHorizonal lucide icons render <svg> and are imported real. If the
 * component Component.tsx changes, update this file in the same PR. */

export function CallToActionSignupDemo({
  className,
  content = callToActionSignupDemoContent,
}: {
  className?: string
  content?: CtaDemoContent
}) {
  const { description, emailPlaceholder, submitLabel, title } = content

  return (
    <div aria-hidden="true" className={className}>
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <div className="text-4xl font-medium tracking-display text-balance sm:text-5xl">
            {title}
          </div>

          {description ? (
            <p className="text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
          ) : null}

          <div className="mt-2 w-full max-w-sm">
            <div className="relative grid grid-cols-[1fr_auto] items-center rounded-xl border border-border/70 bg-background/80 pr-2">
              <Mail className="pointer-events-none absolute inset-y-0 left-4 my-auto size-5 text-muted-foreground" />

              <div className="flex h-12 w-full items-center bg-transparent pl-11 text-sm text-muted-foreground focus:outline-none">
                {emailPlaceholder ?? 'Your email address'}
              </div>

              <span className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
                <span className="hidden sm:block">{submitLabel ?? 'Get Started'}</span>
                <SendHorizonal className="size-4 sm:hidden" strokeWidth={2} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
