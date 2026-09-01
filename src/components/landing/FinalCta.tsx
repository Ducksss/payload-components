import { Suspense } from 'react'

import { WaitlistForm } from '@/components/landing/WaitlistForm'
import { cn } from '@/utilities/ui'
import { CheckCircle2 } from 'lucide-react'

import styles from './landing.module.css'

const earlyAccessPoints = [
  'Launch alerts when public kits ship',
  'Design partner track for repeat builders',
  'Direct path into the private Pro registry',
  'Free forever for the public catalog',
]

const WaitlistFormFallback = () => (
  <div className="rounded-2xl border border-background/15 bg-background/8 p-4 sm:p-6">
    <div className="space-y-2">
      <p className="text-sm font-medium tracking-[0.2em] text-background/70 uppercase">
        Early access
      </p>
      <h3 className="text-2xl font-medium tracking-[-0.02em] text-balance">
        Get notified when the first kits are ready to install.
      </h3>
      <p className="text-sm leading-6 text-background/72">
        Join the waitlist for launch updates, public-kit drops, and early install access.
      </p>
    </div>
    <div className="mt-5 h-[22rem] rounded-xl border border-dashed border-background/15 bg-background/6" />
  </div>
)

export const FinalCta = () => {
  return (
    <section
      id="early-access"
      className={cn(styles.sectionAnchor, 'relative isolate overflow-hidden bg-foreground text-background')}
    >
      {/* Subtle dot grid texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)',
          backgroundSize: '24px 24px',
          maskImage: 'linear-gradient(to bottom, black 30%, transparent 95%)',
        }}
      />
      {/* Brand glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-80 w-2/3 rounded-full bg-brand/25 blur-3xl"
      />

      <div className="container relative py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-semibold tracking-[0.2em] text-background/60 uppercase">
              Early access
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.04] tracking-[-0.02em] text-balance sm:text-5xl lg:text-[3.4rem]">
              Be first in line when the install flow opens up.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-background/75 sm:text-lg">
              Built for agencies and freelancers who ship Payload sites on repeat — and want
              blocks that install themselves.
            </p>

            <ul className="mt-8 grid gap-3 text-sm leading-6 text-background/75 sm:grid-cols-2">
              {earlyAccessPoints.map((point) => (
                <li key={point} className="flex items-start gap-2.5">
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-background/60"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full">
            <Suspense fallback={<WaitlistFormFallback />}>
              <WaitlistForm />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  )
}
