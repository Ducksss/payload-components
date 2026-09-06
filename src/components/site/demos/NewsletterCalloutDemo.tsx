/* Static fixture. Mirrors components/NewsletterCallout/Component.tsx without submitting. */
export function NewsletterCalloutDemo() {
  return (
    <div aria-hidden="true" className="bg-background py-12 text-foreground">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-muted/40 p-6 sm:p-10">
          <p className="font-serif text-3xl tracking-title">Keep reading</p>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            Get the next article in your inbox.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <span className="sr-only">Email address</span>
            <div className="min-h-11 min-w-0 flex-1 rounded-md border border-input bg-background px-4 text-base outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring">
              you@example.com
            </div>
            <div className="min-h-11 rounded-md bg-primary px-5 font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              Subscribe
            </div>
          </div>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  )
}
