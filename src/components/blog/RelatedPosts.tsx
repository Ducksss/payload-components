import { BlogCard } from '@/components/blog/BlogCard'
import { getRelatedPosts, type BlogPage } from '@/lib/blog'

export function RelatedPosts({ page }: { page: BlogPage }) {
  const related = getRelatedPosts(page)
  if (related.length === 0) return null

  return (
    <section aria-labelledby="related-posts-title" className="mt-16 border-t border-border pt-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] font-medium uppercase tracking-eyebrow text-brand-600">
            Keep reading
          </p>
          <h2 id="related-posts-title" className="mt-2 text-2xl font-semibold tracking-title text-foreground">
            Related reading
          </h2>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {related.map((relatedPage) => (
          <BlogCard headingLevel={3} key={relatedPage.url} page={relatedPage} />
        ))}
      </div>
    </section>
  )
}
