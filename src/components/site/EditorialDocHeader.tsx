import { MarkdownCopyButton, ViewOptionsPopover } from 'fumadocs-ui/layouts/docs/page'

import { Eyebrow, HeadingAccent } from '@/components/site/section'

/* Header for long-form docs essays (frontmatter `editorial`), rendered by
 * src/app/[locale]/docs/[[...slug]]/page.tsx in place of the stock DocsTitle.
 * The <h1> is still the page title verbatim: the accent word is wrapped inline,
 * so the heading's accessible name never changes. */
export function EditorialDocHeader({
  accent,
  description,
  eyebrow,
  githubUrl,
  markdownUrl,
  title,
}: {
  accent?: string
  description?: string
  eyebrow: string
  githubUrl: string
  markdownUrl: string
  title: string
}) {
  const index = accent ? title.lastIndexOf(accent) : -1

  return (
    <header className="not-prose flex flex-col items-start gap-6 pb-4 pt-2 sm:pt-6">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="max-w-4xl text-balance text-[clamp(2.75rem,7vw,5.25rem)] font-medium leading-[0.94] tracking-display text-foreground">
        {accent && index !== -1 ? (
          <>
            {title.slice(0, index)}
            <HeadingAccent>{accent}</HeadingAccent>
            {title.slice(index + accent.length)}
          </>
        ) : (
          title
        )}
      </h1>
      {description ? (
        <p className="max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">
          {description}
        </p>
      ) : null}
      <div className="flex flex-row items-center gap-2">
        <MarkdownCopyButton markdownUrl={markdownUrl} />
        <ViewOptionsPopover markdownUrl={markdownUrl} githubUrl={githubUrl} />
      </div>
    </header>
  )
}
