/* Static recommendations fixture. Mirrors components/RelatedPosts/Component.tsx: the section
 * becomes div, h2/h3 become div, links become span, and the image slot is a bg-muted placeholder. */
const relatedPosts = [
  {
    date: 'Aug 28, 2026',
    dateTime: '2026-08-28T12:00:00.000Z',
    excerpt:
      'Editors know what a page needs to say. Start there, then decide which fields the block deserves.',
    title: 'Write the brief before the block',
  },
  {
    date: 'Aug 19, 2026',
    dateTime: '2026-08-19T12:00:00.000Z',
    excerpt:
      'Preview, review, and schedule changes without a second CMS or a staging copy of the site.',
    title: 'Drafts are a feature, not a state',
  },
  {
    date: 'Aug 7, 2026',
    dateTime: '2026-08-07T12:00:00.000Z',
    excerpt:
      'Every optional field is a decision you hand to an editor. Make fewer of them, and make them count.',
    title: 'Fewer fields, better pages',
  },
]

export function RelatedPostsDemo() {
  return (
    <div aria-hidden="true" className="bg-background py-12 text-foreground">
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl">
          <div className="font-serif text-3xl tracking-tight">Related posts</div>
          <ul className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((post) => (
              <li
                key={post.title}
                className="group relative flex flex-col border-t border-border pt-4"
              >
                <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-muted [&_img]:h-full [&_img]:w-full [&_img]:object-cover" />
                <div className="break-words text-lg font-medium leading-snug tracking-title">
                  <span className="rounded-sm underline-offset-4 after:absolute after:inset-0 group-hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {post.title}
                  </span>
                </div>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {post.excerpt}
                </p>
                <time className="mt-3 text-xs text-muted-foreground" dateTime={post.dateTime}>
                  {post.date}
                </time>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
