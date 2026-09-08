import { collectionQueryDemoPosts } from '@/lib/demo-content'

/* DEMO TWIN of payload-components/source/blocks/CollectionQuery/Component.tsx.
 * The real block queries Payload on the server; this presentational twin uses
 * a committed three-post fixture so screenshots and catalog renders are stable. */

export function CollectionQueryDemo() {
  return (
    <section aria-hidden="true" className="container">
      <div className="mx-auto max-w-6xl space-y-6 scroll-mt-24">
        <div className="flex flex-wrap gap-2">
          {['All posts', 'Engineering', 'Product'].map((category, index) => (
            <span
              className={
                index === 0
                  ? 'rounded-md border border-foreground bg-foreground px-3 py-2 text-sm text-background'
                  : 'rounded-md border border-border px-3 py-2 text-sm'
              }
              key={category}
            >
              {category}
            </span>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="contents">
            {collectionQueryDemoPosts.map((post) => (
              <article
                className="group flex flex-col gap-0 overflow-hidden rounded-xl border border-border/70 bg-card py-0 shadow-none"
                key={post.title}
              >
                <div className="aspect-[16/10] bg-muted" />
                <div className="flex min-w-0 flex-col gap-3 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    {post.categories.map((category) => (
                      <span
                        className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground"
                        key={category}
                      >
                        {category}
                      </span>
                    ))}
                    <span className="text-xs text-muted-foreground">{post.publishedAt}</span>
                  </div>
                  <div className="text-balance text-xl font-medium leading-snug tracking-title">
                    {post.title}
                  </div>
                  <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {post.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="text-sm text-muted-foreground">9 posts</div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="px-3 py-2 text-sm text-muted-foreground">Previous</span>
          <span className="text-sm text-muted-foreground">Page 1 of 3</span>
          <span className="rounded-md border border-border px-3 py-2 text-sm">Next</span>
        </div>
      </div>
    </section>
  )
}
