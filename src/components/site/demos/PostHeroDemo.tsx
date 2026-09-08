/* Static article fixture. Mirrors components/PostHero/Component.tsx; h1 becomes div. */
export function PostHeroDemo() {
  return (
    <div aria-hidden="true" className="bg-background py-12 text-foreground md:py-20">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-4xl border-t border-border pt-6">
          <div className="mb-6 flex flex-wrap gap-3 text-xs font-medium uppercase tracking-eyebrow text-muted-foreground">
            <span>Field notes</span>
            <span>Publishing</span>
          </div>
          <div className="max-w-4xl break-words font-serif text-4xl leading-tight tracking-title md:text-6xl">
            Build for the people who publish.
          </div>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Good publishing tools make room for the work that matters. A few lessons from building
            alongside editors.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border pt-5 text-sm">
            <span className="font-medium">Alex Morgan</span>
            <time className="text-muted-foreground" dateTime="2026-08-12T12:00:00.000Z">
              August 12, 2026
            </time>
          </div>
        </div>
        <div className="mt-10 overflow-hidden rounded-lg bg-muted [&_img]:h-auto [&_img]:w-full">
          <div className="flex aspect-[3/1] items-center justify-center bg-muted font-serif text-4xl italic text-muted-foreground">
            Room for the story.
          </div>
        </div>
      </div>
    </div>
  )
}
