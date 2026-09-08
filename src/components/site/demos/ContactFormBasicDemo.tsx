import { contactFormBasicDemoContent as content } from '@/lib/demo-content'

/** Presentational twin: native controls become divs and the heading becomes a div. */
export function ContactFormBasicDemo() {
  return (
    <section aria-hidden="true" className="container">
      <div className="overflow-hidden rounded-frame border border-border/70 bg-card/35 px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-5">
            <p className="text-xs font-medium uppercase tracking-eyebrow text-muted-foreground">
              Get in touch
            </p>
            <div className="text-4xl font-medium tracking-display text-balance sm:text-5xl">
              {content.title}
            </div>
            <p className="max-w-md text-base leading-7 text-muted-foreground">
              {content.description}
            </p>
            <p className="text-sm text-muted-foreground">Fields marked * are required.</p>
          </div>
          <div className="space-y-5">
            {[
              content.nameLabel,
              content.emailLabel,
              content.organizationLabel,
              content.messageLabel,
            ].map((label, index) => (
              <div key={label} className="space-y-2">
                <div className="block text-sm font-medium">
                  {label}
                  {index === 2 ? ' (optional)' : ' *'}
                </div>
                {index === 3 ? (
                  <div className="w-full resize-y rounded-lg border border-border bg-background px-4 py-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60">
                    <div className="h-24" />
                  </div>
                ) : (
                  <div className="h-12 w-full rounded-lg border border-border bg-background px-4 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60" />
                )}
              </div>
            ))}
            <div className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60">
              {content.submitLabel}
            </div>
            <p className="text-sm leading-6 text-muted-foreground" />
            <p className="hidden text-sm text-destructive" />
          </div>
        </div>
      </div>
    </section>
  )
}
