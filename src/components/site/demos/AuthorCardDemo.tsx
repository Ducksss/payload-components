/* Static profile fixture. Mirrors components/AuthorCard/Component.tsx; link becomes span. */
export function AuthorCardDemo() {
  return (
    <div aria-hidden="true" className="bg-background py-8 text-foreground">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl border-y border-border py-8">
          <p className="mb-6 text-xs font-medium uppercase tracking-eyebrow text-muted-foreground">
            About the author
          </p>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted font-serif text-2xl text-muted-foreground [&_img]:h-full [&_img]:w-full [&_img]:object-cover">
              <span>AM</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="break-words text-xl font-medium tracking-title">
                <span className="rounded-sm underline decoration-border underline-offset-4 transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  Alex Morgan
                </span>
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Editor &amp; developer</p>
              <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
                Building thoughtful publishing tools and sharing what we learn along the way.
                Usually found between a draft and a pull request.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
