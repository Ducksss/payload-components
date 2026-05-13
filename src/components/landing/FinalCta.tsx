import { Suspense } from 'react'

import { Badge } from '@/components/ui/badge'
import { WaitlistForm } from '@/components/landing/WaitlistForm'

const WaitlistFormFallback = () => (
  <div className="rounded-[1.5rem] border border-background/15 bg-background/8 p-4 backdrop-blur-sm sm:p-6">
    <div className="space-y-2">
      <p className="text-sm font-medium uppercase tracking-[0.2em] text-background/70">Early access</p>
      <h3 className="text-2xl font-medium tracking-[-0.05em] text-balance">
        Get notified when the first kits are ready to install.
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
    <section id="early-access" className="border-t border-border/60">
      <div className="container py-16 lg:py-24">
        <div className="rounded-[2rem] border border-border/70 bg-foreground px-6 py-10 text-background shadow-[0_24px_70px_-45px_rgba(15,23,42,0.5)] sm:px-8 lg:px-12 lg:py-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <Badge
                variant="secondary"
                className="rounded-full border-0 bg-background/10 px-4 py-1 uppercase tracking-[0.18em] text-background"
              >
                Early access
              </Badge>
              <h2 className="mt-5 text-4xl font-medium tracking-[-0.06em] sm:text-5xl">
                Join the waitlist or raise your hand for the design partner track.
              </h2>
              <p className="mt-4 text-base leading-7 text-background/72">
                Built for agencies and freelancers who want curated blocks, reliable repo wiring,
                and a chance to influence the next layer of the install flow after the public
                gallery and first shipped kits.
              </p>
            </div>

            <div className="w-full max-w-xl">
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
