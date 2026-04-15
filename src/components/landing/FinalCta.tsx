import { Badge } from '@/components/ui/badge'
import { WaitlistForm } from '@/components/landing/WaitlistForm'

export const FinalCta = () => {
  return (
    <section className="border-t border-border/60">
      <div className="container py-16 lg:py-24">
        <div className="rounded-[2rem] border border-border/70 bg-foreground px-6 py-10 text-background shadow-[0_24px_70px_-45px_rgba(15,23,42,0.5)] sm:px-8 lg:px-12 lg:py-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <Badge
                variant="secondary"
                className="rounded-full border-0 bg-background/10 px-4 py-1 uppercase tracking-[0.18em] text-background"
              >
                Payload Kits
              </Badge>
              <h2 className="mt-5 text-4xl font-medium tracking-[-0.06em] sm:text-5xl">
                Ship the next client site with kits that already know Payload.
              </h2>
              <p className="mt-4 text-base leading-7 text-background/72">
                Designed for agencies and freelancers who want install confidence, curated quality,
                and less manual block plumbing every time a new project starts.
              </p>
            </div>

            <div className="w-full max-w-xl">
              <WaitlistForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
