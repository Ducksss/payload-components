import { Suspense } from 'react'

import { Badge } from '@/components/ui/badge'
import { WaitlistForm } from '@/components/landing/WaitlistForm'
import { cn } from '@/utilities/ui'
import { Sparkles } from 'lucide-react'

import styles from './landing.module.css'

const WaitlistFormFallback = () => (
  <div className="rounded-[1.5rem] border border-background/15 bg-background/8 p-4 backdrop-blur-sm sm:p-6">
    <div className="space-y-2">
      <p className="text-sm font-medium uppercase tracking-[0.22em] text-background/70">
        Early access
      </p>
      <h3 className="text-2xl font-medium tracking-[-0.05em] text-balance">
        Get notified as the kit catalog expands.
      </h3>
      <p className="text-sm leading-6 text-background/72">
        Join the waitlist for launch updates, public-kit drops, and early install access.
      </p>
    </div>
    <div className="mt-5 h-[22rem] rounded-[1.25rem] border border-dashed border-background/15 bg-background/6" />
  </div>
)

export const FinalCta = () => {
  return (
    <section id="early-access" className={cn(styles.sectionAnchor, 'relative isolate overflow-hidden')}>
      <div className="container py-20 lg:py-28">
        <div
          className={cn(
            'relative overflow-hidden rounded-[2rem] border border-foreground/85 bg-foreground px-6 py-12 text-background shadow-[0_36px_110px_-50px_rgba(15,23,42,0.65)] sm:px-10 sm:py-14 lg:px-14 lg:py-16',
          )}
        >
          {/* Decorative glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-32 mx-auto h-72 w-3/4 rounded-full bg-background/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.45) 1px, transparent 0)',
              backgroundSize: '24px 24px',
              maskImage: 'linear-gradient(to bottom, black 35%, transparent 95%)',
            }}
          />

          <div className="relative grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-center">
            <div className="max-w-2xl">
              <Badge
                variant="secondary"
                className="inline-flex items-center gap-2 rounded-full border-0 bg-background/12 px-4 py-1.5 text-[0.72rem] font-medium uppercase tracking-[0.22em] text-background"
              >
                <Sparkles className="size-3.5" aria-hidden="true" />
                Early access · Limited
              </Badge>
              <h2 className="mt-5 text-4xl font-medium leading-[1.02] tracking-[-0.06em] text-balance sm:text-5xl lg:text-[3.4rem]">
                Be first when the install flow opens.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-background/75 sm:text-lg">
                Built for agencies and freelancers who want curated blocks, reliable repo wiring,
                and a chance to influence the next layer of the install flow after the public
                gallery and the shipped public kits.
              </p>

              <ul className="mt-7 grid gap-2.5 text-sm leading-6 text-background/72 sm:grid-cols-2">
                <li className="flex items-start gap-2.5">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-background/65" />
                  Launch alerts when public kits ship
                </li>
                <li className="flex items-start gap-2.5">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-background/65" />
                  Design partner track for repeat builders
                </li>
                <li className="flex items-start gap-2.5">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-background/65" />
                  Direct path into the private Pro registry
                </li>
                <li className="flex items-start gap-2.5">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-background/65" />
                  Free forever for the public catalog
                </li>
              </ul>
            </div>

            <div className="w-full">
              <Suspense fallback={<WaitlistFormFallback />}>
                <WaitlistForm />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
